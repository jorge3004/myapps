#!/bin/bash

docker-compose down
# git submodule update --recursive --remote
cd /home/ubuntu/JIR3D
docker-compose -f docker-compose.prod.yml up -d
# echo "hhh"

exit 0