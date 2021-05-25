FROM node:current-alpine

RUN apk update

WORKDIR /opt/build/safire

COPY . .

RUN npm install npm@latest -g

RUN npm install

RUN npm run build

RUN rm -rf src

ENTRYPOINT [ "npm", "start" ]
