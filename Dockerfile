FROM node:12-alpine as vui

RUN mkdir -p /app/vui
WORKDIR /app/vui

# install package
COPY package.json yarn.lock ./
RUN yarn install

# copy source code
COPY . ./

# build frontend
RUN yarn run build-storybook
# exit 0 to suppress build warning, if we can get rid of warning, we can remove it, this make build error not report in build process

# Lower build size
FROM node:12-alpine
WORKDIR /app
COPY --from=vui /app/vui/storybook-static ./storybook-static

# environment variable
EXPOSE 8080

CMD ["npx", "http-server", "./storybook-static"]
