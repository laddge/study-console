<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { format } from 'date-fns'
  import { ExclamationCircleIcon } from '@heroicons/vue/24/outline'
  import { XMarkIcon, UserCircleIcon } from '@heroicons/vue/24/solid'
  import { getAuth, signInWithRedirect, onAuthStateChanged, signOut, GoogleAuthProvider } from 'firebase/auth'
  import TodayWidget from '../components/TodayWidget.vue'
  import TodoWidget from '../components/TodoWidget.vue'
  import BookshelfWidget from '../components/BookshelfWidget.vue'
  import CalendarWidget from '../components/CalendarWidget.vue'

  const user = ref()
  const authorized = ref(false)
  const error = ref(false)

  const login = (async () => {
    try {
      authorized.value = false
      await signInWithRedirect(getAuth(), new GoogleAuthProvider())
    } catch (e) {
      authorized.value = true
      error.value = true
      console.log(e)
    }
  })

  const logout = (async () => {
    try {
      await signOut(getAuth())
      location.reload()
    } catch (e) {
      error.value = true
      console.log(e)
    }
  })

  onMounted(() => {
    onAuthStateChanged(getAuth(), (_user) => {
      authorized.value = true
      if (_user) {
        user.value = _user
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
    <div class="my-5 md:mb-0 px-5 flex items-center gap-x-5">
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
          <button class="text-indigo-500 h-8 w-8 rounded-full overflow-hidden">
            <img :src="user.photoURL">
          </button>
          <ul class="dropdown-menu hidden absolute z-10 right-0 bg-white rounded-2xl border shadow-lg px-5 py-3">
            <li class="text-indigo-500">{{ user.email }}</li>
            <li><button @click="logout()" class="w-full text-left px-1">Logout</button></li>
          </ul>
        </div>
        <button v-if="authorized && !user" @click="login()" class="flex items-center text-indigo-500 text-xl">
          <UserCircleIcon class="mr-1 h-8 w-8" />
          Login
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
