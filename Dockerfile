FROM golang:1.25.1-alpine AS builder

WORKDIR /app

COPY ./ /app

RUN go build -o tanks . && chmod +x ./tanks

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app .

EXPOSE 8080

CMD [ "./tanks" ]