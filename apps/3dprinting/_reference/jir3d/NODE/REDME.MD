Create node_modules  
Run `mkdir -p $(pwd)/node_modules && sudo chmod o+w ./node_modules/ -R`  
Run: `docker run --rm -u "$(id -u):$(id -g)" -v $(pwd):/home/node/app -w /home/node/app node:alpine npm install`

<!-- Run: `docker run --rm -u "$(id -u):$(id -g)" -v $(pwd):/home/node/app -w /home/node/app node:14.20.0-alpine3.15 yarn install` -->

Run `docker-compose up -d`

https://laravel.com/docs/10.x/sail#installing-composer-dependencies-for-existing-projects
