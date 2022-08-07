FROM node:18.4.0-alpine

COPY ["./package.json", "./yarn.lock", "/usr/src/"]

WORKDIR /usr/src

RUN yarn

COPY ["./", "/usr/src/"]

EXPOSE 4000

CMD ["yarn", "start"]
