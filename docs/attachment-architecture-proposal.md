# Document Attachment System: Architecture Proposal

## Executive Summary

This document analyzes the current document attachment implementation in the PIEK ERP system and proposes a more scalable, flexible architecture optimized for ERP integrations. The current implementation works for basic use cases but lacks the abstraction, extensibility, and integration capabilities required for enterprise-scale operations.

---

## 1. Current State Analysis

### 1.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Current Architecture                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Client (MobX Stores)                                        │
│  └── attachments/store.ts                                    │
│      └── rpc.attachments.*                                   │
│                                                              │
│  tRPC Layer (server/src/domains/attachment/attachment_rpc.ts)│
│  ├── delete_file                                             │
│  ├── update_name                                             │
│  ├── get_detail_attachments                                  │
│  └── get_attachment_by_key                                   │
│                                                              │
│  Service Layer (server/src/domains/attachment/attachment_service.ts)
│  ├── insertAttachmentMetadata()                              │
│  ├── linkAttachmentsToOrder()                                │
│  ├── linkAttachmentsToDetail()                               │
│  ├── uploadAndLinkFiles()                                    │
│  ├── getOrderAttachments()                                   │
│  └── getDetailAttachments()                                  │
│                                                              │
│  Database Schema                                             │
│  ├── attachments (central storage)                           │
│  ├── orders.order_attachments (junction table)               │
│  └── pdo.detail_attachments (junction table)                 │
│                                                              │
│  Storage: AWS S3 (via @aws-sdk/client-s3)                    │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Current Implementation Strengths

| Aspect | Assessment |
|--------|------------|
| **Simple CRUD operations** | Well-structured, easy to understand |
| **Database design** | Proper normalization with junction tables |
| **Type safety** | Full TypeScript coverage with Kysely |
| **S3 integration** | Working cloud storage integration |
| **Transaction support** | Uses database transactions for consistency |

### 1.3 Critical Limitations

#### 1.3.1 Tight Coupling to Specific Entities

```typescript
// Current: Hardcoded entity types
async linkAttachmentsToOrder(attachments: ..., orderId: number)
async linkAttachmentsToDetail(attachments: ..., detailId: number)

// Problem: Adding new attachable entity requires:
// 1. New junction table
// 2. New service methods
// 3. New RPC endpoints
// 4. Client-side code changes
```

**Impact**: Every new entity (invoices, contracts, certificates, etc.) requires code changes across all layers.

#### 1.3.2 Limited Integration Capabilities

```typescript
// Current: No support for:
- External URL references (only S3 uploads)
- Third-party document systems (SharePoint, Google Drive, etc.)
- Document metadata extraction
- Version control
- Access control per attachment
- Audit trails
- Webhook notifications on attachment events
```

#### 1.3.3 Scalability Concerns

| Concern | Current State | Risk |
|---------|---------------|------|
| **Storage backend** | Hardcoded S3 | Cannot switch/add providers |
| **File processing** | Synchronous upload | Blocks on large files |
| **Metadata extraction** | None | No content indexing |
| **Caching** | None | Repeated DB queries |
| **CDN integration** | None | Direct S3 access only |
| **Virus scanning** | None | Security risk |

#### 1.3.4 ERP Integration Gaps

```
Current gaps for ERP integrations:

┌────────────────────────┬────────────────────────────────┐
│ Integration Point      │ Current Support                │
├────────────────────────┼────────────────────────────────┤
│ 1C Enterprise          │ ❌ No adapter                   │
│ SAP Document Service   │ ❌ No adapter                   │
│ Microsoft SharePoint   │ ❌ No adapter                   │
│ Custom DMS             │ ❌ No adapter                   │
│ Barcode/QR generation  │ ❌ Not available                │
│ OCR processing         │ ❌ Not available                │
│ Digital signatures     │ ❌ Not available                │
│ Document templates     │ ❌ Not available                │
└────────────────────────┴────────────────────────────────┘
```

---

## 2. Proposed Architecture

### 2.1 Design Principles

