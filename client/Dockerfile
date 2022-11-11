FROM node:18.4.0-alpine

COPY ["./package.json", "./yarn.lock", "/usr/src/"]

WORKDIR /usr/src

RUN yarn

COPY ["./", "/usr/src/"]

EXPOSE 3000

CMD ["yarn", "start"]

#FROM node:18.4.0-alpine

## Add the following lines
#ENV CI=true
#ENV WDS_SOCKET_PORT=0
#
#WORKDIR /app
#COPY package.json ./
#RUN npm install
#COPY ./ ./
#
#CMD ["npm", "start"]
