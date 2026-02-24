 ---

    Architectural Analysis Report: PDO Domain

    1. Current State Analysis

    1.1 Architectural Patterns Currently Used


    ┌────────────────────────┬───────────────────────────────────────────────────────────────┬────────────────────────────┐
    │ Pattern                │ Evidence                                                      │ Assessment                 │
    ├────────────────────────┼───────────────────────────────────────────────────────────────┼────────────────────────────┤
    │ MobX State Management  │ makeAutoObservable throughout stores (DetailSt, MaterialSt... │ Consistent but overused    │
    │ **Repository-like API... │ DetailApi, MaterialApi, OrderApi classes                      │ Present but thin           │
    │ Cache Layer            │ DetailCache, MaterialCache, DetailGroupCache                  │ Centralized client-side... │
    │ Observer Pattern       │ observer() HOC on all page components                         │ Heavy coupling to MobX     │
    │ Mapper Pattern         │ mappers.ts with MaterialMapper                                │ Isolated, well-structured  │
    └────────────────────────┴───────────────────────────────────────────────────────────────┴────────────────────────────┘


    1.2 Coupling Issues

    Critical: Store-Component Coupling

     1 // client/src/domains/pdo/detail/list/store.ts
     2 export const detailListStore = new DetailListStore() // Singleton export

     1 // client/src/domains/pdo/material/list/list.tsx
     2 import { materialListStore } from './store' // Direct import
    Problem: Components directly import singleton stores, making testing and substitution impossible.

    Critical: Cache-Store Coupling

     1 // client/src/domains/pdo/detail/list/store.ts
     2 constructor() {
     3   this.searchStore = new PaginatedSearchStore<AppDetail>(
     4     () => app_cache.details.details, // Direct dependency
     5     { customFilter: this.filter_details.bind(this) }
     6   )
     7 }
    Problem: DetailListStore is tightly coupled to app_cache. Cannot test filtering logic without initializing the entire
    cache.

    High: API-Store-State Coupling

     1 // client/src/domains/pdo/detail/detail.state.ts
     2 export class DetailSt {
     3   readonly attachments = new AttachmentsStore()
     4   readonly warehouse = new DetailWarehouseStore()
     5   readonly blank = new DetailBlankSt()
     6   readonly workflow = new Workflow()
     7 }
    Problem: The entity state class (DetailSt) instantiates its own nested stores. This violates single responsibility and
    makes the class hard to serialize/deserialize.

    1.3 Cohesion Problems

    Scattered Domain Logic:
     - DetailSt contains both entity state AND UI state (attachments, warehouse)
     - MaterialSt mixes shape-specific state (round, square, pipe, etc.) with entity data
     - OrderSt contains modal state (orderAlreadyInProductionModal)

    Example:

     1 // client/src/domains/pdo/material/state.ts
     2 export class MaterialSt {
     3   list = new ListState()
     4   round = new RoundBarState()
     5   square = new SquareState()
     6   // ... shape states mixed with entity state
     7   id: number | null = null
     8   label: string = ''
     9 }

    1.4 Separation of Concerns Violations


    ┌─────────────────────────┬─────────────────────────────────────────────────┬─────────────────────────────────────────┐
    │ Violation               │ Location                                        │ Impact                                  │
    ├─────────────────────────┼─────────────────────────────────────────────────┼─────────────────────────────────────────┤
    │ **UI state in domain s... │ DetailGroupStore.groupNameState                 │ Domain logic polluted with modal state  │
    │ API calls in components │ DetailPage.tsx calls api.get() directly         │ No use case layer                       │
    │ **Cache invalidation i... │ DetailApi.update() calls `app_cache.details.... │ API layer knows about cache implemen... │
    │ **Notification logic i... │ DetailApi.update() calls notifier.ok()          │ Cross-cutting concern leaked            │
    └─────────────────────────┴─────────────────────────────────────────────────┴─────────────────────────────────────────┘


     1 // client/src/domains/pdo/detail/detail_api.ts
     2 async update(detail: DetailSt) {
     3   await rpc.pdo.details.update.mutate(detail.payload)
     4   app_cache.details.update({...}) // Cache knowledge
     5   notifier.ok(`Деталь обновлена`) // Notification knowledge
     6   return detail
     7 }

    1.5 Scaling Risks


    ┌──────────────────────────────┬──────────┬──────────────────────────────────────────────────────┐
    │ Risk                         │ Severity │ Evidence                                             │
    ├──────────────────────────────┼──────────┼──────────────────────────────────────────────────────┤
    │ Singleton stores             │ High     │ export const detailListStore = new DetailListStore() │
    │ No dependency injection      │ High     │ All dependencies hardcoded                           │
    │ Cache invalidation scattered │ Medium   │ Each API method handles its own cache updates        │
    │ No error boundaries          │ Medium   │ Errors handled ad-hoc with notifier.err()            │
    │ Tight MobX coupling          │ High     │ All components wrapped with observer()               │
    └──────────────────────────────┴──────────┴──────────────────────────────────────────────────────┘

    ---

    2. Architectural Evaluation

    2.1 Current Structure Assessment

      1 client/src/domains/pdo/
      2 ├── cache/           # Client-side cache (good isolation)
      3 ├── detail/          # Feature module
      4 ├── detail_grouping/ # Feature module
      5 ├── material/        # Feature module
      6 ├── orders/          # Feature module
      7 ├── shared/          # Shared utilities (underdeveloped)
      8 ├── warehouse/       # Feature module
      9 ├── mappers.ts       # Domain mappers
     10 ├── routes.tsx       # Route configuration
     11 └── root_layout.tsx  # Layout component

    Strengths:
     - Feature-based top-level organization is correct
     - Cache layer provides good abstraction
     - API layer exists and is consistent

    Weaknesses:
     - No clear separation between view, state, and domain logic within features
     - Shared utilities are underdeveloped (only 4 files)
     - No common hooks or custom hook patterns

    2.2 Feature Growth Risks


    ┌──────────────────────┬──────────────────────────────────────────────┬────────────────────────────────────┐
    │ Risk                 │ Current Evidence                             │ Future Impact                      │
    ├──────────────────────┼──────────────────────────────────────────────┼────────────────────────────────────┤
    │ Store proliferation  │ 15+ store files in PDO alone                 │ Exponential growth as features add │
    │ Duplicate patterns   │ DetailApi, MaterialApi, OrderApi all similar │ No reusable CRUD patterns          │
    │ No feature contracts │ Each feature implements its own patterns     │ Inconsistent UX, harder onboarding │
    └──────────────────────┴──────────────────────────────────────────────┴────────────────────────────────────┘


    2.3 Developer Onboarding Risks

    Implicit Conventions:
     - No documented pattern for when to create a new store vs. extend existing
     - No clear rule for what belongs in DetailSt vs. DetailApi
     - Cache invalidation strategy is ad-hoc per feature

    Discovery Problems:

     1 // To understand "how to load a detail", developer must trace:
     2 DetailPage.tsx → api.get() → DetailApi.get() → rpc.pdo.details.get.query()
     3                 → detail.init() → app_cache (side effect)

    2.4 Parallel Team Development Risks


    ┌───────────────────────┬────────────────────────────────────────┬────────────┐
    │ Conflict Point        │ Example                                │ Mitigation │
    ├───────────────────────┼────────────────────────────────────────┼────────────┤
    │ Shared cache          │ app_cache.details accessed by 5+ files │ None       │
    │ Singleton stores      │ detailListStore imported everywhere    │ None       │
    │ No feature boundaries │ orders/ imports from detail/ directly  │ None       │
    └───────────────────────┴────────────────────────────────────────┴────────────┘


     1 // client/src/domains/pdo/orders/order.tsx
     2 import { DetailName } from '@/domains/pdo/detail/detail_name' // Cross-feature import

    2.5 State Management Complexity

    Current State Distribution:
     1. Component state (useState in pages)
     2. MobX stores (entity state, UI state, loading state)
     3. Cache (denormalized list data)
     4. API layer (loading controllers)

    Problem: Same concern (e.g., "is loading") exists in multiple places:

     1 // DetailApi has loading
     2 readonly loader = new LoadingController()
     3 
     4 // DetailSt has no loading, but DetailPage manages it
     5 const [detail, setDetail] = useState<DetailSt | null>(null)
     6 if (api.loader.loading || !detail) return <Loading />

    ---

    3. Architecture Proposal

    3.1 Pattern Comparison


    ┌────────────────────┬─────────────┬───────────────────────────────────────┬──────────────────────────────┐
    │ Pattern            │ Fit for ERP │ Pros                                  │ Cons                         │
    ├────────────────────┼─────────────┼───────────────────────────────────────┼──────────────────────────────┤
    │ MVVM               │ Medium      │ Clear view-model separation, testable │ Overhead for simple features │
    │ Feature-based      │ High        │ Natural boundaries, team scalability  │ Requires discipline          │
    │ Clean Architecture │ High        │ Dependency rule enforces separation   │ Initial complexity           │
    │ Layered            │ Medium      │ Familiar, simple                      │ Can become anemic            │
    │ Modular Monolith   │ Best        │ Scales to microservices if needed     │ Requires module contracts    │
    └────────────────────┴─────────────┴───────────────────────────────────────┴──────────────────────────────┘


    3.2 Recommended: Modular Monolith with Clean Architecture Principles

    Rationale:
     1. ERP systems have clear domain boundaries (PDO, Attendance, Orders)
     2. Future multi-tenant support requires module isolation
     3. Team scalability needs clear ownership boundaries
     4. Plugin architecture requires well-defined contracts

    Core Principles:

      1 ┌─────────────────────────────────────────────────────────┐
      2 │                    Presentation Layer                    │
      3 │  (Views, ViewModels, Components, Hooks)                 │
      4 ├─────────────────────────────────────────────────────────┤
      5 │                    Domain Layer                          │
      6 │  (Entities, Use Cases, Domain Services, Repositories)   │
      7 ├─────────────────────────────────────────────────────────┤
      8 │                  Infrastructure Layer                    │
      9 │  (API Client, Cache, Storage, Notifications)            │
     10 └─────────────────────────────────────────────────────────┘
     11 
     12 Dependency Rule: Inner layers know nothing about outer layers

    3.3 Key Architectural Decisions


    ┌───────────────────────┬─────────────────────┬────────────────────────────────────────────────────┐
    │ Decision              │ Current             │ Proposed                                           │
    ├───────────────────────┼─────────────────────┼────────────────────────────────────────────────────┤
    │ State Management      │ MobX everywhere     │ MobX for view models, React Query for server state │
    │ Feature Communication │ Direct imports      │ Module facades with explicit contracts             │
    │ Cache Strategy        │ Manual invalidation │ React Query cache with structured keys             │
    │ Error Handling        │ Ad-hoc notifier     │ Error boundaries + standardized error types        │
    │ Dependency Management │ Hardcoded           │ Factory functions / minimal DI                     │
    └───────────────────────┴─────────────────────┴────────────────────────────────────────────────────┘


    ---

    4. Refactoring Plan

    4.1 Phase 1: Short-term Improvements (Low Risk, 2-4 weeks)

    Goal: Reduce coupling without structural changes


    ┌───────────────────────────────────┬───────────────────────────────────────────────────────────────┬──────┐
    │ Task                              │ Description                                                   │ Risk │
    ├───────────────────────────────────┼───────────────────────────────────────────────────────────────┼──────┤
    │ 1.1 Extract shared hooks          │ Create useDetail, useMaterial, useOrder hooks                 │ Low  │
    │ 1.2 Standardize loading states    │ Single useLoading hook instead of LoadingController per store │ Low  │
    │ 1.3 Centralize cache invalidation │ Move cache updates to dedicated cacheService                  │ Low  │
    │ 1.4 Remove notifications from API │ Move notifier calls to components/use cases                   │ Low  │
    │ 1.5 Document conventions          │ Write ARCHITECTURE.md for PDO domain                          │ None │
    └───────────────────────────────────┴───────────────────────────────────────────────────────────────┴──────┘


    Example - Extract useDetail hook:

      1 // client/src/domains/pdo/detail/use-detail.ts
      2 export function useDetail(detailId: number | null) {
      3   const [detail, setDetail] = useState<DetailSt | null>(null)
      4   const [isLoading, setIsLoading] = useState(false)
      5   const [error, setError] = useState<Error | null>(null)
      6 
      7   useEffect(() => {
      8     if (!detailId) return
      9     setIsLoading(true)
     10     api.get(detailId)
     11       .then(setDetail)
     12       .catch(setError)
     13       .finally(() => setIsLoading(false))
     14   }, [detailId])
     15 
     16   return { detail, isLoading, error }
     17 }

    4.2 Phase 2: Mid-term Structural Changes (Medium Risk, 6-8 weeks)

    Goal: Introduce proper layering within features


    ┌─────────────────────────────────────────┬────────────────────────────────────────────────────┬────────┐
    │ Task                                    │ Description                                        │ Risk   │
    ├─────────────────────────────────────────┼────────────────────────────────────────────────────┼────────┤
    │ 2.1 Introduce use cases                 │ Extract business logic from API layer              │ Medium │
    │ 2.2 Separate UI state from entity state │ Split DetailSt into DetailEntity + DetailViewModel │ Medium │
    │ 2.3 Create feature facades              │ Single export per feature module                   │ Medium │
    │ 2.4 Implement error boundaries          │ Per-feature error handling                         │ Low    │
    │ 2.5 Introduce module contracts          │ Define explicit interfaces between features        │ Medium │
    └─────────────────────────────────────────┴────────────────────────────────────────────────────┴────────┘


    Example - Use Case Layer:

      1 // client/src/domains/pdo/detail/use-cases/update-detail.ts
      2 export class UpdateDetailUseCase {
      3   constructor(
      4     private detailRepository: DetailRepository,
      5     private detailCache: DetailCache,
      6     private notificationService: NotificationService,
      7   ) {}
      8 
      9   async execute(detail: DetailEntity): Promise<void> {
     10     await this.detailRepository.update(detail)
     11     this.detailCache.update(detail.toDto())
     12     this.notificationService.success('Detail updated')
     13   }
     14 }

    4.3 Phase 3: Long-term Transformation (High Risk, 12-16 weeks)

    Goal: Full modular monolith architecture


    ┌────────────────────────────────────┬─────────────────────────────────────────┬────────┐
    │ Task                               │ Description                             │ Risk   │
    ├────────────────────────────────────┼─────────────────────────────────────────┼────────┤
    │ 3.1 Migrate to React Query         │ Replace manual caching with React Query │ High   │
    │ 3.2 Introduce dependency injection │ Factory functions for use cases         │ High   │
    │ 3.3 Extract shared domain module   │ Common entities and value objects       │ Medium │
    │ 3.4 Implement module lazy loading  │ Code splitting per feature              │ Medium │
    │ 3.5 Add integration tests          │ End-to-end feature tests                │ Low    │
    └────────────────────────────────────┴─────────────────────────────────────────┴────────┘

    ---

    5. Folder Structure Proposal

    5.1 Recommended Structure

      1 client/src/domains/pdo/
      2 ├── detail/
      3 │   ├── api/                    # Infrastructure: API client
      4 │   │   ├── detail.api.ts
      5 │   │   └── detail.repository.ts
      6 │   ├── domain/                 # Domain: Entities and business logic
      7 │   │   ├── entities/
      8 │   │   │   ├── detail.entity.ts
      9 │   │   │   ├── detail-blank.entity.ts
     10 │   │   │   └── workflow.entity.ts
     11 │   │   ├── value-objects/
     12 │   │   │   └── drawing-number.vo.ts
     13 │   │   └── services/
     14 │   │       └── detail-validation.service.ts
     15 │   ├── use-cases/              # Domain: Application logic
     16 │   │   ├── get-detail.use-case.ts
     17 │   │   ├── update-detail.use-case.ts
     18 │   │   ├── create-detail.use-case.ts
     19 │   │   └── delete-detail.use-case.ts
     20 │   ├── view-models/            # Presentation: View state
     21 │   │   ├── detail-form.vm.ts
     22 │   │   └── detail-list.vm.ts
     23 │   ├── ui/                     # Presentation: Components
     24 │   │   ├── components/
     25 │   │   │   ├── detail-form.tsx
     26 │   │   │   ├── detail-card.tsx
     27 │   │   │   └── workflow-view.tsx
     28 │   │   ├── pages/
     29 │   │   │   ├── detail-list.page.tsx
     30 │   │   │   ├── detail-edit.page.tsx
     31 │   │   │   └── detail-create.page.tsx
     32 │   │   └── hooks/
     33 │   │       ├── use-detail.ts
     34 │   │       └── use-detail-list.ts
     35 │   └── index.ts                # Feature facade
     36 │
     37 ├── material/
     38 │   ├── [same structure as detail]
     39 │   └── index.ts
     40 │
     41 ├── orders/
     42 │   ├── [same structure as detail]
     43 │   └── index.ts
     44 │
     45 ├── shared/                     # Shared within PDO domain
     46 │   ├── components/
     47 │   ├── hooks/
     48 │   └── utils/
     49 │
     50 ├── infrastructure/             # Cross-cutting infrastructure
     51 │   ├── cache/
     52 │   │   ├── cache.service.ts
     53 │   │   └── cache.keys.ts
     54 │   ├── notifications/
     55 │   │   └── notification.service.ts
     56 │   └── api/
     57 │       └── rpc.client.ts
     58 │
     59 └── index.ts                    # Domain facade

    5.2 Layer Responsibilities


    ┌──────────────┬──────────────────────────────────────────┬───────────────────────────────────┐
    │ Layer        │ Responsibility                           │ Dependencies                      │
    ├──────────────┼──────────────────────────────────────────┼───────────────────────────────────┤
    │ ui/          │ React components, hooks                  │ view-models, use-cases            │
    │ view-models/ │ UI state, computed values                │ domain entities                   │
    │ use-cases/   │ Business workflows                       │ domain, infrastructure interfaces │
    │ domain/      │ Entities, value objects, domain services │ None (pure)                       │
    │ api/         │ External API communication               │ Infrastructure implementations    │
    └──────────────┴──────────────────────────────────────────┴───────────────────────────────────┘


    5.3 Feature Facade Example

      1 // client/src/domains/pdo/detail/index.ts
      2 export { DetailListPage } from './ui/pages/detail-list.page'
      3 export { DetailEditPage } from './ui/pages/detail-edit.page'
      4 export { DetailCreatePage } from './ui/pages/detail-create.page'
      5 
      6 // Use cases (for composition)
      7 export { GetDetailUseCase } from './use-cases/get-detail.use-case'
      8 export { UpdateDetailUseCase } from './use-cases/update-detail.use-case'
      9 
     10 // View models (for advanced customization)
     11 export { DetailFormViewModel } from './view-models/detail-form.vm'
     12 
     13 // DO NOT export:
     14 // - Internal components
     15 // - Entity classes directly
     16 // - API clients

    ---

    6. Scaling Strategy

    6.1 Multi-tenant Support Preparation

    Current Gap: No tenant isolation in state or API

    Required Changes:

      1 // Infrastructure: Add tenant context
      2 // client/src/infrastructure/tenant/tenant.context.ts
      3 export interface TenantContext {
      4   tenantId: string
      5   features: TenantFeature[]
      6   theme: TenantTheme
      7 }
      8 
      9 // Use cases receive tenant context
     10 export class GetDetailUseCase {
     11   async execute(id: number, ctx: TenantContext): Promise<DetailEntity> {
     12     const dto = await this.repo.findById(id, ctx.tenantId)
     13     return DetailEntity.fromDto(dto)
     14   }
     15 }

    6.2 Plugin-based Extensions

    Module Contract Pattern:

      1 // client/src/domains/pdo/pdo-module.contract.ts
      2 export interface PdoModuleContract {
      3   // Provided capabilities
      4   navigation: {
      5     registerLink(link: NavItem): void
      6   }
      7   detail: {
      8     getDetail(id: number): Promise<DetailEntity>
      9     registerDetailAction(action: DetailAction): void
     10   }
     11   
     12   // Extension points
     13   extensionPoints: {
     14     detailView: ExtensionPoint<DetailViewProps>
     15     materialForm: ExtensionPoint<MaterialFormProps>
     16   }
     17 }

    6.3 Domain Separation

    Current: PDO domain is reasonably isolated

    Improvement:

      1 // Enforce boundaries with ESLint
      2 // .eslintrc.js
      3 {
      4   rules: {
      5     'no-restricted-imports': [
      6       'error',
      7       {
      8         patterns: [
      9           {
     10             group: ['@/domains/pdo/*'],
     11             message: 'Use feature facade imports instead',
     12           },
     13         ],
     14       },
     15     ],
     16   }
     17 }

    6.4 Independent Feature Deployment

    Prerequisites:
     1. Feature lazy loading (code splitting)
     2. Shared dependency extraction
     3. Module contracts

    Implementation:

     1 // client/src/domains/pdo/routes.tsx
     2 const DetailListPage = lazy(() => 
     3   import('./detail').then(m => m.DetailListPage)
     4 )
     5 
     6 const MaterialListPage = lazy(() => 
     7   import('./material').then(m => m.MaterialListPage)
     8 )

    6.5 Performance Scaling


    ┌─────────────────────┬───────────────────────┬─────────────────────────────────────────┐
    │ Concern             │ Current               │ Proposed                                │
    ├─────────────────────┼───────────────────────┼─────────────────────────────────────────┤
    │ Data fetching       │ Manual with MobX      │ React Query with deduplication          │
    │ Cache strategy      │ Full reload           │ Incremental with stale-while-revalidate │
    │ Bundle size         │ Monolithic per domain │ Feature-based code splitting            │
    │ Render optimization │ observer() everywhere │ React.memo + selective subscriptions    │
    └─────────────────────┴───────────────────────┴─────────────────────────────────────────┘


    ---

    Summary of Critical Actions


    ┌──────────┬────────────────────────────────────────────────┬───────────┐
    │ Priority │ Action                                         │ Timeline  │
    ├──────────┼────────────────────────────────────────────────┼───────────┤
    │ P0       │ Document current conventions                   │ Week 1    │
    │ P0       │ Extract useDetail, useMaterial, useOrder hooks │ Week 2    │
    │ P1       │ Remove notifier calls from API layer           │ Week 3    │
    │ P1       │ Centralize cache invalidation logic            │ Week 4    │
    │ P2       │ Introduce use case layer for detail domain     │ Week 6-8  │
    │ P2       │ Split entity state from UI state               │ Week 8-10 │
    │ P3       │ Migrate to React Query                         │ Quarter 2 │
    │ P3       │ Implement module contracts                     │ Quarter 2 │
    └──────────┴────────────────────────────────────────────────┴───────────┘