1. **Entity Agnosticism**: Attachments work with any entity without code changes
2. **Storage Abstraction**: Pluggable storage backends (S3, Azure Blob, local, external URLs)
3. **Integration-First**: Built-in adapter pattern for ERP/DMS integrations
4. **Event-Driven**: Async processing with webhook support
5. **Extensibility**: Plugin architecture for custom processors
6. **Security**: Role-based access control at attachment level
7. **Auditability**: Complete audit trail for compliance

### 2.2 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Proposed Architecture                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    Presentation Layer                        │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │    │
│  │  │ React Components │  │ Mobile App   │  │ External API │       │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘       │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              ↓                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    Attachment Facade                         │    │
│  │  ┌──────────────────────────────────────────────────────┐   │    │
│  │  │  AttachmentService (unified API)                      │   │    │
│  │  │  - attach(entityType, entityId, AttachmentDTO)        │   │    │
│  │  │  - detach(attachmentId)                               │   │    │
│  │  │  - list(entityType, entityId)                         │   │    │
│  │  │  - download(attachmentId)                             │   │    │
│  │  │  - search(criteria)                                   │   │    │
│  │  └──────────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              ↓                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                   Domain Layer                               │    │
│  │                                                              │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │    │
│  │  │  Entities   │  │ Value Objs  │  │  Services   │          │    │
│  │  │  - Attachment│  │ - FileType  │  │ - Validator │          │    │
│  │  │  - EntityRef │  │ - FileSize  │  │ - Metadata  │          │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘          │    │
│  │                                                              │    │
│  │  ┌──────────────────────────────────────────────────────┐   │    │
│  │  │              Repository Interface                     │   │    │
│  │  │  - AttachmentRepository                               │   │    │
│  │  │  - EntityAttachmentRepository                         │   │    │
│  │  └──────────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              ↓                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                 Infrastructure Layer                         │    │
│  │                                                              │    │
│  │  ┌────────────────── Storage Providers ──────────────────┐  │    │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │  │    │
│  │  │  │   S3     │ │  Azure   │ │   Local  │ │  External│  │  │    │
│  │  │  │ Adapter  │ │ Adapter  │ │ Adapter  │ │   URL    │  │  │    │
│  │  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │  │    │
│  │  └───────────────────────────────────────────────────────┘  │    │
│  │                                                              │    │
│  │  ┌────────────────── Processors (Pipeline) ───────────────┐ │    │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │ │    │
│  │  │  │  Virus   │ │   OCR    │ │ Metadata │ │ Thumbnail│   │ │    │
│  │  │  │  Scan    │ │ Extract  │ │ Extract  │ │ Generate │   │ │    │
│  │  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │ │    │
│  │  └───────────────────────────────────────────────────────┘  │    │
│  │                                                              │    │
│  │  ┌────────────────── ERP Integrations ────────────────────┐ │    │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │ │    │
│  │  │  │   1C     │ │   SAP    │ │SharePoint│ │  Custom  │   │ │    │
│  │  │  │ Adapter  │ │ Adapter  │ │ Adapter  │ │  DMS     │   │ │    │
│  │  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │ │    │
│  │  └───────────────────────────────────────────────────────┘  │    │
│  │                                                              │    │
│  │  ┌────────────────── Event Bus ───────────────────────────┐ │    │
│  │  │  - AttachmentUploaded                                 │  │    │
│  │  │  - AttachmentDeleted                                  │  │    │
│  │  │  - AttachmentDownloaded                               │  │    │
│  │  │  - AttachmentProcessingCompleted                       │  │    │
│  │  └───────────────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              ↓                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                   Data Layer                                 │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │    │
│  │  │  PostgreSQL  │  │    Redis     │ │   S3/Blob    │       │    │
│  │  │  (Metadata)  │  │   (Cache)    │ │  (Storage)   │       │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘       │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.3 Core Domain Model

