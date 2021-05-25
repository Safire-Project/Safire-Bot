// https://github.com/discordjs/discord.js/issues/3576#issuecomment-625197611

// eslint-disable-next-line header/header
import {
  Client,
  Guild,
  Channel,
  GuildChannel,
  TextChannel,
  User,
  GuildMember,
  Message,
} from 'discord.js';

export default class MockDiscord {
  // eslint-disable-next-line functional/prefer-readonly-type
  private client!: Client;

  // eslint-disable-next-line functional/prefer-readonly-type
  private guild!: Guild;

  // eslint-disable-next-line functional/prefer-readonly-type
  private channel!: Channel;

  // eslint-disable-next-line functional/prefer-readonly-type
  private guildChannel!: GuildChannel;

  // eslint-disable-next-line functional/prefer-readonly-type
  private textChannel!: TextChannel;

  // eslint-disable-next-line functional/prefer-readonly-type
  private user!: User;

  // eslint-disable-next-line functional/prefer-readonly-type
  private guildMember!: GuildMember;

  // eslint-disable-next-line functional/prefer-readonly-type
  public message!: Message;

  constructor() {
    this.mockClient();
    this.mockGuild();
    this.mockChannel();
    this.mockGuildChannel();
    this.mockTextChannel();
    this.mockUser();
    this.mockGuildMember();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.guild.addMember(this.user, { accessToken: 'mockAccessToken' });
    this.mockMessage();
  }

  public getClient(): Client {
    return this.client;
  }

  public getGuild(): Guild {
    return this.guild;
  }

  public getChannel(): Channel {
    return this.channel;
  }

  public getGuildChannel(): GuildChannel {
    return this.guildChannel;
  }

  public getTextChannel(): TextChannel {
    return this.textChannel;
  }

  public getUser(): User {
    return this.user;
  }

  public getGuildMember(): GuildMember {
    return this.guildMember;
  }

  public getMessage(): Message {
    return this.message;
  }

  // eslint-disable-next-line functional/no-return-void
  private mockClient(): void {
    // eslint-disable-next-line functional/immutable-data
    this.client = new Client();
  }

  // eslint-disable-next-line functional/no-return-void
  private mockGuild(): void {
    // eslint-disable-next-line functional/immutable-data
    this.guild = new Guild(this.client, {
      unavailable: false,
      id: 'guild-id',
      name: 'mocked js guild',
      icon: 'mocked guild icon url',
      splash: 'mocked guild splash url',
      region: 'eu-west',
      member_count: 42,
      large: false,
      features: [],
      application_id: 'application-id',
      afkTimeout: 1000,
      afk_channel_id: 'afk-channel-id',
      system_channel_id: 'system-channel-id',
      embed_enabled: true,
      verification_level: 2,
      explicit_content_filter: 3,
      mfa_level: 8,
      joined_at: new Date('2018-01-01').getTime(),
      owner_id: 'owner-id',
      channels: [],
      roles: [],
      presences: [],
      voice_states: [],
      emojis: [],
    });
  }

  // eslint-disable-next-line functional/no-return-void
  private mockChannel(): void {
    // eslint-disable-next-line functional/immutable-data
    this.channel = new Channel(this.client, {
      id: 'channel-id',
    });
  }

  // eslint-disable-next-line functional/no-return-void
  private mockGuildChannel(): void {
    // eslint-disable-next-line functional/immutable-data
    this.guildChannel = new GuildChannel(this.guild, {
      ...this.channel,

      name: 'guild-channel',
      position: 1,
      parent_id: '123456789',
      permission_overwrites: [],
    });
  }

  // eslint-disable-next-line functional/no-return-void
  private mockTextChannel(): void {
    // eslint-disable-next-line functional/immutable-data
    this.textChannel = new TextChannel(this.guild, {
      ...this.guildChannel,

      topic: 'topic',
      nsfw: false,
      last_message_id: '123456789',
      lastPinTimestamp: new Date('2019-01-01').getTime(),
      rate_limit_per_user: 0,
    });
  }

  // eslint-disable-next-line functional/no-return-void
  private mockUser(): void {
    // eslint-disable-next-line functional/immutable-data
    this.user = new User(this.client, {
      id: 'user-id',
      username: 'user username',
      discriminator: 'user#0000',
      avatar: 'user avatar url',
      bot: false,
    });
  }

  // eslint-disable-next-line functional/no-return-void
  private mockGuildMember(): void {
    // eslint-disable-next-line functional/immutable-data
    this.guildMember = new GuildMember(
      this.client,
      {
        deaf: false,
        mute: false,
        self_mute: false,
        self_deaf: false,
        session_id: 'session-id',
        channel_id: 'channel-id',
        nick: 'nick',
        joined_at: new Date('2020-01-01').getTime(),
        user: this.user,
        roles: [],
      },
      this.guild,
    );
  }

  // eslint-disable-next-line functional/no-return-void
  private mockMessage(): void {
    // eslint-disable-next-line functional/immutable-data
    this.message = new Message(
      this.client,
      {
        id: 'message-id',
        type: 'DEFAULT',
        content: 'this is the message content',
        author: this.user,
        webhook_id: undefined,
        member: this.guildMember,
        pinned: false,
        tts: false,
        nonce: 'nonce',
        embeds: [],
        attachments: [],
        edited_timestamp: undefined,
        reactions: [],
        mentions: [],
        mention_roles: [],
        mention_everyone: [],
        hit: false,
      },
      this.textChannel,
    );
  }
}
