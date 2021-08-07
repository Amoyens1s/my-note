# Containers

## Running containers
```bash
docker run <image>
docker run -d <image> # run in the background
docker run —name <name> <image> # to give a custom name 
docker run —p 3000:3000 <image> # to publish a port HOST:CONTAINER
```

## Viewing the logs
```bash
docker logs <containerID>
docker logs -f <containerID> # to follow the log
docker logs —t <containerID> # to add timestamps
docker logs —n 10 <containerID> # to view the last 10 lines
```

## Executing commands in running containers
```bash
docker exec <containerID> <cmd>
docker exec -it <containerID> sh # to start a shell 
```

## Listing containers
```bash
docker ps # to list running containers
docker ps -a # to list all containers
```

## Starting and stopping containers
```bash
docker stop <containerID> 
docker start <containerID>
```

## Removing containers
```bash
docker container rm <containerID> 
docker rm <containerID> 
docker rm -f <containerID> # to force the removal
docker container prune # to remove stopped containers
```

## Volumes
```bash
docker volume ls
docker volume create app-data
docker volume inspect app-data
docker run -v app-data:/app/data <image>
```

## Copying files between the host and containers
```bash
docker cp <containerID>:/app/log.txt .
docker cp secret.txt <containerID>:/app
```

## Sharing source code with containers
```bash
docker run -v $(pwd):/app <image>
```