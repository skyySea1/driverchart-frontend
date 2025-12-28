backend/
├── src/
│   ├── plugins/            # JWT, CORS, Helmet, Swagger, request-context
│   ├── routes/             # endpoints por domínio
│   │   ├── drivers.ts
│   │   ├── documents.ts
│   │   ├── alerts.ts
│   │   └── users.ts
│   ├── schemas/            # Zod schemas compartilháveis
│   │   ├── driver.ts
│   │   ├── document.ts
│   │   ├── alert.ts
│   │   └── user.ts
│   ├── services/           # regras de negócio e integração com DB
│   │   ├── driverService.ts
│   │   ├── documentService.ts
│   │   └── alertService.ts
│   ├── utils/              # logger, request-id, env validation
│   ├── jobs/               # Cloud Functions / scheduled tasks
│   ├── index.ts            # bootstrap Fastify
│   └── types.ts            # tipos globais
├── package.json
├── tsconfig.json
└── .env


endpoints

Endpoints principais previstos
Domínio	Endpoints	Observações
Drivers	GET /drivers, GET /drivers/:id, POST /drivers, PUT /drivers/:id, DELETE /drivers/:id	CRUD completo, validação Zod
Documents	GET /documents, POST /documents, PATCH /documents/:id/status	Controle de expiração, links de download
Alerts	GET /alerts, POST /alerts	Jobs de expiração e notificações
Users	GET /users, POST /users	Autenticação / roles / permissões



dependências:


astify + TS → framework leve, seguro e auditável

Zod → validação de request/response + geração OpenAPI

Plugins Fastify → JWT, Helmet, CORS, Swagger, request-context

Logging → Pino estruturado com request-id

Cloud Functions → jobs agendados (document expiration, alert triggers)

Env → dotenv local, Fastify Env/Zod produção