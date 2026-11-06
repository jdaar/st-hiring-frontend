import * as yup from 'yup'
import {
  ApiError,
  EndpointContract,
  FailureResponse,
  InferSchema,
  NetworkError,
  RequestSchemas,
  RequestValidationError,
  RequestValues,
  ResponseBody,
  ResponseValidationError,
  SuccessResponse,
  TRANSACTION_ID_HEADER,
  toErrorDetails,
  validateRequestSources,
} from '@st-hiring/shared'
import { API_BASE_URL } from './config'

export type EndpointInput<R extends RequestSchemas> = { [K in keyof R]: InferSchema<R[K]> }

export type EndpointOutput<S extends yup.ISchema<unknown>> = ResponseBody<InferSchema<S>>

const buildUrl = (path: string, params: unknown, query: unknown) => {
  const resolvedPath = path.replace(/:(\w+)/g, (_segment, name: string) =>
    encodeURIComponent(String((params as Record<string, unknown>)[name])),
  )
  const url = new URL(`${API_BASE_URL}${resolvedPath}`, globalThis.location?.origin)

  for (const [key, value] of Object.entries((query ?? {}) as Record<string, unknown>)) {
    if (value !== undefined && value !== null) url.searchParams.set(key, String(value))
  }

  return url
}

// calls an endpoint contract, validating the request before sending it and the response before returning it
export const callEndpoint = async <S extends yup.ISchema<unknown>, R extends RequestSchemas>(
  { method, path, request = {} as R, response }: EndpointContract<R, S>,
  input: EndpointInput<R>,
  { signal }: { signal?: AbortSignal } = {},
): Promise<EndpointOutput<S>> => {
  const { values, details } = await validateRequestSources(request, input as RequestValues)
  if (details.length) throw new RequestValidationError(details)
  const { params, query, body } = values

  const transactionId = crypto.randomUUID()
  const headers = new Headers({ Accept: 'application/json', [TRANSACTION_ID_HEADER]: transactionId })
  if (body !== undefined) headers.set('Content-Type', 'application/json')

  let res: Response
  try {
    res = await fetch(buildUrl(path, params, query), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    })
  } catch (error) {
    if (signal?.aborted) throw error
    throw new NetworkError(transactionId, { cause: error })
  }

  const echoedTransactionId = res.headers.get(TRANSACTION_ID_HEADER) ?? transactionId

  let envelope: SuccessResponse<EndpointOutput<S>> | FailureResponse
  try {
    // unknown fields are dropped so new backend fields do not break the client
    envelope = (await response.validate(await res.json(), { abortEarly: false, stripUnknown: true })) as typeof envelope
  } catch (error) {
    if (signal?.aborted) throw error
    const details =
      error instanceof yup.ValidationError
        ? toErrorDetails(error, 'response')
        : [{ path: 'response', message: 'Response body is not valid JSON' }]
    throw new ResponseValidationError(details, res.status, echoedTransactionId)
  }

  if (!envelope.isSuccess) throw new ApiError(envelope.error, res.status, echoedTransactionId)
  return envelope.body
}
