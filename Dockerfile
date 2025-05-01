FROM node:23.9-alpine3.20 as base
# Update
RUN apk add --no-cache libc6-compat
RUN apk update
# install pnpm
RUN wget -qO /bin/pnpm "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" && chmod +x /bin/pnpm
# configure pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base as frontdeps
COPY pnpm-workspace.yaml /app/pnpm-workspace.yaml
COPY pnpm-lock.yaml /app/pnpm-lock.yaml
COPY ./shared/package.json /app/shared/package.json
COPY ./client/package.json /app/client/package.json
COPY ./client/pnpm-lock.yaml /app/client/pnpm-lock.yaml

WORKDIR /app
RUN --mount=type=cache,target=${PNPM_HOME} echo "PNPM contents before install: $(ls -la ${PNPM_HOME})"
RUN --mount=type=cache,target=${PNPM_HOME} \
  pnpm config set store-dir ${PNPM_HOME} && \
  pnpm install --prefer-offline
RUN --mount=type=cache,target=${PNPM_HOME} echo "PNPM contents after install: $(ls -la ${PNPM_HOME})"

FROM frontdeps as front
ENV NODE_ENV=production
COPY ./shared /app/shared
RUN npm --prefix /app/shared run build

COPY ./client /app/client
RUN npm --prefix /app/client run build

FROM base as srvdeps
WORKDIR /app/
COPY pnpm-workspace.yaml pnpm-workspace.yaml
COPY ./shared/package.json shared/package.json
COPY ./server/package.json server/package.json
COPY ./server/pnpm-lock.yaml server/pnpm-lock.yaml

WORKDIR /app
RUN --mount=type=cache,target=${PNPM_HOME} echo "PNPM contents before install: $(ls -la ${PNPM_HOME})"
RUN --mount=type=cache,target=${PNPM_HOME} \
  pnpm config set store-dir ${PNPM_HOME} && \
  pnpm install --prefer-offline
RUN --mount=type=cache,target=${PNPM_HOME} echo "PNPM contents after install: $(ls -la ${PNPM_HOME})"

WORKDIR /app/server 
RUN pnpm install
WORKDIR /app/shared
RUN pnpm install

FROM base as production
ENV NODE_ENV=production
WORKDIR /app
COPY --from=front /app/client/build ./client/build
COPY --from=srvdeps /app/server ./server
COPY ./shared /app/shared
COPY ./server  /app/server

WORKDIR /app/shared
RUN pnpm install
RUN npm run build

WORKDIR /app/server
CMD npm run migrate && npm run start
