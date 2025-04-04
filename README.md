# superAgro

# for sync table with prisma client

`npx prisma generate`

# to deploy all migration

`npx prisma migrate deploy`

# to create migration

`npx prisma migrate dev --name migration_name`

docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
docker start redis-stack
