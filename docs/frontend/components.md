# StatsCard

* Declarativo (onde você apenas diz o "tipo" do card, e ele já sabe como deve se comportar, identificando cores e etc.
* Qualquer adição ou modificação requer correspondência de tipo(presença e congruência) ou assinatura de contrato via extensão
* Mapeia internamente os estilos com computed simplificando as props
* Usa um efeito de lazy loading atraves da Classe Global `.skeleton` em src/styles.css.
* Componente `Badge.vue`: exibir etiquetas de status de forma condicional e inteligente.

  ---

  1. Como usar o StatCard

  Agora, para adicionar um card no Dashboard ou em qualquer outra página, você só precisa de 3 informações básicas:

   1 <StatCard
   2   type="inspections"
   3   title="Título Customizado"
   4   :value="valorVariavel"
   5   :loading="isLoading"
   6 />

  Os tipos disponíveis hoje são:

* inspections, drivers, medical, alerts, audit, applications, reviews.

  ---

  1. Como manter e expandir (Guia do Desenvolvedor)

  A) Como alterar uma cor ou ícone?
  Toda a configuração visual está concentrada no objeto mappings dentro do StatCard.vue. Se você quiser mudar a cor do card de "Drivers" de indigo para azul:

   1. Abra src/Components/templates/StatCard.vue.
   2. No objeto mappings, localize drivers.
   3. Altere bgClass para bg-blue-50 e iconClass para text-blue-600.

  B) Como adicionar um novo tipo de Card?

   1. No StatCard.vue, adicione 'maintenance' ao tipo CardType.
   2. Adicione a configuração no objeto mappings:

   1     maintenance: {
   2       icon: ToolIcon, // importe o ícone do lucide
   3       bgClass: 'bg-slate-50',
   4       iconClass: 'text-slate-600',
   5       badgeText: 'Scheduled',
   6       badgeVariant: 'outline'
   7     }

  Badges
   badges para serem reativos, alterando sua exibição e cor de acordo com cálculos e condicionais. Por exemplo, no tipo alerts:
   BadgeText: Number(props.value) > 0 ? 'Urgent' : null
  Isso significa que o badge "Urgent" só aparecerá se o valor for maior que zero. Se não houver alertas, o badge não aparece

  ---

1. Carregamento sob medida

* Skeletons: Sempre que criar um componente novo que busca dados, use a classe .skeleton. Ela deve ter uma altura (h-x) e largura (w-x) definida para reservar o espaço correto enquanto os dados não chegam.
* Lazy Loading: em router.ts as páginas devem ser importadas assim:
const Drivers = () => import('@/Views/Drivers.vue').
Assim o navegador não baixa o código da tela de Motoristas até que o usuário clique nela,
