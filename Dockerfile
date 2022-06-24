FROM node:lts-stretch-slim

WORKDIR /usr/src/app
COPY . .
ENV TZ=Europe/Rome
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN npm install
RUN npm install -g typescript
RUN tsc
CMD ["node", "index.js"]
