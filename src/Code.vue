<script setup lang="ts">
defineOptions({
  name: 'CodeComponent',
})

defineProps<{
  code: string
}>()
</script>

<template>
  <div>
    {{ code }}
  </div>
</template>

<style scoped>

</style>
