<script setup lang="ts">
  import { startOfMonth, startOfWeek, format } from 'date-fns'

  const today = new Date()

  const getCellDate = (row: number, col: number): Date => {
    const distance = row * 7 + col
    const cellDate = startOfWeek(startOfMonth(today))
    cellDate.setDate(cellDate.getDate() + distance)
    return cellDate
  }
</script>

<template>
  <div>
    <div class="mx-3 mb-3 text-2xl text-extrabold">
      {{ format(today, 'MMMM') }}
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
          <div v-if="format(getCellDate(row, col), 'Y-M-d') == format(today, 'Y-M-d')" class="mx-auto w-3.5 h-0.5 rounded bg-indigo-500" />
        </td>
      </tr>
    </table>
  </div>
</template>
