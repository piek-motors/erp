MVVM gives you:

    Testable business logic completely decoupled from UI
    Reusable ViewModels across different form screens
    MobX reactivity that naturally maps to observable domain state
    tRPC as the glue between ViewModel actions and the Node.js server

The Layer Stack

┌─────────────────────────────────────────┐
│              VIEW LAYER                 │  React Components (pure JSX, no logic)
├─────────────────────────────────────────┤
│           VIEWMODEL LAYER               │  MobX Classes (state + actions)
├─────────────────────────────────────────┤
│            SERVICE LAYER                │  tRPC Clients (API calls, caching)
├─────────────────────────────────────────┤
│             MODEL LAYER                 │  TypeScript interfaces/domain types
├─────────────────────────────────────────┤
│          NODE.JS + tRPC SERVER          │  Routers, Procedures, Business Logic
└─────────────────────────────────────────┘

Folder Structure

src/
├── models/              # Pure TS interfaces — shared with server via tRPC types
│   ├── invoice.model.ts
│   ├── inventory.model.ts
│   └── user.model.ts
│
├── services/            # tRPC client wrappers — one per domain
│   ├── invoice.service.ts
│   ├── inventory.service.ts
│   └── trpc.client.ts   # tRPC client setup
│
├── viewmodels/          # MobX classes — one per screen/feature
│   ├── base.viewmodel.ts
│   ├── invoice-list.viewmodel.ts
│   ├── invoice-form.viewmodel.ts
│   └── inventory.viewmodel.ts
│
├── views/               # React components — receive ViewModel via prop or context
│   ├── invoice/
│   │   ├── InvoiceList.view.tsx
│   │   └── InvoiceForm.view.tsx
│   └── inventory/
│
├── stores/              # Global singleton stores (session, UI state, permissions)
│   ├── auth.store.ts
│   └── ui.store.ts
│
└── server/              # Node.js + tRPC backend
    ├── router/
    │   ├── invoice.router.ts
    │   └── inventory.router.ts
    └── trpc.ts

Step 1 — tRPC Server Setup (Node.js)
ts

// server/trpc.ts
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();
export const router = t.router;
export const publicProcedure = t.procedure;

// server/router/invoice.router.ts
export const invoiceRouter = router({
  getAll: publicProcedure
    .input(z.object({ page: z.number(), pageSize: z.number() }))
    .query(async ({ input }) => {
      return await InvoiceService.paginate(input);
    }),

  create: publicProcedure
    .input(InvoiceCreateSchema)
    .mutation(async ({ input }) => {
      return await InvoiceService.create(input);
    }),
});

// server/router/index.ts
export const appRouter = router({
  invoice: invoiceRouter,
  inventory: inventoryRouter,
});

export type AppRouter = typeof appRouter; // <-- this is the key for E2E type safety

Step 2 — tRPC Client Service
ts

// services/trpc.client.ts
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../server/router';

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({ url: '/api/trpc' }), // batches multiple calls automatically
  ],
});

// services/invoice.service.ts
import { trpc } from './trpc.client';

export class InvoiceService {
  static getAll = (page: number, pageSize: number) =>
    trpc.invoice.getAll.query({ page, pageSize });

  static create = (data: InvoiceCreateInput) =>
    trpc.invoice.create.mutate(data);
}

The critical benefit here is that InvoiceService calls are fully type-safe — the input and output types flow from the server schema all the way into your ViewModel with zero manual type writing.
Step 3 — Base ViewModel
ts

// viewmodels/base.viewmodel.ts
import { makeAutoObservable, runInAction } from 'mobx';

export abstract class BaseViewModel {
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  protected async executeAsync<T>(fn: () => Promise<T>): Promise<T | null> {
    this.isLoading = true;
    this.error = null;
    try {
      const result = await fn();
      runInAction(() => { this.isLoading = false; });
      return result;
    } catch (e: any) {
      runInAction(() => {
        this.isLoading = false;
        this.error = e.message;
      });
      return null;
    }
  }
}

Step 4 — Feature ViewModel (Invoice List)
ts

// viewmodels/invoice-list.viewmodel.ts
import { observable, computed, action } from 'mobx';
import { BaseViewModel } from './base.viewmodel';
import { InvoiceService } from '../services/invoice.service';
import type { Invoice } from '../models/invoice.model';

