import { ref } from 'vue'
import { defineStore } from 'pinia'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore/lite'
import { auth, db } from '../firebase'

export const useDataStore = defineStore('data', () => {
  const userData = ref()

  const readData = () => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) return
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        userData.value = userDoc.data()
      } else {
        const data = {
          user: {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email
          }
        }
        await setDoc(doc(db, 'users', user.uid), data)
        userData.value = data
      }
    })
  }

  return { userData, readData }
})
