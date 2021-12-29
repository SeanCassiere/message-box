up:
	docker-compose up -d

down: 
	docker-compose down

up-prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

up-debug:
	docker-compose -f docker-compose.yml -f docker-compose.debug.yml up -d