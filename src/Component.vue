<script setup lang="ts">
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import Markdown from './Markdown'
import Code from './Code.vue'
import { content } from './content'

defineOptions({
  inheritAttrs: false,
})

const markdownStr = ref(content)

const enableRaw = useStorage('enableRaw', false)
const enableGfm = useStorage('enableGfm', true)
const rehypePlugins = computed(() => {
  return enableRaw.value
    ? [rehypeRaw, rehypeSanitize({
        ancestors: {
          video: ['video'],
        },
      })] as any
    : []
})
const remarkPlugins = computed(() => {
  return enableGfm.value ? [remarkGfm] : []
})
</script>

<template>
  <div class="h-100vh flex flex-col">
    <div>
      <a-checkbox v-model:checked="enableGfm">
        Enable GFM
      </a-checkbox>
      <a-checkbox v-model:checked="enableRaw">
        Enable Raw
      </a-checkbox>
    </div>

    <div class="grid grid-cols-2 gap-2 min-h-0 of-y-auto gap-4">
      <a-textarea v-model:value="markdownStr" class="h-full" />
      <div class="h-full of-y-auto">
        <Markdown
          class="prose"
          :content="markdownStr"
          :remark-plugins="remarkPlugins"
          :rehype-plugins="rehypePlugins"
        >
          <template #pre="{ code }">
            <Code :code="code" />
          </template>
          <template #img="{ src }">
            <AImage :src="src" :width="360" />
          </template>
          <template #a="{ href }">
            <a class="break-words" :href="href" target="_blank">{{ href }}</a>
          </template>
          <template #video="{ src }">
            <video class="w-full max-w-360px" controls>
              <source :src="src" type="video/mp4">
            </video>
          </template>
        </Markdown>
      </div>
    </div>
  </div>
</template>
