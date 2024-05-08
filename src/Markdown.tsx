import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import { Fragment, defineComponent, h } from 'vue'

/** @type {PluggableList} */
const emptyPlugins = []
/** @type {Readonly<RemarkRehypeOptions>} */
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
}
export default defineComponent({
  inheritAttrs: false,
  props: MarkdownProps,
  setup(props, { slots }) {
    const content = props.content || ''
    const className = props.class
    const rehypePlugins = props.rehypePlugins || emptyPlugins
    const remarkPlugins = props.remarkPlugins || emptyPlugins
    const remarkRehypeOptions = props.remarkRehypeOptions
      ? { ...props.remarkRehypeOptions, ...emptyRemarkRehypeOptions }
      : emptyRemarkRehypeOptions
    const skipHtml = props.skipHtml

    const processor = unified()
      .use(remarkParse)
      .use(remarkPlugins)
      .use(remarkRehype, remarkRehypeOptions)
      .use(rehypePlugins)

    const mdastTree = processor.parse(content)
    /** @type {Nodes} */
    let hastTree = processor.runSync(mdastTree)

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
      }
    }

    visit(hastTree, transform)

    const _components = Object.keys(slots).reduce((acc, key) => {
      const originSlot = slots[key]
      const originSlotRender = typeof originSlot === 'function' ? originSlot : null
      switch (key) {
        case 'pre': {
          acc[key] = (props) => {
            const code = props.node?.children[0]?.children[0]?.value
            return originSlotRender({ code })
          }

          break
        }
        default:
          if (originSlotRender) {
            acc[key] = (props) => {
              return originSlotRender(props)
            }
          }
      }

      return acc
    }, {})

    function jsx(type, props, key) {
      const { children } = props
      delete props.children
      if (arguments.length > 2)
        props.key = key

      let child = children
      // if type is component wrap children in a function
      // https://stackoverflow.com/questions/69875273/non-function-value-encountered-for-default-slot-in-vue-3-composition-api-comp
      if (typeof type === 'function' && children)
        child = () => children

      return h(type, props, child)
    }
    return () => {
      const vnode = toJsxRuntime(hastTree, {
        Fragment,
        components: _components,
        ignoreInvalidStyle: true,
        // @ts-expect-error: to do: types.
        jsx,
        // @ts-expect-error: to do: types.
        jsxs: jsx,
        passKeys: true,
        passNode: true,
        elementAttributeNameCase: 'html',
      })

      return vnode
    }
    /** @type {Visitor} */
    function transform(node, index, parent) {
      if (node.type === 'raw' && parent && typeof index === 'number') {
        if (skipHtml)
          parent.children.splice(index, 1)
        else
          parent.children[index] = { type: 'text', value: node.value }

        return index
      }
    }
  },
})