export class InvoiceListViewModel extends BaseViewModel {
  @observable invoices: Invoice[] = [];
  @observable currentPage = 1;
  @observable pageSize = 25;
  @observable searchQuery = '';

  @computed get filteredInvoices() {
    return this.invoices.filter(inv =>
      inv.number.includes(this.searchQuery)
    );
  }

  @computed get totalAmount() {
    return this.filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  }

  @action setSearch = (query: string) => {
    this.searchQuery = query;
    this.currentPage = 1;
  };

  loadInvoices = () =>
    this.executeAsync(async () => {
      const data = await InvoiceService.getAll(this.currentPage, this.pageSize);
      runInAction(() => { this.invoices = data.items; });
    });
}

Step 5 — View (Pure React, Zero Logic)
tsx

// views/invoice/InvoiceList.view.tsx
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import { InvoiceListViewModel } from '../../viewmodels/invoice-list.viewmodel';

export const InvoiceListView = observer(() => {
  // ViewModel lives at component level — scoped, not global
  const vm = useMemo(() => new InvoiceListViewModel(), []);

  useEffect(() => { vm.loadInvoices(); }, [vm]);

  if (vm.isLoading) return <Spinner />;
  if (vm.error) return <ErrorBanner message={vm.error} />;

  return (
    <div>
      <SearchBar value={vm.searchQuery} onChange={vm.setSearch} />
      <SummaryCard total={vm.totalAmount} />
      <InvoiceTable rows={vm.filteredInvoices} />
    </div>
  );
});

The view is a dumb display layer — it just reads from the ViewModel and calls ViewModel actions. No useState, no useEffect for data logic, no inline business rules.
Step 6 — Global Stores (Session, Auth, Permissions)
ts

// stores/auth.store.ts — singleton, injected via React Context
import { makeAutoObservable } from 'mobx';

export class AuthStore {
  user: User | null = null;
  permissions: string[] = [];

  constructor() { makeAutoObservable(this); }

  get isAdmin() { return this.permissions.includes('admin'); }
  get canEditInvoices() { return this.permissions.includes('invoice:write'); }
}

// App.tsx — provide globally
const authStore = new AuthStore();
const StoreContext = createContext({ authStore });

export const useStores = () => useContext(StoreContext);

ViewModels that need auth simply receive it via constructor injection:
ts

constructor(private auth: AuthStore) { super(); }

Scaling Patterns for Commercial ERP

Module Federation — each ERP module (Finance, HR, Inventory, CRM) becomes an independently deployable micro-frontend using Webpack Module Federation. They share the core ViewModel base classes and the tRPC client config.

Lazy-loaded ViewModel stores — heavy modules (like reporting) only instantiate their ViewModels when the module route is activated, keeping the initial bundle small.

Optimistic updates — update MobX observable state immediately in the ViewModel action, then call tRPC, and roll back on error. This makes the ERP feel instant.

tRPC subscription for real-time — for things like live inventory counts or notifications, tRPC supports WebSocket subscriptions that feed directly into your MobX observable arrays.

Permission-aware ViewModels — inject AuthStore into ViewModels and use @computed fields like canDelete, canApprove to drive UI state without scattering permission checks across components.
What You Get vs. In-House Build
Concern	In-House Typical	MVVM + MobX + tRPC
Type safety	Partial	End-to-end, server → view
Testability	Hard (logic in components)	Easy (test VMs in isolation)
New developer onboarding	Ad hoc patterns	Consistent structure
API refactoring	Break silently	Caught at compile time
Multi-tenant scaling	Manual plumbing	Auth store + context injection

The combination of tRPC for zero-boilerplate type-safe APIs, MobX for reactive ViewModel state, and MVVM to enforce separation is one of the strongest stacks currently available for scaling a TypeScript ERP. The GitHub repo danielyogel/full-stack-prisma-trpc-mobx-react is a solid reference to study for a working baseline of this exact stack.

probably i need plugin bases system
12:00 AM
Architected plugin system design for existing tech stack

The user wants to extend their ERP architecture with a plugin-based system. Let me explain how to design a plugin architecture for their React + MobX + tRPC + Node.js stack.
Done

Great instinct — for a commercial ERP this is essential. Let me design the full plugin architecture on top of what we already built.
Plugin-Based Architecture for Commercial ERP
Why You Need It

