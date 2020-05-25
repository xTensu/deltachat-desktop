import { CommandId } from '../remote/commandIds'

function call(id: CommandId, args: { [key: string]: any }) {
  if (id <= 99) {
    // 1-99 Custom / electron / test
    switch (id) {
      case CommandId.test_trigger_error:
        throw new Error('Test Error')
        break
    }
  } else if (id <= 149) {
    /* 100-149 DC without context */
  } else if (id > 149) {
    /* 100-149 DC with context */
    // todo check if context is provided if not throw an error
  }
}
