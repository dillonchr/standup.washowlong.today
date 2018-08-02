FROM mhart/alpine-node:10.7.0 as build
WORKDIR /code/
RUN npm i -g parcel-bundler
COPY package*.json ./
RUN npm i > /dev/null
COPY . .
RUN npm run build

FROM bitnami/nginx:1.14.0-debian-9
COPY --from=build /code/dist/. /app/
