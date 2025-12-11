import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, signInAnonymously } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "FAKE_KEY_FOR_LOCAL",
  authDomain: "local.firebaseapp.com",
  projectId: "dot-compliance-local",
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)

export async function initAuth() {
  try {
    await signInAnonymously(auth)
    console.log('Signed in anonymously')
  } catch (e) {
    console.error('Auth init error', e)
  }
}
