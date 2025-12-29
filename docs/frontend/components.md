# StatsCard

   * Declarativo (onde você apenas diz o "tipo" do card, e ele já sabe como deve se comportar, identificando cores e etc.
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

  3. Como manter e expandir (Guia do Desenvolvedor)

  A) Como alterar uma cor ou ícone?
  Toda a configuração visual está concentrada no objeto mappings dentro do StatCard.vue. Se você quiser mudar a cor do card de "Drivers" de indigo para azul:

   1. Abra src/Components/templates/StatCard.vue.
   2. No objeto mappings, localize drivers.
   3. Altere bgClass para bg-blue-50 e iconClass para text-blue-600.

  B) Como adicionar um novo tipo de Card?
  Se amanhã você precisar de um card para "Maintenance":

   1. No StatCard.vue, adicione 'maintenance' ao tipo CardType.
   2. Adicione a configuração no objeto mappings:

   1     maintenance: {
   2       icon: ToolIcon, // importe o ícone do lucide
   3       bgClass: 'bg-slate-50',
   4       iconClass: 'text-slate-600',
   5       badgeText: 'Scheduled',
   6       badgeVariant: 'outline'
   7     }

  C) Como funciona a lógica do Badge?
  Eu configurei alguns badges para serem reativos. Por exemplo, no tipo alerts:

   1 badgeText: Number(props.value) > 0 ? 'Urgent' : null
  Isso significa que o badge "Urgent" só aparecerá se o valor for maior que zero. Se não houver alertas, o badge desaparece automaticamente, limpando a interface.

  ---

  4. Dicas de Design e Performance

   * Skeletons: Sempre que criar um componente novo que busca dados, use a classe .skeleton. Ela deve ter uma altura (h-x) e largura (w-x) definida para reservar o espaço correto enquanto os dados não chegam.
   * Lazy Loading: No seu router.ts, as páginas são importadas assim: const Drivers = () => import('@/Views/Drivers.vue'). Isso é ótimo! Significa que o navegador não baixa o código da tela de Motoristas até que o usuário clique nela,
     economizando dados e tempo de carregamento inicial.

  O sistema agora está pronto para crescer de forma organizada. Se você precisar de um novo comportamento inteligente em algum card, basta mexer no computed do StatCard e todas as páginas que o usam serão atualizadas instantaneamente