```typescript
// Universal attachment entity - works with ANY entity type
interface Attachment {
  id: number
  entityId: string              // Universal identifier
  entityType: string            // e.g., 'order', 'detail', 'invoice', 'contract'
  
  // File information
  filename: string
  mimeType: string
  size: number
  
  // Storage reference (polymorphic)
  storageProvider: string       // 's3', 'azure', 'local', 'external', 'sharepoint'
  storageKey: string            // Provider-specific key/URL
  
  // Metadata (extensible)
  metadata: AttachmentMetadata
  tags: string[]
  
  // Audit
  uploadedBy: number
  uploadedAt: Date
  lastAccessedAt: Date | null
  
  // Version control (optional)
  version: number
  predecessorId: number | null
  
  // Security
  accessLevel: AccessLevel
  allowedRoles: UserRole[]
}

interface AttachmentMetadata {
  // Auto-extracted
  checksum?: string
  dimensions?: { width: number; height: number }  // For images
  pageCount?: number  // For PDFs
  extractedText?: string  // From OCR
  
  // Business metadata
  category?: AttachmentCategory
  description?: string
  externalReference?: string  // For linked documents
  
  // Processing status
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed'
  processingErrors?: string[]
}

// Universal reference to any attachable entity
interface EntityReference {
  entityType: string
  entityId: string | number
  context?: Record<string, any>  // Additional context for resolution
}
```

### 2.4 Database Schema Evolution

```sql
-- Current schema (keep for backward compatibility)
CREATE TABLE attachments (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL,
  filename TEXT NOT NULL,
  size INTEGER NOT NULL,
  uploaded_at TIMESTAMP NOT NULL
);

-- New universal schema
CREATE TABLE attachments_v2 (
  id SERIAL PRIMARY KEY,
  
  -- Entity reference (universal)
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(100) NOT NULL,  -- String to support external IDs
  
  -- File information
  filename TEXT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size BIGINT NOT NULL,
  
  -- Storage (polymorphic)
  storage_provider VARCHAR(50) NOT NULL DEFAULT 's3',
  storage_key TEXT NOT NULL,
  storage_metadata JSONB,  -- Provider-specific metadata
  
  -- Business metadata
  category VARCHAR(50),
  tags TEXT[] DEFAULT '{}',
  description TEXT,
  external_reference TEXT,
  
  -- Version control
  version INTEGER NOT NULL DEFAULT 1,
  predecessor_id INTEGER REFERENCES attachments_v2(id),
  
  -- Security
  access_level VARCHAR(20) NOT NULL DEFAULT 'inherit',
  allowed_roles VARCHAR(50)[],
  
  -- Processing
  processing_status VARCHAR(20) NOT NULL DEFAULT 'pending',
  processing_errors TEXT[],
  extracted_metadata JSONB,
  
  -- Audit
  uploaded_by INTEGER NOT NULL REFERENCES users(id),
  uploaded_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_accessed_at TIMESTAMP,
  
  -- Constraints
  CONSTRAINT chk_entity_reference UNIQUE (entity_type, entity_id, storage_key)
);

-- Index for fast lookups
CREATE INDEX idx_attachments_entity ON attachments_v2(entity_type, entity_id);
CREATE INDEX idx_attachments_category ON attachments_v2(category);
CREATE INDEX idx_attachments_tags ON attachments_v2 USING GIN(tags);

-- Junction table for many-to-many (if needed for multiple entity links)
CREATE TABLE attachment_entity_links (
  attachment_id INTEGER REFERENCES attachments_v2(id) ON DELETE CASCADE,
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(100) NOT NULL,
  linked_at TIMESTAMP NOT NULL DEFAULT NOW(),
  linked_by INTEGER NOT NULL REFERENCES users(id),
  PRIMARY KEY (attachment_id, entity_type, entity_id)
);

-- Audit trail
CREATE TABLE attachment_audit_log (
  id SERIAL PRIMARY KEY,
  attachment_id INTEGER REFERENCES attachments_v2(id),
  action VARCHAR(50) NOT NULL,  -- 'uploaded', 'downloaded', 'deleted', 'updated'
  actor_id INTEGER NOT NULL REFERENCES users(id),
  actor_role VARCHAR(50),
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 2.5 Service Layer Design

```typescript
// Main service facade
interface AttachmentService {
  // Core operations
  attach(reference: EntityReference, dto: AttachmentDTO): Promise<Attachment>
  detach(attachmentId: number): Promise<void>
  list(reference: EntityReference, filters?: AttachmentFilters): Promise<Attachment[]>
  
