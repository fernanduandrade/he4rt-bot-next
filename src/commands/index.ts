import { Events, Routes } from 'discord.js'
import { Command, Context, He4rtClient } from '../types'
import { useAnnounce } from './announce'
import { useBan } from './ban'
import { useColor } from './color'
import { useCommandsList } from './commands_list'
import { useIntroduce } from './introduce'
import { useRanking } from './ranking'

const registerHooks = (client: He4rtClient, commands: Command[]) => {
  commands.forEach(([data, cb]) => {
    client.commands.set(data, cb)
  })
}

export const registerCommands = async ({ client, rest }: Context) => {
  registerHooks(client, [useCommandsList(), useIntroduce(), useAnnounce(), useColor(), useBan(), useRanking()])

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return

    for (const [key, cb] of client.commands) {
      if (key.name === interaction.commandName) cb && (await cb(interaction, client))
    }
  })

  await rest.put(
    Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID as string, process.env.DISCORD_GUILD_ID as string),
    { body: [...client.commands.keys()] }
  )
}
