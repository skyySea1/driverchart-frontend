Bottlenecks reais (onde isso vai quebrar)

Agora a parte importante.

🚨 1️⃣ MAIOR PROBLEMA: Domínio espalhado no frontend

Hoje:

regras de negócio estão em:

DriverFormModal.vue

dataService.ts

utils.ts

componentes de certificado

validação manual

mapeamento flat ⇄ nested local

👉 Isso não escala para compliance.

Sintoma futuro

regra muda → 5 arquivos quebram

dois devs implementam regra diferente

auditoria vira pesadelo

Correção (prioridade ALTA)

Criar camada explícita de domínio:

src/domain/
├── driver/
│ ├── driver.schema.ts ← Zod
│ ├── driver.mapper.ts
│ ├── driver.rules.ts
│ ├── driver.types.ts
│ └── driver.constants.ts

UI nunca decide regra de compliance.

👉 Nota CTO: hoje 5/10 → pode virar 9/10

🚨 2️⃣ dataService.ts é um futuro “God Service”

Esse arquivo tende a virar:

CRUD de tudo

regras escondidas

side effects silenciosos

Risco

difícil testar

difícil versionar

impossível auditar

Melhor abordagem

Serviços por domínio:

services/
├── driver.service.ts
├── vehicle.service.ts
├── audit.service.ts
└── auth.service.ts

Cada service:

recebe dados já validados

não conhece UI

não faz transformação estrutural

🚨 3️⃣ Forms gigantes sem engine de validação

DriverFormModal.vue já está no limite aceitável.

Problemas:

validação manual

regras condicionais espalhadas

impossível versionar schema (DOT 2024 vs 2025)

Solução correta (você já apontou):

Zod como fonte da verdade

opcional: VeeValidate como adapter

Sem isso, cada novo formulário = dívida técnica.

🚨 4️⃣ Certificados acoplados ao formato do form

RoadTestCertificate.vue depende de estrutura específica.

Hoje você resolve com formattedForCertificate, mas isso não escala.

Melhor:

Certificados leem domínio, não form.

generateRoadTestCertificate(driverDomainObject)

Isso permite:

gerar PDF no backend

versionar layout

gerar histórico retroativo

⚠️ 5️⃣ Testes praticamente inexistentes

src/tests/Alert.test.ts é simbólico.

Para compliance:

regras precisam de testes

schemas precisam de snapshot tests

mappers precisam de tests

Sem isso:

você confia na UI para garantir compliance
isso não passa em auditoria séria.

⚠️ 6️⃣ Stores sem limite de responsabilidade

userStore, modalStore estão ok agora, mas:

Risco:

store vira domínio

lógica demais no Pinia

Regra:

Store = estado, não regra

⚠️ 7️⃣ Observabilidade zero

Não vejo:

logging estruturado

tracking de erro

versionamento de schema salvo

Para compliance real:

precisa saber quem mudou o quê

quando

com qual versão do schema

Avaliação pelas “15 práticas” (resumo executivo)
Prática Nota Observação
Arquitetura 7/10 Boa base, falta domínio explícito
Separação de responsabilidades 7/10 UI ainda carrega regra
Tipagem 6/10 TS presente, mas sem schema-first
Escalabilidade 6/10 Vai doer sem refactor
Compliance readiness 6/10 Estrutura boa, falta rigor
Testabilidade 3/10 Maior risco atual
Evolutividade 6/10 Schema versioning ausente
Performance 8/10 Nada alarmante
DX 8/10 Boa organização
Consistência 7/10 Alguns padrões duplicados
Automação 5/10 Falta CI / validação
Resiliência 6/10 Pouco tratamento de erro
Segurança 6/10 Front depende demais de UI
Governança 5/10 Falta ownership por domínio
Custo técnico futuro ⚠️ Alto Se não agir agora
Prioridades claras (ordem CTO)
🔴 Curto prazo (alto impacto)

Introduzir Zod como schema central

Criar domain/ por entidade

Refatorar dataService

🟡 Médio prazo

Testes de schema + mapper

Certificados desacoplados

Versionamento de regras

🟢 Longo prazo

Auditoria por snapshot

Backend compartilhando schema

Automação de compliance checks

Veredito final (sem rodeio)

Você construiu um frontend sólido, acima da média.
Mas ele ainda é um frontend “inteligente demais”.

Se você mover:

regras → domínio

validação → schema

transformação → mappers

👉 isso vira um produto de compliance sério, pronto para crescer.
