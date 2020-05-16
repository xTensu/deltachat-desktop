/**
 * Encapsulate frontend <-> backend communication
 * to be able to switch this layer later on...
 */

const { ipcRenderer } = window.electron_functions
const log = require('../shared/logger').getLogger('renderer/ipc')
import { ApiArguments, CommandRequest } from '../shared/backend_api'

export const ipcBackend = ipcRenderer

var backendLoggingStarted = false
export function startBackendLogging() {
  if (backendLoggingStarted === true)
    return log.error('Backend logging is already started!')
  backendLoggingStarted = true

  ipcBackend.on('ALL', (e, eName, ...args) =>
    log.debug('backend', eName, ...args)
  )
  ipcBackend.on('error', (e, ...args) => log.error(...args))
}

export function sendToBackend(event: string, ...args: any[]) {
  log.debug(`sendToBackend: ${event} ${args.join(' ')}`)
  ipcRenderer.send('ALL', event, ...args)
  ipcRenderer.send(event, ...args)
}

// Call a dc method without blocking the renderer process. Return value
// of the dc method is the first argument to cb
var callDcMethodIdentifier = 0
// private function, please use `DeltaBackend.call` instead
function callDcMethod(
  methodName: string,
  args: any[],
  cb: (returnValue: any) => void
) {
  const identifier = callDcMethodIdentifier++
  if (identifier >= Number.MAX_SAFE_INTEGER - 1) callDcMethodIdentifier = 0
  const ignoreReturn = typeof cb !== 'function'
  const eventName = ignoreReturn ? 'EVENT_DC_DISPATCH' : 'EVENT_DC_DISPATCH_CB'

  sendToBackend(eventName, identifier, methodName, args)

  if (ignoreReturn) return

  ipcRenderer.once(
    `EVENT_DD_DISPATCH_RETURN_${identifier}_${methodName}`,
    (_ev, returnValue) => {
      log.debug(
        `EVENT_DD_DISPATCH_RETURN_${identifier}_${methodName}`,
        'Got back return: ',
        returnValue
      )
      cb(returnValue)
    }
  )
}

export function _callDcMethodAsync(
  fnName: string,
  ...args: any[]
): Promise<any> {
  return Backend_Transport.send(fnName, args)
}

export function mainProcessUpdateBadge() {
  ipcRenderer.send('update-badge')
}

export function saveLastChatId(chatId: number) {
  ipcRenderer.send('saveLastChatId', chatId)
}

/**
 * get the last selected chats id from previous session
 */
export function getLastSelectedChatId() {
  return ipcRenderer.sendSync('getLastSelectedChatId')
}

export function openHelp() {
  ipcRenderer.send('help', window.localeData.locale)
}

ipcRenderer.on('showHelpDialog', openHelp)

// Communicate with deltachat controller backend

export interface TransportMethod {
  initialized: boolean
  online: boolean
  send(commandId: string, parameters: ApiArguments): Promise<any>
}

export class ElectronIPCTransport implements TransportMethod {
  callbacks: { [key: number]: { res: Function; rej: Function } } = {}
  invocation_id_counter: number = 0
  initialized = false
  online = false

  constructor() {}

  setup() {
    ipcRenderer.on('backend_call_result', (_event, answer) => {
      // handle answer
      // console.log('got', answer)
      const callback = this.callbacks[answer.invocation_id]
      if (!callback) {
        log.error(`No callback found for invocation_id ${answer.invocation_id}`)
      }

      if (answer.kind && answer.message) {
        callback.rej(new Error(`${answer.kind}:${answer.message}`))
      } else {
        callback.res(answer.result || null)
      }

      delete this.callbacks[answer.invocation_id]
    })

    this.initialized = true
    this.online = true
  }

  send(commandId: string, parameters: ApiArguments): Promise<any | null> {
    if (!this.initialized) throw new Error("Transport wasn't initilized yet")
    if (!this.online) throw new Error('Not connected to backend')
    const identifier = this.invocation_id_counter++
    if (identifier >= Number.MAX_SAFE_INTEGER - 1)
      this.invocation_id_counter = 0

    let callback

    const promise = new Promise((res, rej) => {
      callback = { res, rej }
    })
    this.callbacks[identifier] = callback
    let data: CommandRequest = {
      arguments: parameters,
      command_id: commandId,
      invocation_id: identifier,
    }
    // console.log("sending:", data)
    ipcRenderer.send('backend_call', data)
    return promise
  }

  _currentCallCount() {
    return this.invocation_id_counter
  }

  _currentUnresolvedCallCount() {
    return Object.keys(this.callbacks).length
  }
}

export const Backend_Transport = new ElectronIPCTransport()
;(global as any)._BT = Backend_Transport
