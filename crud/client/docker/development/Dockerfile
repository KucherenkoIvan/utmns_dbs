FROM node:16 as dev
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile --silent && yarn cache clean --all
COPY . .

EXPOSE 3000

CMD yarn start
