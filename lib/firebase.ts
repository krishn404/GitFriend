import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyBOWK8rR6avk1rsIGU9SdLtfoNr5FgIl34",
    authDomain: "gitfriend-b50d5.firebaseapp.com",
    projectId: "gitfriend-b50d5",
    storageBucket: "gitfriend-b50d5.firebasestorage.app",
    messagingSenderId: "753441879690",
    appId: "1:753441879690:web:6b15756899de2dd5f89f73",
    measurementId: "G-K1PHCCPCYD"
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()
const githubProvider = new GithubAuthProvider()

export { auth, googleProvider, githubProvider }

