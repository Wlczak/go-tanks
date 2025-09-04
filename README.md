# GoTanks

A tech demo of a js - golang stack for building simple 2D multiplayer games.

This project is heavily inspired by TankTrouble. It currently only supports singleplayer mode but multiplayer is coming very soon.

## Installation instructions

### Requirements

- npm(v18.0+)/docker
- golang (1.25.1+)/docker

### Instructions

1. Clone the repository
2. Build the typescript files
   - 2a (with docker) run the `build.sh` script or the command inside
   - 2b (native npm) run `cd game && npm install --no-save && npx tsc`
3. Run the golang server
   - 3a (with docker) run `docker compose up`
   - 3b (native golang) run `go run .` or compile and run `go build . && ./tanks`
4. Connect on localhost:8080 (changing the port will be available in the future)
