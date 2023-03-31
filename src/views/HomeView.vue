<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { format } from 'date-fns'
  import { ExclamationCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline'
  import { signInWithRedirect, onAuthStateChanged, signOut, GoogleAuthProvider } from 'firebase/auth'
  import { doc, getDoc, setDoc } from 'firebase/firestore/lite'
  import { auth, db } from '../firebase'
  import TodayWidget from '../components/TodayWidget.vue'
  import TodoWidget from '../components/TodoWidget.vue'
  import BookshelfWidget from '../components/BookshelfWidget.vue'
  import CalendarWidget from '../components/CalendarWidget.vue'

  const user = ref()
  const userData = ref()
  const authorized = ref(false)
  const error = ref(false)

  const readData = (async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.value.uid))
      if (userDoc.exists()) {
        userData.value = userDoc.data()
      } else {
        const data = {
          user: {
            uid: user.value.uid,
            displayName: user.value.displayName,
            email: user.value.email
          }
        }
        await setDoc(doc(db, 'users', user.value.uid), data)
        userData.value = data
      }
    } catch (e) {
      error.value = true
      console.log(e)
    }
  })

  const login = (async () => {
    try {
      authorized.value = false
      await signInWithRedirect(auth, new GoogleAuthProvider())
    } catch (e) {
      authorized.value = true
      error.value = true
      console.log(e)
    }
  })

  const logout = (async () => {
    try {
      await signOut(auth)
      location.reload()
    } catch (e) {
      error.value = true
      console.log(e)
    }
  })

  onMounted(() => {
    onAuthStateChanged(auth, async (_user) => {
      authorized.value = true
      if (_user) {
        user.value = _user
        readData()
      }
    })
  })
</script>

<template>
  <main class="container max-w-5xl mx-auto px-5">
    <div v-if="error" class="flex rounded ring ring-red-200 bg-red-100 text-red-800 my-5 p-5">
      <ExclamationCircleIcon class="mr-1 h-6 w-6" />
      エラーが発生しました
      <button @click="error = false" class="ml-auto">
        <XMarkIcon class="h-6 w-6" />
      </button>
    </div>
    <div class="my-5 md:mb-0 px-3 flex items-center gap-x-5">
      <div class="md:flex gap-x-3">
        <div class="text-xl">
          {{ format(new Date(), 'Y年') }}
        </div>
        <div class="text-4xl">
          {{ format(new Date(), 'M / d') }}
        </div>
      </div>
      <div class="ml-auto md:ml-0 h-8">
        <div v-if="user" class="relative dropdown">
          <button class="text-indigo-500 h-8 w-8 rounded-full overflow-hidden shadow hover:ring-2 hover:ring-gray-200">
            <img :src="user.photoURL">
          </button>
          <ul class="dropdown-menu hidden absolute z-10 right-0 bg-white rounded-2xl border shadow-lg px-5 py-3">
            <li class="text-indigo-500">{{ user.email }}</li>
            <li><button @click="logout()" class="w-full text-left px-1">Logout</button></li>
          </ul>
        </div>
        <button v-if="authorized && !user" @click="login()" class="flex items-center text-xl rounded hover:bg-gray-200 active:bg-gray-300">
          <svg aria-hidden="true" class="h-8 w-8 mr-1" width="18" height="18" viewBox="0 0 18 18"><path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z" fill="#4285F4"></path><path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z" fill="#34A853"></path><path d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z" fill="#FBBC05"></path><path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z" fill="#EA4335"></path></svg>
          Googleでログイン
        </button>
        <div v-if="!authorized" class="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent" />
      </div>
    </div>
    <div class="md:flex gap-5">
      <div class="md:flex-none md:w-56">
        <div class="my-5 p-5 bg-white md:h-56 rounded-2xl border shadow-md">
          <TodayWidget />
        </div>
        <div class="my-5 p-5 bg-white rounded-2xl border shadow-md">
          <TodoWidget />
        </div>
      </div>
      <div class="md:grow">
        <div class="my-5 p-5 bg-white rounded-2xl border shadow-md">
          <BookshelfWidget />
        </div>
        <div class="my-5 p-5 bg-white rounded-2xl border shadow-md">
          <CalendarWidget />
        </div>
      </div>
    </div>
  </main>
</template>
