#!/bin/bash

cd /home/ubuntu/JIR3D/
docker-compose -f docker-compose.prod.yml up -d --build

exit 0