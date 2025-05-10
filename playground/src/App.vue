
<script setup lang="ts">
import { useConvexQuery } from 'convex-vue'

import { api } from '../convex/_generated/api'

const { data, error, isLoading } = useConvexQuery(api.tasks.get)

</script>

<template>
  <div>
    <h1>Tasks</h1>
    <p v-if="isLoading">
      Loading...
    </p>
    <p v-if="error">
      Error: {{ error.message }}
    </p>
    <ul v-if="data">
      <li v-if="data.length === 0">
        No tasks found.
      </li>
      <li
        v-for="{_id, text, isCompleted} in data"
        :key="_id"
      >
        <input
          :id="_id"
          type="checkbox"
          :checked="isCompleted"
        >
        <label :for="_id">{{ text }}</label>
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
}
</style>
