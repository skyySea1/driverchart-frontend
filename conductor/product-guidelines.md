# Product Guidelines - DOT Compliance System

## Visual Identity & Information Hierarchy
- **Primary Palette:** Follow the **Slate** grayscale for structural elements (`bg-slate-50`, `border-slate-200`) and **Indigo/Blue** for interaction highlights.
- **Action Colors:** Use **Emerald** for positive actions/active statuses and **Red** for destructive or critical error states.
- **Compliance Status:** Adhere to the established high-contrast status badges in tables (e.g., `bg-green-100 text-green-800` for Valid).
- **Progressive Disclosure:** Use `Modal.vue` for detailed driver information to keep the main registry lean. Future phases will introduce dedicated profile sections to further refine this disclosure.

## UI Components & Interaction
- **Declarative Approach:** Utilize components like `StatCard.vue` and `DefaultTable.vue` where logic and styling are mapped internally via props (e.g., `type="drivers"`).
- **Interactive Affordance:** Every clickable element (buttons, interactive rows, uploaders) **MUST** include the `v-cursor` directive.
- **Visual Feedback:** Implement `.skeleton` loaders for all data-fetching components to maintain a smooth, perceived performance.
- **Micro-interactions:** Apply `transition-colors duration-200` to all interactive elements to ensure a polished feel.

## Forms & Data Entry
- **Layout:** Use `grid` and `gap-4` for logical field alignment.
- **Validation:** Enforce real-time schema validation using **Zod** to prevent data entry errors before they reach the backend.
- **UX Density:** Maintain high information density while using whitespace (KISS principle) to prevent cognitive overload for administrative staff.

## Tone & Communication
- **Tone:** Professional and concise. Messages should be direct and efficiency-oriented.
- **Error Handling:** Use `BaseAlert.vue` for global notifications, ensuring messages are technically accurate yet easy to understand for non-technical administrators.