When selling to different clients, each one needs different modules, different workflows, different UI. A plugin system means:

    Core ERP ships lean — only the engine
    Clients buy/activate only the modules they need (Finance, HR, CRM, Warehouse...)
    You or third parties can build new modules without touching core
    Each plugin is independently versioned and deployable

The Mental Model

┌─────────────────────────────────────────────────────┐
│                    ERP SHELL (Core)                  │
│  - Plugin Registry     - Auth / Permissions          │
│  - Router Engine       - Global Stores               │
│  - Layout / Sidebar    - tRPC base client            │
└──────────────┬──────────────────────────────────────┘
               │ registers self on boot
    ┌──────────┼──────────┬──────────────┐
    ▼          ▼          ▼              ▼
┌────────┐ ┌──────┐ ┌─────────┐ ┌────────────┐
│Finance │ │  HR  │ │Inventory│ │  CRM       │  ← Plugins
│Plugin  │ │Plugin│ │Plugin   │ │  Plugin    │
└────────┘ └──────┘ └─────────┘ └────────────┘
  own VM     own VM   own VM       own VM
  own routes own API  own API      own API

Core: The Plugin Contract

Every plugin must implement this interface. This is the contract between core and any module:
ts

// core/plugin.interface.ts
import type { Router } from '@trpc/server';
import type { RouteObject } from 'react-router-dom';
import type { AppRouter } from '../server/router';

export interface ERPPlugin {
  // Identity
  id: string;                    // 'finance' | 'hr' | 'crm' etc.
  name: string;
  version: string;
  requiredPermissions: string[]; // ['finance:read'] etc.

  // Frontend
  routes: RouteObject[];         // lazy-loaded React routes
  navigationItems: NavItem[];    // what appears in the sidebar
  dashboardWidgets?: Widget[];   // optional dashboard cards

  // Backend
  trpcRouter: Router<any, any>;  // plugin's own tRPC router

  // Lifecycle hooks
  onInstall?(): Promise<void>;   // run DB migrations
  onActivate?(): void;           // run when plugin is enabled
  onDeactivate?(): void;         // cleanup
}

export interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType;
  requiredPermission: string;
}

Core: Plugin Registry

The registry is the brain — it knows what's installed and active:
ts

// core/plugin-registry.ts
import { makeAutoObservable, observable } from 'mobx';
import type { ERPPlugin } from './plugin.interface';

export class PluginRegistry {
  @observable private plugins = new Map<string, ERPPlugin>();
  @observable activePlugins = new Set<string>();

  constructor() { makeAutoObservable(this); }

  register(plugin: ERPPlugin) {
    this.plugins.set(plugin.id, plugin);
    console.log(`[PluginRegistry] Registered: ${plugin.id}@${plugin.version}`);
  }

  activate(pluginId: string) {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) throw new Error(`Plugin "${pluginId}" not found`);
    this.activePlugins.add(pluginId);
    plugin.onActivate?.();
  }

  deactivate(pluginId: string) {
    const plugin = this.plugins.get(pluginId);
    plugin?.onDeactivate?.();
    this.activePlugins.delete(pluginId);
  }

  getActive(): ERPPlugin[] {
    return [...this.activePlugins]
      .map(id => this.plugins.get(id)!)
      .filter(Boolean);
  }

  // Aggregated routes from all active plugins
  get allRoutes() {
    return this.getActive().flatMap(p => p.routes);
  }

  // Aggregated nav items — filtered by user permissions
  getNavItems(userPermissions: string[]) {
    return this.getActive()
      .flatMap(p => p.navigationItems)
      .filter(item => userPermissions.includes(item.requiredPermission));
  }
}

// Singleton — shared across the app
export const pluginRegistry = new PluginRegistry();

Core: Dynamic tRPC Router Assembly

On the server, you assemble one master router from all active plugins at startup:
ts

// server/router/index.ts
import { router } from '../trpc';
import { pluginRegistry } from '../../core/plugin-registry';

function buildAppRouter() {
  const pluginRouters = Object.fromEntries(
    pluginRegistry.getActive().map(plugin => [
      plugin.id,
      plugin.trpcRouter,
    ])
  );

  return router({
    // core always-on routes
    auth: authRouter,
    settings: settingsRouter,
    // dynamically merged plugin routes
    ...pluginRouters,
  });
}

