/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { Args, PieceContext } from '@sapphire/framework';
import {
  MessageEmbed,
  MessageButton,
  MessageActionRow,
  Message,
  MessageComponentInteractionCollector,
  TextChannel,
  Collection,
  GuildMember,
  MessageComponentInteraction,
  Snowflake,
  Guild,
} from 'discord.js';

import SafireCommand from '../../lib/types/safire-command';
import SafireResult from '../../lib/types/safire-result';

export default class PollCommand extends SafireCommand {
  readonly timeout = 30_000;

  readonly delimiter = '|';

  readonly defaultOptions = {
    buttons: [
      new MessageButton()
        .setCustomID('Yes')
        .setLabel('Yes')
        .setStyle('SUCCESS')
        .setEmoji('✅'),
      new MessageButton()
        .setCustomID('No')
        .setLabel('No')
        .setStyle('DANGER')
        .setEmoji('❌'),
    ],
    fields: [
      { name: 'Yes', value: '0' },
      { name: 'No', value: '0' },
    ],
  };

  private readonly pollCache = new Collection<
    string,
    Collection<
      string,
      {
        readonly count: number;
        // eslint-disable-next-line functional/prefer-readonly-type
        readonly voters: Array<GuildMember>;
      }
    >
  >();

  constructor(context: PieceContext) {
    super(context, {
      aliases: ['p'],
      name: 'poll',
      description: 'Spawns a new poll.',
      preconditions: ['GuildOnly'],
    });
  }

  readonly handlePollCloser = async function handlePollCloseEvent(
    this: PollCommand,
    message: Message,
    interactionCollector: Collection<`${bigint}`, MessageComponentInteraction>,
    commandArguments: Args,
    salt: Snowflake,
  ): Promise<void> {
    return message
      .edit({
        embeds: [
          new MessageEmbed(message.embeds[0]).setFooter(
            'This Poll Has Now Concluded',
          ),
        ],
        components: [],
      })
      .then(async () =>
        this.pollCache.delete(
          `${await this.getPollQuestion(commandArguments)}-${salt}`,
        ),
      )
      .then(() =>
        this.container.logger.info(
          `Poll collected ${interactionCollector.size} results`,
        ),
      );
  };

  readonly applyCollector =
    // eslint-disable-next-line sonarjs/cognitive-complexity
    async function applyMessageComponentInteractionCollector(
      this: PollCommand,
      message: Message,
      commandArguments: Args,
      salt: Snowflake,
    ): Promise<MessageComponentInteractionCollector> {
      const cachedPollData = this.pollCache.get(
        `${await this.getPollQuestion(commandArguments)}-${salt}`,
      );
      return !cachedPollData
        ? Promise.reject(new Error('could not hit poll cache for question'))
        : message
            .createMessageComponentInteractionCollector({
              filter: async (interaction: MessageComponentInteraction) =>
                cachedPollData.has(interaction.customID),
              idle: this.timeout,
            })
            .on('collect', (interaction) => {
              const voters =
                cachedPollData.get(interaction.customID)?.voters ?? [];
              const oldKey = cachedPollData.findKey((pollData) =>
                pollData.voters.includes(
                  !(interaction.member instanceof GuildMember)
                    ? new GuildMember(
                        this.container.client,
                        undefined,
                        new Guild(this.container.client, undefined),
                      )
                    : interaction.member,
                ),
              );
              const oldData = cachedPollData.get(
                oldKey ?? cachedPollData.firstKey() ?? '',
              );
              return !(interaction.channel instanceof TextChannel) ||
                !message.embeds[0] ||
                !(interaction.message instanceof Message) ||
                !(interaction.member instanceof GuildMember)
                ? Promise.reject(new Error('cannot find original poll embed.'))
                : voters.includes(interaction.member)
                ? interaction.reply({
                    content: 'You already voted this way!',
                    ephemeral: true,
                  })
                : interaction.message
                    .edit({
                      embeds: [
                        new MessageEmbed(message.embeds[0])
                          .spliceFields(0, message.embeds[0].fields.length)
                          .addFields(
                            cachedPollData
                              .set(oldKey ?? cachedPollData.firstKey() ?? '', {
                                count: (oldData?.count ?? 0) - (oldKey ? 1 : 0),
                                voters:
                                  oldData?.voters.filter((voter) =>
                                    oldKey
                                      ? voter !== interaction.member
                                      : true,
                                  ) ?? [],
                              })
                              .set(interaction.customID, {
                                count:
                                  (cachedPollData.get(interaction.customID)
                                    ?.count ?? 0) + 1,
                                voters: [...voters, interaction.member] ?? [],
                              })
                              .map((value, key) => ({
                                name: `${key} - ${value.count}`,
                                value: `${
                                  value.voters.length === 0
                                    ? 'No Voters Yet.'
                                    : value.voters
                                        .toLocaleString()
                                        .slice(0, 1500 / cachedPollData.size)
                                }`,
                              })),
                          ),
                      ],
                    })
                    .then(() =>
                      interaction.reply({
                        content: `You voted for ${interaction.customID}!`,
                        ephemeral: true,
                      }),
                    );
            })
            .on('end', (interactionCollector) =>
              this.handlePollCloser(
                message,
                interactionCollector,
                commandArguments,
                salt,
              ),
            );
    };

