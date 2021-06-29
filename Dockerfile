# SPDX-License-Identifier: MIT OR CC0-1.0
# Bryn (Safire Project)

FROM node:16.3.0-alpine3.13

WORKDIR /opt/build/safire

ENV NODE_ENV="development"

RUN apk update

COPY . .

RUN npm install

RUN npm run build || npm run buildWithoutChecks

RUN rm -rf src

ENTRYPOINT [ "npm" ]
CMD [ "start" ]
