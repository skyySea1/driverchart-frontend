import { ref, shallowRef, onUnmounted, type Ref } from 'vue'
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore'
import { db } from '@/services/firebaseService.ts'
import type { FirestoreDoc } from '../types.ts'

type UseRealtimeCollectionOptions<T extends FirestoreDoc> = {
  map: (doc: FirestoreDoc) => T
}

export function useRealtimeCollection(
  path: string,
): { items: Ref<FirestoreDoc[]>; loading: Ref<boolean> }
export function useRealtimeCollection<T extends FirestoreDoc>(
  path: string,
  options: UseRealtimeCollectionOptions<T>,
): { items: Ref<T[]>; loading: Ref<boolean> }
export function useRealtimeCollection<T extends FirestoreDoc>(
  path: string,
  options?: UseRealtimeCollectionOptions<T>,
): { items: Ref<FirestoreDoc[]> | Ref<T[]>; loading: Ref<boolean> } {
  const untypedItems = shallowRef<FirestoreDoc[]>([])
  const typedItems = shallowRef<T[]>([])
  const loading = ref(true)

  let unsub: (() => void) | null = null

  try {
    // search for docs in a collection ordered by date
    const q = query(collection(db, path), orderBy('createdAt', 'desc'))

    //  listen to a Firestore collection in real-time for dynamic updates
    unsub = onSnapshot(
      q,
      (snap) => {
        const rawDocs: FirestoreDoc[] = snap.docs.map((d) => ({ ...d.data(), id: d.id }))

        if (options?.map) {
          const next: T[] = []
          for (const doc of rawDocs) {
            try {
              next.push(options.map(doc))
            } catch (e) {
              console.warn(`[Realtime] Dropping invalid doc from ${path}:`, e)
            }
          }
          typedItems.value = next
        } else {
          untypedItems.value = rawDocs
        }
        loading.value = false
      },
      (err) => {
        console.error(`[Realtime] Error in ${path}:`, err)
        loading.value = false
      },
    )
  } catch (error) {
    console.error(`[Realtime] Failed to setup listener for ${path}:`, error)
    loading.value = false
  }

  const cleanup = () => {
    if (unsub) {
      unsub()
      unsub = null
    }
  }

  onUnmounted(cleanup)

  return { items: options?.map ? typedItems : untypedItems, loading }
}
