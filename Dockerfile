FROM node:20.12-alpine3.19 AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

FROM node:20.12-alpine3.19 AS production

# RUN apk add --no-cache tzdata

# ENV TZ=Asia/Bangkok

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app ./

EXPOSE 8001

CMD [ "node", "app.js" ]

# FROM node:18-alpine

# WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm ci --cache .npm --prefer-offline
# # Building your code for production
# # RUN npm ci --only=production
# # Bundle app source
# COPY . .

# EXPOSE 8001

# CMD [ "node", "app.js" ]
