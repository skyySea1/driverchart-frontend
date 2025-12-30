import type { Directive } from 'vue'

const interactiveTags = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA']

const cursorDirective: Directive<HTMLElement> = {
  mounted(el, binding, vnode) {
    const shouldAdd = resolveShouldAdd(el, binding.value, vnode)
    if (shouldAdd) el.classList.add('cursor-pointer')
  },
  updated(el, binding, vnode) {
    const shouldAdd = resolveShouldAdd(el, binding.value, vnode)
    if (shouldAdd) {
      el.classList.add('cursor-pointer')
    } else {
      el.classList.remove('cursor-pointer')
    }
  },
}

function resolveShouldAdd(
  el: HTMLElement,
  value: unknown,
  vnode: { props?: Record<string, unknown> | null },
): boolean {
  if (value === true) return true
  if (value === false) return false

  const props = vnode.props ?? {}
  const hasClickProp = Object.keys(props).some((key) => key.toLowerCase().startsWith('onclick'))
  const hasNativeClick = typeof el.onclick === 'function'
  const hasInteractiveTag = interactiveTags.includes(el.tagName)
  const hasButtonRole = el.getAttribute('role') === 'button'

  return hasClickProp || hasNativeClick || hasInteractiveTag || hasButtonRole
}

export default cursorDirective
