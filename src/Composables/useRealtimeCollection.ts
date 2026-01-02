import { ref, onUnmounted, type Ref } from 'vue'
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore'
import { db } from '@/services/firebaseService.ts'
import type { FirestoreDoc } from '../types.ts'

export function useRealtimeCollection<T extends FirestoreDoc = FirestoreDoc>(
  path: string,
): { items: Ref<T[]>; loading: Ref<boolean> } {
  const items = ref<T[]>([]) as Ref<T[]>
  const loading = ref(true)

  // search for docs in a collection ordered by date
  const q = query(collection(db, path), orderBy('createdAt', 'desc'))

  //  listen to a Firestore collection in real-time for dynamic updates
  const unsub = onSnapshot(
    q,
    (snap) => {
      items.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T)
      loading.value = false
    },
    (err) => {
      console.error(`[Realtime] Error in ${path}:`, err)
      loading.value = false
    },
  )

  onUnmounted(unsub)
  return { items, loading }
}
