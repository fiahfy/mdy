# mdy

> Markdown-based note-taking application 

## Build Setup

```bash
# install dependencies
$ yarn

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn export

# deploy
$ yarn deploy:hosting
```

## Firebase Setup

### Deploy Settings
```
# deploy firestore settings (rules and indexes)
firebase deploy --only firestore
```

### Create `.env` file
```
API_KEY=<apiKey>
AUTH_DOMAIN=<authDomain>
DATABASE_URL=<databaseURL>
PROJECT_ID=<projectId>
STORAGE_BUCKET=<storageBucket>
```
