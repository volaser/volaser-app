#!/usr/bin/env bash
echo "Executing appcenter-post-clone.sh"

# Add Nexus Config for fetching npm packages
if [ -z "$NEXUS_URL" ]
then
    echo "You need define the NEXUS_URL environment variable in App Center"
    exit
fi

if [ -z "$NEXUS_AUTH_TOKEN" ]
then
    echo "You need define the NEXUS_AUTH_TOKEN environment variable in App Center"
    exit
fi

if [ -z "$NEXUS_EMAIL" ]
then
    echo "You need define the NEXUS_EMAIL environment variable in App Center"
    exit
fi

touch .npmrc
echo "registry=${NEXUS_URL}
always-auth=true
_auth=${NEXUS_AUTH_TOKEN}
email=[${NEXUS_EMAIL}]" > .npmrc

yarn install
yarn bundle