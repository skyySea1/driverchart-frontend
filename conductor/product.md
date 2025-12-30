# Product Guide - DOT Compliance System

## Initial Concept
A lean, high-performance compliance management system designed to replace complex third-party software. The initial focus is exclusively on the **Drivers context**, ensuring administrative staff can manage qualifications with mastery and excellence.

## Target Users
- **Primary:** Administrative Staff / Compliance Managers.
- **Secondary:** Stakeholders seeking to bring compliance tracking in-house to reduce dependency on third-party SaaS.

## Core Goals
- **Transition & Migration:** Seamlessly replace legacy third-party systems using CSV-based data migration.
- **Mastery of Basics:** Provide a superior UX for tracking CDL, Medical Cards, and MVRs without the bloat of multi-module fleet systems.
- **Proactive Management:** Use visual dashboard alerts to identify expiring documents before they become compliance liabilities.

## Key Features
- **Driver Management:** Single-page interface (SPA) with searchable tables and modal-based editing.
- **Compliance Dashboard:** Action-oriented view prioritizing drivers with upcoming or expired requirements.
- **Document Logging:** Historical audit trails of all document updates for audit readiness.
- **Data Migration:** Bulk import capabilities focused on driver records from legacy systems.
- **DOT Documentation:** (Phase 1.5) Clean, print-ready PDF generation for W-9, I-9, and Road Test certificates.

## Design Philosophy & Methodology
- **Lean & Fast:** Minimalist interactions to reduce administrative overhead.
- **Excellent UX:** Modern, whitespace-heavy design (inspired by top-tier SaaS) that provides clarity over complexity.
- **Core Principles:** LEAN, KISS, and DRY.
- **Frontend Pattern:** Strict adherence to Vue 3 Composition API.

## Technical Foundation
- **Build & Style:** Vite, Tailwind CSS, PostCSS.
- **Schema Validation:** Zod (ensuring strict type safety).
- **Backend/API:** Fastify with OpenAPI documentation (for self-documenting APIs) and Cloud Functions.
- **Key Libraries:** Day.js (date manipulation), Dotenv (env vars), Axios (HTTP client).
- **Future Extensibility:** Open to Fastify ecosystem plugins (TBD).
