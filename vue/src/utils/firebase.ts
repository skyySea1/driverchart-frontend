import { FirebaseError, initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, signInAnonymously } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)

export async function initAuth() {
  try {
    await signInAnonymously(auth)
    console.log('Signed in anonymously')
  } catch (e) {
    const errorCode = e instanceof FirebaseError ? e.code : 'unknown'
    console.error(
      `Failed to initialize anonymous authentication (code: ${errorCode}). Check Firebase configuration.`,
      e
    );
  }
}
