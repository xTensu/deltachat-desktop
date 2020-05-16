export type ApiArguments = any[]

export type CommandRequest = {
  command_id: string
  arguments: ApiArguments // todo change this to an object that contains the names of the properties.
  invocation_id: number
}

export type CommandResultError = {
  kind: string
  message: string
  invocation_id: number
}

export type CommandResult<T> = {
  result: T
  invocation_id: number
}
