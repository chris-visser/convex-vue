<script setup lang="ts">
import type { Id } from '../../convex/_generated/dataModel'
import { useConvexMutation, useConvexQuery } from 'convex-vue'

import { ref } from 'vue'
import { api } from '../../convex/_generated/api'

const props = defineProps<{
  isSync?: boolean
}>()
const limit = ref(10)
const { data, error, isPending, suspense } = useConvexQuery(api.tasks.get, () => ({
  limit: limit.value || undefined,
}))

if (props.isSync) {
  await suspense()
}

const { error: removeError, mutate: remove } = useConvexMutation(api.tasks.remove)
const newTask = ref('')
const { isPending: isNewTaskLoading, mutate: addTask } = useConvexMutation(api.tasks.add, {
  optimisticUpdate(ctx, { text }) {
    const current = ctx.getQuery(api.tasks.get, {})
    if (!current)
      return

    ctx.setQuery(api.tasks.get, {}, [
      ...current,
      {
        _creationTime: Date.now(),
        _id: 'optimistic_id' as Id<'tasks'>,
        completed: false,
        text,
      },
    ])
  },
})

function handleNewTask() {
  if (newTask.value.trim() === '') {
    return
  }
  addTask({ text: newTask.value })
  newTask.value = ''
}
</script>

<template>
  <div>
    <h1>Tasks</h1>
    <p>
      Limit:
      <input v-model.number="limit">
    </p>
    <form @submit.prevent="handleNewTask">
      <input
        v-model="newTask"
        name="task"
        type="text"
        placeholder="Add a task"
      >
      <button
        type="submit"
      >
        <span v-if="isNewTaskLoading">Saving..</span>
        <span v-else>Save</span>
      </button>
    </form>
    <p v-if="isPending">
      Loading...
    </p>
    <p
      v-if="error || removeError"
      class="error"
    >
      Error: {{ error?.message || removeError?.message }}
    </p>
    <ul v-if="data">
      <li v-if="data.length === 0">
        No tasks found.
      </li>
      <li
        v-for="{ _id, text, isCompleted } in data"
        :key="_id"
      >
        <input
          :id="_id"
          type="checkbox"
          :checked="isCompleted"
        >
        <label :for="_id">{{ text }}</label>
        <button
          type="button"
          @click="() => remove({ id: _id })"
        >
          <span v-if="isPending">...</span>
          <span v-else>X</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}
label,
input[type='checkbox'] {
  cursor: pointer;
}
li {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0.5rem;
  border-bottom: 1px solid #ccc;
  text-align: left;
  width: 100%;
}

li button {
  margin-left: auto;
}

.error {
  color: red;
}
</style>
