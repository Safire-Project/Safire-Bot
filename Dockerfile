# SPDX-License-Identifier: MIT OR CC0-1.0
# Bryn (Safire Project)

FROM node:16.3.0-alpine3.13

RUN apk update

WORKDIR /opt/build/safire

COPY . .

RUN npm install --force

RUN npm run build

RUN rm -rf src

ENTRYPOINT [ "npm" ]
CMD [ "start" ]