  readonly getPollQuestion = async function parseMessageForPollFunction(
    this: PollCommand,
    commandArguments: Args,
  ): Promise<string> {
    return commandArguments
      .start()
      .rest('string')
      .then((string) => string.split(this.delimiter)[0] ?? string)
      .then((string) =>
        string
          ?.split(' ')
          .map(
            (substring) =>
              substring.charAt(0).toLocaleUpperCase() + substring.slice(1),
          )
          .join(' '),
      )
      .then(
        (processedString) =>
          `${processedString}${processedString.includes('?') ? '' : '?'}`,
      );
  };

  async run(message: Message, commandArguments: Args): Promise<SafireResult> {
    const parsedAnswers = (await commandArguments.start().rest('string'))
      .split(this.delimiter)
      .slice(1);
    return !(await commandArguments.start().peekResult('string')).success
      ? Promise.reject(new Error('You need to provide a poll question.'))
      : this.getPollQuestion(commandArguments)
          .then(async (pollQuestionString) =>
            this.pollCache.set(
              `${pollQuestionString}-${message.id}`,
              // eslint-disable-next-line total-functions/no-unsafe-readonly-mutable-assignment
              new Collection(
                parsedAnswers.length > 0
                  ? parsedAnswers.map((answer) => [
                      answer,
                      { count: 0, voters: [] },
                    ])
                  : this.defaultOptions.fields.map((field) => [
                      field.name,
                      { count: 0, voters: [] },
                    ]),
              ),
            ),
          )
          .then(() => this.getPollQuestion(commandArguments))
          .then((processedString) =>
            message.reply({
              components: [
                new MessageActionRow().addComponents(
                  parsedAnswers.length === 0
                    ? this.defaultOptions.buttons
                    : this.pollCache
                        .get(`${processedString}-${message.id}`)
                        ?.map((_count, answer) =>
                          new MessageButton()
                            .setCustomID(answer)
                            .setLabel(answer)
                            .setStyle('PRIMARY'),
                        ) ?? this.defaultOptions.buttons,
                ),
              ],
              embeds: [
                new MessageEmbed()
                  .setTitle(`__***${processedString}***__`)
                  .setColor('RANDOM')
                  .setAuthor(`${message.author.tag} asked:`)
                  .setImage(
                    message.guild?.splashURL() ??
                      message.guild?.bannerURL() ??
                      message.guild?.iconURL() ??
                      message.author.displayAvatarURL(),
                  )
                  .addFields(
                    this.pollCache
                      .get(`${processedString}-${message.id}`)
                      ?.map((_count, answer) => ({
                        name: `${answer} - 0`,
                        value: 'No Votes Yet.',
                      })) ?? this.defaultOptions.fields,
                  ),
              ],
            }),
          )
          .then((pollMessage) =>
            this.applyCollector(pollMessage, commandArguments, message.id),
          )
          .then(() => this.getPollQuestion(commandArguments))
          .then(
            (pollQuestion) =>
              new SafireResult(`Poll Published: ${pollQuestion}`),
          );
  }
}
