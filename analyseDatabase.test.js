/* eslint-env jest */
const main = require('./index.js')
const nock = require('nock')
const baseURL = 'http://localhost:5984'

test('analyseDatabase - no design docs', async () => {
  const reply1 = {
    update_seq: '23531-a',
    db_name: 'testdb',
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
  const scope = nock(baseURL)
    .get('/testdb')
    .reply(200, reply1)
    .get('/testdb/_all_docs?startkey="_design"&endkey="_design0"&include_docs=true')
    .reply(200, reply2)
  const data = await main.analyseDatabase(baseURL, 'testdb')
  const output = {
    databaseName: 'testdb',
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
    }
  }
  expect(data).toStrictEqual(output)
  expect(scope.isDone()).toStrictEqual(true)
})

test('analyseDatabase - one design doc', async () => {
  const reply1 = {
    update_seq: '23531-a',
    db_name: 'testdb',
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
    doc_count: 11,
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
    rows: [
      {
        id: 'mydesigndoc',
        key: 'mydesigndoc',
        value: {
          rev: '1-123'
        },
        doc: {
          views: {
            one: {
              map: 'function(doc){}'
            }
          }
        }
      }
    ]
  }
  const scope = nock(baseURL)
    .get('/testdb')
    .reply(200, reply1)
    .get('/testdb/_all_docs?startkey="_design"&endkey="_design0"&include_docs=true')
    .reply(200, reply2)
  const data = await main.analyseDatabase(baseURL, 'testdb')
  const output = {
    databaseName: 'testdb',
    partitioned: false,
    numDocs: 10,
    numDeletions: 2,
    numDesignDocs: 1,
    totalDocs: 13,
    diskSize: 123,
    billableSize: 456,
    q: 16,
    recommendedQDocs: 1,
    recommendedQBytes: 1,
    indexes: {
      global: {
        mapReduce: 1,
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
        mapReduce: 1,
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
        none: 1,
        custom: 0
      }
    }
  }
  expect(data).toStrictEqual(output)
  expect(scope.isDone()).toStrictEqual(true)
})
