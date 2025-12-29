import { ref, onUnmounted, type Ref } from 'vue'
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore'
import { db } from '@/services/firebase.ts'

// Define a generic Firestore document type, add new fields as needed
interface FirestoreDoc {
  id: string
  [key: string]: unknown
}
export function useRealtimeCollection<T extends FirestoreDoc = FirestoreDoc>(
  path: string,
): { items: Ref<T[]>; loading: Ref<boolean> } {
  const items = ref<T[]>([]) as Ref<T[]>
  const loading = ref(true)

  // search for docs in a collection ordered by date
  const q = query(collection(db, path), orderBy('createdAt', 'desc'))
  //  listen to a Firestore collection in real-time for dynamic updates
  console.log(`[Realtime] Listening to ${path}`)
  const unsub = onSnapshot(
    q,
    (snap) => {
      console.log(`[Realtime] Received ${snap.docs.length} docs from ${path}`)
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
