import { GuildMember, SlashCommandBuilder } from 'discord.js'
import { Command, DailyPOST } from '@/types'
import { DAILY } from '@/defines/commands.json'
import { isPresentedMember, isPrivilegedMember, reply } from '@/utils'
import { HCOINS_ERROR } from '-/commands/daily.json'
import { getUser, upsertUser } from '@/http/firebase'

export const useDaily = (): Command => {
  const data = new SlashCommandBuilder().setName(DAILY.TITLE).setDescription(DAILY.DESCRIPTION).setDMPermission(false)

  return [
    data,
    async (interaction, client) => {
      const member = interaction.member as GuildMember

      if (!isPresentedMember(member)) {
        await reply(interaction).errorMemberIsNotPresented()

        return
      }

      const user = await getUser(client, { id: member.id })

      if (user?.daily_last && user?.daily) {
        const oneDayInMilliseconds = 60000 * 1440
        const lastRedeem = new Date(user.daily_last).valueOf() + oneDayInMilliseconds
        const actuallyTime = new Date().valueOf()

        if (lastRedeem >= actuallyTime) {
          await interaction.reply({
            content: HCOINS_ERROR,
            ephemeral: true,
          })

          return
        }
      }

      client.api.he4rt.users
        .daily()
        .post<DailyPOST>({
          donator: isPrivilegedMember(member),
          discord_id: member.id,
        })
        .catch(() => {})

      upsertUser(client, { id: member.id, daily: user?.daily ? ++user.daily : 1, daily_last: new Date().toISOString() })
        .then(async () => {
          await reply(interaction).success()
        })
        .catch(async () => {
          await reply(interaction).error()
        })
    },
  ]
}
