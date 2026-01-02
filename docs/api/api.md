# Directives for development

- Always use named imports, export default is forbidden
- if one variable or constant is used twice, create one const in constants.ts
  
## Vercel api deploy

   1. Preparar o Código (`index.ts`): O Fastify precisa ser exportado como uma função para a Vercel, e não apenas chamar .listen()
      diretamente quando rodar lá.
   2. Configurar `vercel.json`: Dizer à Vercel como construir e rodar a API.
   3. Variáveis de Ambiente: Ensinar como configurar o service-account.json na Vercel (ele terá que virar uma string Base64 ou variáveis
      separadas).
   4. função buildApp para configura plugins e rotas e retorna a instância fastify.
   5. No bloco principal (if (require.main === module) ou verificação similar), chamar start para desenvolvimento local.
   6. Exportar buildApp para ser usado pelo adaptador da Vercel.

   7. Vá para a pasta api no terminal (cd api).
   8. Instale a CLI da Vercel se não tiver (npm i -g vercel) ou use npx vercel.
   9. Rode npx vercel.
   10. Siga os passos (login, link project, etc).
   11. IMPORTANTE: Adicione as variáveis de ambiente na Vercel (Settings -> Environment Variables):
       - FIREBASE_PROJECT_ID: O ID do seu projeto.
       - GOOGLE_APPLICATION_CREDENTIALS: (Este é complicado na Vercel).
       - entrypoint: api/api/serverless.ts e api/vercel.json para rodar o Fastify em ambiente serverless.

-Run `vercel --prod` for deployment
