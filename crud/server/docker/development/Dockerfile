FROM node:16

WORKDIR /app

ENV NODE=${NODE_ENV}

COPY . .

RUN yarn

EXPOSE 5000

CMD [ "yarn", "dev" ]
