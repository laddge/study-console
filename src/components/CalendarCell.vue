<script setup lang="ts">
  import { format, getDate } from 'date-fns'

  const props = defineProps<{ date: Date }>()
</script>

<template>
  <div class="h-16 p-1">
    <span :class="format(date, 'Y-M-d') == format(new Date(), 'Y-M-d') ? 'bg-indigo-100 rounded px-1.5 py-0.5' : 'px-1.5 py-0.5'">
      <span v-if="getDate(props.date) == 1">{{ format(date, 'M/') }}</span>{{ getDate(props.date) }}
    </span>
  </div>
</template>
