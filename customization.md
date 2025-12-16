# Rules

- As telas devem ter a classe print:bg-white para imprimir branco
- Elementos Html devem ter Classes "BEM"
- Nomenclatura BEM:
  
| Tipo         | Formato                 | Exemplo                   |
|--------------|-------------------------|---------------------------|
| Bloco        | nome                    | sidebar                   |
| Elemento     | bloco__elemento         | sidebar__nav              |
| Modificador  | bloco__elemento--estado | sidebar__nav-item--active |

Estrutura visual:

┌─────────────────────────┐
│  🚛 CharterSafe         │  ← header (logo)
│     DOT Compliance      │
├─────────────────────────┤
│  📊 Dashboard           │
│  👥 Drivers             │
│  🚚 Vehicles            │  ← nav (flex-1, cresce)
│  📈 Reports             │
│  📄 Documents           │
│  ⚙️ System Specs        │
│                         │
│                         │
├─────────────────────────┤
│  👤 John Doe        🚪  │  ← footer (usuário)
│     Administrator       │
└─────────────────────────┘