  // File operations
  download(attachmentId: number): Promise<FileStream>
  getSignedUrl(attachmentId: number, expiresIn: number): Promise<string>
  
  // Search and discovery
  search(criteria: SearchCriteria): Promise<Attachment[]>
  findByExternalReference(ref: string): Promise<Attachment | null>
  
  // Management
  updateMetadata(attachmentId: number, metadata: Partial<AttachmentMetadata>): Promise<void>
  addTags(attachmentId: number, tags: string[]): Promise<void>
  categorize(attachmentId: number, category: AttachmentCategory): Promise<void>
  
  // Version control
  createVersion(attachmentId: number, newFile: FileDTO): Promise<Attachment>
  getVersionHistory(attachmentId: number): Promise<Attachment[]>
}

// Storage provider abstraction
interface StorageProvider {
  name: string
  
  // Core operations
  upload(file: File, options?: UploadOptions): Promise<StorageResult>
  download(key: string): Promise<FileStream>
  delete(key: string): Promise<void>
  
  // Advanced features
  getSignedUrl(key: string, expiresIn: number): Promise<string>
  copy(sourceKey: string, destKey: string): Promise<void>
  move(sourceKey: string, destKey: string): Promise<void>
  
  // Metadata
  getMetadata(key: string): Promise<StorageMetadata>
}

// Processor pipeline
interface AttachmentProcessor {
  name: string
  priority: number
  
  process(attachment: Attachment, context: ProcessingContext): Promise<ProcessingResult>
  canHandle(attachment: Attachment): boolean
}

// Event types
type AttachmentEvent =
  | { type: 'ATTACHMENT_UPLOADED'; attachmentId: number }
  | { type: 'ATTACHMENT_DELETED'; attachmentId: number; reason: string }
  | { type: 'ATTACHMENT_DOWNLOADED'; attachmentId: number; userId: number }
  | { type: 'ATTACHMENT_PROCESSING_COMPLETED'; attachmentId: number; success: boolean }
  | { type: 'ATTACHMENT_METADATA_UPDATED'; attachmentId: number }
```

### 2.6 ERP Integration Adapters

```typescript
// Base adapter interface
interface ERPIntegrationAdapter {
  name: string
  enabled: boolean
  
  // Connection management
  connect(config: AdapterConfig): Promise<void>
  disconnect(): Promise<void>
  testConnection(): Promise<boolean>
  
  // Document operations
  importDocument(reference: string): Promise<ExternalDocument>
  exportDocument(attachment: Attachment): Promise<void>
  syncMetadata(attachment: Attachment): Promise<void>
  
  // Webhooks
  registerWebhook(url: string, events: string[]): Promise<void>
  handleWebhook(payload: any): Promise<void>
}

// 1C Enterprise Adapter
class OneCAdapter implements ERPIntegrationAdapter {
  name = '1c-enterprise'
  
  async importDocument(guid: string): Promise<ExternalDocument> {
    // Connect to 1C via COM or HTTP API
    // Fetch document metadata and file
    // Return normalized document structure
  }
  
  async linkAttachment(orderId: number, oneCDocId: string): Promise<void> {
    // Create bidirectional link between ERP order and 1C document
  }
}

// SAP Document Service Adapter
class SAPAdapter implements ERPIntegrationAdapter {
  name = 'sap-dms'
  
  async importDocument(documentId: string): Promise<ExternalDocument> {
    // Use SAP BAPI or RFC to fetch documents
    // Handle SAP-specific authentication (SAML, OAuth)
  }
}

// SharePoint Adapter
class SharePointAdapter implements ERPIntegrationAdapter {
  name = 'sharepoint'
  
  async importDocument(siteUrl: string, listId: string, itemId: number): Promise<ExternalDocument> {
    // Use Microsoft Graph API
    // Handle OAuth2 authentication
  }
}

