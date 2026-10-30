FROM node:alpine as dev
WORKDIR /app
ENV DOCKER_BUILDKIT=1
ENV NODE_ENV=development
COPY package.json .
RUN npm i
COPY . .
CMD ["npm", "run", "dev"]

# FROM node:alpine as builder
# ARG VITE_GOOGLE_CLIENT_ID
# WORKDIR /app
# ENV NODE_ENV=production
# COPY package.json .
# # RUN npm ci
# RUN npm i
# COPY . .
# RUN npm run build

FROM nginx as prod
WORKDIR /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d
# COPY /app/dist .
# COPY --from=builder /app/dist .
CMD ["nginx", "-g", "daemon off;"]    

# FROM nginx as prod
# WORKDIR /usr/share/nginx/html
# COPY ./dist .
# COPY ./default.conf /etc/nginx/conf.d
# CMD ["nginx", "-g", "daemon off;"]    
# COPY --from=builder /app/dist /usr/share/nginx/html
# COPY --from=builder /home/node/app/dist /usr/share/nginx/html

# FROM base as dev
# FROM node:alpine as base
# COPY --chown=node:node . .
# COPY package.json .
# COPY package-lock.json .
# # COPY package*.json .
# # COPY --chown=node:node ./package*.json .
# # ENV PATH /home/node/app/node_modules/.bin:$PATH

# FROM base as builder
# ENV NODE_ENV=production
# COPY . .
# RUN npm ci  
# RUN npm run build 