<template>
  <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div
      class="bg-white w-full md:w-3/4 lg:w-2/3 xl:w-1/2 p-6 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto"
    >
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-slate-800">{{ driver ? 'Editar' : 'Novo' }} Motorista</h3>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600">
          <X class="w-6 h-6" />
        </button>
      </div>

      <form @submit.prevent="save" class="space-y-6">
        <!-- Personal Info -->
        <div class="space-y-2">
          <h4 class="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Dados Pessoais
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Nome</label>
              <input
                v-model="form.firstName"
                class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Nome"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Nome do Meio</label>
              <input
                v-model="form.middleName"
                class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Nome do Meio"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Sobrenome</label>
              <input
                v-model="form.lastName"
                class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Sobrenome"
              />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1"
                >Data de Nascimento</label
              >
              <input
                v-model="form.dob"
                type="date"
                class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">SSN</label>
              <input
                v-model="form.ssn"
                class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="XXX-XX-XXXX"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Contato</label>
              <input
                v-model="form.contact"
                class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Tel / Email"
              />
            </div>
          </div>
        </div>

        <!-- Compliance -->
        <div class="space-y-3">
          <h4 class="text-sm font-semibold text-slate-500 uppercase tracking-wider border-t pt-4">
            Compliance & Qualificações
          </h4>
          <div class="space-y-3">
            <!-- CDL -->
            <div
              class="flex flex-col md:flex-row gap-3 items-start md:items-center bg-slate-400 p-2 rounded"
            >
              <div class="w-8 flex justify-center text-indigo-600">
                <FileBadge class="w-5 h-5" />
              </div>
              <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
                <input
                  v-model="form.cdlNumber"
                  placeholder="Número da CDL"
                  class="p-2 border rounded text-sm w-full"
                />
                <input
                  v-model="form.cdlExp"
                  type="date"
                  class="p-2 border rounded text-sm w-full"
                  title="Data de Expiração"
                />
                <input
                  v-model="form.cdlUpload"
                  placeholder="Arquivo (ex: cdl.pdf)"
                  class="p-2 border rounded text-sm w-full"
                />
              </div>
            </div>

            <!-- Medical -->
            <div
              class="flex flex-col md:flex-row gap-3 items-start md:items-center bg-slate-50 p-2 rounded"
            >
              <div class="w-8 flex justify-center text-rose-500">
                <Stethoscope class="w-5 h-5" />
              </div>
              <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
                <input
                  v-model="form.medicalNumber"
                  placeholder="ID Médico"
                  class="p-2 border rounded text-sm w-full"
                />
                <input
                  v-model="form.medicalExp"
                  type="date"
                  class="p-2 border rounded text-sm w-full"
                  title="Data de Expiração"
                />
                <input
                  v-model="form.medicalUpload"
                  placeholder="Arquivo (ex: medical.pdf)"
                  class="p-2 border rounded text-sm w-full"
                />
              </div>
            </div>

            <!-- MVR -->
            <div
              class="flex flex-col md:flex-row gap-3 items-start md:items-center bg-slate-50 p-2 rounded"
            >
              <div class="w-8 flex justify-center text-emerald-600">
                <FileSpreadsheet class="w-5 h-5" />
              </div>
              <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
                <div class="col-span-1 md:col-span-2 flex items-center text-sm text-slate-600">
                  Annual MVR Check
                </div>
                <!-- <input v-model="form.mvrDate" type="date" class="p-2 border rounded text-sm w-full" /> -->
                <div class="flex gap-2 w-full">
                  <input
                    v-model="form.mvrDate"
                    type="date"
                    class="p-2 border rounded text-sm flex-1"
                    title="Data de Verificação"
                  />
                  <input
                    v-model="form.mvrUpload"
                    placeholder="Arquivo"
                    class="p-2 border rounded text-sm flex-1"
                  />
                </div>
              </div>
            </div>

            <!-- Clearinghouse -->
            <div
              class="flex flex-col md:flex-row gap-3 items-start md:items-center bg-slate-50 p-2 rounded"
            >
              <div class="w-8 flex justify-center text-blue-600">
                <ShieldCheck class="w-5 h-5" />
              </div>
              <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
                <div class="col-span-1 md:col-span-2 flex items-center text-sm text-slate-600">
                  Clearinghouse Query
                </div>
                <div class="flex gap-2 w-full">
                  <input
                    v-model="form.clearinghouseDate"
                    type="date"
                    class="p-2 border rounded text-sm flex-1"
                    title="Data da Consulta"
                  />
                  <input
                    v-model="form.clearinghouseUpload"
                    placeholder="Files"
                    class="p-2 border rounded text-sm flex-1"
                  />
                </div>
              </div>
            </div>

            <!-- Road Test -->
            <div
              class="flex flex-col md:flex-row gap-3 items-start md:items-center bg-slate-50 p-2 rounded"
            >
              <div class="w-8 flex justify-center text-orange-600">
                <Truck class="w-5 h-5" />
              </div>
              <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
                <input
                  v-model="form.roadTestExaminer"
                  placeholder="Road Test"
                  class="p-2 border rounded text-sm w-full"
                />
                <input
                  v-model="form.roadTestDate"
                  type="date"
                  class="p-2 border rounded text-sm w-full"
                  title="Test Date"
                />

                <div class="flex gap-1">
                  <input
                    v-model="form.roadTestUpload"
                    placeholder="file"
                    class="p-2 border rounded text-sm flex-1 min-w-0"
                  />
                  <button
                    type="button"
                    @click="printRoadTest"
                    class="p-2 bg-slate-200 hover:bg-slate-300 rounded text-slate-700"
                    title="Imprimir Certificado"
                  >
                    <Printer class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t">
          <button
            v-cursor
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded transition-colors"
          >
            Cancelar
          </button>
          <button
            v-cursor
            type="submit"
            class="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded shadow transition-colors flex items-center gap-2"
          >
            <Save class="w-4 h-4" /> Salvar
          </button>
        </div>
      </form>

      <!-- Invisible printable certificate -->
      <div id="road-test-cert" class="hidden print:block">
        <RoadTestCertificate :driver="form" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { addDoc, collection, serverTimestamp, setDoc, doc } from 'firebase/firestore'
