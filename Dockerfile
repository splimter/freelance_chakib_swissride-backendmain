FROM node:18

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn global add node-gyp
RUN yarn install

COPY . .

ENV PORT=11221
ENV HOST=localhost
ENV MONGO_DB_URL=maincluster.em0ey.mongodb.net
ENV MONGO_DB_CLUSTER=MainCluster
ENV MONGO_DB_NAME=maindb
ENV MONGO_DB_USERNAME=swissrideroot
ENV MONGO_DB_PASSWORD="]K9y,j!?qZO?47fVJdFY#7]~:65*nL1I"
ENV JWT_SECRET=z+ec!e)XV5nD}HF1pL43|)7A;ER_^l7/.S!Gu>kivlEsRg-`@q


# Build the application
RUN yarn build

# Expose the port the app runs on
EXPOSE 11221

# Start the application
CMD ["yarn", "start"]