// nano library
const flatten = require('./lib/flatten.js')
const Nano = require('nano')
const qrate = require('qrate')
const compatibility = require('./lib/compatibility.js')
let nano

// analyse design docs to see which features are being used
const analyseDesignDocs = (ddocs) => {
  // design doc analysis
  const builtInReducers = ['_count', '_sum', '_stats', '_approx_count_distinct']
  const obj = {
    global: {
      mapReduce: 0,
      search: 0,
      geo: 0,
      mangoJSON: 0,
      mangoText: 0
    },
    partitioned: {
      mapReduce: 0,
      search: 0,
      mangoJSON: 0,
      mangoText: 0
    },
    viewGroups: {
      mapReduce: 0,
      search: 0,
      mango: 0
    },
    updates: 0,
    shows: 0,
    lists: 0,
    vdus: 0,
    dbcopy: 0,
    reducers: {
      _count: 0,
      _sum: 0,
      _stats: 0,
      _approx_count_distinct: 0,
      none: 0,
      custom: 0
    }
  }

  // loop through all the design docs
  for (const i in ddocs) {
    let isQuery = false
    const ddoc = ddocs[i]

    // check for Mango (Cloudant Query) - machine-generated design doc
    if (ddoc.language && ddoc.language === 'query') {
      isQuery = true
    }

    // look for partitioned databases
    const isPartitioned = !!(ddoc.options && ddoc.options.partitioned === true)

    // if there are MapReduce views
    if (ddoc.views) {
      const len = Object.keys(ddoc.views).length

      // count the number of partitioned/global views
      if (isQuery) {
        if (isPartitioned) {
          obj.partitioned.mangoJSON += len
        } else {
          obj.global.mangoJSON += len
        }
        obj.viewGroups.mango++
      } else {
        if (isPartitioned) {
          obj.partitioned.mapReduce += len
        } else {
          obj.global.mapReduce += len
        }
        if (ddoc.options && ddoc.options.epi && ddoc.options.epi.dbcopy) {
          obj.dbcopy += Object.keys(ddoc.options.epi.dbcopy).length
        }
        obj.viewGroups.mapReduce++
      }

      // look into each view
      for (const j in ddoc.views) {
        const view = ddoc.views[j]

        // for dbcopy
        if (view.dbcopy) {
          obj.dbcopy++
        }

        // reducers
        if (!view.reduce) {
          obj.reducers.none++
        } else if (builtInReducers.indexOf(view.reduce) > -1) {
          // built-in reducers
          obj.reducers[view.reduce]++
        } else {
          // or custom reducers
          obj.reducers.custom++
        }
      }
    }

    // for Mango indexes
    if (ddoc.indexes) {
      // count the number of partitioned/global indexes
      const len = Object.keys(ddoc.indexes).length
      if (isQuery) {
        if (isPartitioned) {
          obj.partitioned.mangoText += len
        } else {
          obj.global.mangoText += len
        }
        obj.viewGroups.mango++
      } else {
        if (isPartitioned) {
          obj.partitioned.search += len
        } else {
          obj.global.search += len
        }
        obj.viewGroups.search++
      }
    }

    // geo
    if (ddoc.st_indexes) {
      const len = Object.keys(ddoc.st_indexes).length
      obj.global.geo += len
    }

    // update functions
    if (ddoc.updates) {
      const len = Object.keys(ddoc.updates).length
      obj.updates += len
    }

    // show functions
    if (ddoc.shows) {
      const len = Object.keys(ddoc.shows).length
      obj.shows += len
    }

    // list functions
    if (ddoc.lists) {
      const len = Object.keys(ddoc.lists).length
      obj.lists += len
    }

    // VDU functions
    if (ddoc.validate_doc_update) {
      obj.vdus++
    }
  }
  return obj
}

// analyse all databases
const analyseAllDatabases = async (baseURL, iamApiKey, doFullScan) => {
  const CONCURRENCY = 1
  const REQUESTS_PER_SECOND = 5

  // setup CouchDB connection
  await instantiateNano(baseURL, iamApiKey)

  // return a promise, resolved when we've examined all the databases
  return new Promise((resolve, reject) => {
    const retval = []

    // queue of work
    const worker = async (dbName) => {
      const output = await analyseDatabase(baseURL, dbName, iamApiKey, doFullScan)
      const flattenedOutput = flatten(output)
      if (retval.length === 0) {
        // output headers
        const headers = Object.keys(flattenedOutput)
        console.log(headers.join(','))
      }
      console.log(Object.values(flattenedOutput).join(','))
      retval.push(output)
    }

    // iterate through each database
    const q = qrate(worker, CONCURRENCY, REQUESTS_PER_SECOND)
    nano.db.list().then((databaseList) => {
      for (const i in databaseList) {
        q.push(databaseList[i])
      }
    })
    q.drain = () => {
      // return when queue is exhausted
      resolve(retval)
    }
  })
}

