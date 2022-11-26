import { Events, GuildMember } from 'discord.js'
import { commandsListener } from '@/commands'
import { He4rtClient } from '@/types'
import { XPListener } from './gamification'
import { isBot, isValidXPMessage } from '@/utils'
import { deletePossibleUserInServerLeave } from './guild'
import { sendGoodMessagesInChatChannel, suppressEmbedMessagesInBusyChannels } from './channel'
import { removeCustomColorOfUnderprivilegedMembers } from './role'

export const discordEvents = (client: He4rtClient) => {
  client.on(Events.GuildMemberRemove, (member) => {
    if (isBot(member.user)) return

    deletePossibleUserInServerLeave(client, member.user.id)
  })

  client.on(Events.GuildMemberUpdate, (oldMember, newMember) => {
    if (isBot(oldMember.user) || isBot(newMember.user) || !oldMember) return

    removeCustomColorOfUnderprivilegedMembers(client, oldMember as GuildMember, newMember)
  })

  client.on(Events.MessageCreate, (message) => {
    if (isBot(message.author)) return

    if (isValidXPMessage(message)) {
      XPListener(client, message)
    }

    suppressEmbedMessagesInBusyChannels(message)
    sendGoodMessagesInChatChannel(message)
  })

  client.on(Events.InteractionCreate, (interaction) => {
    if (interaction.isChatInputCommand()) commandsListener(client, interaction)
  })
}
