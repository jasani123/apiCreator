FROM node:latest

MAINTAINER <Hetal>

RUN npm update

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . /usr/src/app

ADD config.json   /usr/share/api-creator/

ADD deploy.sh /usr/src/app

RUN npm install

EXPOSE 3000

RUN curl -L https://github.com/docker/machine/releases/download/v0.10.0/docker-machine-`uname -s`-`uname -m` >/tmp/docker-machine
 
RUN chmod +x /tmp/docker-machine

#RUN sudo cp /tmp/docker-machine /usr/local/bin/docker-machine

ENTRYPOINT ["node","server.js"]