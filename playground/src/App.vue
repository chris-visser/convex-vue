`
<script setup lang="ts">
import TaskList from './components/TaskList.vue'
</script>

<template>
  <Suspense>
    <TaskList is-sync />
    <template #fallback>
      Loading via suspense...
    </template>
  </Suspense>
</template>

<style scoped>
ul {
  display: flex;
  gap: 8rem;
  margin: auto;
  list-style: none;
}
</style>