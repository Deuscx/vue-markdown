import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import remarkParse from 'remark-parse'
import type { Options as RehypeOptions } from 'remark-rehype'
import remarkRehype from 'remark-rehype'
import type { PluggableList } from 'unified'
import { unified } from 'unified'
import type { Visitor } from 'unist-util-visit'
import { visit } from 'unist-util-visit'
import { Fragment, defineComponent, h } from 'vue'

const emptyRemarkRehypeOptions = { allowDangerousHtml: true }

const MarkdownProps = {
  content: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    default: '',
  },
  rehypePlugins: {
    type: Object as PropType<PluggableList>,
    default: () => [],
  },
  remarkPlugins: {
    type: Object as PropType<PluggableList>,
    default: () => [],
  },
  remarkRehypeOptions: {
    type: Object as PropType<RehypeOptions>,
    default: () => {},
  },
  skipHtml: {
    type: Boolean,
    default: false,
  },
}

export default defineComponent({
  props: MarkdownProps,
  setup(props, { slots }) {
    const _components = Object.keys(slots)
      .reduce<Record<string, any>>((acc, key) => {
        const originSlot = slots[key]
        const originSlotRender = typeof originSlot === 'function' ? originSlot : null
        switch (key) {
          case 'pre': {
            acc[key] = (props: any) => {
              const code = props.node?.children[0]?.children[0]?.value
              if (originSlotRender)
                return originSlotRender({ code })
            }

            break
          }
          default:
            if (originSlotRender) {
              acc[key] = (props: any) => {
                return originSlotRender(props)
              }
            }
        }

        return acc
      }, {})

    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    function jsx(type, props, key) {
      const { children } = props
      delete props.children
      if (arguments.length > 2)
        props.key = key

      let child = children

      // if children is string wrap in array
      if (typeof children === 'string')
        child = [children]

      // if type is component wrap children in a function
      // https://stackoverflow.com/questions/69875273/non-function-value-encountered-for-default-slot-in-vue-3-composition-api-comp
      if (typeof type === 'function' && children)
        child = () => children

      return h(type, props, child)
    }

    const remarkRehypeOptions = props.remarkRehypeOptions
      ? { ...props.remarkRehypeOptions, ...emptyRemarkRehypeOptions }
      : emptyRemarkRehypeOptions

    const processor = computed(() =>
      unified()
        .use(remarkParse)
        .use(props.remarkPlugins)
        .use(remarkRehype, remarkRehypeOptions)
        .use(props.rehypePlugins), {
    })

    return () => {
      const content = props.content || ''
      const className = props.class
      const skipHtml = props.skipHtml

      const mdastTree = processor.value.parse(content)
      /** @type {Nodes} */
      let hastTree = processor.value.runSync(mdastTree)

      // Wrap in `div` if there’s a class name.
      if (className) {
        hastTree = {
          type: 'element',
          tagName: 'div',
          properties: { className },
          // Assume no doctypes.
          children: /** @type {Array<ElementContent>} */ (
            hastTree.type === 'root' ? hastTree.children : [hastTree]
          ),
        } as any
      }

      const transform: Visitor = (node, index, parent) => {
        if (node.type === 'raw' && parent && typeof index === 'number') {
          if (skipHtml)
            parent.children.splice(index, 1)
          else
            parent.children[index] = { type: 'text', value: (node as any).value } as any

          return index
        }
      }

      visit(hastTree, transform)

      const vnode = toJsxRuntime(hastTree, {
        Fragment,
        components: _components,
        ignoreInvalidStyle: true,
        jsx,
        jsxs: jsx,
        passKeys: true,
        passNode: true,
        elementAttributeNameCase: 'html',
      })

      return vnode
    }
  },
})
