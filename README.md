# Competition Tracker

## Install

**NOTE:** You need to have node.js, mongodb installed and running.

```sh
  $ npm install
  $ cp config/config.example.js config/config.js
  $ npm start
```

**NOTE:** Do not forget to update your twitter APP_ID and APP_SECRET in `config/config.js`.

Then visit [http://localhost:3000/](http://localhost:3000/)

## Related modules

1. [node-genem](https://github.com/madhums/node-genem) A module to generate the MVC skeleton using this approach.
2. [node-notifier](http://github.com/madhums/node-notifier) - used for notifications via emails and push notificatiions
3. [node-imager](http://github.com/madhums/node-imager) - used to resize, crop and upload images to S3/rackspace
4. [node-view-helpers](http://github.com/madhums/node-view-helpers) - some common view helpers
5. [mongoose-migrate](https://github.com/madhums/mongoose-migrate#readme) - Keeps track of the migrations in a mongodb collection (fork of visionmedia/node-migrate)

## Directory structure
```
-app/
  |__controllers/
  |__models/
  |__mailer/
  |__views/
-config/
  |__routes.js
  |__config.js
  |__passport.js (auth config)
  |__imager.js (imager config)
  |__express.js (express.js configs)
  |__middlewares/ (custom middlewares)
-public/
```

## Tests

```sh
$ npm test
```
