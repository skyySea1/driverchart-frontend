# Diretrizes vue

- Use v-show not v-if for navigation, avoiding recreating and reevaluating  
- ícones devem ser do tamanho da fonte (usar 1em)
- usestate = ref
- onChange in react is equal to v-model bdinging in vvue
- para usasr props usa-se kebab-case Ex: ":is-open={valor tipado}
- valores são acessados com state.value ao invés de setters
- tipagem em props com camelcase
- Vue usa reactive proxy based, therefore turning usememo and usecallback unnecessary
- O v-model cuidará do binding bi-direcional do input de forma mais limpa que o onChange do React.
- estrutura para criar componentes e elementos dentro de um container
- estados reativos não precisam de setter igual react, vasta usar direto