// Generic external URL adapter
class ExternalUrlAdapter implements StorageProvider {
  name = 'external-url'
  
  async upload(url: string, options?: UploadOptions): Promise<StorageResult> {
    // Validate URL
    // Optionally download and cache the file
    // Store reference
  }
}
```

### 2.7 Processing Pipeline

```typescript
// Configurable processor pipeline
const defaultPipeline: AttachmentProcessor[] = [
  new VirusScanProcessor(),      // Security first
  new MetadataExtractorProcessor(), // Extract file metadata
  new OCRProcessor(),            // Extract text from images/PDFs
  new ThumbnailGeneratorProcessor(), // Generate previews
  new IndexingProcessor(),       // Add to search index
  new NotificationProcessor(),   // Send webhooks/notifications
]

// Example: Virus scan processor
class VirusScanProcessor implements AttachmentProcessor {
  name = 'virus-scan'
  priority = 1  // Run first
  
  async process(attachment: Attachment, context: ProcessingContext): Promise<ProcessingResult> {
    const file = await this.storage.download(attachment.storageKey)
    const scanResult = await this.antivirus.scan(file)
    
    if (!scanResult.clean) {
      // Quarantine the file
      await this.quarantine(attachment.id)
      throw new VirusDetectedError(scanResult.threats)
    }
    
    return { success: true, metadata: { virusScanDate: new Date() } }
  }
}

// Example: OCR processor
class OCRProcessor implements AttachmentProcessor {
  name = 'ocr-extraction'
  priority = 3
  
  async process(attachment: Attachment, context: ProcessingContext): Promise<ProcessingResult> {
    if (!this.isImageOrPdf(attachment)) {
      return { success: true, skipped: true }
    }
    
    const file = await this.storage.download(attachment.storageKey)
    const text = await this.ocrEngine.extractText(file)
    
    return {
      success: true,
      metadata: {
        extractedText: text,
        wordCount: text.split(' ').length,
        language: await this.detectLanguage(text)
      }
    }
  }
}
```

---

## 3. Integration Scenarios

### 3.1 Order Management Integration

```typescript
// Current approach (requires code changes for each entity)
await attachmentService.linkAttachmentsToOrder(attachments, orderId)

// New approach (universal, no code changes needed)
await attachmentService.attach(
  { entityType: 'order', entityId: orderId },
  { file, category: 'invoice', tags: ['pending-review'] }
)

// Attach to multiple entities
await attachmentService.attach(
  { entityType: 'order', entityId: orderId },
  { file }
)
await attachmentService.attach(
  { entityType: 'invoice', entityId: invoiceId },
  { file }  // Same file, different reference
)
```

### 3.2 External DMS Integration

```typescript
// Link to existing SharePoint document
const sharepointAdapter = container.get<SharePointAdapter>('sharepoint')
const externalDoc = await sharepointAdapter.importDocument(
  'https://company.sharepoint.com/sites/orders/...',
  'documents',
  12345
)

// Create reference in ERP without duplicating file
await attachmentService.attach(
  { entityType: 'order', entityId: orderId, context: { source: 'sharepoint' } },
  {
    storageProvider: 'sharepoint',
    storageKey: externalDoc.id,
    metadata: { externalUrl: externalDoc.url }
  }
)
```

### 3.3 1C Enterprise Synchronization

```typescript
// Bidirectional sync
class OrderDocumentSync {
  constructor(
    private oneCAdapter: OneCAdapter,
    private attachmentService: AttachmentService,
    private eventBus: EventBus
  ) {
    // Listen for order creation
    this.eventBus.on('ORDER_CREATED', async (orderId) => {
      // Create corresponding document in 1C
      const oneCDocId = await this.oneCAdapter.createOrderDocument(orderId)
      
      // Link back to ERP
      await this.attachmentService.attach(
        { entityType: 'order', entityId: orderId },
        {
          storageProvider: '1c-enterprise',
          storageKey: oneCDocId,
          category: 'erp-document'
        }
      )
    })
    
    // Listen for 1C document updates
    this.oneCAdapter.registerWebhook('/webhooks/1c', ['document.updated'])
  }
}
```

### 3.4 Automated Document Processing

```typescript
// Invoice processing pipeline
const invoicePipeline: AttachmentProcessor[] = [
  new VirusScanProcessor(),
  new InvoiceOCRProcessor(),      // Specialized for invoices
  new DataExtractionProcessor(),  // Extract invoice number, date, amount
  new ValidationProcessor(),      // Validate against order
  new AccountingSyncProcessor(),  // Sync to accounting system
]

