FROM mhart/alpine-node:10.7.0 AS build
WORKDIR /code/
RUN apk update && apk upgrade && apk add git
RUN npm i -g parcel-bundler > /dev/null
COPY package*.json ./
RUN npm i > /dev/null
COPY . .
RUN npm run build

FROM nginx:1.15.3-alpine
COPY --from=build /code/dist/ /usr/share/nginx/html/
EXPOSE 80
