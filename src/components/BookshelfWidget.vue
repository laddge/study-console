<script setup lang="ts">
  import { ref, computed, nextTick } from 'vue'
  import { PlusIcon, ChevronUpIcon, ChevronDownIcon, XMarkIcon } from '@heroicons/vue/24/solid'
  import { nanoid } from 'nanoid'
  import { cloneDeep } from 'lodash'
  import { ModalsContainer, VueFinalModal } from 'vue-final-modal'
  import { storeToRefs } from 'pinia'
  import { useDataStore } from '../stores/data'

  const { userData } = storeToRefs(useDataStore())
  const { updateData } = useDataStore()
  const editing = ref(false)
  const memory = ref({})
  const insertText = ref('')
  const td0 = ref({})
  const td1 = ref({})
  const td2 = ref({})
  const modalModel = computed({
    get() {
      return memory.value.id ? true : false
    },
    set(val) {
      if (!val) {
        editing.value = false
        memory.value = {}
        insertText.value = ''
      }
    }
  })
  const countStatus = (status, book) => {
    const num = book.questions.filter(q => q.status == status).length
    const den = book.questions.length
    return num / den * 100
  }
  const statusToColor = (status) => {
    if (status == 0) {
      return 'emerald-500'
    } else if (status == 1) {
      return 'yellow-400'
    } else if (status == 2) {
      return 'red-400'
    } else {
      return 'gray-300'
    }
  }
  const insert = () => {
    if (!memory.value) return
    let order = 0
    if (!memory.value.questions) {
      memory.value.questions = []
    } else if (memory.value.questions.length) {
      const orders = memory.value.questions.map(obj => obj.order)
      order = orders.reduce((a, b) => Math.max(a, b)) + 1
    }
    memory.value.questions.push({ id: nanoid(), name: insertText.value, order })
    const matches = insertText.value.match(/([\d]+)[^\d]*$/)
    if (matches.length > 1) {
      const num = Number(matches[1])
      insertText.value = insertText.value.replace(new RegExp(`(.*)${num}`),  `$1${num + 1}`)
    }
  }
  const reOrder = async (qid, down = false) => {
    const target = memory.value.questions.filter(q => q.id == qid)[0]
    let oppos = memory.value.questions.filter(q => q.order < target.order).sort((a, b) => b.order - a.order)
    if (down) {
      oppos = memory.value.questions.filter(q => q.order > target.order).sort((a, b) => a.order - b.order)
    }
    if (!oppos) return
    const oppo = oppos[0]
    const { order: targetOrder } = target
    const { order: oppoOrder } = oppo
    target.order = oppoOrder
    oppo.order = targetOrder
    await nextTick()
    td0.value[target.id].classList.add('bg-gray-200')
    td1.value[target.id].classList.add('bg-gray-200')
    td2.value[target.id].classList.add('bg-gray-200')
    setTimeout(() => {
      td0.value[target.id].classList.remove('bg-gray-200')
      td1.value[target.id].classList.remove('bg-gray-200')
      td2.value[target.id].classList.remove('bg-gray-200')
    }, 500)
  }
  const delBook = () => {
    if (!memory.value.id) return
    if (confirm(`[ ${memory.value.name} ] を削除しますか？`)) {
      userData.value.books = userData.value.books.filter(book => book.id != memory.value.id)
      try {
        updateData()
        modalModel.value = false
      } catch (e) {
        console.log(e)
        alert('エラーが発生しました')
      }
    }
  }
  const save = () => {
    if (!userData.value.books) userData.value.books = []
    userData.value.books = userData.value.books.filter(book => book.id != memory.value.id)
    memory.value.updatedAt = Date.now()
    userData.value.books.push(memory.value)
    try {
      updateData()
      modalModel.value = false
    } catch (e) {
      console.log(e)
      alert('エラーが発生しました')
    }
  }
</script>

