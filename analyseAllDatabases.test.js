/* eslint-env jest */
const main = require('./index.js')
const nock = require('nock')
const baseURL = 'http://localhost:5984'

test('analyseAllDatabases - two dbs', async () => {
  const reply0 = [
    'testdb1',
    'testdb2'
  ]
  const reply1 = {
    update_seq: '23531-a',
    db_name: 'testdb1',
    purge_seq: 0,
    sizes: {
      file: 123,
      external: 456,
      active: 999
    },
    props: {},
    other: {
      data_size: 456
    },
    doc_del_count: 2,
    doc_count: 10,
    disk_size: 123,
    disk_format_version: 8,
    data_size: 999,
    compact_running: false,
    cluster: {
      q: 16,
      n: 3,
      w: 2,
      r: 2
    },
    instance_start_time: '0'
  }
  const reply2 = {
    rows: []
  }
  const reply3 = {
    update_seq: '23531-a',
    db_name: 'testdb2',
    purge_seq: 0,
    sizes: {
      file: 1230,
      external: 4560,
      active: 9990
    },
    props: {},
    other: {
      data_size: 4560
    },
    doc_del_count: 20,
    doc_count: 100,
    disk_size: 1230,
    disk_format_version: 8,
    data_size: 9990,
    compact_running: false,
    cluster: {
      q: 16,
      n: 3,
      w: 2,
      r: 2
    },
    instance_start_time: '0'
  }
  const reply4 = {
    rows: []
  }
  const scope = nock(baseURL)
    .get('/_all_dbs')
    .reply(200, reply0)
    .get('/testdb1')
    .reply(200, reply1)
    .get('/testdb1/_design_docs?include_docs=true')
    .reply(200, reply2)
    .get('/testdb2')
    .reply(200, reply3)
    .get('/testdb2/_design_docs?include_docs=true')
    .reply(200, reply4)
  const data = await main.analyseAllDatabases(baseURL)
  const output = [{
    databaseName: 'testdb1',
    partitioned: false,
    numDocs: 10,
    numDeletions: 2,
    numDesignDocs: 0,
    totalDocs: 12,
    diskSize: 123,
    billableSize: 456,
    q: 16,
    recommendedQDocs: 1,
    recommendedQBytes: 1,
    indexes: {
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
    },
    compatibility: {
      couchDB1: {
        ok: true
      },
      couchDB2: {
        ok: true
      },
      couchDB3: {
        ok: true
      },
      couchDB4: {
        ok: true
      }
    }
  }, {
    databaseName: 'testdb2',
    partitioned: false,
    numDocs: 100,
    numDeletions: 20,
    numDesignDocs: 0,
    totalDocs: 120,
    diskSize: 1230,
    billableSize: 4560,
    q: 16,
    recommendedQDocs: 1,
    recommendedQBytes: 1,
    indexes: {
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
    },
    compatibility: {
      couchDB1: {
        ok: true
      },
      couchDB2: {
        ok: true
      },
      couchDB3: {
        ok: true
      },
      couchDB4: {
        ok: true
      }
    }
  }]
  expect(data).toStrictEqual(output)
  expect(scope.isDone()).toStrictEqual(true)
})
