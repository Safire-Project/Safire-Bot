FROM node:16.2.0-alpine3.13

RUN apk update

WORKDIR /opt/build/safire

COPY . .

RUN npm install npm@latest -g

RUN npm install

RUN npm run build

RUN rm -rf src

ENTRYPOINT [ "npm" ]
CMD [ "start" ]
