<!-- src/Views/SystemSpecs.vue -->
<template>
  <div class="space-y-6">
    <div v-if="loading" class="space-y-4">
      <div class="h-48 skeleton rounded-xl border border-slate-200 w-full"></div>
      <div class="h-64 skeleton rounded-xl border border-slate-200 w-full"></div>
    </div>

    <div v-else class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 class="font-bold text-lg text-slate-800 flex items-center">
        <Database class="w-5 h-5 mr-2 text-blue-500" />
        Backend Architecture
      </h3>
      <p class="text-slate-600 mt-2">
        This system is currently running on a <strong>Serverless Architecture</strong> using
        Firebase Firestore for database storage and Firebase Auth for security.
      </p>
      <div class="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <h4 class="font-bold text-slate-700 text-sm mb-2">Data Structure (JSON/NoSQL):</h4>
        <pre class="text-xs text-slate-600 font-mono">
  // Collection: document_logs (NEW)
     {
      "fileName": "String",
      "category": "String (Driver/Vehicle)",
      "entityName": "String",
      "uploadedAt": "Timestamp",
      "uploadedBy": "String"
                  }
                  </pre
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Database } from 'lucide-vue-next'

const loading = ref(true)

onMounted(() => {
  // Simulate minor load time for consistency
  setTimeout(() => {
    loading.value = false
  }, 400)
})
</script>
