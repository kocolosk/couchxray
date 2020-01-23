
const getDatabaseList = async (nano) => {
  return nano.db.list()
}

const getInfo = async (nano, dbName) => {
  return nano.db.get(dbName)
}

module.exports = {
  getDatabaseList,
  getInfo
}
