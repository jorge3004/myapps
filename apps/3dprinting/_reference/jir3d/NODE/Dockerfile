# FROM node:latest as dev
FROM node:alpine as dev
# ENV DOCKER_BUILDKIT: 1
# ENV NODE_ENV=development
WORKDIR /app
# COPY package.json .
#enable typescript
# RUN npm i -g typescript && npm i 
# RUN npm i -g nodemon && npm i
COPY . .
# CMD ["npm", "start"]
ENTRYPOINT ["tail", "-f", "/dev/null"]
# CMD ["sleep", "infinity"]

# FROM node:alpine as prod
# WORKDIR /app
# COPY package.json .
# ENV NODE_ENV=production
# COPY . .
# RUN npm ci --omit=dev
# CMD ["node", "app.js"]


# FROM node:alpine as base
# WORKDIR /app
# COPY package.json .
# ENV DOCKER_BUILDKIT: 1

# FROM base as prod

# COPY --chown=node:node . .
# ENV PATH /home/node/app/node_modules/.bin:$PATH
# COPY --chown=node:node ./package*.json .
# COPY package*.json .
# COPY package-lock.json .
# ENV DEBUG=nodejs-docker-express:*
# WORKDIR /home/node/app
# FROM base as dev
# # COPY --chown=node:node . .
# RUN npm i -g nodemon && npm i




# FROM node:alpine as base
# WORKDIR /app
# # WORKDIR /home/node/app
# # ENV PATH /home/node/app/node_modules/.bin:$PATH
# # COPY --chown=node:node ./package*.json .
# # ENV DEBUG=nodejs-docker-express:*
# COPY package.json .
# COPY package-lock.json .
# # COPY package*.json .
# ENV DOCKER_BUILDKIT: 1

# FROM base as prod
# ENV NODE_ENV=production
# COPY . .
# # COPY --chown=node:node . .
# RUN npm ci --omit=dev
# CMD ["node", "app.js"]

# FROM base as dev
# ENV NODE_ENV=development
# COPY . .
# # COPY --chown=node:node . .
# RUN npm i -g nodemon && npm i
# CMD ["npm", "start"]
