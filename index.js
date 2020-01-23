// nano library
const flatten = require('./lib/flatten.js')
const Nano = require('nano')
let nano

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

  for (var i in ddocs) {
    let isQuery = false
    const ddoc = ddocs[i]
    if (ddoc.language && ddoc.language === 'query') {
      isQuery = true
    }
    if (ddoc.views) {
      const len = Object.keys(ddoc.views).length
      if (isQuery) {
        if (obj.partitioned) {
          obj.partitioned.mangoJSON += len
        } else {
          obj.global.mangoJSON += len
        }
        obj.viewGroups.mango++
      } else {
        if (obj.options && obj.options.partitioned === true) {
          obj.partitioned.mapReduce += len
        } else {
          obj.global.mapReduce += len
        }
        if (ddoc.options && ddoc.options.epi && ddoc.options.epi.dbcopy) {
          obj.dbcopy += Object.keys(ddoc.options.epi.dbcopy).length
        }
        for (var j in ddoc.views) {
          const view = ddoc.views[j]
          if (view.dbcopy) {
            obj.dbcopy++
          }
          if (!view.reduce) {
            obj.reducers.none++
          } else if (builtInReducers.indexOf(view.reduce) > -1) {
            obj.reducers[view.reduce]++
          } else {
            obj.reducers.custom++
          }
        }
        obj.viewGroups.mapReduce++
      }
    }

    if (ddoc.indexes) {
      const len = Object.keys(ddoc.indexes).length
      if (isQuery) {
        if (obj.partitioned) {
          obj.partitioned.mangoText += len
        } else {
          obj.global.mangoText += len
        }
      } else {
        if (obj.options && obj.options.partitioned === true) {
          obj.partitioned.search += len
        } else {
          obj.global.search += len
        }
      }
      obj.viewGroups.search++
    }

    if (ddoc.st_indexes) {
      const len = Object.keys(ddoc.st_indexes).length
      obj.global.geo += len
    }

    if (ddoc.updates) {
      const len = Object.keys(ddoc.updates).length
      obj.updates += len
    }

    if (ddoc.shows) {
      const len = Object.keys(ddoc.shows).length
      obj.shows += len
    }

    if (ddoc.lists) {
      const len = Object.keys(ddoc.lists).length
      obj.lists += len
    }

    if (ddoc.validate_doc_update) {
      obj.vdus++
    }
  }
  return obj
}

const analyseAllDatabases = async (baseURL) => {
  nano = Nano(baseURL)
  // iterate through each database
  const databaseList = await nano.db.list()
  for (var i in databaseList) {
    const dbName = databaseList[i]
    const output = await analyseDatabase(baseURL, dbName)
    const flattenedOutput = flatten(output)
    if (i === '0') {
      // output headers
      const headers = Object.keys(flattenedOutput)
      console.log(headers.join(','))
    }
    console.log(Object.values(flattenedOutput).join(','))
  }
}

const analyseDatabase = async (baseURL, dbName) => {
  if (!nano) {
    nano = Nano(baseURL)
  }

  // database info
  const info = await nano.db.get(dbName)
  // console.log('info', info)

  /*  // shard info
  let req = {
    db: dbName,
    method: 'get',
    path: '/_shards'
  }
  const shardInfo = await nano.request(req) */

  // design doc info
  const req = {
    db: dbName,
    method: 'get',
    path: '/_all_docs',
    qs: {
      startkey: '_design',
      endkey: '_design0',
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
    recommendedQBytes: Math.ceil((info.other.data_size + 1) / (10 * 1073741824)), // 10GB
    // designDocs: designDocs,
    indexes: analyseDesignDocs(designDocs)
  }
  return output
}

module.exports = {
  analyseDatabase,
  analyseDesignDocs,
  analyseAllDatabases
}
