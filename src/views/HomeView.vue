<script setup lang="ts">
import TodayWidget from '../components/TodayWidget.vue'
import TodoWidget from '../components/TodoWidget.vue'
import CalendarWidget from '../components/CalendarWidget.vue'
</script>

<template>
  <main class="container mx-auto px-5 md:flex gap-5">
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
        <CalendarWidget />
      </div>
    </div>
  </main>
</template>
