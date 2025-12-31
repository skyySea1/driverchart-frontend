1. KISS (Keep It Simple): Autenticação é um Estado Global. Tentar gerenciar isso com um composable puro (usando provide/inject ou singletons manuais) adiciona complexidade
    desnecessária. O Pinia já resolve isso nativamente.
2. DRY (Don't Repeat Yourself): O usuário, o token e os métodos de login/logout serão acessados pelo Router (guards), pelo Header (UI), pelas Views (permissões) e pela Camada de
    API (interceptors). Centralizar isso em uma Store é a única forma saneável.
3. SOLID:
    - Single Responsibility: A Store gerencia o estado da sessão.
    - O SDK do Firebase (Service) faz a comunicação externa.
    - O Router consome a Store para decidir navegação.F
F
