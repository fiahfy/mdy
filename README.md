# mdy

> Markdown-based note-taking application.

## Build Setup

```bash
# install dependencies
yarn

# serve with hot reload at localhost:3000
yarn dev

# build for production and launch server
yarn build
yarn start

# generate static project
yarn export

# deploy to Firebase Hosting
yarn deploy
```

## Firebase Setup

### Deploy Settings

```bash
# deploy firestore settings (rules and indexes)
firebase deploy --only firestore
```

### Create `.env` file

```
NEXT_PUBLIC_FIREBASE_API_KEY=<apiKey>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<authDomain>
NEXT_PUBLIC_FIREBASE_DATABASE_URL=<databaseURL>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<projectId>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<storageBucket>
```