// Usage
await attachmentService.attach(
  { entityType: 'invoice', entityId: invoiceId },
  { file, pipeline: 'invoice-processing' }
)

// Results automatically available via metadata
const attachment = await attachmentService.get(invoiceId)
const extractedData = attachment.metadata.extractedMetadata
// { invoiceNumber: 'INV-123', amount: 1000, vendor: 'ABC Corp' }
```

---

## 4. Migration Strategy

### 4.1 Phase 1: Foundation (Weeks 1-3)

**Goal**: Create new architecture without breaking existing functionality

| Task | Description | Risk |
|------|-------------|------|
| 1.1 Create new database schema | Add attachments_v2 tables alongside existing | Low |
| 1.2 Implement storage provider interface | Abstract S3 behind interface | Low |
| 1.3 Create attachment service facade | New service with universal API | Low |
| 1.4 Implement basic processors | Virus scan, metadata extraction | Medium |
| 1.5 Add event bus | Simple in-memory event system | Low |

### 4.2 Phase 2: Parallel Operation (Weeks 4-6)

**Goal**: Run old and new systems in parallel

| Task | Description | Risk |
|------|-------------|------|
| 2.1 Dual-write attachments | Write to both schemas | Medium |
| 2.2 Migrate existing attachments | Background migration script | Medium |
| 2.3 Update client to new API | Gradual rollout | Medium |
| 2.4 Add caching layer | Redis for frequently accessed attachments | Low |
| 2.5 Implement audit logging | Complete audit trail | Low |

### 4.3 Phase 3: Integration Adapters (Weeks 7-10)

**Goal**: Enable ERP integrations

| Task | Description | Risk |
|------|-------------|------|
| 3.1 Create adapter framework | Base classes and interfaces | Low |
| 3.2 Implement 1C adapter | Most critical ERP integration | High |
| 3.3 Implement SharePoint adapter | Common external DMS | Medium |
| 3.4 Implement external URL adapter | Generic URL references | Low |
| 3.5 Add webhook system | Outbound notifications | Medium |

### 4.4 Phase 4: Advanced Features (Weeks 11-14)

**Goal**: Complete feature parity and advanced capabilities

| Task | Description | Risk |
|------|-------------|------|
| 4.1 Implement version control | Track attachment versions | Medium |
| 4.2 Add OCR processing | Text extraction from images/PDFs | Medium |
| 4.3 Implement search | Full-text search across attachments | Medium |
| 4.4 Add access control | Per-attachment permissions | High |
| 4.5 Performance optimization | CDN, lazy loading, compression | Low |

### 4.5 Phase 5: Deprecation (Weeks 15-16)

**Goal**: Remove old system

| Task | Description | Risk |
|------|-------------|------|
| 5.1 Switch all traffic to new system | Feature flag flip | Medium |
| 5.2 Monitor and fix issues | Production stabilization | Medium |
| 5.3 Remove old schema | Clean up database | Low |
| 5.4 Documentation | Update all docs | None |

---

## 5. Benefits Comparison

### 5.1 Scalability

| Aspect | Current | Proposed |
|--------|---------|----------|
| **New entity types** | Code changes required | No code changes |
| **Storage backends** | S3 only | Pluggable providers |
| **Concurrent uploads** | Limited by sync processing | Async pipeline |
| **File size limits** | Memory-bound | Stream-based |
| **Geographic distribution** | Single region | Multi-region capable |

### 5.2 Flexibility

| Capability | Current | Proposed |
|------------|---------|----------|
| **External URLs** | ❌ | ✅ |
| **Third-party DMS** | ❌ | ✅ (adapters) |
| **Document versions** | ❌ | ✅ |
| **Custom metadata** | Limited | Extensible (JSONB) |
| **Processing pipeline** | ❌ | ✅ (pluggable) |
| **Event notifications** | ❌ | ✅ (webhooks) |

### 5.3 ERP Integration

| Integration | Current | Proposed |
|-------------|---------|----------|
| **1C Enterprise** | ❌ Manual | ✅ Adapter |
| **SAP DMS** | ❌ Manual | ✅ Adapter |
| **SharePoint** | ❌ Manual | ✅ Adapter |
| **Custom DMS** | ❌ Manual | ✅ Framework |
| **Bidirectional sync** | ❌ | ✅ Event-driven |

### 5.4 Security & Compliance

| Feature | Current | Proposed |
|---------|---------|----------|
| **Virus scanning** | ❌ | ✅ |
| **Access control** | Entity-level only | Per-attachment |
| **Audit trail** | ❌ | ✅ Complete |
| **Data retention** | ❌ | ✅ Policies |
| **Encryption** | S3 default | End-to-end capable |

---

## 6. Technical Specifications

### 6.1 API Design (tRPC)

```typescript
// New tRPC router
export const attachments = router({
  // Core operations
  attach: procedure
    .input(AttachSchema)
    .mutation(async ({ input, ctx }) => {
      return attachmentService.attach(input.reference, input.dto)
    }),
  
  detach: procedure
    .input(z.object({ attachmentId: z.number() }))
    .mutation(async ({ input }) => {
      return attachmentService.detach(input.attachmentId)
    }),
  
  list: procedure
    .input(ListAttachmentsSchema)
    .query(async ({ input }) => {
      return attachmentService.list(input.reference, input.filters)
    }),
  
  // File operations
  download: procedure
    .input(z.object({ attachmentId: z.number() }))
    .query(async ({ input }) => {
      return attachmentService.getSignedUrl(input.attachmentId, 3600)
    }),
  
  // Search
  search: procedure
    .input(SearchSchema)
    .query(async ({ input }) => {
      return attachmentService.search(input.criteria)
    }),
  
  // Management
  updateMetadata: procedure
    .input(UpdateMetadataSchema)
    .mutation(async ({ input }) => {
      return attachmentService.updateMetadata(input.attachmentId, input.metadata)
    }),
  
  addTags: procedure
    .input(AddTagsSchema)
    .mutation(async ({ input }) => {
      return attachmentService.addTags(input.attachmentId, input.tags)
    }),
  
  // Version control
  createVersion: procedure
    .input(CreateVersionSchema)
    .mutation(async ({ input }) => {
      return attachmentService.createVersion(input.attachmentId, input.newFile)
    }),
  
  getVersionHistory: procedure
    .input(z.object({ attachmentId: z.number() }))
    .query(async ({ input }) => {
      return attachmentService.getVersionHistory(input.attachmentId)
    }),
})
```

### 6.2 Configuration

```typescript
interface AttachmentConfig {
  // Storage providers
  storage: {
    default: 's3' | 'azure' | 'local'
    s3: {
      bucket: string
      region: string
      credentials: AWSCredentials
    }
    azure?: {
      connectionString: string
      containerName: string
    }
    local?: {
      path: string
    }
  }
  