<template>
  <div>
    <div class="mx-3 mb-4 text-xl flex gap-2 items-center">
      <div class="grow font-bold">
        本棚
      </div>
      <button @click="editing = true; memory.id = nanoid()" class="h-6 w-6 text-indigo-500 rounded hover:bg-gray-200 active:bg-gray-300">
        <PlusIcon />
      </button>
    </div>
    <ul v-if="userData" class="grid grid-col-1 md:grid-cols-2 gap-3">
      <li v-if="userData.books" v-for="book in userData.books.sort((a, b) => b.updatedAt - a.updatedAt)" :key="book.id">
        <button @click="memory = cloneDeep(book)" class="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-200 active:bg-gray-300">
          <div :class="`flex-none h-3 w-3 rounded-full bg-${book.color}-500`" />
          <div class="w-full table table-fixed">
            <div class="table-cell truncate text-lg text-left">
              {{ book.name }}
              <div class="flex h-1 rounded overflow-hidden bg-gray-300 box-content border-2 border-white">
                <div class="bg-emerald-500 h-1" :style="`width: ${countStatus(0, book)}%;`" />
                <div class="bg-yellow-400 h-1" :style="`width: ${countStatus(1, book)}%;`" />
                <div class="bg-red-400 h-1" :style="`width: ${countStatus(2, book)}%;`" />
              </div>
            </div>
          </div>
        </button>
      </li>
      <li v-if="!userData.books || !userData.books.length">
        <div class="text-center text-gray-500 text-lg">Nothing...</div>
      </li>
    </ul>
    <VueFinalModal
      v-model="modalModel"
      overlay-transition="vfm-fade"
      content-transition="vfm-fade"
      class="flex justify-center items-center"
      content-class="w-full max-w-xl mx-4 p-8 bg-white border rounded-2xl shadow-md"
    >
      <div v-if="editing">
        <div>
          <div class="flex">
            <div :class="`flex-none mt-10 ml-2 mr-3 h-3 w-3 rounded-full ${memory.color ? '' : 'bg-gray-300'} bg-${memory.color}-500`" />
            <div class="flex-none">
              色
              <div class="mt-1">
                <select v-model="memory.color" class="outline-0 border-2 focus:ring-2 focus:ring-indigo-300 rounded-l rounded-r-none focus:relative">
                  <option class="bg-red-500">red</option>
                  <option class="bg-orange-500">orange</option>
                  <option class="bg-amber-500">amber</option>
                  <option class="bg-yellow-500">yellow</option>
                  <option class="bg-lime-500">lime</option>
                  <option class="bg-green-500">green</option>
                  <option class="bg-emerald-500">emerald</option>
                  <option class="bg-teal-500">teal</option>
                  <option class="bg-cyan-500">cyan</option>
                  <option class="bg-sky-500">sky</option>
                  <option class="bg-blue-500">blue</option>
                  <option class="bg-indigo-500">indigo</option>
                  <option class="bg-violet-500">violet</option>
                  <option class="bg-purple-500">purple</option>
                  <option class="bg-fuchsia-500">fuchsia</option>
                  <option class="bg-pink-500">pink</option>
                  <option class="bg-rose-500">rose</option>
                </select>
              </div>
            </div>
            <div class="grow">
              教材名
              <input type="text" v-model="memory.name" class="outline-0 focus:ring-2 focus:ring-indigo-300 w-full border-2 rounded-r rounded-l-none mt-1 ml-[-2px]">
            </div>
          </div>
        </div>
        <div class="mb-4">
          <div class="mt-8 border-2 p-3">
            <div class="flex border-b">
              <div class="grow p-2">問題</div>
              <div class="w-24 p-2">状態</div>
              <div class="w-24 p-2">操作</div>
            </div>
            <div class="h-80 overflow-scroll">
              <table class="w-full text-left">
                <tr v-if="memory.questions" v-for="q in memory.questions.sort((a, b) => a.order - b.order)" :key="q.id">
                  <td :ref="el => td0[q.id] = el" class="p-2 border-y transition">{{ q.name }}</td>
                  <td :ref="el => td1[q.id] = el" class="p-2 w-24 border-y transition">
                    <div class="flex items-center gap-2">
                      <div :class="`flex-none h-3 w-3 rounded-full bg-${statusToColor(q.status)}`" />
                      <select v-model="q.status" class="outline-0 border-2 focus:ring-2 focus:ring-indigo-300 rounded">
                        <option :value="undefined">未</option>
                        <option :value="0" class="bg-emerald-500">緑</option>
                        <option :value="1" class="bg-yellow-400">黄</option>
                        <option :value="2" class="bg-red-400">赤</option>
                      </select>
                    </div>
                  </td>
                  <td :ref="el => td2[q.id] = el" class="p-2 w-24 border-y transition">
                    <div class="flex items-center">
                      <div class="grow flex items-center justify-center">
                        <button @click="reOrder(q.id)" class="h-6 w-6 text-indigo-500">
                          <ChevronUpIcon />
                        </button>
                      </div>
                      <div class="grow flex items-center justify-center">
                        <button @click="reOrder(q.id, true)" class="h-6 w-6 text-indigo-500">
                          <ChevronDownIcon />
                        </button>
                      </div>
                      <div class="grow flex items-center justify-center">
                        <button @click="memory.questions = memory.questions.filter(_q => _q.order != q.order)" class="h-6 w-6 text-red-500">
                          <XMarkIcon />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </div>
            <div class="flex gap-2 mt-3">
              <input type="text" v-model="insertText" class="outline-0 border-2 focus:ring-2 focus:ring-indigo-300 rounded w-1/4">
              <button @click="insert()" class="block px-4 text-indigo-500 rounded hover:bg-gray-200 active:bg-gray-300 disabled:text-indigo-300" :disabled="!insertText">
                追加
              </button>
            </div>
          </div>
        </div>
        <div class="mt-8 flex justify-end gap-2">
          <button @click="modalModel = false" class="block px-4 py-2 text-indigo-500 rounded hover:bg-gray-200 active:bg-gray-300">
            キャンセル
          </button>
          <button @click="save()" class="block px-4 py-2 text-white rounded bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 disabled:bg-indigo-400" :disabled="!memory.name || !memory.color || !memory.questions || !memory.questions.length">
            保存
          </button>
        </div>
      </div>
      <div v-else>
        <div class="flex items-center">
          <div :class="`flex-none ml-2 mr-3 h-3 w-3 rounded-full ${memory.color ? '' : 'bg-gray-300'} bg-${memory.color}-500`" />
          <div class="text-lg font-bold truncate">
            {{ memory.name }}
          </div>
          <button @click="editing = true" class="ml-auto block px-4 py-2 text-indigo-500 rounded hover:bg-gray-200 active:bg-gray-300">
            編集
          </button>
          <button @click="delBook()" class="block px-4 py-2 text-red-500 rounded hover:bg-gray-200 active:bg-gray-300">
            削除
          </button>
        </div>
        <div class="mt-8 border-2 p-3">
          <div class="flex border-b">
            <div class="w-1/2 p-2">問題</div>
            <div class="w-1/2 p-2">状態</div>
          </div>
          <div class="h-96 overflow-scroll">
            <table class="w-full table-fixed text-left">
              <tr v-if="memory.questions" v-for="q in memory.questions.sort((a, b) => a.order - b.order)" :key="q.id">
                <td class="p-2 border-y">{{ q.name }}</td>
                <td class="p-2 border-y">
                  <div class="flex items-center gap-2">
                    <div :class="`flex-none h-3 w-3 rounded-full bg-${statusToColor(q.status)}`" />
                    <div v-if="q.status == undefined">未</div>
                    <div v-if="q.status == 0">緑</div>
                    <div v-if="q.status == 1">黄</div>
                    <div v-if="q.status == 2">赤</div>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div class="mt-8 flex justify-end gap-2">
          <button @click="modalModel = false" class="block px-4 py-2 text-indigo-500 rounded hover:bg-gray-200 active:bg-gray-300">
            閉じる
          </button>
        </div>
      </div>
    </VueFinalModal>
    <ModalsContainer />
  </div>
</template>
