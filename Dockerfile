FROM golang:1.25.1-alpine

WORKDIR /app

COPY ./ /app

EXPOSE 8080

CMD [ "go", "run", "." ]