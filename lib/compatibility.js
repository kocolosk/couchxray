
const couchDB1 = (data) => {
  const features = [
  ]
  if (data.indexes.global.search) {
    features.push('search')
  }
  if (data.indexes.global.geo) {
    features.push('geo')
  }
  if (data.indexes.global.mangoJSON || data.indexes.global.mangoText) {
    features.push('mango')
  }
  if (data.partitioned || data.indexes.partitioned.mapReduce || data.indexes.partitioned.search ||
      data.indexes.partitioned.mangoJSON || data.indexes.partitioned.mangoText) {
    features.push('partitioned databases')
  }
  if (data.indexes.dbcopy) {
    features.push('dbcopy')
  }
  if (data.indexes.reducers._approx_count_distinct) {
    features.push('approx count reducer')
  }
  const retval = {
    ok: (features.length === 0),
    features: features
  }
  if (retval.ok) {
    delete retval.features
  }
  return retval
}

const couchDB2 = (data) => {
  const features = [
  ]
  if (data.indexes.global.search) {
    features.push('search')
  }
  if (data.indexes.global.geo) {
    features.push('geo')
  }
  if (data.partitioned || data.indexes.partitioned.mapReduce || data.indexes.partitioned.search ||
      data.indexes.partitioned.mangoJSON || data.indexes.partitioned.mangoText) {
    features.push('partitioned databases')
  }
  if (data.indexes.dbcopy) {
    features.push('dbcopy')
  }
  if (data.indexes.reducers._approx_count_distinct) {
    features.push('approx count reducer')
  }
  const retval = {
    ok: (features.length === 0),
    features: features
  }
  if (retval.ok) {
    delete retval.features
  }
  return retval
}

const couchDB3 = (data) => {
  const features = [
  ]
  if (data.indexes.global.geo) {
    features.push('geo')
  }
  if (data.indexes.dbcopy) {
    features.push('dbcopy')
  }
  const retval = {
    ok: (features.length === 0),
    features: features
  }
  if (retval.ok) {
    delete retval.features
  }
  return retval
}

const couchDB4 = (data) => {
  const features = [
  ]
  if (data.indexes.global.geo) {
    features.push('geo')
  }
  if (data.indexes.dbcopy) {
    features.push('dbcopy')
  }
  if (data.indexes.updates) {
    features.push('update functions')
  }
  if (data.indexes.shows) {
    features.push('show functions')
  }
  if (data.indexes.lists) {
    features.push('list functions')
  }
  const retval = {
    ok: (features.length === 0),
    features: features
  }
  if (retval.ok) {
    delete retval.features
  }
  return retval
}

module.exports = {
  couchDB1,
  couchDB2,
  couchDB3,
  couchDB4
}
