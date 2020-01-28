#!/usr/bin/env node
const couchxray = require('..')
const colorize = require('json-colorizer')
const url = require('url')

const splitURL = (u) => {
  const retval = {
    baseURL: null,
    databaseName: null
  }
  try {
    const parsedURL = new url.URL(u)
    if (parsedURL.pathname === '/') {
      retval.baseURL = u
      retval.databaseName = null
    } else {
      retval.databaseName = parsedURL.pathname.substr(1)
      parsedURL.pathname = '/'
      retval.baseURL = parsedURL.toString()
    }
  } catch (e) {
    throw new Error('invalid URL')
  }
  return retval
}

// find CouchDB URL
const envCouchURL = process.env.COUCH_URL
let baseURL
let databaseName
if (envCouchURL) {
  try {
    const parsedEnvCouchURL = splitURL(envCouchURL)
    baseURL = parsedEnvCouchURL.baseURL
    databaseName = parsedEnvCouchURL.databaseName
  } catch (e) {
    console.error('Environment variable COUCH_URL is not a valid URL')
    process.exit(1)
  }
}

// parse the command-line URL
const arg = process.argv.length > 2 ? process.argv[2] : null
if (!databaseName && arg) {
  try {
    // if the command-line argument is a URL
    const parsedArg = splitURL(arg)
    baseURL = parsedArg.baseURL
    databaseName = parsedArg.databaseName
  } catch (e) {
    // otherwise it was a database name to be combined with the environment variable
    if (baseURL) {
      databaseName = arg
    }
  }
}

if (!baseURL) {
  console.error('You must supply a URL as a COUCH_URL environment variable or as a command-line parameter')
  process.exit(1)
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
