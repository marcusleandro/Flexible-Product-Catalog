FROM node:18.15.0

COPY package.json yarn.lock /var/rws-api/

WORKDIR /var/rws-api

RUN yarn install

COPY . /var/rws-api

EXPOSE 4000

CMD ["npm", "run", "dev"]
