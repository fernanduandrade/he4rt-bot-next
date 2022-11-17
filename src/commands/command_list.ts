import { SlashCommandBuilder } from 'discord.js'
import { Command } from '../types'
import COMMANDS from '../defines/commands.json'

export const useCommandsList = (): Command => {
  const data = new SlashCommandBuilder()
    .setName(COMMANDS.COMMAND_LIST.TITLE)
    .setDescription(COMMANDS.COMMAND_LIST.DESCRIPTION)
    .setDMPermission(false)
    
  return [
    data,
    async (interaction, client) => {
      const content = Object.values(COMMANDS).reduce((acc, { TITLE, DESCRIPTION }) => {
        return acc += `**/${TITLE}** - ${DESCRIPTION}\n`
      }, COMMANDS.COMMAND_LIST.SUBTITLE)

      await interaction.reply({
        content,
        ephemeral: true,
      })
    },
  ]
}
