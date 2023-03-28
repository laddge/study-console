<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { getMonth, setMonth, getDate, startOfMonth, startOfWeek, format } from 'date-fns'
  import { ChevronLeftIcon, ChevronRightIcon, ArrowUturnLeftIcon } from '@heroicons/vue/24/solid'

  const month = ref(0)

  onMounted(() => {
    month.value = getMonth(new Date())
  })

  const getCellDate = (row: number, col: number): Date => {
    const d = row * 7 + col
    const cellDate = startOfWeek(startOfMonth(setMonth(new Date(), month.value)))
    cellDate.setDate(getDate(cellDate) + d)
    return cellDate
  }
</script>

<template>
  <div>
    <div class="mx-3 mb-4 text-xl flex gap-2 items-center">
      <div class="grow font-bold">
        {{ format(setMonth(new Date(), month), 'MMMM Y') }}
      </div>
      <ArrowUturnLeftIcon v-if="month != getMonth(new Date())" @click="month = getMonth(new Date())" class="h-5 w-5 mr-3 text-indigo-500" />
      <ChevronLeftIcon @click="month--" class="h-6 w-6 text-indigo-500" />
      <ChevronRightIcon @click="month++" class="h-6 w-6 text-indigo-500" />
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
      <tr v-for="(_, row) in 5" :key="row">
        <td v-for="(_, col) in 7" :key="col" class="py-3">
          <div v-if="row == 0 && col == 0 || format(getCellDate(row, col), 'd') == '1'">
            {{ format(getCellDate(row, col), 'M/d') }}
          </div>
          <div v-else>
            {{ format(getCellDate(row, col), 'd') }}
          </div>
          <div v-if="format(getCellDate(row, col), 'Y-M-d') == format(new Date(), 'Y-M-d')" class="mx-auto w-3.5 h-0.5 rounded bg-indigo-500" />
        </td>
      </tr>
    </table>
  </div>
</template>