export const appRouter = buildAppRouter();
export type AppRouter = typeof appRouter;

Now trpc.finance.getInvoices() is fully type-safe and only exists if the finance plugin is active.
Building a Plugin — Finance Example
ts

// plugins/finance/index.ts
import { lazy } from 'react';
import type { ERPPlugin } from '../../core/plugin.interface';
import { financeRouter } from './server/finance.router';
import { IconCoins } from '@some-icon-lib';

export const FinancePlugin: ERPPlugin = {
  id: 'finance',
  name: 'Finance & Accounting',
  version: '1.2.0',
  requiredPermissions: ['finance:read'],

  // Lazy-loaded — zero cost if user doesn't have access
  routes: [
    {
      path: '/finance',
      Component: lazy(() => import('./views/FinanceDashboard.view')),
    },
    {
      path: '/finance/invoices',
      Component: lazy(() => import('./views/InvoiceList.view')),
    },
    {
      path: '/finance/invoices/:id',
      Component: lazy(() => import('./views/InvoiceDetail.view')),
    },
  ],

  navigationItems: [
    {
      label: 'Finance',
      path: '/finance',
      icon: IconCoins,
      requiredPermission: 'finance:read',
    },
  ],

  dashboardWidgets: [
    { id: 'revenue-chart', Component: lazy(() => import('./widgets/RevenueChart')) },
    { id: 'outstanding-invoices', Component: lazy(() => import('./widgets/OutstandingInvoices')) },
  ],

  trpcRouter: financeRouter,

  async onInstall() {
    // run DB migrations for finance tables
    await db.migrate('./plugins/finance/migrations');
  },

  onActivate() {
    console.log('Finance plugin activated');
  },
};

Bootstrapping — App Entry Point
ts

// main.ts — boot sequence
import { pluginRegistry } from './core/plugin-registry';
import { FinancePlugin } from './plugins/finance';
import { HRPlugin } from './plugins/hr';
import { InventoryPlugin } from './plugins/inventory';

async function bootstrap() {
  // 1. Register all available plugins (installed but not necessarily active)
  pluginRegistry.register(FinancePlugin);
  pluginRegistry.register(HRPlugin);
  pluginRegistry.register(InventoryPlugin);

  // 2. Fetch which plugins THIS tenant has licensed from your DB/config
  const tenantConfig = await fetchTenantConfig(); // { activePlugins: ['finance', 'inventory'] }

  // 3. Activate only what the tenant paid for
  tenantConfig.activePlugins.forEach(id => pluginRegistry.activate(id));

  // 4. Mount React app
  ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
}

bootstrap();

Shell Layout — Reads from Registry
tsx

// core/Shell.tsx
import { observer } from 'mobx-react-lite';
import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { pluginRegistry } from './plugin-registry';
import { useStores } from './stores';

export const Shell = observer(() => {
  const { authStore } = useStores();
  const navItems = pluginRegistry.getNavItems(authStore.permissions);
  const allRoutes = pluginRegistry.allRoutes;

  return (
    <div className="erp-layout">
      <Sidebar items={navItems} />
      <main>
        <Suspense fallback={<PageSpinner />}>
          <Routes>
            {allRoutes.map(route => (
              <Route key={route.path} {...route} />
            ))}
          </Routes>
        </Suspense>
      </main>
    </div>
  );
});

The sidebar and routes automatically update when plugins are activated/deactivated because the registry is a MobX observable.
Multi-Tenant Plugin Configuration

For SaaS, each tenant has their own plugin activation stored in your DB:
ts

// Tenant config in DB
{
  tenantId: 'acme-corp',
  activePlugins: ['finance', 'inventory'],
  pluginConfig: {
    finance: { currency: 'EUR', fiscalYearStart: 'January' },
    inventory: { warehouseCount: 3 }
  }
}

Each plugin can expose its own settings schema:
ts

export const FinancePlugin: ERPPlugin = {
  // ...
  settingsSchema: z.object({
    currency: z.enum(['USD', 'EUR', 'GBP']),
    fiscalYearStart: z.string(),
  }),
};

