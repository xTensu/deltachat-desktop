import { CommandId } from './commandIds'
import { DeltaChat, C } from 'deltachat-node'
import {
  FullChat,
  ChatListItemType,
  MessageType,
  JsonLocations,
  Theme,
  DCContact,
  LocalSettings,
} from '../../shared/shared-types'
import { MuteDuration } from '../../shared/constants'
import { LocaleData } from '../../shared/localize'

type TransportMethod = {
  send: (id: CommandId, args: { [key: string]: any }) => Promise<any>
}

class HasTransport {
  constructor(public transport: TransportMethod) {}
}

export class Accounts extends HasTransport {
  // todo getAccounts
  async importBackup(file: string): Promise<void> {
    throw new Error('Not implemented yet')
  }

  // to replace state.logins
  async getLogins(): Promise<DeltaChatAccount[]> {
    throw new Error('Not implemented yet')
  }

  // to replace ipc function 'forgetLogin'
  async forgetAccount(login: DeltaChatAccount): Promise<void> {
    throw new Error('Not implemented yet')
  }
}

export class Themes extends HasTransport {
  async getActiveTheme(): Promise<{
    theme: Theme
    data: string
  } | null> {
    throw new Error('Not implemented yet')
  }
  async getAvailableThemes(): Promise<Theme[]> {
    throw new Error('Not implemented yet')
  }
  async setTheme(address: string): Promise<void> {
    throw new Error('Not implemented yet')
  }
}

export class Localization extends HasTransport {
  // todo get availible Languages
  // replaces ipc call 'chooseLanguage'
  async setLanguage(): Promise<LocaleData> {
    throw new Error('Not implemented yet')
  }
  async getLocaleData(locale: string): Promise<LocaleData> {
    throw new Error('Not implemented yet')
  }
}

/**
 * describes local cofiguration shared between all accounts -> config.json
 */
export class LocalSharedSettings extends HasTransport {
  // replaces state.saved
  async getConfig(): Promise<LocalSettings> {
    throw new Error('Not implemented yet')
  }

  // replaces ipc 'updateDesktopSetting' (that might be already moved to the DeltaChatController)
  async set(key: string, value: any): Promise<void> {
    throw new Error('Not implemented yet')
  }
}

export class DeltaChatInstance extends HasTransport {
  readonly accounts = new Accounts(this.transport)
  readonly themes = new Themes(this.transport)
  readonly localSharedConfig = new LocalSharedSettings(this.transport)
  private _context: Context | null

  get context() {
    throw new Error('Not implemented yet')
    return this._context
  }

  /** sets the currently active account of the connection */
  async openContext(login: DeltaChatAccount) {
    throw new Error('Not implemented yet')
    await this.transport.send(CommandId.openContext, {})
    this._context = new Context(this.transport)
    // todo setup notifications (listen to event)
    // todo setup unread badgeCounter (listen to event)
    return this._context
  }

  async closeContext() {
    throw new Error('Not implemented yet')
    this._context = null
  }

  /** triggers an error to test error behaviour */
  async _trigger_error(): Promise<boolean> {
    return this.transport.send(CommandId.test_trigger_error, {})
  }

  async getProviderInfo(
    email: string
  ): Promise<{
    before_login_hint: any
    overview_page: any
    status: any
  }> {
    throw new Error('Not implemented yet')
  }

  stopOngoingProcess(): Promise<number> {
    throw new Error('Not implemented yet')
  }
  checkQrCode(
    qrCode: string
  ): Promise<{
    state: number
    text1: string
    text1Meaning: string
    text2: string
    timestamp: number
    id: number
  }> {
    throw new Error('Not implemented yet')
  }
  getNetworkStatus(): Promise<[boolean, string]> {
    throw new Error('Not implemented yet')
  }
}

export class Autocrypt extends HasTransport {
  async initiateKeyTransfer(): Promise<string> {
    throw new Error('Not implemented yet')
  }
  async continueKeyTransfer(messageId: number, key: string): Promise<number> {
    throw new Error('Not implemented yet')
  }
}

