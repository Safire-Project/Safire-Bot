/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

export enum EVENTS {
  COMMAND_ACCEPTED = 'COMMAND_ACCEPTED',
  COMMAND_DENIED = 'COMMAND_DENIED',
  COMMAND_ERROR = 'COMMAND_ERROR',
  COMMAND_FINISHED = 'COMMAND_FINISHED',
  COMMAND_PRE_RUN = 'COMMAND_PRE_RUN',
  COMMAND_RUN = 'COMMAND_RUN',
  COMMAND_SUCCESS = 'COMMAND_SUCCESS',
  CONNECT = 'CONNECT',
  DEBUG = 'DEBUG',
  DESTROY = 'DESTROY',
  DISCONNECT = 'DISCONNECT',
  ERROR = 'ERROR',
  FINISH = 'FINISH',
  IDENTIFY = 'IDENTIFY',
  INIT = 'INIT',
  MESSAGE_BLOCKED = 'MESSAGE_BLOCKED',
  MUTE = 'MUTE',
  READY = 'READY',
  RECONNECTING = 'RECONNECTING',
  UNHANDLED_REJECTION = 'UNHANDLED_REJECTION',
  WARN = 'WARN',
}

export default EVENTS;
