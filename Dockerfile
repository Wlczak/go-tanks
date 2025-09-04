FROM golang:1.25.1-alpine AS builder

WORKDIR /app

COPY ./ /app

RUN go build . && chmod +x ./tanks

FROM alpine:latest

WORKDIR /app

COPY ./ /app

EXPOSE 8080

CMD [ "./tanks" ]