export class ChatList extends HasTransport {
  async selectChat(chatId: number): Promise<FullChat> {
    throw new Error('Not implemented yet')
  }
  async getSelectedChatId(): Promise<number> {
    throw new Error('Not implemented yet')
  }
  async onChatModified(chatId: number): Promise<void> {
    throw new Error('Not implemented yet')
  }
  async getChatListIds(
    listFlags: number,
    queryStr: string,
    queryContactId: number
  ): Promise<number[]> {
    throw new Error('Not implemented yet')
  }
  async getChatListItemsByIds(
    chatIds: number[]
  ): Promise<{
    [key: number]: ChatListItemType
  }> {
    throw new Error('Not implemented yet')
  }
  async getFullChatById(chatId: number): Promise<FullChat> {
    throw new Error('Not implemented yet')
  }
  // this method might be used for a favicon badge counter
  async getGeneralFreshMessageCounter(): Promise<number> {
    throw new Error('Not implemented yet')
  }
}

export class Contacts extends HasTransport {
  async unblockContact(contactId: number): Promise<void> {
    throw new Error('Not implemented yet')
  }
  async blockContact(contactId: number): Promise<void> {
    throw new Error('Not implemented yet')
  }
  async changeNickname(contactId: number, name: string): Promise<number> {
    throw new Error('Not implemented yet')
  }
  async acceptContactRequest({
    messageId,
    contactId,
  }: {
    messageId: number
    contactId: number
  }): Promise<number> {
    throw new Error('Not implemented yet')
  }
  async createContact(email: string, name?: string): Promise<number> {
    throw new Error('Not implemented yet')
  }
  async createChatByContactId(contactId: number): Promise<number> {
    throw new Error('Not implemented yet')
  }
  async getContact(contactId: number): Promise<DCContact> {
    throw new Error('Not implemented yet')
  }
  async getContacts2(
    listFlags: number,
    queryStr: string
  ): Promise<DCContact[]> {
    throw new Error('Not implemented yet')
  }
  async markNoticedContact(contactId: number): Promise<void> {
    throw new Error('Not implemented yet')
  }
  async getChatIdByContactId(contactId: number): Promise<number> {
    throw new Error('Not implemented yet')
  }
  async getDMChatId(contactId: number): Promise<number> {
    throw new Error('Not implemented yet')
  }
}

export class Chat extends HasTransport {
  async getChatMedia(
    msgType1: number,
    msgType2: number
  ): Promise<MessageType[]> {
    throw new Error('Not implemented yet')
  }
  async getEncryptionInfo(contactId: number): Promise<string> {
    throw new Error('Not implemented yet')
  }
  async getQrCode(chatId?: number): Promise<string> {
    throw new Error('Not implemented yet')
  }
  async leaveGroup(chatId: number): Promise<void> {
    throw new Error('Not implemented yet')
  }
  async setName(chatId: number, name: string): Promise<boolean> {
    throw new Error('Not implemented yet')
  }
  async modifyGroup(
    chatId: number,
    name: string,
    image: string,
    remove: number[],
    add: number[]
  ): Promise<boolean> {
    throw new Error('Not implemented yet')
  }
  async addContactToChat(chatId: number, contactId: number): Promise<boolean> {
    throw new Error('Not implemented yet')
  }
  async setProfileImage(chatId: number, newImage: string): Promise<boolean> {
    throw new Error('Not implemented yet')
  }
  async setMuteDuration(
    chatId: number,
    duration: MuteDuration
  ): Promise<boolean> {
    throw new Error('Not implemented yet')
  }
  async createGroupChat(verified: boolean, name: string): Promise<number> {
    throw new Error('Not implemented yet')
  }
  async delete(chatId: number): Promise<void> {
    throw new Error('Not implemented yet')
  }
  async setVisibility(
    chatId: number,
    visibility:
      | C.DC_CERTCK_AUTO
      | C.DC_CERTCK_STRICT
      | C.DC_CHAT_VISIBILITY_PINNED
  ): Promise<void> {
    throw new Error('Not implemented yet')
  }
  async getChatContacts(chatId: number): Promise<number[]> {
    throw new Error('Not implemented yet')
  }
  async markNoticedChat(chatId: number): Promise<void> {
    throw new Error('Not implemented yet')
  }
}

export class Locations extends HasTransport {
  async setLocation(
    latitude: number,
    longitude: number,
    accuracy: number
  ): Promise<void> {
    throw new Error('Not implemented yet')
  }
  async getLocations(
    chatId: number,
    contactId: number,
    timestampFrom: number,
    timestampTo: number
  ): Promise<JsonLocations> {
    throw new Error('Not implemented yet')
  }
}

