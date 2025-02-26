
# vue-markdown

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/deuscx/vue-markdown">
    <!-- <img src="" alt="Logo" width="80" height="80"-->
  </a>

  <h3 align="center">vue-markdown</h3>

  <p align="center">
    A markdown component for Vue.js
  </p>
</div>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![GitHub][license-shield]][license-url]

<!-- ## Features -->

## Getting Started

Markdown component for Vue.js. easy to use and customize.

[demo](https://vue-markdown-playground.vercel.app/)
<!-- ## Try it Online

link to demo or gif link-->
![image](https://github.com/Deuscx/vue-markdown/assets/48537979/38c2775c-f423-4c57-9a1b-452210233be2)

## Installation

```bash
pnpm install @deuscx/vue-markdown
```



<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

```vue
<script lang="ts" setup>
import { ref } from 'vue'
import VueMarkdown from '@deuscx/vue-markdown'
const markdown = ref('# Hello World')
</script>

<template>
  <div>
    <VueMarkdown :content="markdown" />
  </div>
</template>
```

### Custom Component
By default, the component will render the markdown as a native element. You can customize the component by passing a custom component as a slot.

For Example:

You can use the `AImage` component to render images in markdown.
```vue
<template>
  <div>
    <VueMarkdown :content="markdown">
      <template #img="{ src }">
        <AImage :src="src" :width="360" />
      </template>
    </VueMarkdown>
  </div>
</template>
```

### Custom Plugins
You can add custom plugins to the markdown component by passing them as a prop.

For Example:
you can add rehypePlugin and remarkPlugin to the markdown component.

```vue
<script lang="ts" setup>
import { ref } from 'vue'
import VueMarkdown from '@deuscx/vue-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

const markdown = ref('# Hello World')
</script>

<template>
  <div>
    <VueMarkdown
      :content="markdown"
      :rehype-plugins="[rehypeRaw]"
      :remark-plugins="[remarkGfm]"
    />
  </div>
</template>
```

See the [open issues](https://github.com/deuscx/vue-markdown/issues) for a full list of proposed features (and known issues).


## Credits

- [React Markdown](https://github.com/remarkjs/react-markdown)


<!-- LICENSE -->
## License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.


[contributors-shield]: https://img.shields.io/github/contributors/deuscx/vue-markdown.svg?style=for-the-badge
[contributors-url]: https://github.com/deuscx/vue-markdown/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/deuscx/vue-markdown.svg?style=for-the-badge
[forks-url]: https://github.com/deuscx/vue-markdown/network/members
[stars-shield]: https://img.shields.io/github/stars/deuscx/vue-markdown.svg?style=for-the-badge
[stars-url]: https://github.com/deuscx/vue-markdown/stargazers
[issues-shield]: https://img.shields.io/github/issues/deuscx/vue-markdown.svg?style=for-the-badge
[issues-url]: https://github.com/deuscx/vue-markdown/issues
[license-shield]: https://img.shields.io/github/license/deuscx/vue-markdown?style=for-the-badge
[license-url]: https://github.com/deuscx/vue-markdown/blob/master/LICENSE
