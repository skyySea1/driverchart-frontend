# migração para vue

- Use v-show not v-if for navigation, avoiding recreating an reevaluate  
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

```vue

 // Container raiz - alturaF total da tela, flex horizontal
    <div className="flex h-screen bg-gray-50">
      
      {/* Sidebar - largura fixa, scroll vertical próprio */}
      <aside className="w-64 flex-none bg-white border-r overflow-y-auto">
        {/* Menu, navegação */}
      </aside>

      {/* Área principal - cresce, scroll vertical próprio */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Seu conteúdo: tabs, cards, tabelas */}
        </div>
      </main>
    </div>

```
