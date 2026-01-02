Explanação UseRealtimeCollection

1. onSnapshot(q, callback)
   ↓
   Firebase: "Ok, vou te avisar toda vez que 'q' mudar"
   ↓
   Retorna função 'unsub' para cancelar depois

2. Alguém adiciona/edita/remove documento
   ↓
   Firebase detecta a mudança
   ↓
   Chama seu callback com os dados novos (snap)
   ↓
   items.value é atualizado
   ↓
   Vue re-renderiza a tela

3. Componente é destruído (usuário sai da página)
   ↓
   onUnmounted(unsub) é executado
   ↓
   Firebase: "Ok, parei de avisar"
