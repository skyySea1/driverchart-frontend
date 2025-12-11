
/* src/composables/useRealtimeCollection.js */


/* src/composables/useDotHelpers.js */


/* src/App.vue */
<template>
  <div class="min-h-screen flex bg-slate-50">
    <Sidebar :collapsed="sidebarCollapsed" @toggle="toggleSidebar" />

    <div class="flex-1 p-6">
      <Header @open-mobile="sidebarCollapsed = false" />
      <main class="mt-6">
        <component :is="viewComponent"
                   @navigate="navigate"
                   />
      </main>
    </div>

    <!-- Floating collapse button on the edge -->
    <button @click="toggleSidebar" class="fixed left-64 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 z-30 print:hidden">
      <Arrow :class="['w-6 h-6 transition-transform', sidebarCollapsed ? 'rotate-180' : '']" />
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ArrowLeftRight as Arrow } from '@lucide/vue-next'
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
import Dashboard from './views/Dashboard.vue'
import Drivers from './views/Drivers.vue'
import Vehicles from './views/Vehicles.vue'
import DocumentRegistry from './views/DocumentRegistry.vue'
import Reports from './views/Reports.vue'
import { initAuth } from './firebase'

const route = ref('dashboard')
const sidebarCollapsed = ref(false)

const viewComponent = computed(() => {
  return {
    dashboard: Dashboard,
    drivers: Drivers,
    vehicles: Vehicles,
    docs: DocumentRegistry,
    reports: Reports,
  }[route.value]
})

function navigate(to){ route.value = to }
function toggleSidebar(){ sidebarCollapsed.value = !sidebarCollapsed.value }

onMounted(async ()=>{
  await initAuth()
})
</script>

<style>
/* small positioning for floating button when collapsed */
</style>

/* src/components/Sidebar.vue */
<template>
  <aside :class="['h-screen fixed left-0 top-0 w-64 transition-transform bg-slate-900 text-white print:hidden', collapsed? '-translate-x-56' : 'translate-x-0']">
    <div class="p-4 flex items-center gap-3">
      <div class="w-10 h-10 bg-slate-700 rounded flex items-center justify-center">DB</div>
      <div>
        <div class="font-bold">DOT Compliance</div>
        <div class="text-sm text-slate-400">Charter Bus</div>
      </div>
    </div>
    <nav class="p-4 space-y-2">
      <button @click="$emit('navigate','dashboard')" class="flex items-center gap-3 w-full text-left p-2 rounded hover:bg-slate-800">
        <span>Dashboard</span>
      </button>
      <button @click="$emit('navigate','drivers')" class="flex items-center gap-3 w-full text-left p-2 rounded hover:bg-slate-800">Drivers</button>
      <button @click="$emit('navigate','vehicles')" class="flex items-center gap-3 w-full text-left p-2 rounded hover:bg-slate-800">Fleet</button>
      <button @click="$emit('navigate','docs')" class="flex items-center gap-3 w-full text-left p-2 rounded hover:bg-slate-800">Document Registry</button>
      <button @click="$emit('navigate','reports')" class="flex items-center gap-3 w-full text-left p-2 rounded hover:bg-slate-800">Reports</button>
    </nav>
  </aside>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({ collapsed: Boolean })
</script>

/* src/components/Header.vue */
<template>
  <header class="flex items-center justify-between">
    <div class="flex items-center gap-4">
      <button class="sm:hidden p-2 rounded bg-slate-100" @click="$emit('open-mobile')">☰</button>
      <h1 class="text-2xl font-semibold">DOT Compliance Dashboard</h1>
    </div>
    <div class="flex items-center gap-4">
      <div class="text-sm text-slate-500">Signed-in (anonymous)</div>
    </div>
  </header>
</template>

<script setup></script>

