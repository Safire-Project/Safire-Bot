/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import {
  MessageEmbed,
  MessageButton,
  MessageActionRow,
  Message,
  InteractionCollector,
  TextChannel,
  Collection,
  MessageComponentInteraction,
  Snowflake,
  User,
} from 'discord.js';
import { Args, PieceContext } from '@sapphire/framework';
import { TOPICS, EVENTS } from '../../lib/logger';

import SafireCommand from '../../lib/types/safire-command';
import SafireResult from '../../lib/types/safire-result';

export default class PollCommand extends SafireCommand {
  public readonly defaultOptions = {
    buttons: [
      new MessageButton()
        .setCustomId('Yes')
        .setLabel('Yes')
        .setStyle('SUCCESS')
        .setEmoji('✅'),
      new MessageButton()
        .setCustomId('No')
        .setLabel('No')
        .setStyle('DANGER')
        .setEmoji('❌'),
    ],
    fields: [
      { name: 'Yes', value: '0' },
      { name: 'No', value: '0' },
    ],
  };

  private readonly timeout = 360_000_000;

  private readonly delimiter = '|';

  private readonly pollCache = new Collection<
    string,
    Collection<
      string,
      {
        readonly count: number;
        // eslint-disable-next-line functional/prefer-readonly-type
        readonly voters: Array<User>;
      }
    >
  >();

  constructor(context: PieceContext) {
    super(context, {
      aliases: ['po', 'pl', 'strawpoll', 'spoll'],
      name: 'poll',
      description: 'Starts a new poll.',
      detailedDescription:
        '`poll question to ask | option 1 | option 2 | option 3`\n\n' +
        'Will start a new strawpoll with the given message as the question. By default, the command will give Yes/No options. If you would like to set custom options, then you may separate out a maximum of 25 options separated by |.',
    });
  }

  public readonly run = async function run(
    this: PollCommand,
    message: Message,
    commandArguments: Args,
  ): Promise<SafireResult> {
    const parsedAnswers = (await commandArguments.start().rest('string'))
      .split(this.delimiter)
      .slice(1)
      .map((answer) => answer.trim());
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
                            .setCustomId(answer)
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
  };

  private readonly handlePollCloser = async function handlePollCloseEvent(
    this: PollCommand,
    message: Message,
    interactionCollector: Collection<string, MessageComponentInteraction>,
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
          TOPICS.POLL,
          EVENTS.FINISH,
        ),
      );
  };

  private readonly applyCollector =
    // eslint-disable-next-line sonarjs/cognitive-complexity
    async function applyMessageComponentInteractionCollector(
      this: PollCommand,
      message: Message,
      commandArguments: Args,
      salt: Snowflake,
    ): Promise<InteractionCollector<MessageComponentInteraction>> {
      const cachedPollData = this.pollCache.get(
        `${await this.getPollQuestion(commandArguments)}-${salt}`,
      );
      return !cachedPollData
        ? Promise.reject(new Error('could not hit poll cache for question'))
        : message
            .createMessageComponentCollector({
              filter: async (interaction: MessageComponentInteraction) =>
                cachedPollData.has(interaction.customId),
              idle: this.timeout,
            })
            .on('collect', async (interaction) => {
              const voters =
                cachedPollData.get(interaction.customId)?.voters ?? [];
              const oldKey = cachedPollData.findKey((pollData) =>
                pollData.voters.includes(interaction.user),
              );
              const oldData = cachedPollData.get(
                oldKey ?? cachedPollData.firstKey() ?? '',
              );
              return !(interaction.channel instanceof TextChannel) ||
                !message.embeds[0] ||
                !(interaction.message instanceof Message)
                ? Promise.reject(new Error('cannot find original poll embed.'))
                : voters.includes(interaction.user)
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
                                    oldKey ? voter !== interaction.user : true,
                                  ) ?? [],
                              })
                              .set(interaction.customId, {
                                count:
                                  (cachedPollData.get(interaction.customId)
                                    ?.count ?? 0) + 1,
                                voters: [...voters, interaction.user] ?? [],
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
                          )
                          .addField(
                            'test',
                            encodeURI(
                              `https://quickchart.io/chart?c= ${JSON.stringify({
                                type: 'bar',
                                labels: [
                                  await this.getPollQuestion(commandArguments),
                                  'yo',
                                  'hi',
                                  'whats good',
                                ],
                                data: {
                                  datasets: cachedPollData.map(
                                    (_value, key) => ({
                                      label: key,
                                      data: [20, 30, 40],
                                    }),
                                  ),
                                },
                              })}`,
                            ),
                          )
                          .addField(
                            'plain test',
                            `https://quickchart.io/chart?c= ${JSON.stringify({
                              type: 'bar',
                              labels: [
                                await this.getPollQuestion(commandArguments),
                              ],
                              data: cachedPollData.map((_value, key) => ({
                                label: key,
                                data: [50],
                              })),
                            })}`,
                          ),
                      ],
                    })
                    .then(() =>
                      interaction.reply({
                        content: `You voted for ${interaction.customId}!`,
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

  private readonly getPollQuestion = async function parseMessageForPollFunction(
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
          .join(' ')
          .trim(),
      )
      .then(
        (processedString) =>
          `${processedString}${processedString.includes('?') ? '' : '?'}`,
      );
  };
}
