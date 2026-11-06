import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Setting, SettingValue } from '@st-hiring/shared'

// local copy of the confirmed server settings, values only so it stays serializable
export interface SettingsState {
  values: Record<string, SettingValue>
}

const initialState: SettingsState = { values: {} }

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    settingsReceived: (state, { payload }: PayloadAction<Setting[]>) => {
      state.values = Object.fromEntries(payload.map(({ id, value }) => [id, value]))
    },
  },
})

export const { settingsReceived } = settingsSlice.actions

interface WithSettings {
  settings: SettingsState
}

export const selectMaxTicketsPerOrder = ({ settings }: WithSettings) => {
  const { maxTicketsPerOrder } = settings.values
  if (typeof maxTicketsPerOrder === 'boolean') return undefined
  const limit = Number(maxTicketsPerOrder)
  return Number.isInteger(limit) && limit > 0 ? limit : undefined
}
