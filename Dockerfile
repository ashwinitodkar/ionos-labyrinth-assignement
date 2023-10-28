FROM node:alpine as base
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm i npm@latest -g && npm install
RUN npm -v && ls
RUN npm i -g nodemon
EXPOSE 8088
ARG APP_ENV
ENV APP_ENV ${APP_ENV}
CMD ["nodemon", "index.js"]
