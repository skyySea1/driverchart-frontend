// Alert.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Alert from '@/Components/ui/Alert.vue'

describe('Alert Component', () => {
  it('renders error alert', () => {
    const wrapper = mount(Alert, {
      props: {
        type: 'error',
        title: 'Erro',
        message: 'Algo deu errado'
      }
    })
    expect(wrapper.text()).toContain('Erro')
    expect(wrapper.text()).toContain('Algo deu errado')
  })

  it('closes when close button clicked', async () => {
    const wrapper = mount(Alert, {
      props: {
        message: 'Test',
        closeable: true
      }
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  })
})
