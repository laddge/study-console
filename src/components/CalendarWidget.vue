<script setup lang="ts">
  import { ref } from 'vue'
  import { addMonths, getDate, startOfMonth, endOfMonth, getWeekOfMonth, startOfWeek, format } from 'date-fns'
  import { ChevronLeftIcon, ChevronRightIcon, ArrowUturnLeftIcon } from '@heroicons/vue/24/solid'
  import CalendarCell from './CalendarCell.vue'

  const monthDiff = ref(0)

  const getCellDate = (row: number, col: number): Date => {
    const d = row * 7 + col
    const cellDate = startOfWeek(addMonths(startOfMonth(new Date()), monthDiff.value))
    cellDate.setDate(getDate(cellDate) + d)
    return cellDate
  }
</script>

<template>
  <div>
    <div class="mx-3 mb-4 text-xl flex gap-2 items-center">
      <div class="grow font-bold">
        {{ format(addMonths(startOfMonth(new Date()), monthDiff), 'MMMM Y') }}
      </div>
      <ArrowUturnLeftIcon v-if="monthDiff != 0" @click="monthDiff = 0" class="h-5 w-5 mr-3 text-indigo-500" />
      <ChevronLeftIcon @click="monthDiff--" class="h-6 w-6 text-indigo-500" />
      <ChevronRightIcon @click="monthDiff++" class="h-6 w-6 text-indigo-500" />
    </div>
    <table class="table-fixed w-full text-center">
      <tr>
        <th>Sun</th>
        <th>Mon</th>
        <th>Tue</th>
        <th>Wed</th>
        <th>Thu</th>
        <th>Fri</th>
        <th>Sat</th>
      </tr>
      <tr v-for="(_, row) in getWeekOfMonth(endOfMonth(addMonths(startOfMonth(new Date()), monthDiff)))" :key="row">
        <td v-for="(_, col) in 7" :key="col">
          <CalendarCell :date="getCellDate(row, col)" />
        </td>
      </tr>
    </table>
  </div>
</template>
