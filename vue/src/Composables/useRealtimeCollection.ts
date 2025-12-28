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
): { items: Ref<T[]> } {
  const items = ref<T[]>([]) as Ref<T[]>
  // search for docs in a collection ordered by date
  const q = query(collection(db, path), orderBy('createdAt', 'desc'))
  //  listen to a Firestore collection in real-time for dynamic updates
  const unsub = onSnapshot(q, (snap) => {
    items.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T)
  })

  onUnmounted(unsub)
  return { items }
}
