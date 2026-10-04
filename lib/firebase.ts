import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA_7bc9Qv7yWZb5GAS37p7RY_5DrGzABQo",
  authDomain: "outreachai-2576d.firebaseapp.com",
  projectId: "outreachai-2576d",
  storageBucket: "outreachai-2576d.firebasestorage.app",
  messagingSenderId: "453160296892",
  appId: "1:453160296892:web:67e54fb3270ca791564bb9",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);

export async function googleSignInGetToken(): Promise<string> {
  const result = await signInWithPopup(auth, new GoogleAuthProvider());
  return await result.user.getIdToken();
}