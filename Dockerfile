FROM node:16-alpine AS base

ARG ENVFILE
ENV ENVFILE=$ENVFILE
ENV PORT=7000
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app
COPY . /app
COPY .docker/nginx /etc/nginx

RUN apk update && apk add --no-cache nginx libc6-compat

RUN yarn install --frozen-lockfile

RUN echo $ENVFILE | base64 -d > /app/.env.production
RUN yarn build

RUN mv /app/.next /app/.next-build

EXPOSE $PORT
CMD ["sh", "/app/init.sh"]