  // Processing pipeline
  pipeline: {
    enabled: boolean
    processors: string[]
    maxConcurrent: number
    retryAttempts: number
  }
  
  // Security
  security: {
    virusScanning: {
      enabled: boolean
      provider: 'clamav' | 'virustotal'
      apiKey?: string
    }
    maxFileSize: number  // bytes
    allowedMimeTypes: string[]
  }
  
  // ERP integrations
  integrations: {
    oneC?: {
      enabled: boolean
      endpoint: string
      credentials: OneCCredentials
    }
    sharepoint?: {
      enabled: boolean
      tenantId: string
      clientId: string
      clientSecret: string
    }
  }
  
  // Events
  events: {
    webhooks: {
      enabled: boolean
      endpoints: string[]
    }
  }
}
```

### 6.3 Dependency Injection

```typescript
// Container setup
const container = createContainer()

// Register storage providers
container.register<StorageProvider>('s3', S3StorageProvider)
container.register<StorageProvider>('azure', AzureStorageProvider)
container.register<StorageProvider>('local', LocalStorageProvider)

// Register processors
container.register<AttachmentProcessor>('virus-scan', VirusScanProcessor)
container.register<AttachmentProcessor>('ocr', OCRProcessor)
container.register<AttachmentProcessor>('metadata', MetadataExtractorProcessor)

