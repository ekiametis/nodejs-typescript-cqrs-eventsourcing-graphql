## Staege-0 BASE IMAGE
FROM node:12 AS base

## Stage-1 DEPENDENCIES
FROM base AS dependencies
WORKDIR /npm
COPY package* ./
RUN npm install


## Stage-2 RELEASE
FROM base AS release

ENV APP="/app"

WORKDIR $APP

### Source copy
COPY --from=dependencies /npm/ ./
COPY package.json ./  
COPY package-lock.json ./
COPY tsconfig.json ./
COPY src ./src
COPY entrypoint.sh ./entrypoint.sh

### NPM Build and clean folders
RUN npm run build
RUN rm -rf .src/ && \
    mv ./dist/* ./ && \
    rm -rf ./dist

ENTRYPOINT ["./entrypoint.sh"]