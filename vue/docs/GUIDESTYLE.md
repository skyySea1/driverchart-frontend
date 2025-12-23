# VueBus Style Guide

This style guide outlines the visual and interaction conventions for the VueBus project, ensuring consistency across new and existing features for lean and assertive development.
The system use Declarative component methodology

## 1. Color Palette and Themes

The project uses the **Slate** grayscale for structure and semantic colors for actions.

* **Structure (Slate):**
  * `bg-slate-50`: Background for sections, table headers, secondary areas.
  * `border-slate-200`: Standard borders for cards and inputs.
  * `text-slate-900`: Main titles.
  * `text-slate-700`: Body text and labels.
  * `text-slate-500`: Inactive icons and metadata.
* **Interaction (Indigo/Blue):**
  * Used for hovers on white buttons and links.
  * Ex: `hover:text-indigo-600 hover:border-indigo-600`.
* **Positive Action (Emerald):**
  * Used for "Save" or "Active" status.
  * Ex: `bg-emerald-600` (Primary buttons).
* **Destructive/Error (Red):**
  * Delete buttons, error messages.

## 2. UI Components

### Cards and Containers

All main content should float on white "cards" over the gray background.

* **Standard Classes:** `bg-white rounded-xl shadow-sm border border-slate-200`.
* **Overflow:** Use `overflow-hidden` if there are children with corners (like tables).

### Buttons

* **Primary Button (Action):**
  * `bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg shadow-sm`.
  * Always use the `v-cursor` directive.
* **Secondary / Icon Button (Header/Actions):**
  * `bg-white border border-slate-200 text-slate-600 rounded-lg shadow-sm`.
  * **Hover:** `hover:text-indigo-600 hover:border-indigo-600 hover:bg-slate-50`.
  * Always use the `v-cursor` directive.
  * **Icon Size:** Standardize to `w-5 h-5` (or `w-4 h-4` for compact buttons).

### Modals

Do not create modals from scratch.

* Always use the `@/Components/ui/Modal.vue` component.
* **Titles:** `text-lg font-bold text-slate-800`.
* **Size:** Use size props (`max-w-md`, `max-w-4xl`, etc.) according to content density.

## 3. Forms (Inputs)

* **Labels:**
  * `text-xs font-bold text-slate-700` (Can be uppercase if it's a section header `text-slate-400`).
* **Text/Select Inputs:**
  * `w-full border border-slate-300 rounded p-2 text-sm`.
  * **Focus:** `focus:ring-2 focus:ring-blue-500 outline-none`.
* **Grouping:** Use `grid` and `gap-4` to align fields side-by-side.

## 4. Tables

Use the `@/Components/templates/DefaultTable.vue` component.

* **Header:** Defined via `columns` prop.
* **Cells:** Use `#cell(name)` slots for customization.
* **Status Badges:**
  * Rounded: `rounded-full`.
  * Font: `text-xs font-semibold`.
  * Ex: `bg-green-100 text-green-800`.

## 5. Icons

* **Library:** `lucide-vue-next`.
* **Style:** Simple stroke.
* **Size:** Generally `w-5 h-5`. Large "Empty State" icons can be `w-8 h-8`.

## 6. Behavior and Directives

* **Cursor:** Any clickable element (buttons, interactive table rows, uploaders) **MUST** have the `v-cursor` directive.
* **Transitions:** Use `transition-colors duration-200` on interactive elements to smooth hover effects.
