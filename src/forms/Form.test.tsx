import { describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import * as yup from 'yup'
import { renderWithTheme } from '../test/render'
import { Form, FormActions, FormStatus, FormSwitch, FormTextField } from '.'

interface Values {
  name: string
  seats: number | ''
  open: boolean
}

const initialValues: Values = { name: 'Rock night', seats: 100, open: false }

const renderForm = (onSubmit = vi.fn()) =>
  renderWithTheme(
    <Form<Values>
      initialValues={initialValues}
      validationSchema={yup.object({ name: yup.string().required('Name is required'), seats: yup.number(), open: yup.boolean() })}
      onSubmit={onSubmit}
    >
      <FormTextField name="name" label="Name" />
      <FormTextField name="seats" label="Seats" type="number" schema={yup.number().typeError('Seats is required').min(1, 'At least 1')} />
      <FormSwitch name="open" label="Open" />
      <FormStatus />
      <FormActions />
    </Form>,
  )

describe('form layer', () => {
  it('binds fields to the form values and submits them typed', async () => {
    const onSubmit = vi.fn()
    const { user } = renderForm(onSubmit)

    await user.clear(screen.getByLabelText('Seats'))
    await user.type(screen.getByLabelText('Seats'), '250')
    await user.click(screen.getByRole('checkbox', { name: 'Open' }))
    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce())
    expect(onSubmit.mock.calls[0][0]).toEqual({ name: 'Rock night', seats: 250, open: true })
  })

  it('shows form and field level yup errors once a field is touched', async () => {
    const { user } = renderForm()

    await user.clear(screen.getByLabelText('Name'))
    await user.tab()
    expect(await screen.findByText('Name is required')).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true')

    await user.clear(screen.getByLabelText('Seats'))
    await user.type(screen.getByLabelText('Seats'), '0')
    await user.tab()
    expect(await screen.findByText('At least 1')).toBeInTheDocument()
  })

  it('does not submit while invalid', async () => {
    const onSubmit = vi.fn()
    const { user } = renderForm(onSubmit)

    await user.clear(screen.getByLabelText('Name'))
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByText('Name is required')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('enables its actions only once there is something to save or discard', async () => {
    const { user } = renderForm()
    const save = screen.getByRole('button', { name: 'Save' })
    const discard = screen.getByRole('button', { name: 'Discard' })

    expect(save).toBeDisabled()
    expect(discard).toBeDisabled()

    await user.type(screen.getByLabelText('Name'), '!')
    expect(save).toBeEnabled()

    await user.click(discard)
    expect(screen.getByLabelText('Name')).toHaveValue('Rock night')
    expect(save).toBeDisabled()
  })

  it('shows the submit button as busy while submitting, then the status', async () => {
    let finish = () => {}
    const onSubmit = vi.fn(
      (_values: Values, { setStatus }: { setStatus: (status: string) => void }) =>
        new Promise<void>((resolve) => {
          finish = () => {
            setStatus('Saved with warnings')
            resolve()
          }
        }),
    )
    const { user } = renderForm(onSubmit)

    await user.type(screen.getByLabelText('Name'), '!')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('aria-busy', 'true'))
    finish()
    expect(await screen.findByRole('alert')).toHaveTextContent('Saved with warnings')
  })
})
