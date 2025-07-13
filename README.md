# tanks

A tech demo of a js - golang stack for building simple 2D multiplayer games.

This project is heavily inspired by TankTrouble. It currently only supports singleplayer mode but multiplayer is comming very soon.

## Instalation instructions

### Requirements

- npm/docker
- golang/docker

### Instructions

1. Clone the repository
2. Build the typescript files
   - 2a (with docker) run the `build.sh` script or the command inside
   - 2b (native npm) run `npm install --no-save && npx tsc` in the game folder
3. Run the golang server
   - 3a (with docker) run `docker compose up`
   - 3b (native golang) run `go run .` or compile and run `go build . && ./tanks`
4. Connect on localhost:8080
