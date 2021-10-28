# SPDX-License-Identifier: MIT OR CC0-1.0
# Bryn (Safire Project)

FROM node:17.0.1-alpine3.14

WORKDIR /opt/build/safire

ENV NODE_ENV="development"

RUN apk update

# Node Canvas Dependencies
RUN apk add --no-cache alpine-sdk build-base gcc python3 py3-pip pkgconfig pkgconf g++ cairo-dev jpeg-dev pango-dev giflib-dev

COPY . .

RUN npm install

RUN npm run build

RUN rm -rf src

ENTRYPOINT [ "npm" ]
CMD [ "start" ]
