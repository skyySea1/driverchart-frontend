<template>
  <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 print:hidden">
    <!-- Chat Window (Collapsible) -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-4 scale-95"
    >
      <div
        v-if="isOpen"
        class="bg-slate-900 rounded-xl shadow-2xl w-96 h-125 flex flex-col border border-slate-700 overflow-hidden"
      >
        <!-- Header -->
        <div class="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
          <div class="flex items-center gap-2 text-white">
            <Bot :size="20" class="text-blue-400" />
            <div class="flex flex-col">
              <h3 class="font-semibold text-sm">FMCSA Assistant</h3>
              <span class="text-[10px] text-slate-400">Powered by Gemini</span>
            </div>
          </div>
          <button @click="isOpen = false" class="text-slate-400 hover:text-white transition-colors">
            <X :size="18" />
          </button>
        </div>

        <!-- Chat Area -->
        <div
          ref="chatContainer"
          class="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-900/95 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900"
        >
          <div v-if="messages.length === 0" class="text-center text-slate-500 text-sm mt-8 px-4">
            <Bot :size="32" class="mx-auto mb-2 opacity-50" />
            <p>How can I help you with DOT compliance today?</p>
          </div>

          <!-- Messages -->
          <div
            v-for="(msg, i) in messages"
            :key="i"
            :class="['flex', msg.role === 'user' ? 'justify-end' : 'justify-start']"
          >
            <div
              :class="[
                'max-w-[85%] rounded-lg p-3 text-sm leading-relaxed shadow-sm',
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none',
              ]"
            >
              <div
                v-if="msg.role === 'assistant'"
                class="prose prose-invert prose-sm max-w-none"
                v-html="formatMessage(msg.content)"
              ></div>
              <span v-else>{{ msg.content }}</span>
            </div>
          </div>

          <div v-if="isThinking" class="flex items-center gap-2 text-xs text-blue-400 p-2">
            <div class="flex space-x-1">
              <div class="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
              <div
                class="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"
              ></div>
              <div
                class="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"
              ></div>
            </div>
            <span>Analyzing regulations...</span>
          </div>
        </div>

        <!-- Input -->
        <div class="p-3 bg-slate-800 border-t border-slate-700">
          <div class="flex gap-2">
            <input
              v-model="chatInput"
              @keydown.enter="handleAskAI"
              class="flex-1 bg-slate-700 border-none rounded-lg px-3 py-2 text-sm text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Ask about HOS, DVIR..."
            />
            <button
              @click="handleAskAI"
              :disabled="!chatInput.trim() || isThinking"
              class="p-2 bg-blue-600 rounded-lg text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send :size="16" />
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Floating Button -->
    <button
      @click="toggleOpen"
      class="cursor-pointer w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group relative"
    >
      <Transition mode="out-in" name="rotate">
        <Bot v-if="!isOpen" :size="28" class="group-hover:rotate-12 transition-transform" />
        <X v-else :size="28" />
      </Transition>

      <!-- Ping effect if closed and inactive for a while (optional enhancement) -->
      <span
        v-if="!isOpen && messages.length > 0"
        class="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900"
      ></span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { Bot, Send, X } from 'lucide-vue-next'
import { askRegulatoryAssistant } from '@/services/geminiService'
import DOMPurify from 'dompurify'

const isOpen = ref(false)
const chatInput = ref('')
const isThinking = ref(false)
const chatContainer = ref<HTMLElement | null>(null)

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const messages = ref<Message[]>([])

function toggleOpen() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    scrollToBottom()
  }
}

function formatMessage(content: string) {
  // Simple formatting for line breaks and basic markdown-like structures
  const formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')

  return DOMPurify.sanitize(formatted)
}

function scrollToBottom() {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

async function handleAskAI() {
  const query = chatInput.value.trim()
  if (!query || isThinking.value) return

  // Add user message
  messages.value.push({ role: 'user', content: query })
  chatInput.value = ''
  scrollToBottom()

  isThinking.value = true

  try {
    const response = await askRegulatoryAssistant(query)
    messages.value.push({ role: 'assistant', content: response })
  } catch {
    messages.value.push({
      role: 'assistant',
      content:
        'Sorry, I encountered an error connecting to the regulatory database. Please try again.',
    })
  } finally {
    isThinking.value = false
    scrollToBottom()
  }
}

watch(
  messages,
  () => {
    scrollToBottom()
  },
  { deep: true },
)
</script>

<style scoped>
.rotate-enter-active,
.rotate-leave-active {
  transition: all 0.2s ease;
}
.rotate-enter-from,
.rotate-leave-to {
  opacity: 0;
  transform: rotate(90deg);
}
</style>
