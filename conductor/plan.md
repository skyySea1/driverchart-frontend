# Project Plan

## Phase 1: Infrastructure & Setup
- [x] Initial Project Setup (Vue & API directories) [d4f412d]
- [x] Verify and Configure Tailwind CSS and PostCSS [7335d5]
- [x] Verify and Configure Pinia for State Management [7335d5]
- [x] Verify and Configure Vue Router [7335d5]
- [] Verify Fastify Backend Basic Structure [7335d5]
- [] Configure Firebase Connection (Frontend & Backend) [7335d5]

## Phase 2: Core UI & Layout (Requirement 1)
- [x] Implement Responsive App Layout (Sidebar, Header) [7335d5]
- [x] Implement Navigation with Mobile Support [7335d5]
- [x] Integrate Lucide Icons [7335d5]
- [x] Setup Global Styles (Typography, Colors) [7335d5]

## Phase 3: Dashboard & KPIs (Requirement 2)
- [x] Create Dashboard View Structure [7335d5]
- [x] Implement KPI Cards (Total Drivers, Vehicles, Alerts) [7335d5]
- [x] Implement Expiration Alert Logic (Red/Yellow/Green) [7335d5]
- [x] Implement "Expiring Soon" List Widget [7335d5]

## Phase 4: Driver Management (Requirement 3 & 5)
- [x] Create Driver List View (Table with columns: Name, Status, CDL, Medical, etc.) [7335d5]
- [ ] Implement Driver Search Functionality
- [x] Implement Driver Creation/Edit Modal Form [7335d5]
- [~] Implement File Upload Component (Currently name-only per Req 9)
- [x] Implement Driver Deletion with Double Confirmation [7335d5]
- [ ] Implement Zod Schemas & Validation for Driver Form

## Phase 5: Vehicle Management (Requirement 6)
- [x] Create Vehicle List View (Table with Bus #, VIN, Status, Last Annual Inspection, Next Inspection, and Mileage) [7335d5]
- [x] Implement Vehicle Inspection Date Calculation (Auto-calculate Next Inspection) [7335d5]
- [ ] Implement Vehicle Inspection Report Upload
- [ ] Implement Zod Schemas & Validation for Vehicle Form

## Phase 6: Document Registry (Requirement 7)
- [x] Create Document Registry View [7335d5]
- [~] Implement Tabs: General History, Driver Docs, Fleet Docs (UI exists, filtering needed)
- [ ] Implement Audit Logging for Document Changes (Firestore `document_logs`)

## Phase 7: Reporting & Certificates (Requirement 4 & 8)
- [x] Implement Road Test Certificate Template [7335d5]
- [~] Implement PDF Generation for Certificates (Currently uses print styles)
- [x] Create Compliance Matrix Report [7335d5]
- [x] Create Expiration Forecast Report [7335d5]

## Phase 8: AI & Advanced Features (Requirement 10)
- [x] Implement DOT Regulation Assistant Widget (Chat Interface) [7335d5]
- [x] Implement AI Risk Audit Analysis (Backend Service) [7335d5]

## Phase 9: Data Integration & Firebase (Requirement 9)
- [x] Migrate `dataService` from mocks to Axios API calls [7c9615]
- [x] Implement Firestore real-time queries (`onSnapshot`) in Views via `useRealtimeCollection` [7c9615]
- [x] Implement Firestore nested path pattern: `artifacts/{appId}/public/data/{collection}` [7c9615]
- [ ] Implement initialization check for Firebase Auth before data calls
- [ ] Implement Document Logging in parallel with save operations

## Phase 10: Backend API Implementation (Fastify)
- [x] Implement Zod Schemas (Drivers, Users, Documents) [7335d5]
- [x] Implement Service Layer (Business Logic & DB Interaction) [7335d5]
- [x] Implement Routes/Controllers (CRUD Endpoints) [7335d5]
- [x] Configure OpenAPI/Swagger Documentation [7335d5]
- [x] Implement Cloud Functions/Jobs for Expiration Alerts [7335d5]
- [x] Integrated Frontend with Backend API using Axios [7c9615]

## Low priority Tasks
- [] add examples schemas
- [] map predictable errors and messages for further status codes, and verify endpoint descriptiveness
- [] think about duplicate data (like email, and other unique field) and idempotence
- [] define git workflow like snapshot routines and patterns, and server layer (specify dev, prod environment)
