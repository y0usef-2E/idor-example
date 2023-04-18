FROM golang:latest 

WORKDIR /app

COPY . .

RUN apt-get update --yes --quiet && apt-get upgrade --yes --quiet 
RUN apt-get install --yes --quiet  --no-install-recommends \
    sqlite3 


RUN go build -o ./idor-example-api  

RUN rm test.db 
RUN rm -rd client 
RUN rm -rd local_scripts

CMD ./idor-example-api