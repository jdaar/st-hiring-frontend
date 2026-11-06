import * as yup from 'yup'
import { Setting, SettingValue } from '@st-hiring/shared'

export interface SettingField {
  id: string
  value: SettingValue | ''
  // last value the server confirmed, decides the input type and whether the field changed
  savedValue: SettingValue
  version: number
}

export interface SettingsFormValues {
  settings: SettingField[]
}

export const toFormValues = (settings: Setting[]): SettingsFormValues => ({
  settings: settings.map(({ id, value, version }) => ({ id, value, savedValue: value, version })),
})

// maxTicketsPerOrder -> Max tickets per order
export const toLabel = (id: string) =>
  id
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .toLowerCase()
    .replace(/^./, (first) => first.toUpperCase())

export const valueSchema = (savedValue: SettingValue): yup.Schema => {
  switch (typeof savedValue) {
    case 'number':
      return yup.number().typeError('Must be a number').required('Required')
    case 'boolean':
      return yup.boolean().required('Required')
    default:
      return yup.string().trim().required('Required')
  }
}
