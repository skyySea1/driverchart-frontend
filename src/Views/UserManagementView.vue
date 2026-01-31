<template>
  <div class="space-y-6">
    <!-- Header -->
    <div
      class="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200"
    >
      <div>
        <h1 class="text-2xl font-bold text-slate-900">User Management</h1>
        <p class="text-sm text-slate-500">Manage system access and roles</p>
      </div>
      <BaseButton
        v-if="canManageUsers"
        label="Add New User"
        :icon="UserPlus"
        @click="openModal()"
        class="shadow-sm"
      />
    </div>

    <!-- Loading/Error -->
    <BaseLoading v-if="isLoading" />
    <BaseAlert v-else-if="error" type="error" :message="error" @close="error = null" />

    <!-- Users Table -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <table class="min-w-full divide-y divide-slate-200">
        <thead class="bg-slate-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              User
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              Role
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-slate-200">
          <tr v-for="user in users" :key="user.id" class="hover:bg-slate-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div
                  class="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold uppercase"
                >
                  {{ getInitials(user.name || user.firstName) }}
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-slate-900">
                    {{ user.name || user.firstName + (user.lastName ? ' ' + user.lastName : '') }}
                  </div>
                  <div class="text-sm text-slate-500">{{ user.email }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="getRoleBadgeClass(user.role)"
              >
                {{ user.role }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ user.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                v-if="canManageUsers"
                @click="openModal(user)"
                class="text-indigo-600 cursor-pointer hover:text-indigo-900 mr-4"
              >
                Edit
              </button>
              <button
                v-if="canManageUsers && currentUser?.id !== user.id"
                @click="confirmDelete(user)"
                class="text-red-600 cursor-pointer hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- User Modal -->
    <BaseModal
      :isOpen="isModalOpen"
      :title="editingUser ? 'Edit User' : 'Create New User'"
      @close="closeModal"
    >
      <form @submit.prevent="saveUser" class="space-y-4 p-1">
        <InputGroup v-model="form.name" label="Full Name" required placeholder="John Doe" />
        <InputGroup
          v-model="form.email"
          label="Email Address"
          type="email"
          required
          placeholder="john@example.com"
        />

        <InputGroup
          v-if="!editingUser"
          v-model="form.password"
          label="Password"
          type="password"
          required
          placeholder="insert a strong password"
        />

        <div class="space-y-1">
          <label class="block text-xs font-bold text-slate-700">Role & Permissions</label>
          <select v-model="form.role" class="input-base w-full">
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Dispatcher">Dispatcher</option>
            <option value="Auditor">Auditor</option>
            <option value="Viewer">Viewer</option>
          </select>

          <!-- Permissions Preview -->
          <div class="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
            <p class="text-[10px] uppercase font-bold text-slate-500 mb-2">Granted Capabilities:</p>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="perm in selectedRolePermissions"
                :key="perm"
                class="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600"
              >
                {{ perm }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            v-model="form.isActive"
            id="isActive"
            class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label for="isActive" class="text-sm font-medium text-slate-700">User is Active</label>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4">
          <BaseButton
            :icon="X"
            label="Cancel"
            variant="secondary"
            @click="closeModal"
            type="button"
          />
          <BaseButton
            :label="editingUser ? 'Update User' : 'Create User'"
            :loading="isSaving"
            type="submit"
          />
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue'
import { userService } from '@/services/userService'
import { useAuthStore } from '@/stores/AuthStore'
import { UserPlus, X } from 'lucide-vue-next'
import BaseButton from '@/Components/ui/buttons/BaseButton.vue'
import BaseLoading from '@/Components/ui/BaseLoading.vue'
import BaseAlert from '@/Components/ui/BaseAlert.vue'
import BaseModal from '@/Components/ui/modal/BaseModal.vue'
import InputGroup from '@/Components/ui/inputs/InputGroup.vue'
import type { User, UserRole } from '@/types'
import { getPermissionsForRole } from '@/utils/permissions'

const authStore = useAuthStore()
const users = ref<User[]>([])
const isLoading = ref(true)
const isSaving = ref(false)
const error = ref<string | null>(null)
const isModalOpen = ref(false)
const editingUser = ref<User | null>(null)

const currentUser = computed(() => authStore.user)
const canManageUsers = computed(() => currentUser.value?.role === 'Admin')

const form = reactive({
  name: '',
  email: '',
  password: '',
  role: 'Viewer' as UserRole,
  isActive: true,
})

// Permissions Preview Logic
const selectedRolePermissions = computed(() => {
  return getPermissionsForRole(form.role)
})

function getInitials(name: string) {
  if (!name) return '??'
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

function getRoleBadgeClass(role: string) {
  switch (role) {
    case 'Admin':
      return 'bg-purple-100 text-purple-800'
    case 'Manager':
      return 'bg-blue-100 text-blue-800'
    case 'Auditor':
      return 'bg-orange-100 text-orange-800'
    default:
      return 'bg-slate-100 text-slate-800'
  }
}

async function fetchUsers() {
  isLoading.value = true
  try {
    users.value = await userService.getAll()
  } catch (e) {
    error.value = 'Failed to load users.'
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

function openModal(user?: User) {
  if (user) {
    editingUser.value = user
    form.name = user.name || user.firstName + ' ' + user.lastName
    form.email = user.email
    form.role = user.role
    form.isActive = user.isActive
    form.password = '' // Don't fill password
  } else {
    editingUser.value = null
    form.name = ''
    form.email = ''
    form.password = ''
    form.role = 'Viewer'
    form.isActive = true
  }
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  error.value = null
}

async function saveUser() {
  isSaving.value = true
  error.value = null
  try {
    const payload = {
      name: form.name,
      firstName: form.name.split(' ')[0], // simple split
      lastName: form.name.split(' ').slice(1).join(' ') || '',
      email: form.email,
      role: form.role,
      isActive: form.isActive,
      ...(form.password ? { password: form.password } : {}),
    }

    if (editingUser.value) {
      await userService.updateUser(editingUser.value.id, payload)
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await userService.createUser(payload as any)
    }
    await fetchUsers()
    closeModal()
  } catch (e: unknown) {
    console.error(e)
    if (e instanceof Error) {
      // Assuming e could be an AxiosError which has a 'response' property
      // This check is a common pattern for handling API errors with Axios
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof (e as any).response?.data?.message === 'string') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error.value = (e as any).response.data.message
      } else {
        error.value = e.message || 'Failed to save user.'
      }
    } else {
      error.value = 'An unknown error occurred while saving the user.'
    }
  } finally {
    isSaving.value = false
  }
}

async function confirmDelete(user: User) {
  if (
    confirm(
      `Are you sure you want to delete ${user.name || user.email}? This action cannot be undone.`,
    )
  ) {
    try {
      await userService.deleteUser(user.id)
      await fetchUsers()
    } catch {
      error.value = 'Failed to delete user.'
    }
  }
}

onMounted(() => {
  fetchUsers()
})
</script>