export class MessageList extends HasTransport {
  async sendMessage(
    chatId: number,
    text: string | null,
    filename?: string,
    location?: {
      lat: number
      lng: number
    }
  ): Promise<
    [
      number,
      (
        | MessageType
        | {
            msg: null
          }
      )
    ]
  > {
    throw new Error('Not implemented yet')
  }

  async sendSticker(chatId: number, stickerPath: string): Promise<void> {
    throw new Error('Not implemented yet')
  }

  async deleteMessage(id: number): Promise<void> {
    throw new Error('Not implemented yet')
  }

  async getMessage(msgId: number): Promise<{ msg: null } | MessageType> {
    throw new Error('Not implemented yet')
  }

  async getMessages(
    messageIds: number[]
  ): Promise<{ [key: number]: MessageType | { msg: null } }> {
    throw new Error('Not implemented yet')
  }

  async getMessageInfo(msgId: number): Promise<string> {
    throw new Error('Not implemented yet')
  }

  async setDraft(chatId: number, msgText: string): Promise<void> {
    throw new Error('Not implemented yet')
  }

  async messageIdToJson(id: number): Promise<{ msg: null } | MessageType> {
    throw new Error('Not implemented yet')
  }

  async getMessageIds(chatid: number): Promise<number[]> {
    throw new Error('Not implemented yet')
  }

  async forwardMessage(msgId: number, chatId: number): Promise<void> {
    throw new Error('Not implemented yet')
  }
}

export class Settings extends HasTransport {
  async setConfig(key: string, value: string): Promise<number> {
    throw new Error('Not implemented yet')
  }
  async getConfig(key: string): Promise<string> {
    throw new Error('Not implemented yet')
  }
  async getConfigFor(
    keys: string[]
  ): Promise<{
    [key: string]: string
  }> {
    throw new Error('Not implemented yet')
  }
  async keysImport(directory: string): Promise<void> {
    throw new Error('Not implemented yet')
  }
  async keysExport(directory: string): Promise<void> {
    throw new Error('Not implemented yet')
  }
  async serverFlags({
    mail_security,
    send_security,
  }: {
    mail_security?: string
    send_security?: string
  }): Promise<number | ''> {
    throw new Error('Not implemented yet')
  }
}

export class Context extends HasTransport {
  readonly autocrypt = new Autocrypt(this.transport)
  readonly chatList = new ChatList(this.transport)
  readonly contacts = new Contacts(this.transport)
  readonly locations = new Locations(this.transport)
  readonly messageList = new MessageList(this.transport)
  readonly settings = new Settings(this.transport)

  async isConfigured(): Promise<boolean> {
    throw new Error('Not implemented yet')
  }

  /** Configure the account */
  async configure(/* TODO */) {
    throw new Error('Not implemented yet')
  }

  /** get information abeout deltachat core and the current context */
  async getInfo(): Promise<{ [key: string]: string }> {
    throw new Error('Not implemented yet')
    return this.transport.send(CommandId.getInfo, {})
  }

  async getMessageIds(chatId: number): Promise<number[]> {
    throw new Error('Not implemented yet')
    return this.transport.send(45, { chat_id: chatId })
  }

  async updateBlockedContacts(): Promise<void> {
    throw new Error('Not implemented yet')
  }

  async setProfilePicture(newImage: string): Promise<void> {
    throw new Error('Not implemented yet')
  }

  async getProfilePicture(): Promise<string> {
    throw new Error('Not implemented yet')
  }

  async joinSecurejoin(qrCode: string): Promise<number> {
    throw new Error('Not implemented yet')
  }

  async exportBackup(dir: string): Promise<void> {
    throw new Error('Not implemented yet')
  }

  async maybeNetwork(): Promise<void> {
    throw new Error('Not implemented yet')
  }

  async getStickers(): Promise<{
    [key: string]: string[]
  }> {
    throw new Error('Not implemented yet')
  }
}

// todo events:
// update-logins // send to all clients when the accountlist changes
// update-desktop-config // send to all clients when the config.json changed
// update-locale // if locale was changed (its a local-shared-setting so it applies to all accounts) or when the experimental language file is watched and it changed
