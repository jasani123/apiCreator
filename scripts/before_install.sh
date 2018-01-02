#!/bin/bash

rm -rf /home/ec2-user/api-creator

echo "files removed..."

yum update -y

yum install -y nodejs npm --enablerepo=epel

npm install pm2 -g -y

touch /etc/yum.repos.d/mongodb-org-3.4.repo

echo "[mongodb-org-3.4]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/amazon/2013.03/mongodb-org/3.4/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-3.4.asc" > /etc/yum.repos.d/mongodb-org-3.4.repo

yum install -y mongodb-org

service mongod start

chkconfig mongod on


