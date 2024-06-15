<script setup lang="ts">
import { codeToHtml } from 'shiki'

defineOptions({
  name: 'CodeComponent',
})

const props = defineProps<{
  code: string
}>()

const html = computedAsync(() => {
  return codeToHtml(props.code, {
    lang: 'javascript',
    theme: 'vitesse-light',
  })
})
</script>

<template>
  <div class="whitespace-break-spaces" v-html="html" />
</template>

<style scoped>

</style>