/* src/views/Dashboard.vue */
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
            <button @click="askIa" class="mt-2 px-3 py-1 bg-slate-800 text-white rounded">Perguntar</button>
          </div>
          <div v-if="iaAnswer" class="mt-3 p-3 bg-slate-50 rounded">{{ iaAnswer }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import StatCard from '../components/StatCard.vue'
import { db } from '../firebase'
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

/* src/components/StatCard.vue */
<template>
  <div class="bg-white p-4 rounded shadow">
    <div class="text-sm text-slate-400">{{ title }}</div>
    <div class="text-2xl font-bold">{{ value }}</div>
  </div>
</template>
<script setup>
const props = defineProps({ title: String, value: [String,Number] })
</script>

/* src/views/Drivers.vue */
<template>
  <div>
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold">Driver Qualification Files</h2>
      <div>
        <button @click="openNew" class="px-3 py-1 bg-slate-800 text-white rounded">Novo Motorista</button>
      </div>
    </div>

    <div class="mt-4 bg-white rounded shadow p-4">
      <table class="w-full text-sm">
        <thead>
          <tr class="text-left">
            <th>Nome</th>
            <th>Status</th>
            <th>Contato</th>
            <th>CDL Exp</th>
            <th>Medical Exp</th>
            <th>Annual MVR</th>
            <th>Clearinghouse</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in drivers" :key="d.id" class="border-t">
            <td>{{ d.firstName }} {{ d.lastName }}</td>
            <td>{{ d.status || 'Active' }}</td>
            <td>{{ d.contact }}</td>
            <td :class="statusColor(d.cdlExp)">{{ d.cdlExp || '-' }}</td>
            <td :class="statusColor(d.medicalExp)">{{ d.medicalExp || '-' }}</td>
            <td :class="statusColor(d.mvrDate)">{{ d.mvrDate || '-' }}</td>
            <td :class="statusColor(d.clearinghouseDate)">{{ d.clearinghouseDate || '-' }}</td>
            <td>
              <button @click="openEdit(d)" class="px-2 py-1 mr-1 bg-slate-100 rounded">Editar</button>
              <button @click="confirmDelete(d)" class="px-2 py-1 mr-1 bg-red-600 text-white rounded">Excluir</button>
              <button @click="runAudit(d)" class="px-2 py-1 bg-amber-500 rounded">Auditar IA</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <DriverFormModal v-if="showModal" :driver="editing" @close="closeModal" @saved="reload" />

    <!-- Delete confirmation double modal simplified -->
    <div v-if="toDelete" class="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div class="bg-white p-6 rounded w-96">
        <h3 class="font-bold text-red-600">Confirmar Exclusão</h3>
        <p class="mt-3">Tem certeza que deseja excluir {{ toDelete.firstName }} {{ toDelete.lastName }}? Esta ação é permanente.</p>
        <div class="mt-4 flex justify-end gap-2">
          <button @click="toDelete=null" class="px-3 py-1">Cancelar</button>
          <button @click="deleteDriver" class="px-3 py-1 bg-red-600 text-white">Excluir permanentemente</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DriverFormModal from '../components/DriverFormModal.vue'
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { statusColorFor } from '../composables/useDotHelpers'

const drivers = ref([])
const showModal = ref(false)
const editing = ref(null)
const toDelete = ref(null)

function statusColor(date){ return statusColorFor(date) }

function openNew(){ editing.value = null; showModal.value = true }
function openEdit(d){ editing.value = { ...d }; showModal.value = true }
function closeModal(){ showModal.value = false }
function reload(){ /* noop: onSnapshot keeps list updated */ }

function confirmDelete(d){ toDelete.value = d }
async function deleteDriver(){
  await deleteDoc(doc(db, `artifacts/app/public/data/drivers`, toDelete.value.id))
  toDelete.value = null
}

function runAudit(d){
  // Simular auditoria IA
  alert(`Auditoria IA (simulada) para ${d.firstName} ${d.lastName}`)
}

onMounted(()=>{
  const q = collection(db, 'artifacts/app/public/data/drivers')
  onSnapshot(q, (snap)=>{
    drivers.value = snap.docs.map(s=>({ id: s.id, ...s.data() }))
  })
})
</script>

/* src/components/DriverFormModal.vue */
<template>
  <div class="fixed inset-0 bg-black/30 flex items-center justify-center">
    <div class="bg-white w-11/12 md:w-3/4 lg:w-2/3 p-4 rounded max-h-[90vh] overflow-auto">
      <h3 class="font-bold">{{ driver ? 'Editar' : 'Novo' }} Motorista</h3>

      <form @submit.prevent="save" class="space-y-4 mt-3">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input v-model="form.firstName" placeholder="First name" class="p-2 border rounded" />
          <input v-model="form.middleName" placeholder="Middle name" class="p-2 border rounded" />
          <input v-model="form.lastName" placeholder="Last name" class="p-2 border rounded" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input v-model="form.dob" type="date" class="p-2 border rounded" />
          <input v-model="form.ssn" placeholder="SSN (simulado)" class="p-2 border rounded" />
          <input v-model="form.contact" placeholder="Telefone / Email" class="p-2 border rounded" />
        </div>

        <div class="space-y-2">
          <h4 class="font-semibold">Compliance & Qualifications</h4>
          <div class="grid gap-2">
            <div class="flex items-center gap-3">
              <div class="w-6">📄</div>
              <input v-model="form.cdlNumber" placeholder="CDL Number" class="p-2 border rounded" />
              <input v-model="form.cdlExp" type="date" class="p-2 border rounded" />
              <input v-model="form.cdlUpload" placeholder="upload: filename.pdf" class="p-2 border rounded" />
            </div>

            <div class="flex items-center gap-3">
              <div class="w-6">🩺</div>
              <input v-model="form.medicalNumber" placeholder="Medical ID" class="p-2 border rounded" />
              <input v-model="form.medicalExp" type="date" class="p-2 border rounded" />
              <input v-model="form.medicalUpload" placeholder="upload: filename.pdf" class="p-2 border rounded" />
            </div>

            <div class="flex items-center gap-3">
              <div class="w-6">🧾</div>
              <input v-model="form.mvrDate" type="date" class="p-2 border rounded" />
              <input v-model="form.mvrUpload" placeholder="upload: filename.pdf" class="p-2 border rounded" />
            </div>

            <div class="flex items-center gap-3">
              <div class="w-6">🔬</div>
              <input v-model="form.clearinghouseDate" type="date" class="p-2 border rounded" />
              <input v-model="form.clearinghouseUpload" placeholder="upload: filename.pdf" class="p-2 border rounded" />
            </div>

            <div class="flex items-center gap-3">
              <div class="w-6">🛣️</div>
              <input v-model="form.roadTestExaminer" placeholder="Examiner name" class="p-2 border rounded" />
              <input v-model="form.roadTestDate" type="date" class="p-2 border rounded" />
              <input v-model="form.roadTestUpload" placeholder="upload: filename.pdf" class="p-2 border rounded" />
              <div class="flex gap-2">
                <button type="button" @click="printRoadTest" class="px-2 py-1 border rounded">Print</button>
                <button type="button" @click="saveRoadTestPdf" class="px-2 py-1 border rounded">Save PDF</button>
              </div>
            </div>

          </div>
        </div>

        <div class="flex justify-end gap-2">
          <button type="button" @click="$emit('close')" class="px-3 py-1">Cancelar</button>
          <button type="submit" class="px-3 py-1 bg-slate-800 text-white">Salvar</button>
        </div>
      </form>

      <!-- Invisible printable certificate -->
      <div id="road-test-cert" class="hidden print:block">
        <RoadTestCertificate :driver="form" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { addDoc, collection, serverTimestamp, setDoc, doc } from 'firebase/firestore'
import { db } from '../firebase'
import RoadTestCertificate from './RoadTestCertificate.vue'

const props = defineProps({ driver: Object })
const emit = defineEmits(['close','saved'])

const form = ref({})

onMounted(()=>{
  if (props.driver) form.value = { ...props.driver }
  else form.value = defaultForm()
})

function defaultForm(){
  return {
    firstName:'', middleName:'', lastName:'', dob:'', ssn:'', contact:'', status:'Active',
    cdlNumber:'', cdlExp:'', cdlUpload:'',
    medicalNumber:'', medicalExp:'', medicalUpload:'',
    mvrDate:'', mvrUpload:'',
    clearinghouseDate:'', clearinghouseUpload:'',
    roadTestExaminer:'', roadTestDate:'', roadTestUpload:'',
  }
}

async function save(){
  const col = collection(db, 'artifacts/app/public/data/drivers')
  if (props.driver && props.driver.id){
    await setDoc(doc(db, 'artifacts/app/public/data/drivers', props.driver.id), { ...form.value, updatedAt: serverTimestamp() }, { merge: true })
  } else {
    await addDoc(col, { ...form.value, createdAt: serverTimestamp() })
  }
  emit('saved')
  emit('close')
}

function printRoadTest(){
  // Open printable area and call window.print()
  // Ensure show only certificate in print via css: .print:hidden on other components
  const original = document.body.innerHTML
  const cert = document.getElementById('road-test-cert')
  if (!cert) return alert('Certificate not ready')
  const html = cert.innerHTML
  document.body.innerHTML = html
  window.print()
  location.reload()
}

function saveRoadTestPdf(){
  // In browser we can trigger print to PDF same as print
  printRoadTest()
}
</script>

/* src/components/RoadTestCertificate.vue */
<template>
  <div class="p-6 bg-white text-black" style="width:800px">
    <h2 class="text-lg font-bold">Certificate of Driver's Road Test</h2>
    <p class="mt-2">(Template simplified — based on DOT 49 CFR 391.31)</p>
    <div class="mt-4">
      <div><strong>Driver:</strong> {{ driver.firstName }} {{ driver.lastName }}</div>
      <div><strong>Examiner:</strong> {{ driver.roadTestExaminer }}</div>
      <div><strong>Date:</strong> {{ driver.roadTestDate }}</div>
    </div>
    <div class="mt-6">
      <p>Certification: The driver successfully completed the road test per DOT requirements.</p>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({ driver: Object })
</script>

/* src/views/Vehicles.vue */
<template>
  <div>
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold">Fleet Maintenance</h2>
      <button @click="openNew" class="px-3 py-1 bg-slate-800 text-white rounded">Novo Veículo</button>
    </div>

    <div class="mt-4 bg-white rounded shadow p-4">
      <table class="w-full text-sm">
        <thead>
          <tr class="text-left">
            <th>Bus #</th>
            <th>VIN</th>
            <th>Status</th>
            <th>Last Inspection</th>
            <th>Next Inspection</th>
            <th>Odometer</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in vehicles" :key="v.id" class="border-t">
            <td>{{ v.busNumber }}</td>
            <td>{{ v.vin }}</td>
            <td>{{ v.status }}</td>
            <td>{{ v.lastInspection || '-' }}</td>
            <td>{{ nextInspectionFor(v.lastInspection) }}</td>
            <td>{{ v.odometer || '-' }}</td>
            <td>
              <button @click="openEdit(v)" class="px-2 py-1 bg-slate-100 rounded">Editar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import dayjs from 'dayjs'

const vehicles = ref([])

onMounted(()=>{
  const q = collection(db, 'artifacts/app/public/data/vehicles')
  onSnapshot(q, (snap)=>{
    vehicles.value = snap.docs.map(s=>({ id: s.id, ...s.data() }))
  })
})

function nextInspectionFor(last){
  if (!last) return '-'
  return dayjs(last).add(1,'year').format('YYYY-MM-DD')
}
</script>

/* src/views/DocumentRegistry.vue */
<template>
  <div>
    <h2 class="text-xl font-semibold">Document Registry</h2>
    <div class="mt-4 bg-white p-4 rounded shadow">
      <div class="mb-4">
        <label>Filter:</label>
        <input v-model="filter" placeholder="Nome do motorista ou #Ônibus" class="p-2 border rounded ml-2" />
      </div>

      <table class="w-full text-sm">
        <thead>
          <tr class="text-left"><th>Date</th><th>File</th><th>Type</th><th>Entity</th><th>User</th></tr>
        </thead>
        <tbody>
          <tr v-for="r in filtered" :key="r.id" class="border-t">
            <td>{{ r.createdAt?.toDate ? r.createdAt.toDate().toISOString().slice(0,10) : '-' }}</td>
            <td>{{ r.fileName }}</td>
            <td>{{ r.type }}</td>
            <td>{{ r.entity }}</td>
            <td>{{ r.user || 'system' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

const entries = ref([])
const filter = ref('')

onMounted(()=>{
  const q = collection(db, 'artifacts/app/public/data/document_logs')
  onSnapshot(q,(snap)=>{ entries.value = snap.docs.map(s=>({ id: s.id, ...s.data() })) })
})

const filtered = computed(()=>{
  if (!filter.value) return entries.value
  const f = filter.value.toLowerCase()
  return entries.value.filter(e => (e.entity || '').toLowerCase().includes(f) || (e.fileName || '').toLowerCase().includes(f))
})
</script>

/* src/views/Reports.vue */
<template>
  <div>
    <h2 class="text-xl font-semibold">Relatórios Gerenciais</h2>
    <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-white p-4 rounded shadow">
        <h3 class="font-semibold">Compliance Matrix</h3>
        <div class="mt-2 text-sm">(visualização de exemplo)</div>
      </div>
      <div class="bg-white p-4 rounded shadow">
        <h3 class="font-semibold">Expiration Forecast (90 days)</h3>
        <div class="mt-2 text-sm">(visualização de exemplo)</div>
      </div>
    </div>
  </div>
</template>

<script setup></script>
