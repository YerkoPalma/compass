FROM node:slim

LABEL "com.github.actions.name"="build"
LABEL "com.github.actions.description"="Build for old browsers"
LABEL "com.github.actions.icon"="gear"
LABEL "com.github.actions.color"="purple"

RUN npm install

ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]