const flatten = (obj) => {
  const retval = {}
  recursiveFlatten(obj, retval, '')
  return retval
}

const recursiveFlatten = (obj, dest, prefix) => {
  const keys = Object.keys(obj)
  for (var k in keys) {
    const key = keys[k]
    let p = prefix
    if (prefix.length > 0) {
      p += '.'
    }
    if (typeof obj[key] === 'object') {
      p += key
      recursiveFlatten(obj[key], dest, p)
    } else if (Array.isArray(obj[key])) {
      dest[p + key] = obj[key].join(' / ')
    } else {
      dest[p + key] = obj[key]
    }
  }
}

module.exports = flatten