import { db } from '../services/firebase'
import RoadTestCertificate from '../Components/templates/RoadTestCertificate.vue'
import {
  FileBadge,
  Stethoscope,
  FileSpreadsheet,
  ShieldCheck,
  Truck,
  X,
  Printer,
  Save,
} from 'lucide-vue-next'

const props = defineProps({ driver: Object })
const emit = defineEmits(['close', 'saved'])

const form = ref({})

onMounted(() => {
  if (props.driver) form.value = { ...props.driver }
  else form.value = defaultForm()
})

function defaultForm() {
  return {
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    ssn: '',
    contact: '',
    status: 'Active',
    cdlNumber: '',
    cdlExp: '',
    cdlUpload: '',
    medicalNumber: '',
    medicalExp: '',
    medicalUpload: '',
    mvrDate: '',
    mvrUpload: '',
    clearinghouseDate: '',
    clearinghouseUpload: '',
    roadTestExaminer: '',
    roadTestDate: '',
    roadTestUpload: '',
  }
}

async function save() {
  const col = collection(db, 'artifacts/app/public/data/drivers')
  if (props.driver && props.driver.id) {
    await setDoc(
      doc(db, 'artifacts/app/public/data/drivers', props.driver.id),
      { ...form.value, updatedAt: serverTimestamp() },
      { merge: true },
    )
  } else {
    await addDoc(col, { ...form.value, createdAt: serverTimestamp() })
  }
  emit('saved')
  emit('close')
}

function printRoadTest() {
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

function saveRoadTestPdf() {
  // In browser we can trigger print to PDF same as print
  printRoadTest()
}
</script>
