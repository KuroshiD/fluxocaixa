up:
    docker compose up
    # docker-compose up -d

up-prod:
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up

down: 
    docker-compose down

logs:
    docker-compose logs

build:
    docker compose build