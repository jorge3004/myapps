# RUN mkdir -p /home/node/app/node_modules && chmod o+w -R /home/node/app/node_modules
# COPY ./package.json ./yarn.lock ./ 
# RUN yarn install
FROM node:alpine as dev
WORKDIR /home/node/app
COPY . .
# CMD [ "yarn", "dev" ]
