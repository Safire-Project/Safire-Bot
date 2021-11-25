/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types, header/header */
/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

// TODO Change buttons to messageID-answerIndex-multipoll-barType serials so that we do zero caching,
// ? Consider postgres for entire bot here
// *CustomIDs limited to 100 characters - So we need to programmatically ensure that limit is not overcome -> good reason to use postgres
// TODO Move handler logic to listeners/Polling/poll-button-interaction.ts
// TODO Allow up to 25 options
// TODO Add flag for different graph types
// TODO Add flag for timeout to remove buttons/close poll
// eslint-disable-next-line write-good-comments/write-good-comments
// TODO Add flag to allow for multiple answers

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
  EmbedFieldData,
} from 'discord.js';
import { Args, PieceContext } from '@sapphire/framework';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { right } from 'fp-ts/lib/Either';
import { TOPICS, EVENTS } from '../../lib/logger';

import SafireCommand, { SafireEither } from '../../lib/types/safire-command';
import SafireResult from '../../lib/types/safire-result';
import client from '../../bot';
import { backgroundPlugin } from '../../lib/chartjs-plugin/chartjs-plugin-background';

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
    chartBarBackgrounds: ['rgba(0,204,0,0.2)', 'rgba(255,0,0,0.2)'],
    chartBarBorders: ['rgb(0,204,0)', 'rgb(255,0,0)'],
  };

  private readonly timeout = 360_000_000;

  private readonly delimiter = '|';

  private readonly pollCache = new Collection<
    string,
    Collection<string, ReadonlyArray<User>>
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

  public readonly messageRun = async function runCommandOnMessage(
    this: PollCommand,
    message: Message,
    commandArguments: Args,
  ): Promise<SafireEither> {
    const parsedAnswers = (await commandArguments.start().rest('string'))
      // eslint-disable-next-line unicorn/no-await-expression-member
      .split(this.delimiter)
      .slice(1)
      .map((answer) => answer.trim());
    // eslint-disable-next-line unicorn/no-await-expression-member
    return !(await commandArguments.start().peekResult('string')).success
      ? Promise.reject(new Error('You need to provide a poll question.'))
      : this.getPollQuestion(commandArguments)
          .then(async (pollQuestionString) =>
            this.pollCache.set(
              `${pollQuestionString}-${message.id}`,
              new Collection(
                parsedAnswers.length > 0
                  ? parsedAnswers.map((answer) => [answer, []])
                  : this.defaultOptions.fields.map((field) => [field.name, []]),
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
          .then((pollQuestion) =>
            right(new SafireResult(`Poll Published: ${pollQuestion}`)),
          );
  };

  private readonly handlePollCloser = async function handlePollCloseEvent(
    this: PollCommand,
    message: Message,
    interactionCollector: Collection<string, MessageComponentInteraction>,
    commandArguments: Args,
    salt: Snowflake,
  ): Promise<void> {
    return (
      message
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
        // eslint-disable-next-line functional/no-return-void
        .then(() =>
          this.container.logger.info(
            `Poll collected ${interactionCollector.size} results`,
            TOPICS.POLL,
            EVENTS.FINISH,
          ),
        )
    );
  };

  private readonly applyCollector =
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
              const voters = cachedPollData.get(interaction.customId) ?? [];
              const oldKey = cachedPollData.findKey((pollData) =>
                pollData.includes(interaction.user),
              );
              const oldData = cachedPollData.get(
                oldKey ?? cachedPollData.firstKey() ?? '',
              );
              const organizedPollData = cachedPollData
                .clone()
                .set(
                  oldKey ?? cachedPollData.firstKey() ?? '',
                  oldData?.filter((voter) =>
                    oldKey ? voter !== interaction.user : true,
                  ) ?? [],
                )
                .set(interaction.customId, [...voters, interaction.user] ?? []);
              const organizedEmbed = this.embedFromPollData(
                message,
                organizedPollData,
              );
              const imageCache = await this.drawNewPoll(
                organizedPollData,
                commandArguments,
              );
              const finalEmbed = organizedEmbed.setImage(
                imageCache ? imageCache.attachments.first()?.url ?? '' : '',
              );
              return this.sendFeedback(interaction, voters, finalEmbed);
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

  private readonly embedFromPollData =
    function generateEmbedFromOrganizedPollData(
      this: PollCommand,
      message: Message,
      organizedPollData: Collection<string, readonly User[]>,
    ): MessageEmbed {
      return new MessageEmbed(message.embeds[0])
        .spliceFields(0, message.embeds[0]?.fields.length ?? 0)
        .addFields(this.answerFieldsGenerator(organizedPollData));
    };

  private readonly sendFeedback = function sendEmbedOrFeedbackToOriginalChannel(
    interaction: MessageComponentInteraction,
    voters: readonly User[],
    finalEmbed: MessageEmbed,
  ): void | PromiseLike<void> {
    return !(interaction.message instanceof Message)
      ? Promise.reject(new Error('cannot find original poll embed.'))
      : voters.includes(interaction.user)
      ? interaction.reply({
          content: 'You already voted this way!',
          ephemeral: true,
        })
      : interaction.message
          .edit({
            embeds: [finalEmbed],
          })
          .then(() =>
            interaction.reply({
              content: `You voted for ${interaction.customId}!`,
              ephemeral: true,
            }),
          );
  };

  private readonly drawNewPoll = async function generateChartGraphics(
    this: PollCommand,
    organizedPollData: Collection<string, readonly User[]>,
    commandArguments: Args,
  ): Promise<Message | undefined> {
    const imageCacheChannel = await client.channels.fetch(
      process.env['imageCacheChannel'] ?? '',
    );
    return imageCacheChannel && imageCacheChannel instanceof TextChannel
      ? imageCacheChannel.send({
          files: [
            {
              name: 'image.png',
              attachment: new ChartJSNodeCanvas({
                width: 1280,
                height: 720,
                plugins: {
                  modern: [backgroundPlugin],
                },
              }).renderToStream(
                {
                  type: 'bar',
                  data: {
                    labels: [...organizedPollData.keys()],
                    datasets: [
                      {
                        data: organizedPollData.map(
                          (pollData) => pollData.length,
                        ),
                        label: new Date().toLocaleTimeString(),
                        backgroundColor:
                          organizedPollData.size === 2
                            ? this.defaultOptions.chartBarBackgrounds
                            : [...organizedPollData.keys()].map(
                                (_value, index, array) =>
                                  `hsl(${
                                    index * (320 / (array.length - 1))
                                  }, 80%, 25%)`,
                              ),
                        borderColor:
                          organizedPollData.size === 2
                            ? this.defaultOptions.chartBarBorders
                            : [...organizedPollData.keys()].map(
                                (_value, index, array) =>
                                  `hsl(${
                                    index * (320 / (array.length - 1))
                                  }, 100%, 50%)`,
                              ),
                        borderWidth: 8,
                      },
                    ],
                  },
                  options: {
                    scales: {
                      yAxes: {
                        ticks: { stepSize: 1, font: { size: 40 } },
                      },
                      xAxes: {
                        ticks: { font: { size: 50 } },
                      },
                    },
                    plugins: {
                      title: {
                        font: { size: 60 },
                        fullSize: true,
                        color: 'white',
                        padding: 20,
                        display: true,
                        text: await this.getPollQuestion(commandArguments),
                      },
                      legend: {
                        position: 'bottom',
                        labels: { boxHeight: 0, boxWidth: 0 },
                      },
                      background: {
                        chartBackgroundColor: 'black',
                      },
                    },
                  },
                },
                'image/png',
              ),
            },
          ],
        })
      : undefined;
  };

  private answerFieldsGenerator(
    organizedPollData: Collection<string, readonly User[]>,
    // eslint-disable-next-line functional/prefer-readonly-type
  ): EmbedFieldData[] {
    return organizedPollData.map((value, key) => ({
      name: `${key} - ${value.length}`,
      value: `${this.formatAnswerField(value, organizedPollData)}`,
    }));
  }

  private formatAnswerField(
    value: readonly User[],
    organizedPollData: Collection<string, readonly User[]>,
  ): string {
    return value.length === 0
      ? 'No Voters Yet.'
      : value.toLocaleString().slice(0, 1500 / organizedPollData.size);
  }
}

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types, header/header */