// perform a "full scan" of the database looking for doc _ids that are too long
// and MapReduce key/values that are too large for FoundationDB.
const fullScan = async (dbName, designDocs) => {
  console.error(`doing full scan of database ${dbName} with ${designDocs.length} design documents`)

  // get each map function from all this database's design docs
  const mapFunctions = {}
  for (const i in designDocs) {
    const ddoc = designDocs[i]
    if (ddoc.language && ddoc.language !== 'query') {
      for (const j in ddoc.views) {
        const view = ddoc.views[j]
        if (view.map && typeof view.map === 'string') {
          mapFunctions[ddoc._id + '/' + j] = view.map
        }
      }
    }
  }

  // return a promise - resolve when we reach the end of the changes feed
  return new Promise((resolve, reject) => {
    const db = nano.db.use(dbName)
    const retval = {
      docIdTooBig: false,
      errors: {}
    }
    let total = 0

    // spool through all the changes (apart from deletions)
    db.changesReader.spool({
      includeDocs: true,
      fastChanges: true,
      since: 0,
      selector: { // filter out deletions
        _deleted: {
          $exists: false
        }
      }
    }).on('batch', (b) => {
      // for each batch of deletions
      total += b.length

      // loop through each change
      for (const i in b) {
        // extract the doc
        const doc = b[i].doc

        // if doc id too big, report it
        if (doc._id.length > 1000) {
          retval.docIdTooBig = true
        }

        // ignore design docs
        if (!doc._id.startsWith('_design/')) {
          // for each of this databases MapReduce functions
          for (const j in mapFunctions) {
            // generate a harness to run the map function safely
            const mapFunction = mapFunctions[j]
            const evalStr = `const kv = []; const emit = (k,v) => { kv.push({ k:k, v:v })}; const d = ${JSON.stringify(doc)}; const map = ${mapFunction}; map(d); return kv;`

            // get a list of the key/values emitted from the Map function
            // eslint-disable-next-line
            const emittedKV = Function(evalStr)()

            // identify those which exceed safe Transaction Engine key value size limits
            let indexKeyTooBig = false
            let indexValueTooBig = false
            for (const k in emittedKV) {
              const kv = emittedKV[k]
              if (JSON.stringify(kv.k).length > 1000) {
                indexKeyTooBig = true
              }
              if (JSON.stringify(kv.v).length > 8000) {
                indexValueTooBig = true
              }
            }

            // if they are out of spec, record the ddoc/index reference for the report
            if (indexKeyTooBig || indexValueTooBig) {
              if (!retval.errors[j]) {
                retval.errors[j] = { indexKeyTooBig: false, indexValueTooBig: false }
              }
              retval.errors[j].indexKeyTooBig = retval.errors[j].indexKeyTooBig || indexKeyTooBig
              retval.errors[j].indexValueTooBig = retval.errors[j].indexValueTooBig || indexValueTooBig
            }
          }
        }
      }
      process.stderr.write(`${total} changes\r`)
    }).on('end', (b) => {
      console.error(`${total} changes analysed`)
      resolve(retval)
    }).on('error', (e) => {
      console.error('changes feed error', e)
      reject(retval)
    })
  })
}

// analyse a single database
const analyseDatabase = async (baseURL, dbName, iamApiKey, doFullScan) => {
  // setup CouchDB connection
  await instantiateNano(baseURL, iamApiKey)

  // database info
  const info = await nano.db.get(dbName)

  // design doc info
  const req = {
    db: dbName,
    method: 'get',
    path: '_design_docs',
    qs: {
      include_docs: true
    }
  }
  const ddocs = await nano.request(req)
  const designDocs = ddocs.rows.map((d) => { return d.doc })
  const totalDocs = info.doc_count + info.doc_del_count
  const partitioned = !!(info.props && info.props.partitioned)
  const output = {
    databaseName: dbName,
    partitioned: partitioned,
    numDocs: info.doc_count - ddocs.rows.length,
    numDeletions: info.doc_del_count,
    numDesignDocs: ddocs.rows.length,
    totalDocs: totalDocs,
    diskSize: info.sizes.file,
    billableSize: info.sizes.external,
    q: info.cluster.q, // Object.keys(shardInfo.shards).length,
    recommendedQDocs: Math.ceil((totalDocs + 1) / 10000000), // 10 million docs
    recommendedQBytes: Math.ceil((info.sizes.active + 1) / (10 * 1073741824)), // 10GB
    // designDocs: designDocs,
    indexes: analyseDesignDocs(designDocs),
    compatibility: { }
  }

  // full scan
  if (doFullScan) {
    const scanResults = await fullScan(dbName, designDocs)
    output.scan = scanResults
  }

  output.compatibility.couchDB1 = compatibility.couchDB1(output)
  output.compatibility.couchDB2 = compatibility.couchDB2(output)
  output.compatibility.couchDB3 = compatibility.couchDB3(output)
  output.compatibility.couchDB4 = compatibility.couchDB4(output)

  return output
}

const instantiateNano = async (baseURL, iamApiKey) => {
  const headers = {
    'Content-type': 'application/json'
  }
  if (iamApiKey) {
    const ccurllib = require('ccurllib')
    let obj = ccurllib.get(iamApiKey)
    if (!obj) {
      try {
        obj = await ccurllib.getBearerToken(iamApiKey)
        if (obj) {
          ccurllib.set(iamApiKey, obj)
        }
      } catch (e) {
        console.error('IAM Auth failed')
        process.exit(1)
      }
    }
    headers.Authorization = 'Bearer ' + obj.access_token
  }
  nano = Nano({ url: baseURL, requestDefaults: { headers: headers } })
}

module.exports = {
  analyseDatabase,
  analyseDesignDocs,
  analyseAllDatabases
}
