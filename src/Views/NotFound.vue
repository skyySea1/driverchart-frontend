  <template>
  <div class="not-found">
    <div class="not-found__container">
      <div class="not-found__content">
        <div class="not-found__code">404</div>

        <h1 class="not-found__title">Page Not Found</h1>

        <p class="not-found__description">
          Sorry, the page you are looking for does not exist or has been removed.
        </p>

        <div class="not-found__details">
          <p class="not-found__path">
            <span class="not-found__label">Current Route:</span>
            <code>{{ currentRoute }}</code>
          </p>
        </div>

        <div class="not-found__actions">
          <RouterLink to="/" class="not-found__button not-found__button--primary">
            Back to Home
          </RouterLink>

          <button
            @click="goBack"
            class="not-found__button not-found__button--secondary"
          >
            Go Back
          </button>
        </div>
      </div>

      <div class="not-found__illustration">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="80" fill="none" stroke="#e0e0e0" stroke-width="2"/>
          <text x="100" y="120" text-anchor="middle" font-size="60" font-weight="bold" fill="#cccccc">?</text>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()

const currentRoute = computed(() => route.fullPath)

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
}

.not-found__container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  max-width: 900px;
  width: 100%;
  align-items: center;
}

.not-found__content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.not-found__code {
  font-size: 5rem;
  font-weight: 900;
  color: #333;
  line-height: 1;
}

.not-found__title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.not-found__description {
  font-size: 1rem;
  color: #666;
  margin: 0;
  line-height: 1.6;
}

.not-found__details {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #e74c3c;
}

.not-found__path {
  margin: 0;
  font-size: 0.9rem;
  color: #555;
}

.not-found__label {
  font-weight: 600;
  color: #333;
}

.not-found__path code {
  display: block;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: #f8f8f8;
  border-radius: 4px;
  color: #e74c3c;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  word-break: break-all;
}

.not-found__actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.not-found__button {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.not-found__button--primary {
  background-color: #333;
  color: white;
}

.not-found__button--primary:hover {
  background-color: #555;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.not-found__button--secondary {
  background-color: white;
  color: #333;
  border: 2px solid #333;
}

.not-found__button--secondary:hover {
  background-color: #f5f5f5;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.not-found__illustration {
  display: flex;
  align-items: center;
  justify-content: center;
}

.not-found__illustration svg {
  width: 100%;
  max-width: 250px;
  height: auto;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media (max-width: 768px) {
  .not-found__container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .not-found__code {
    font-size: 3rem;
  }

  .not-found__title {
    font-size: 1.5rem;
  }

  .not-found__actions {
    flex-direction: column;
  }

  .not-found__button {
    width: 100%;
  }
}
</style>
