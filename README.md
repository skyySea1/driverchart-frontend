
# How to run

1. pnpm install
2. pnpm run dev

## Project Architecture

```txt
driverchart/
├── src/
│   ├── Components/Dashboard.vue       # Main app component
│   ├── components/
│   │   ├── templates/            # FormW9, FormI9, RoadTestTemplate (printable DOT docs)
│   │   └── ui/                   # Reusable components (Modal, StatCard, etc.)
│   ├── services/                    # Pure functions withoutState
│   │   ├── firebase.ts           # Firebase initialization (uses Vite env vars)
│   │   └── utils.ts              # Date/compliance calculation helpers
│   └── main.vue                  # Entry point, renders <Dashboard />
├── .env                          # VITE_FIREBASE_* keys (never commit)
└── package.json
```

### Firestore Data Structure

**All collections follow this nested path pattern:**

```javascript
"artifacts/{appId}/public/data/{collection}";
```

- **Collections**: `drivers`, `vehicles`, `document_logs`
- **appId**: Retrieved via `getAppId()` from `lib/firebase.js`, defaults to `'dot-compliance-app'`
- **Example**: `collection(db, 'artifacts', appId, 'public', 'data', 'drivers')`

**Always use this pattern** when adding new Firestore queries. Do not use root-level collections.

### Authentication Flow

1. On mount, `Dashboard.vue` checks for global `__initial_auth_token` (injected by Firebase App Hosting)
2. If present, uses `signInWithCustomToken()`, else falls back to `signInAnonymously()`
3. All Firestore queries require `user` to be set (checked in `useEffect` dependency)

## Compliance Date Calculations (lib/utils.js)

```javascript
getDaysDiff(expirationDate); // Days until future date (license, Medical Cert)
getDaysUntilDue(lastActionDate); // Days until 1-year anniversary (MVR, Drug Test)
getStatusColor(days); // Returns Tailwind classes: red (expired), yellow (<30), green
getStatusText(days); // Returns "EXPIRED", "Due in X days", or "Valid"```

### Document Logging Pattern

When saving driver/vehicle forms with file uploads:

1. logic Comparison in new file names against existing (`data[field] !== editingDriver?.[field]`), doens't break if field is null
2. Call `createDocumentLog(fileName, 'Driver' | 'Vehicle', entityName)` for changed docs
3. Log in parallel using `Promise.all()` before the main save operation

### Print-Ready Components
- For easy reporting, components are open for printing functionality
Templates in `components/templates/` use:

- `print:` Tailwind variants for print styles
- `print:hidden` on close buttons, navigation
- `print:p-0 print:bg-white` to remove spacing/backgrounds
- Triggered from forms via local modal state (e.g., `activeDocument === 'w9'`)


## Styling Guidelines 

- **Colors**: Primary `#2E47CC` (deep blue), Background `#F0F4FF` (light blue), Accent `#7335d5` (purple)
- **Fonts**: 'Space Grotesk' (headlines), 'Inter' (body text) - not currently imported, using system fonts
- **Icons**: lucide-react only
- **Status indicators**: Use conditional Tailwind classes: `text-red-600 bg-red-50` (expired), `text-yellow-600 bg-yellow-50` (warning), `text-green-600 bg-green-50` (valid)
