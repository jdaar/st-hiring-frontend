import { ApplicationError, SettingAlreadyExistsError, SettingVersionConflictError } from '@st-hiring/shared'

export const toErrorMessage = (error: unknown): string => {
  if (!(error instanceof ApplicationError)) return 'Something went wrong'
  // instanceof narrows the generic class to ApplicationError<any>
  const { code, details, message }: ApplicationError = error
  if (code === SettingVersionConflictError.code) return 'Changed by someone else, discard to load the latest value'
  if (code === SettingAlreadyExistsError.code) return 'A setting with this key already exists'
  return details?.[0]?.message ?? message
}
