<template>
  <div
    class="bg-linear-to-br from-slate-900 to-slate-800 text-white rounded-xl shadow-lg flex flex-col h-125"
  >
    <!-- Header -->
    <div class="p-4 border-b border-slate-700 flex items-center gap-2">
      <Bot :size="20" class="text-blue-400" />
      <h3 class="font-semibold">DOT / FMCSA Assistant</h3>
    </div>

    <!-- Chat Area -->
    <div ref="chatContainer" class="flex-1 p-4 overflow-y-auto space-y-4">
      <div
        v-if="chatResponse"
        class="bg-slate-700/50 p-4 rounded-lg text-sm leading-relaxed border border-slate-600 shadow-inner"
      >
        <p class="font-bold text-blue-300 mb-2 flex items-center gap-2">
          <Bot :size="14" /> BusCompass AI:
        </p>
        <div
          class="prose prose-invert prose-sm max-w-none"
          v-html="chatResponse.replace(/\n/g, '<br>')"
        ></div>
      </div>

      <div v-else class="text-center text-slate-400 text-sm mt-10 px-6">
        <div
          class="bg-slate-800/50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 border border-slate-700"
        >
          <Bot :size="24" />
        </div>
        <p>
          Ask questions about Hours of Service (HOS), Driver Qualification or Vehicle Inspections.
        </p>
      </div>

      <div
        v-if="isThinking"
        class="flex items-center gap-3 text-xs text-blue-300 animate-pulse bg-blue-900/20 p-2 rounded-lg border border-blue-800/30"
      >
        <div class="flex space-x-1">
          <div class="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
          <div
            class="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"
          ></div>
          <div
            class="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"
          ></div>
        </div>
        Analyzing FMCSA regulations...
      </div>
    </div>

    <!-- Input Area -->
    <div class="p-4 bg-slate-900/50 border-t border-slate-700">
      <div class="flex gap-2">
        <input
          v-model="chatInput"
          @keydown.enter="handleAskAI"
          type="text"
          placeholder="Ex: What is the driving hour limit?"
          class="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <button
          v-cursor
          @click="handleAskAI"
          :disabled="isThinking || !chatInput.trim()"
          class="bg-blue-600 btn-up-hover-effect text-white p-2.5 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg active:scale-95"
        >
          <Send :size="18" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUpdated } from 'vue'
import { Bot, Send } from 'lucide-vue-next'
import { askRegulatoryAssistant } from '@/services/gemini'

const chatInput = ref('')
const chatResponse = ref('')
const isThinking = ref(false)
const chatContainer = ref<HTMLElement | null>(null)

const handleAskAI = async () => {
  if (!chatInput.value.trim() || isThinking.value) return

  const query = chatInput.value
  chatInput.value = ''
  isThinking.value = true
  chatResponse.value = ''

  try {
    const answer = await askRegulatoryAssistant(query)
    chatResponse.value = answer
  } catch {
    chatResponse.value = 'Error connecting to regulatory assistant.'
  } finally {
    isThinking.value = false
  }
}

onUpdated(() => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
})
</script>
