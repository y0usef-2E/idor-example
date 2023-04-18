FROM golang:latest 

WORKDIR /app

COPY . .

RUN apt-get update --yes --quiet && apt-get upgrade --yes --quiet 
RUN apt-get install --yes --quiet  --no-install-recommends \
    sqlite3 


RUN go build -o ./idor-example-api  

EXPOSE 8000
CMD ./idor-example-api