// Register ERP adapters
container.register<ERPIntegrationAdapter>('1c-enterprise', OneCAdapter)
container.register<ERPIntegrationAdapter>('sharepoint', SharePointAdapter)

// Register main service
container.register<AttachmentService>('attachment-service', AttachmentService)
```

---

## 7. Risk Assessment

### 7.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Data migration failures** | Medium | High | Parallel operation, rollback plan |
| **Performance regression** | Low | Medium | Load testing, gradual rollout |
| **Integration complexity** | High | Medium | Start with one adapter, iterate |
| **Storage provider failures** | Low | High | Retry logic, fallback providers |

### 7.2 Business Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Downtime during migration** | Low | High | Zero-downtime migration strategy |
| **Data loss** | Low | Critical | Backups, verification, audit trail |
| **User disruption** | Medium | Low | Training, documentation, gradual rollout |

---

## 8. Success Metrics

### 8.1 Technical KPIs

| Metric | Current | Target |
|--------|---------|--------|
| **Upload latency (p95)** | ~500ms | <200ms |
| **Download latency (p95)** | ~300ms | <100ms (with CDN) |
| **Max file size** | Memory-limited | 10GB (streaming) |
| **Concurrent uploads** | ~10 | ~1000 |
| **Search latency** | N/A | <100ms |

### 8.2 Business KPIs

| Metric | Current | Target |
|--------|---------|--------|
| **Time to integrate new entity** | 2-3 days | 0 days (config only) |
| **Time to add storage provider** | N/A (impossible) | 1-2 days |
| **ERP integration time** | 1-2 weeks per system | 2-3 days per system |
| **Document processing time** | Manual | Automated |

---

## 9. Recommendations

### 9.1 Immediate Actions (Next Sprint)

1. **Create proof of concept** for storage provider abstraction
2. **Design new database schema** with team review
3. **Implement event bus** for decoupled communication
4. **Document current attachment usage** across the codebase

### 9.2 Short-term Goals (Next Month)

1. **Complete Phase 1** (Foundation)
2. **Begin dual-write** for new attachments
3. **Create 1C adapter prototype**
4. **Add virus scanning** (security priority)

### 9.3 Long-term Vision (Next Quarter)

1. **Full migration** to new architecture
2. **At least 2 ERP adapters** production-ready
3. **Automated document processing** for invoices
4. **Complete audit trail** for compliance

---

## 10. Conclusion

The proposed architecture transforms the attachment system from a simple file storage mechanism into a comprehensive document management platform capable of:

- **Supporting any entity type** without code changes
- **Integrating with external systems** through a flexible adapter framework
- **Scaling horizontally** with async processing and caching
- **Meeting enterprise requirements** for security, audit, and compliance
- **Enabling automation** through processing pipelines and events

The migration strategy ensures zero downtime and allows for gradual adoption, minimizing risk while delivering incremental value throughout the implementation.

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| **Entity Reference** | Universal identifier for any attachable object |
| **Storage Provider** | Abstract interface for file storage backends |
| **Processor Pipeline** | Chain of processors applied to attachments |
| **ERP Adapter** | Integration module for external ERP systems |
| **Attachment Facade** | Unified API for all attachment operations |

## Appendix B: Related Documentation

- [Plugin Architecture](./plugin_architec.md) - Overall system architecture
- [Database Schema](./db/schema.ts) - Current database structure
- [Attachment Service](./server/src/domains/attachment/attachment_service.ts) - Current implementation
