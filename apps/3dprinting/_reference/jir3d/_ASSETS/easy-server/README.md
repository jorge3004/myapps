# JIR3D MODIFICATIONS:

## Update system

sudo apt-get update

## Install Git

sudo apt-get install git

## Set enviroment variables

sudo ./aliases/load.sh

sudo source ./aliases/.bash_aliases.sh

## /install/docker

sudo bash ./install/docker/install-docker.sh
sudo usermod -a -G docker ubuntu
id ubuntu

# Reload a Linux user's group assignments to docker w/o logout

newgrp docker

## /install/nginx-proxy

Modify NGINX_PROXY_EMAIL_ADDRESS=your.email@example.com --> jorgeluis.rivera01@outlook.com
Modify NGINX_PROXY_BASE_PATH=~/server/proxy/ --> /home/ubuntu/server/proxy/
sudo bash ./install/nginx-proxy/install-proxy.sh

# Easy Server :fire:

Linux scripts to automate simple tasks in new servers!

### Requirements

- apt
- sudo

### TODO

- [ ] Create install script for [CTOP](https://github.com/bcicen/ctop)
- [ ] Check implementation of [NGINX proxy manager](https://nginxproxymanager.com/)
