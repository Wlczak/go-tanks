FROM golang:1.25.4-alpine AS gobuild

WORKDIR /build

COPY ./ /build/

RUN go build -o tanks . && chmod +x ./tanks

FROM node:latest AS tsbuilder

WORKDIR /build

COPY ./game/ /build/

RUN npm install --no-save && npx tsc

FROM alpine:latest

WORKDIR /app

COPY ./ ./
COPY --from=gobuild /build/tanks ./
COPY --from=tsbuilder /build/dist/ ./game/dist/

EXPOSE 8080

CMD [ "./tanks" ]