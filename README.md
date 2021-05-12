# product-review-service

# Prequisites

The NPM script assumes that the pm2 installed globally using either of the below commands  <br />
$ npm install pm2@latest -g
# or
$ yarn global add pm2

# Start the server in high availability mode:
PM2 is used to spawn multiple web servers in cluster mode within a single machine / server. For network level load balancing HA Proxy or AWS Elastic Load Balancing can be looked into.

$ npm run start:prod

# Start the server in a single instance

$ npm start

# Start the server in developer mode

$ npm run serve
