FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl procps

WORKDIR /home/node/app

COPY . .

RUN npm install --quiet --no-optional --loglevel=error

RUN npm run build

# CMD [ "npm", "run", "start:prod" ]

CMD [ "tail", "-f", "/dev/null"	 ]