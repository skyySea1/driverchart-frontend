<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard title="Motoristas" :value="totalDrivers" />
      <StatCard title="Veículos" :value="totalVehicles" />
      <StatCard title="Alertas" :value="alertsCount" />
      <StatCard title="Pontuação Auditoria" :value="auditScore" />
    </div>

    <div class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="col-span-2">
        <div class="bg-white p-4 rounded shadow">
          <h3 class="font-semibold">Painel de Alertas</h3>
          <ul class="mt-3 space-y-2">
            <li v-for="a in alerts" :key="a.id" class="p-2 border rounded">
              <div class="flex justify-between">
                <div>{{ a.text }}</div>
                <div class="text-sm text-slate-500">{{ a.when }}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <div class="bg-white p-4 rounded shadow">
          <h3 class="font-semibold">Assistente de Regulação DOT (IA)</h3>
          <div class="mt-2">
            <input v-model="iaQuery" placeholder="Pergunte sobre FMCSA..." class="w-full p-2 border rounded" />
            <button @click="askIa" class="mt-2 px-3 py-1 bg-slate-800 text-white rounded">Ask</button>
          </div>
          <div v-if="iaAnswer" class="mt-3 p-3 bg-slate-50 rounded">{{ iaAnswer }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import StatCard from './StatCard.vue'
import { db } from '../utils/firebase'
import { collection, query, getDocs } from 'firebase/firestore'
import dayjs from 'dayjs'

const totalDrivers = ref(0)
const totalVehicles = ref(0)
const alerts = ref([])
const alertsCount = computed(()=> alerts.value.length)
const auditScore = ref('—')

const iaQuery = ref('')
const iaAnswer = ref('')

async function loadCounts(){
  const dSnap = await getDocs(collection(db, 'artifacts/app/public/data/drivers'))
  totalDrivers.value = dSnap.size
  const vSnap = await getDocs(collection(db, 'artifacts/app/public/data/vehicles'))
  totalVehicles.value = vSnap.size
}

function computeAlerts(){
  // lightweight: read all drivers and vehicles in realtime would be better; here we mock from drivers
  // In real app, use onSnapshot and compute expirations
}

async function askIa(){
  // Placeholder: in prod this would call Antigravity or Gemini
  iaAnswer.value = `(Resposta simulada) Para "${iaQuery.value}": consulte 49 CFR and FMCSA guidance. Esta é uma resposta simulada.`
}

onMounted(async ()=>{
  await loadCounts()
})
</script>