And you build a generic Settings UI in the admin panel that renders any plugin's settings form automatically.
What You Get
Feature	How
Client gets only what they pay for	tenantConfig.activePlugins controls activation
New module = new plugin file	Zero changes to core
Third-party plugins	Implement ERPPlugin interface, register at boot
Bundle splitting	All plugin views are lazy() — automatic code splitting
Type-safe APIs	tRPC router assembled from active plugins only
Sidebar auto-updates	MobX observable registry drives nav items
Permission-gated	Nav items filtered by user permissions at registry level
Recommended Next Step

The next layer worth discussing is the plugin communication bus — how plugins talk to each other (e.g. Finance plugin listening to events from Inventory plugin when a PO is created). That's done via an event emitter on the core, and it's what separates a "modular monolith" plugin system from a truly decoupled one. Worth planning before you wire up cross-module workflows.

is it possible to hold trpc routers in and ui code in the sabe module directory
12:03 AM
Validated colocating tRPC routers with UI code feasibility

The user wants to know if they can co-locate tRPC routers (server code) with UI code in the same plugin directory. Yes, this is absolutely possible and is actually a common monorepo pattern.
Done

Yes, absolutely — this is actually the preferred pattern for a plugin-based monorepo. The whole point is that a plugin is a self-contained unit with everything inside it.
The Structure

plugins/
└── finance/
    ├── index.ts                  # plugin manifest (ERPPlugin interface)
    │
    ├── server/                   # tRPC router + DB logic
    │   ├── finance.router.ts
    │   ├── finance.service.ts
    │   └── finance.schema.ts     # zod schemas
    │
    ├── viewmodels/               # MobX ViewModels
    │   ├── invoice-list.vm.ts
    │   └── invoice-form.vm.ts
    │
    ├── views/                    # React components
    │   ├── InvoiceList.view.tsx
    │   └── InvoiceForm.view.tsx
    │
    └── widgets/                  # Dashboard widgets
        └── RevenueChart.tsx

Everything that belongs to Finance lives in plugins/finance/. You delete the folder, the feature is gone. No orphaned files anywhere else.
The Key Trick — Shared Zod Schemas

The reason this works so cleanly is that your Zod schemas are the bridge between server and client. Define them once in the plugin, use them on both sides:
ts

// plugins/finance/server/finance.schema.ts
import { z } from 'zod';

export const InvoiceCreateSchema = z.object({
  clientId: z.string(),
  amount: z.number().positive(),
  dueDate: z.string(),
});

export type InvoiceCreateInput = z.infer<typeof InvoiceCreateSchema>;
export type Invoice = z.infer<typeof InvoiceSchema>;

ts

// plugins/finance/server/finance.router.ts  ← server uses it
import { InvoiceCreateSchema } from './finance.schema';

export const financeRouter = router({
  createInvoice: publicProcedure
    .input(InvoiceCreateSchema)
    .mutation(({ input }) => InvoiceService.create(input)),
});

ts

// plugins/finance/viewmodels/invoice-form.vm.ts  ← client uses same schema
import type { InvoiceCreateInput } from '../server/finance.schema';

export class InvoiceFormViewModel extends BaseViewModel {
  submit = (data: InvoiceCreateInput) =>
    this.executeAsync(() => trpc.finance.createInvoice.mutate(data));
}

One schema, zero duplication, full type safety across the boundary.
The One Thing You Must Handle — Build Separation

The only real concern is that server code must never end up in the client bundle. You handle this in two ways:

Option A — Path aliases + bundler rules (simpler)
ts

