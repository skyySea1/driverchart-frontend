<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Driver Qualification Files</h2>
        <p class="text-slate-500 text-sm">Gerencie os motoristas e conformidade DQ.</p>
      </div>
      <button
  @click="openNew"
  type="button"
  class="
    px-4 py-2 rounded-lg
    bg-indigo-600 text-white
    flex items-center gap-2
    shadow
    transition-all duration-200
    hover:bg-indigo-700 hover:-translate-y-0.5
    active:translate-y-0 active:shadow-md
    focus:outline-none focus:ring-2 focus:ring-indigo-400
    cursor-pointer
  "
>
  <Plus class="w-4 h-4 pointer-events-none" />
  Add Driver
</button>

    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden border border-slate-200">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="bg-slate-50 text-slate-700 font-semibold border-b">
            <tr>
              <th class="p-4 whitespace-nowrap">Nome</th>
              <th class="p-4 whitespace-nowrap">Status</th>
              <th class="p-4 whitespace-nowrap">Contato</th>
              <th class="p-4 whitespace-nowrap text-center">CDL Exp</th>
              <th class="p-4 whitespace-nowrap text-center">Medical Exp</th>
              <th class="p-4 whitespace-nowrap text-center">Annual MVR</th>
              <th class="p-4 whitespace-nowrap text-center">Clearinghouse</th>
              <th class="p-4 whitespace-nowrap text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="d in drivers" :key="d.id" class="hover:bg-slate-50 transition-colors">
              <td class="p-4 font-medium text-slate-800 whitespace-nowrap">{{ d.firstName }} {{ d.lastName }}</td>
              <td class="p-4 whitespace-nowrap">
                <span class="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800" v-if="!d.status || d.status === 'Active'">
                  Active
                </span>
                <span class="px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800" v-else>
                  {{ d.status }}
                </span>
              </td>
              <td class="p-4 text-slate-600 whitespace-nowrap">{{ d.contact || '-' }}</td>

              <td class="p-4 text-center">
                <span :class="['px-2 py-1 rounded text-xs font-medium', statusColor(d.cdlExp)]">{{ d.cdlExp || '-' }}</span>
              </td>
              <td class="p-4 text-center">
                <span :class="['px-2 py-1 rounded text-xs font-medium', statusColor(d.medicalExp)]">{{ d.medicalExp || '-' }}</span>
              </td>
              <td class="p-4 text-center">
                <span :class="['px-2 py-1 rounded text-xs font-medium', statusColor(d.mvrDate)]">{{ d.mvrDate || '-' }}</span>
              </td>
              <td class="p-4 text-center">
                <span :class="['px-2 py-1 rounded text-xs font-medium', statusColor(d.clearinghouseDate)]">{{ d.clearinghouseDate || '-' }}</span>
              </td>

              <td class="p-4 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-2">
                  <button @click="openEdit(d)" class="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="Editar">
                    <Edit class="w-4 h-4" />
                  </button>
                  <button @click="runAudit(d)" class="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors" title="Auditar IA">
                    <Bot class="w-4 h-4" />
                  </button>
                  <button @click="confirmDelete(d)" class="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Excluir">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="drivers.length === 0">
              <td colspan="8" class="p-8 text-center text-slate-500">No drivers found. Click "Add Driver" to start tracking.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <DriverFormModal v-if="showModal" :driver="editing" @close="closeModal" @saved="reload" />

    <!-- Delete confirmation double modal simplified -->
    <div v-if="toDelete" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
        <h3 class="text-lg font-bold text-red-600 flex items-center gap-2">
          <Trash2 class="w-5 h-5" /> Confirmar Exclusão
        </h3>
        <p class="mt-3 text-slate-600">
          Tem certeza que deseja excluir <strong>{{ toDelete.firstName }} {{ toDelete.lastName }}</strong>?
          <br>Esta ação é permanente e não pode ser desfeita.
        </p>
        <div class="mt-6 flex justify-end gap-3">
          <button @click="toDelete=null" class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded transition-colors">Cancelar</button>
          <button @click="deleteDriver" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors shadow">Excluir permanentemente</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DriverFormModal from './DriverFormModal.vue'
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../utils/firebase'
import { statusColorFor } from '../Composables/useDotHelpers'
import { Plus, Edit, Trash2, Bot } from 'lucide-vue-next'

const drivers = ref([])
const showModal = ref(false)
const editing = ref(null)
const toDelete = ref(null)

// Adapting helper to return full tailwind classes if possible, but keeping logic
function statusColor(date){
  // Map helper outputs to specific tailwind badge styles
  const cls = statusColorFor(date)
  if (cls.includes('bg-red')) return 'bg-red-100 text-red-800'
  if (cls.includes('bg-yellow') || cls.includes('bg-amber')) return 'bg-amber-100 text-amber-800'
  if (cls.includes('bg-green')) return 'bg-green-100 text-green-800'
  return 'text-slate-500'
}

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
