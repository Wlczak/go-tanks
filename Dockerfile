FROM golang:1.24.5-alpine3.22

WORKDIR /app

COPY ./ /app

CMD [ "go", "run", "." ]