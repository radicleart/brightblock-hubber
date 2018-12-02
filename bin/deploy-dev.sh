#!/bin/bash -e
#
############################################################

printf "\n\nBuild a local snapshot of the UI gateway component.\n";
printf "\n-----------------------------------------------------------------------------------------------------\n";
printf "\t1. Jenkins pulls code from git (prior to this script).\n";
printf "\t2. Jenkins creates dist folder - npm run build (prior to this script).\n";
printf "\t3. Jenkins copies dist folder to brightblock-docker/brightblock/nginx.\n";
printf "\t4. Jenkins builds the nginx image.\n";

DOCKER_COMPOSE_CMD='sudo /usr/local/bin/docker-compose'
DOCKER_ID_USER='mijoco'
DOCKER_CMD='sudo /usr/bin/docker'
DOCKER_HOME=/var/jenkins_home/brightblock/brightblock-docker/brightblock
ls -lt dist
cp -r dist/* $DOCKER_HOME/nginx/www/brightblock-ui

pushd $DOCKER_HOME > /dev/null

$DOCKER_CMD ps -a
$DOCKER_COMPOSE_CMD down nginx | printf "\nContainers not up\n"
$DOCKER_COMPOSE_CMD build nginx
$DOCKER_COMPOSE_CMD up nginx | printf "\nContainers not up\n"

#$DOCKER_CMD ps -a
#$DOCKER_COMPOSE_CMD build
#$DOCKER_CMD tag brightblock_nginx  $DOCKER_ID_USER/brightblock_nginx
#$DOCKER_CMD push $DOCKER_ID_USER/brightblock_nginx
#$DOCKER_COMPOSE_CMD restart nginx

popd > /dev/null

printf "Finished brightblock-dcms nginx build and deployment.\n"
printf "\n-----------------------------------------------------------------------------------------------------\n";

exit 0;

# old deployment where code was loaded from volume rather than baked into images..
#SERVER=$1
#DEPLOY_SERVER=$SERVER:/home/bob/deployment/brightblock-ui
#ssh -i ~/.ssh/id_rsa -p 7019 bob@$SERVER "
#	mkdir -p /home/bob/deployment/brightblock-ui
#";
#rsync -aP --quiet -e "ssh -p 7019" dist/ bob@$DEPLOY_SERVER
#ssh -i ~/.ssh/id_rsa -p 7019 bob@$SERVER "
#	rsync -aP --quiet  /home/bob/deployment/brightblock-ui/  rsync://localhost:10873/volume/deployments/nginx/html/brightblock-ui
#";
