ARG NODE_VERSION

FROM node:${NODE_VERSION}-bookworm-slim

SHELL ["/bin/bash", "-l", "-c"]

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    git \
    unzip && \
    rm -rf /var/lib/apt/lists/*

ARG BUN_VERSION="1.3.12"
RUN curl -fsSL "https://github.com/oven-sh/bun/releases/download/bun-v${BUN_VERSION}/bun-linux-x64.zip" -o /tmp/bun.zip && \
    unzip /tmp/bun.zip -d /tmp && \
    mv /tmp/bun-linux-x64/bun /usr/local/bin/bun && \
    chmod +x /usr/local/bin/bun && \
    rm -rf /tmp/bun.zip /tmp/bun-linux-x64

WORKDIR /repo
ENV RUNNER_TEMP="/tmp"

CMD [ "bash" ]
