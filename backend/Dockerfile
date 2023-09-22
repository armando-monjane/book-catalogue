FROM node:lts AS development

# Create app directory
WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json

RUN apt-get -qy update && apt-get -qy install openssl

RUN npm ci

COPY .env.example .env

COPY . /usr/src/app

RUN npx prisma generate --schema ./prisma/schema.prisma

EXPOSE 5000

CMD [ "npm", "start" ]

FROM development as dev-envs
RUN <<EOF
apt-get update
apt-get install -y --no-install-recommends git
EOF

RUN <<EOF
useradd -s /bin/bash -m vscode
groupadd docker
usermod -aG docker vscode
EOF
# install Docker tools (cli, buildx, compose)
COPY --from=gloursdocker/docker / /
CMD [ "npm", "start" ]