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
  callbacks: { res: Function; rej: Function }[] = []
  initialized = false
  online = false

  constructor() {}

  setup(): Promise<void> {
    return new Promise((res, rej) => {
      ipcRenderer.on('backend_call_result', (_event, answer) => {
        // handle answer
        // console.log("got", answer)
        // if (answer.invocation_id == 0) {
        //   throw new Error('Command id missing error')
        // }
        if (!answer.invocation_id) {
          throw new Error('invocation_id missing')
        }
        const callback = this.callbacks[answer.invocation_id - 1]
        if (!callback) {
          throw new Error(
            `No callback found for invocation_id ${answer.invocation_id}`
          )
        }

        if (answer.kind && answer.message) {
          callback.rej(new Error(`${answer.kind}:${answer.message}`))
        } else {
          callback.res(answer.result || null)
        }

        this.callbacks[answer.invocation_id] = null
      })

      this.initialized = true
      this.online = true
    })
  }

  send(commandId: string, parameters: ApiArguments): Promise<any | null> {
    if (!this.initialized) throw new Error("Transport wasn't initilized yet")
    if (!this.online) throw new Error('Not connected to backend')

    let callback

    const promise = new Promise((res, rej) => {
      callback = { res, rej }
    })

    let data: CommandRequest = {
      arguments: parameters,
      command_id: commandId,
      invocation_id: this.callbacks.push(callback),
    }
    // console.log("sending:", data)
    ipcRenderer.send('backend_call', data)
    return promise
  }

  _currentCallCount() {
    return this.callbacks.length
  }

  _currentUnresolvedCallCount() {
    return this.callbacks.filter(cb => cb !== null).length
  }
}

const Backend_Transport = new ElectronIPCTransport()
Backend_Transport.setup()
;(global as any)._BT = Backend_Transport
