<script setup lang="ts">
import { Image } from 'ant-design-vue'
import Markdown from './Markdown'
import Code from './Code.vue'

defineOptions({
  inheritAttrs: false,
})
const props = defineProps<{
  initial: number
}>()

const { count, inc, dec } = useCounter(props.initial)

const markdownStr = `
111
![](https://gw.alipayobjects.com/zos/kitchen/8Ab%24hLJ5ur/cover.webp)
<script> alert(1) <\/script>
 \`\`\`js
console.log('hello')
\`\`\`
`
</script>

<template>
  <div>
    {{ count }}
    <button class="inc btn" @click="inc()">
      +
    </button>
    <button class="dec btn" @click="dec()">
      -
    </button>
    <Markdown
      :content="markdownStr"
    >
      <template #pre="{ code }">
        <Code :code="code" />
      </template>
      <template #img="{ src }">
        <Image :src="src" />
      </template>
    </Markdown>
  </div>
</template>
