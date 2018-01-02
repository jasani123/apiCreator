#!/bin/bash

ip=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

response=$(curl -H "Content-Type: application/json" -s -w '%{http_code}' -o /dev/null -X POST -d '{ "service" : "abc"

 : 2017 }' http://$ip:3000/api/healthcheck)

if [ "$response" == "201" ]
then
    exit 0
else
    exit 1
fi


