# couchxray
_couchxray_ is a command-line tool which outputs the CouchDB features used by a database and was inspired by the Python project [xray](https://github.com/cloudant-labs/xray) by Will Holley. On a per database basis, _couchxray outputs whether it is using:

- global MapReduce views and which reducers (built-in or bespoke) are being used.
- Lucene-based search indexes or Cloudant-specific Geospatial indexes.
- so called "Mango" (aka Cloudant Query) indexes backed by MapReduce or Lucene.
- partitions, and which form of per-partition secondary indexes are used.
- CouchDB features such as update/show/list/vdu functions.
- dbcopy, a now-deprecated Cloudant-only feature.

This information is useful when moving data between major versions of CouchDB. _couchxray_ outputs a "compatibility" object which shows which versions of CouchDB are suitable for hosting the database e.g. if the database is using Lucene-based indexes then CouchDB 3+ would be required.

The tool outputs data in JSON for single-database requests or as a CSV when profiling all the databases in a CouchDB instance.

## Installation

Installation requires [Node.js/npm](https://nodejs.org/en/) to be installed:

```sh
npm install -g couchxray
```

## Usage

The URL containing the CouchDB service, including service credentials, should be supplied as a `COUCH_URL` environment variable or as the only command-line parameter.

e.g.

```sh
> export COUCH_URL="https://username:password@host.cloudant.com"
> couchxray
```

or

```sh
couchxray "https://username:password@host.cloudant.com"
```

### Examining a single database

If the URL supplied contains the database name, a single database is examined and the output data is presented as JSON.

```sh
> couchxray http://admin:admin@localhost:5984/cities
{
  "databaseName": "cities",
  "partitioned": false,
  "numDocs": 23514,
  "numDeletions": 9,
  "numDesignDocs": 8,
  "totalDocs": 23531,
  "diskSize": 13688612,
  "billableSize": 2683923,
  "q": 16,
  "recommendedQDocs": 1,
  "recommendedQBytes": 1,
  "indexes": {
    "global": {
      "mapReduce": 7,
      "search": 1,
      "geo": 0,
      "mangoJSON": 0,
      "mangoText": 0
    },
    "partitioned": {
      "mapReduce": 0,
      "search": 0,
      "mangoJSON": 0,
      "mangoText": 0
    },
    "viewGroups": {
      "mapReduce": 8,
      "search": 1,
      "mango": 0
    },
    "updates": 0,
    "shows": 0,
    "lists": 0,
    "vdus": 0,
    "dbcopy": 0,
    "reducers": {
      "_count": 2,
      "_sum": 4,
      "_stats": 1,
      "_approx_count_distinct": 0,
      "none": 0,
      "custom": 0
    }
  },
  "compatibility": {
    "couchDB1": {
      "ok": false,
      "features": [
        "search"
      ]
    },
    "couchDB2": {
      "ok": false,
      "features": [
        "search"
      ]
    },
    "couchDB3": {
      "ok": true
    },
    "couchDB4": {
      "ok": true
    }
  }
}
```

### Examining all databases

If the URL points to the "top level" of the CouchDB service, all of the databases are examined and the output data is presented as a CSV file:

```sh
> couchxray http://admin:admin@localhost:5984
databaseName,partitioned,numDocs,numDeletions,numDesignDocs,totalDocs,diskSize,billableSize,q,recommendedQDocs,recommendedQBytes,indexes.global.mapReduce,indexes.global.search,indexes.global.geo,indexes.global.mangoJSON,indexes.global.mangoText,indexes.partitioned.mapReduce,indexes.partitioned.search,indexes.partitioned.mangoJSON,indexes.partitioned.mangoText,indexes.viewGroups.mapReduce,indexes.viewGroups.search,indexes.viewGroups.mango,indexes.updates,indexes.shows,indexes.lists,indexes.vdus,indexes.dbcopy,indexes.reducers._count,indexes.reducers._sum,indexes.reducers._stats,indexes.reducers._approx_count_distinct,indexes.reducers.none,indexes.reducers.custom,compatibility.couchDB1.ok,compatibility.couchDB2.ok,compatibility.couchDB3.ok,compatibility.couchDB4.ok
aaa,false,3,1,1,5,388179,173,16,1,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,true,true,true,true
aa,false,2,0,0,2,2722750,2489192,16,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,true,true,true,true
a,false,22,3,2,27,4353575,250017,16,1,1,0,0,0,1,1,0,0,0,0,0,0,2,0,0,0,0,0,1,0,0,0,0,0,false,mango,true,true,true
_replicator,false,4,22,1,27,2297477,14447,16,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,true,true,true,true
a1,false,1,0,0,1,154619,39,16,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,true,true,true,true
ab,false,3,0,1,4,388147,387,16,1,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,true,true,true,true
abb,false,1,0,0,1,154507,20,16,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,true,true,true,true
```

## What does the output data mean?

| databaseName                            | The name of the database                                                                 |
|-----------------------------------------|------------------------------------------------------------------------------------------|
| partitioned                             | If the database is [partitioned](https://docs.couchdb.org/en/master/partitioned-dbs/index.html) or not                                                    |
| numDocs                                 | The number of regular documents                                                          |
| numDeletions                            | The number of deleted documents                                                          |
| numDesignDocs                           | The number of [design documents](https://docs.couchdb.org/en/master/api/ddoc/index.html)                                                           |
| totalDocs                               | Total number of documents                                                                |
| diskSize                                | Disk space used                                                                          |
| billableSize                            | Data size used in Cloudant billing                                                       |
| q                                       | The number of [shards](https://docs.couchdb.org/en/master/cluster/databases.html#creating-a-database)                                                                     |
| recommendedQDocs                        | Recommended value of q given the document count                                          |
| recommendedQBytes                       | Recommended value of q given the data size                                               |
| indexes.global.mapReduce                | The number of global [MapReduce](https://docs.couchdb.org/en/master/intro/tour.html#running-a-query-using-mapreduce) indexes                                                   |
| indexes.global.search                   | The number of global [Lucene-based search](https://docs.couchdb.org/en/master/ddocs/search.html) indexes                                         |
| indexes.global.geo                      | The number of [geo-spatial](https://cloud.ibm.com/docs/Cloudant?topic=cloudant-cloudant-nosql-db-geospatial) indexes (Cloudant only)                                        |
| indexes.global.mangoJSON                | The number of global [Mango/MapReduce](https://docs.couchdb.org/en/master/api/database/find.html#api-db-find) indexes                                             |
| indexes.global.mangoText                | The number of global Mango/Lucene indexes                                                |
| indexes.partitioned.mapReduce           | The number of partitioned MapReduce indexes                                              |
| indexes.partitioned.search              | The number of partitioned Lucene-based search indexes                                    |
| indexes.partitioned.mangoJSON           | The number of partitioned Mango/MapReduce indexes                                        |
| indexes.partitioned.mangoText           | The number of partitioned Mango/Lucene indexes                                           |
| indexes.viewGroups.mapReduce            | The number of MapReduce view groups (design docs with one or more MapReduce definitions) |
| indexes.viewGroups.search               | The number of search view groups                                                         |
| indexes.viewGroups.mango                | The number of Mango view groups                                                          |
| indexes.updates                         | Number of [update](https://docs.couchdb.org/en/master/ddocs/ddocs.html#update-functions) functions                                                               |
| indexes.shows                           | Number of [show](https://docs.couchdb.org/en/master/ddocs/ddocs.html#show-functions) functions                                                                 |
| indexes.lists                           | Number of [list](https://docs.couchdb.org/en/master/ddocs/ddocs.html#list-functions) functions                                                                 |
| indexes.vdus                            | Number of [vdu](https://docs.couchdb.org/en/master/ddocs/ddocs.html#validate-document-update-functions) functions                                                                  |
| indexes.dbcopy                          | Number of indexes defined to output their data to another database                       |
| indexes.reducers._count                 | Number of indexes using the [_count](https://docs.couchdb.org/en/master/ddocs/ddocs.html#_count) reducer                                             |
| indexes.reducers._sum                   | Number of indexes using the [_sum](https://docs.couchdb.org/en/master/ddocs/ddocs.html#_sum) reducer                                               |
| indexes.reducers._stats                 | Number of indexes using the [_stats](https://docs.couchdb.org/en/master/ddocs/ddocs.html#_stats) reducer                                             |
| indexes.reducers._approx_count_distinct | Number of indexes using the [approximate count](https://docs.couchdb.org/en/master/ddocs/ddocs.html#_approx_count_distinct) reducer                                    |
| indexes.reducers.none                   | Number of indexes using no reducer                                                       |
| indexes.reducers.custom                 | Number of indexes using a user-defined reducer                                           |
| compatibility.couchDB1.ok               | Compatible with CouchDB 1.x                                                              |
| compatibility.couchDB1.features         | Array of features that make the database incompatible                                    |
| compatibility.couchDB2.ok               | Compatible with CouchDB 2.x                                                              |
| compatibility.couchDB2.features         | Array of features that make the database incompatible                                    |
| compatibility.couchDB3.ok               | Compatible with CouchDB 3.x                                                              |
| compatibility.couchDB3.features         | Array of features that make the database incompatible                                    |
| compatibility.couchDB4.ok               | Compatible with CouchDB 4.x                                                              |
| compatibility.couchDB4.features         | Array of features that make the database incompatible                                    |
