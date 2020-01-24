/* eslint-env jest */
const main = require('./index.js')

test('analyseDatabase function is present', () => {
  expect(typeof main.analyseDatabase).toBe('function')
})

test('analyseAllDatabases function is present', () => {
  expect(typeof main.analyseAllDatabases).toBe('function')
})

test('analyseDesignDocs function is present', () => {
  expect(typeof main.analyseDesignDocs).toBe('function')
})
