# Hubber

- [Introduction](#introduction)
- [Build](#build-setup)
- [Purpose](#purpose)
- [Environment](#test-environment)
- [Todo](#todo)

## Introduction

An application for managing the settings of a Gaia Hub. 

The references for this application are;

1. General background - [Blockstack](https://blockstack.org) 
2. Application spec, see [this forum post](https://forum.blockstack.org/t/help-wanted-makers-gaia-administration-application/6798) 
3. The [Gaia Admin Service](https://github.com/blockstack/gaia/tree/develop/admin) specification (currently on on the develop branch).
4. The [Gaia Hub](https://github.com/blockstack/gaia/tree/master) specification.

The test application is [gaia_admin.brightblock.org](https://gaia_admin.brightblock.org/#/).

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

## Purpose

Works with the Gaia Admin Service to configure and reload a Gaia Hub. The Gaia Admin Service is a small server 
side component which is colocated with the users Gaia Hub.

Given the location (URL) of a users gaia hub admin service and an API key this application talks to the
Admin Services API end points to manage the hub.

## Prerequisites

User must be logged in with a blockstack id to use this application (strictly this is only required for testing the
operation of the new Gaia settings).

The blockstack setting [here](http://localhost:8888/account/api) for "URL for Gaia Hub Connection" must be set to the url of the users
Gaia Hub in this case - https://gaia_hub.brightblock.org.

To test you need to have the Admin Service running - see next section.

## Test Environment

This applciation has been built using a cloud hosted Debian stretch VM with services running directly or via 
docker containers.

The Gaia end points are proxied via nginx web server which also terminates ssl. 

The end points for the hub and admin service are;

```
https://gaia_hub.brightblock.org/hub_info

https://gaia_sidecar.brightblock.org
```

Gaia Admin Service running as a node js application (from the develop branch of the Gaia Hub github repository).

```
nohup node $HUB_HOME/admin/lib/index.js /tmp/gaia-admin.json &
API_KEY=potatoes
```

Gaia Hub running via docker;

```
docker run -d --restart=always -v $HUB_HOME/hub/config.json:/src/hub/config.json -p 3000:3000 -e CONFIG_PATH=/src/hub/config.json quay.io/blockstack/gaia-hub:latest
```
 

Given the location (URL) of a users gaia hub admin service and an API key this application talks to the
Admin Services API end points to manage the hub.

## Todo

The following are needed before this is ready for production..

1. Review against Blockstack functional requirements.
2. Form validation and use of vuelidate.
2. Testing (unit, e2e and manual testing is required)
