FROM node:14.16.1

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
#install dependencies
COPY package.json /usr/src/app
RUN npm install
#bundle app src
COPY . /usr/src/app
EXPOSE 3000
CMD [ "npm" , "start" ]
