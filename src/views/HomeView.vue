<script setup lang="ts">
  import { format } from 'date-fns'
  import { UserCircleIcon } from '@heroicons/vue/24/solid'
  import TodayWidget from '../components/TodayWidget.vue'
  import TodoWidget from '../components/TodoWidget.vue'
  import BookshelfWidget from '../components/BookshelfWidget.vue'
  import CalendarWidget from '../components/CalendarWidget.vue'
</script>

<template>
  <main class="container max-w-5xl mx-auto px-5">
    <div class="my-5 md:mb-0 px-5 flex items-center gap-x-5">
      <div class="md:flex gap-x-3">
        <div class="text-xl">
          {{ format(new Date(), 'Y年') }}
        </div>
        <div class="text-4xl">
          {{ format(new Date(), 'M / d') }}
        </div>
      </div>
      <button class="ml-auto md:ml-0 flex items-center text-indigo-500 text-xl gap-x-1">
        <UserCircleIcon class="h-7 w-7" />
        Login
      </button>
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
