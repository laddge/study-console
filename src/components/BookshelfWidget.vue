<script setup lang="ts">
  import { ref } from 'vue'
  import { PlusIcon } from '@heroicons/vue/24/solid'

  const count = ref(3)
</script>

<template>
  <div>
    <div class="mx-3 mb-4 text-xl flex gap-2 items-center">
      <div class="grow font-bold">
        本棚
      </div>
      <PlusIcon @click="count++" class="h-6 w-6 text-indigo-500" />
    </div>
    <div class="grid grid-col-1 md:grid-cols-2 gap-y-5">
      <div v-for="i in count" :key="i" class="flex items-center gap-3 pr-5">
        <div class="flex-none h-3 w-3 rounded-full bg-blue-500" />
        <div class="w-full table table-fixed">
          <div class="table-cell truncate text-lg">
            数3 青チャート ({{ i }})
            <div class="flex h-1 rounded overflow-hidden bg-gray-300">
              <div class="bg-emerald-500 h-1 w-[20%]" />
              <div class="bg-yellow-400 h-1 w-[30%]" />
              <div class="bg-red-400 h-1 w-[10%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>