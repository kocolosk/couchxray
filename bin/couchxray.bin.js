#!/usr/bin/env node
const couchxray = require('..')
const colorize = require('json-colorizer')

// find CouchDB URL
const couchURL = process.argv.length > 2 ? process.argv[2] : process.env.COUCH_URL
if (!couchURL) {
  console.error('Please supply CouchDB URL or COUCH_URL environment variable')
  process.exit(1)
}

// parse the URL
const url = require('url')
const u = new url.URL(couchURL)
let baseURL
let databaseName
if (u.pathname === '/') {
  baseURL = couchURL
} else {
  databaseName = u.pathname.substr(1)
  u.pathname = '/'
  baseURL = u.toString()
}
const main = async () => {
  if (databaseName) {
    const data = await couchxray.analyseDatabase(baseURL, databaseName)
    console.log(colorize(data, { pretty: true }))
  } else {
    await couchxray.analyseAllDatabases(baseURL)
    process.exit(0)
  }
}
main()