// vite.config.ts
export default {
  resolve: {
    alias: { '@plugins': '/plugins' }
  },
  // Vite tree-shakes server code automatically if it's never imported by client entry
}
```

Just make sure your client code only ever imports from `../views`, `../viewmodels`, and types from `../server/*.schema.ts`. Never import `../server/finance.service.ts` (which has DB calls) from a view.

**Option B — Explicit `/shared` subfolder** (cleaner for large teams)
```
plugins/finance/
├── server/         # never imported by client
│   ├── finance.router.ts
│   └── finance.service.ts
├── shared/         # safe to import from both sides
│   └── finance.schema.ts
├── viewmodels/
└── views/
```

You add a lint rule that forbids importing from `*/server/*` in any `*.view.tsx` or `*.vm.ts` file. Most teams use `eslint-plugin-boundaries` for this.

---

## Monorepo Setup (if you go that route)

With something like **Turborepo** or **pnpm workspaces**, each plugin can even be its own package:
```
packages/
├── core/                  # shell, registry, base classes
├── plugin-finance/        # finance plugin (server + client)
├── plugin-hr/
└── plugin-inventory/

Each plugin has one package.json and declares what it needs. The core app just installs the plugin packages it wants. This is the cleanest commercial scaling approach — you can literally ship plugins as npm packages to enterprise clients.
Bottom Line

Co-locating server and client code in the same plugin directory is not only possible, it's the right approach because:

    The plugin is a deployable unit — everything in one place
    Shared Zod schemas eliminate the API contract drift problem
    A simple lint rule (no imports from */server/* in client files) is all the enforcement you need
    It maps perfectly to how you'd sell modules — "the Finance plugin" is literally one folder


This is the most important design decision you'll make. Draw the borders wrong and you'll have plugins that are either too tangled or too fragmented.
Where Plugin Borders Should Be in ERP Design
The Core Principle

A plugin border should sit at a business domain boundary, not a technical one. The question to ask is not "is this a separate feature?" but rather "does this have its own data, its own rules, and its own lifecycle?"

If you can answer yes to all three — it's a plugin. If it shares data or rules deeply with something else — it's part of the same plugin.
The Two Layers — Core vs Plugins

Before drawing plugin borders, you need to be clear about what is never a plugin:

CORE (always on, no exceptions)
├── Authentication & Sessions
├── User & Role Management
├── Permission Engine
├── Tenant / Company configuration
├── Notification infrastructure (not the notifications themselves)
├── Audit log infrastructure
├── Plugin Registry & Lifecycle
├── File Storage abstraction
└── Global search infrastructure

Everything else is a candidate for a plugin. The rule is: core has no business logic, only platform infrastructure.
The Right Plugin Borders

These are the natural domain boundaries in a standard ERP:

┌─────────────────────────────────────────────────────────────────┐
│  FINANCE                                                        │
│  Data: invoices, payments, accounts, journal entries            │
│  Rules: tax calc, payment terms, account balancing              │
│  Lifecycle: quote → invoice → payment → reconciliation          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  PROCUREMENT                                                    │
│  Data: purchase orders, vendors, vendor invoices                │
│  Rules: approval workflows, budget checks, 3-way matching       │
│  Lifecycle: PR → PO → receipt → vendor invoice → payment        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  INVENTORY                                                      │
│  Data: products, warehouses, stock movements, lots/serials      │
│  Rules: reorder points, FIFO/LIFO valuation, reservation logic  │
│  Lifecycle: receive → store → pick → ship → adjust              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  SALES                                                          │
│  Data: leads, opportunities, quotes, sales orders, customers    │
│  Rules: pricing, discounts, commission, territory               │
│  Lifecycle: lead → quote → order → fulfillment → invoice        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  HR                                                             │
│  Data: employees, contracts, departments, positions             │
│  Rules: leave policies, probation, org hierarchy                │
│  Lifecycle: hire → onboard → manage → offboard                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  PAYROLL                                                        │
│  Data: payslips, deductions, benefits, tax tables               │
│  Rules: country-specific tax law, net/gross calc                │
│  Lifecycle: period → calculate → approve → pay → report         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  PROJECTS                                                       │
│  Data: projects, tasks, time entries, milestones, budgets       │
│  Rules: billing rules, resource allocation, progress tracking   │
│  Lifecycle: plan → execute → track → bill → close               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  MANUFACTURING                                                  │
│  Data: BOMs, work orders, routings, production runs             │
│  Rules: capacity planning, material requirements, quality       │
│  Lifecycle: plan → schedule → produce → QC → deliver            │
└─────────────────────────────────────────────────────────────────┘

The Hard Part — Cross-Plugin Dependencies

This is where most teams get burned. When Sales creates an Order and Inventory needs to reserve stock and Finance needs to create an invoice — who owns what?

The answer is: plugins never call each other directly. They communicate through the core event bus.
ts

// core/event-bus.ts
type ERPEvent =
  | { type: 'sales.order.confirmed'; orderId: string; customerId: string; lines: OrderLine[] }
  | { type: 'inventory.stock.reserved'; orderId: string; warehouseId: string }
  | { type: 'procurement.po.received'; poId: string; lines: ReceivedLine[] }
  | { type: 'hr.employee.hired'; employeeId: string; startDate: string }
  | { type: 'finance.invoice.paid'; invoiceId: string; amount: number };

export class EventBus {
  private handlers = new Map<string, Set<Function>>();

  emit<T extends ERPEvent>(event: T) {
    this.handlers.get(event.type)?.forEach(h => h(event));
  }

  on<T extends ERPEvent['type']>(
    eventType: T,
    handler: (event: Extract<ERPEvent, { type: T }>) => void
  ) {
    if (!this.handlers.has(eventType)) this.handlers.set(eventType, new Set());
    this.handlers.get(eventType)!.add(handler);
  }
}

Then each plugin declares what it listens to and what it emits — never what it calls:
ts

// plugins/inventory/index.ts
export const InventoryPlugin: ERPPlugin = {
  id: 'inventory',

  onActivate() {
    // Listen to events from other plugins
    eventBus.on('sales.order.confirmed', async (event) => {
      await InventoryService.reserveStock(event.orderId, event.lines);
      eventBus.emit({ type: 'inventory.stock.reserved', orderId: event.orderId });
    });

    eventBus.on('procurement.po.received', async (event) => {
      await InventoryService.receiveStock(event.poId, event.lines);
    });
  },
};

ts

// plugins/finance/index.ts
export const FinancePlugin: ERPPlugin = {
  id: 'finance',

  onActivate() {
    eventBus.on('sales.order.confirmed', async (event) => {
      await FinanceService.createDraftInvoice(event.orderId, event.customerId);
    });

    eventBus.on('inventory.stock.reserved', async (event) => {
      await FinanceService.confirmInvoice(event.orderId);
    });
  },
};
```

The Sales plugin emits one event and has absolutely no idea that Inventory and Finance are listening. You can add a new plugin (say, Logistics) that also listens to `sales.order.confirmed` — and Sales doesn't change at all.

---

## Shared Data — The Biggest Border Mistake

The most common mistake is creating a "shared" entity that two plugins both own. The classic trap is **Product**:
```
❌ WRONG
Inventory plugin owns the Product table
Finance plugin imports from Inventory to get product prices
Procurement plugin also imports from Inventory to create POs
→ Inventory becomes a dependency of everything. It's not a plugin anymore, it's core.
```
```
✅ RIGHT — Product Catalog is its own plugin

┌─────────────────────┐
│  PRODUCT CATALOG    │  ← standalone plugin
│  products, prices,  │
│  units, categories  │
└─────────┬───────────┘
          │ other plugins read via tRPC or events
          ▼
  Finance    Inventory    Procurement    Sales
  (uses       (uses        (uses          (uses
  prices)     SKUs)        supplier       catalog
              (uses        prices)        for quotes)
              units)
```

The rule: **if more than two plugins need the same data, that data belongs in its own plugin or in core.**

---

## A Practical Border Checklist

Before making something a plugin, run it through this:

| Question | If Yes | If No |
|---|---|---|
| Does it have its own DB tables? | Plugin candidate | Probably part of another plugin |
| Can it be turned off without breaking core? | Plugin | Core |
| Does it have a distinct user role or permission set? | Plugin | Probably a sub-feature |
| Does it have its own business lifecycle? | Plugin | Sub-feature of existing plugin |
| Do more than 2 other plugins need its data? | Consider making it core or its own shared plugin | Fine as a plugin |
| Does it require country/industry-specific logic? | Definitely a plugin (localisation variant) | Standard plugin |

---

## The Real-World Border Map
```
DEPENDS ON NOTHING          DEPENDS ON CATALOG/CORE       DEPENDS ON MULTIPLE
──────────────────          ──────────────────────────    ───────────────────
Product Catalog             Inventory (uses catalog)      Finance (uses sales,
HR                          Procurement (uses catalog)      procurement, projects)
CRM (basic)                 Sales (uses catalog, CRM)     Payroll (uses HR)
                            Projects (uses HR, CRM)       Manufacturing (uses
                                                           inventory, procurement)

Build in that order. Left column first, right column last. This way you always have something shippable and each plugin has stable dependencies below it.

The summary: plugin borders = business domain borders, communication = events only, shared data = its own plugin. The moment a plugin imports directly from another plugin's internals, you've broken the boundary and you'll pay for it every time you try to deploy or version independently.
