FROM golang:1.24.5-alpine3.22

WORKDIR /app

COPY ./ /app

EXPOSE 8080

CMD [ "go", "run", "." ]