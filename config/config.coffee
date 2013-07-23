path = require("path")
rootPath = path.normalize(__dirname + "/..")
module.exports =
  development:
    db: "mongodb://localhost/competition_tracker"
    root: rootPath
    app:
      name: "Competitor"
      defaultCompetitors: ["McDonalds", "Starbucks"]

    twitter:
      consumer_key: "Io5zdIGhHuhHlsVTRg46Q"
      consumer_secret: "txyQLU5gFVwl8BZ4LFKQ07XORGoz79J8UDSDF1To"
      access_token_key: "19803299-cUYGlMPfY8LcMYxgZx3LxPMore7zhSzQvGJ3nXnTj"
      access_token_secret: "3SFN0xULj18NOksrNARToSGJHAPNttJgJSjQ7WemnQ"

    mixpanel:
      id: "cf42cf0cb29fa19846c59fb09be7d237"

  test: {}
  production: {}