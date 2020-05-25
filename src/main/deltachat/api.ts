import { getLogger } from '../../shared/logger'
import {
  CommandRequest,
  CommandResultError,
  CommandResult,
} from '../../shared/backend_api'
import DeltaChatController from './controller'
const log = getLogger('main/ipc')

// Errors
export class GenericError extends Error {
  kindName = 'Generic'

  toError() {
    return {
      kind: this.kindName,
      message: this.message,
    }
  }
}

// Functions

export async function callMethod(
  request: CommandRequest,
  dcController: DeltaChatController
): Promise<CommandResultError | CommandResult<any>> {
  // check request
  if (!request) throw 'no Request'
  else if (typeof request.invocation_id !== 'number')
    log.error('callMethod: request invalid - no invocation id:', request)
  else if (typeof request.command_id !== 'string')
    return {
      kind: 'CommandIdMissing',
      message: 'You need to specify an invocation id',
      invocation_id: request.invocation_id,
    }

  let methodName = request.command_id

  // run request
  let returnValue
  try {
    returnValue = await dcController._callMethod(methodName, request.arguments)
  } catch (error) {
    log.error(
      `Error calling ${methodName}(${
        request.arguments ? request.arguments.join(', ') : ''
      }):`,
      error
    )
    let error_object: GenericError
    if (typeof error == 'string') {
      error_object = new GenericError(error)
    } else if (error instanceof GenericError) {
      error_object = error
    } else if (error instanceof Error) {
      error_object = new GenericError(error.message)
    }
    return {
      ...error_object.toError(),
      invocation_id: request.invocation_id,
    }
  }
  return {
    result: returnValue,
    invocation_id: request.invocation_id,
  }
}
