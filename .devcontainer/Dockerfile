FROM ubuntu:latest
LABEL authors="mario"

# install patch
RUN apt-get update && apt-get install -y patch

ENTRYPOINT ["top", "-b"]
