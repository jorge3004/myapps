https://www.youtube.com/watch?v=ZYq3NJnO08U
git push --recurse-submodules=on-demand
git clone --recurse-submodules --remote-submodules git@github.com:jorge3004/JIR3D.git
git clone --recurse-submodules git@github.com:jorge3004/JIR3D.git
git submodule foreach 'git checkout master'
git submodule update --recursive --remote
git submodule update --recursive

git config -f .gitmodules submodule.<path>.branch <branch>
https://stackoverflow.com/questions/1777854/how-can-i-specify-a-branch-tag-when-adding-a-git-submodule/18799234#18799234

git fetch --all
git branch backup-master //optional for backup
git reset --hard origin/master

ssh-keygen

Docker + ReactJS tutorial: Development to Production workflow + multi-stage builds + docker compose
https://www.youtube.com/watch?v=3xDAU5cvi5E

https://www.youtube.com/watch?v=eiTivLeIkm0
https://github.com/evertramos/nginx-proxy-automation
git clone --recurse-submodules https://github.com/evertramos/nginx-proxy-automation.git proxy
cd proxy/bin && ./fresh-start.sh --yes -e jorgeluis.rivera01@outlook.com --skip-docker-image-check

systemctl reload nginx

ssh ubuntu@REDACTED_HOST

HOSTGATOR
git init
git remote add origin ssh://REDACTED_USER@REDACTED_HOST/REDACTED_PATH/puebla.jir3d.com.mx
git remote add origin ssh://REDACTED_USER@REDACTED_HOST/REDACTED_PATH/api.puebla.jir3d.com.mx

git remote add cpanel ssh://REDACTED_USER@REDACTED_HOST/REDACTED_PATH/public_html
git remote add cpanel ssh://REDACTED_USER@REDACTED_HOST/REDACTED_PATH/api.jir3d.com.mx

git push -u origin master -f

docker-compose up --force-recreate --build --remove-orphans -d

https://javascript.plainenglish.io/step-by-step-guide-to-dockerize-react-app-created-using-vite-90772423f7fb

https://askubuntu.com/questions/730754/how-do-i-show-the-git-branch-with-colours-in-bash-prompt
https://digitalfortress.tech/tutorial/setting-up-git-prompt-step-by-step/

https://stackoverflow.com/questions/64221861/an-error-failed-to-solve-with-frontend-dockerfile-v0

https://jlelse.blog/dev/using-windows-3 #alpine in windows
https://docs.docker.com/desktop/windows/wsl/

[ec2-user@ip-172-31-5-145 JIR3D]$ docker-compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ -d adminer.jir3d.com
Creating jir3d_certbot_run ... done
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Requesting a certificate for adminer.jir3d.com

Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/adminer.jir3d.com/fullchain.pem
Key is saved at: /etc/letsencrypt/live/adminer.jir3d.com/privkey.pem
This certificate expires on 2023-06-27.
These files will be updated when the certificate renews.

NEXT STEPS:

- The certificate will need to be renewed before it expires. Certbot can automatically renew the certificate in the background, but you may need to take steps to enable that functionality. See https://certbot.org/renewal-setup for instructions.

---

If you like Certbot, please consider supporting our work by:

- Donating to ISRG / Let's Encrypt: https://letsencrypt.org/donate
- Donating to EFF: https://eff.org/donate-le

---

mysql -u jirdcom_USER -p
mysql -u jirdcom_USER -p REDACTED
SET GLOBAL sql_mode = '';

Create node_modules  
Run `mkdir -p $(pwd)/node_modules && sudo chmod o+w ./node_modules/ -R`  
Run: `docker run --rm -u "$(id -u):$(id -g)" -v $(pwd):/home/node/app -w /home/node/app node:alpine yarn install`

<!-- Run: `docker run --rm -u "$(id -u):$(id -g)" -v $(pwd):/home/node/app -w /home/node/app node:14.20.0-alpine3.15 yarn install` -->

Run `docker-compose up -d`

https://laravel.com/docs/10.x/sail#installing-composer-dependencies-for-existing-projects
