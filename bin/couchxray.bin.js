#!/usr/bin/env node
const couchxray = require('..')
const colorize = require('json-colorizer')
const url = require('url')
const yargs = require('yargs/yargs')

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
const envIAMKey = process.env.IAM_API_KEY

// parse the command-line URL
const argv = yargs(process.argv)
  .option('scan', { alias: 's', type: 'boolean', description: 'perform full database scan' })
  .option('database', { alias: ['db', 'd'], type: 'string', description: 'single database to scan' })
  .option('all_dbs', { alias: ['a', 'all-dbs'], type: 'boolean', description: 'scan all databases' })
  .option('url', { alias: ['u'], type: 'string', description: 'URL of Cloudant service' })
  .option('iam_api_key', { alias: ['i', 'iam-api-key'], type: 'string', description: 'IAM API key' })
  .argv

// take environment variables into account
argv.url = argv.url || envCouchURL

// extract database name from URL if present
if (argv.url) {
  try {
    const parsedEnvCouchURL = splitURL(argv.url)
    argv.url = parsedEnvCouchURL.baseURL
    argv.database = parsedEnvCouchURL.databaseName || argv.database
  } catch (e) {
    console.error('Not a valid URL')
    process.exit(1)
  }
}
argv.iam_api_key = argv.iam_api_key || envIAMKey

// check for mandatory parameters
if (!argv.url) {
  throw new Error('Must supply a URL for the CouchDB service. See --help.')
}
if (!argv.database && !argv.all_dbs) {
  throw new Error('Must supply a database name or choose to analyse all databases. See --help.')
}

// main
const main = async () => {
  // single database
  if (argv.database) {
    const data = await couchxray.analyseDatabase(argv.url, argv.database, argv.iam_api_key, argv.scan)
    console.log(colorize(data, { pretty: true }))
  } else if (argv.all_dbs) {
    // all databases
    await couchxray.analyseAllDatabases(argv.url, argv.iam_api_key, argv.scan)
    process.exit(0)
  }
}
main()
