FROM node:16.14

ARG COMMIT="local-build"
ARG TAG=""

LABEL commit=${COMMIT}
LABEL tag=$TAG

# Allow exposing HTTP endpoint
EXPOSE 3000

# Add project source
COPY ./web /code

COPY ./.seed-data /seed-data

# Setup work directory
WORKDIR /code

# Create directory for storing logs
RUN mkdir /code/logs

# Start the dev server
RUN npm install # --production
