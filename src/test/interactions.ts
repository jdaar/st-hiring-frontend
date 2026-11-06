import userEvent from '@testing-library/user-event'
import { within } from 'storybook/test'

// storybook/test's user-event cannot drive MUI select menus under jsdom (event "view" mismatch), and two
// user-event copies on one document break each other, so plays that pick options use this one throughout
export const setupUser = () => userEvent.setup()

export type User = ReturnType<typeof setupUser>

export const pickOption = async (user: User, combobox: HTMLElement, option: string) => {
  await user.click(combobox)
  await user.click(await within(combobox.ownerDocument.body).findByRole('option', { name: option }))
}
