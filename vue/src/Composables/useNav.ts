

import { useRouter } from 'vue-router'

export function useNav() {
  const router = useRouter()

  const go = (to: string) => router.push(to)

  return { go }
}


