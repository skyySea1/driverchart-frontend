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
import { db } from '../utils/firebase'
import dayjs from 'dayjs'

const vehicles = ref([])

onMounted(() => {
  const q = collection(db, 'artifacts/app/public/data/vehicles')
  onSnapshot(q, (snap)=>{
    vehicles.value = snap.docs.map(s => ({ id: s.id, ...s.data() }))
  })
})

function nextInspectionFor(last){
  if (!last) return '-'
  return dayjs(last).add(1,'year').format('YYYY-MM-DD')
}
</script>

