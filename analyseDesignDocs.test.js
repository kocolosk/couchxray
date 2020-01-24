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

test('analyseDesignDocs - no design docs', () => {
  const input = []
  const output = {
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
  expect(main.analyseDesignDocs(input)).toStrictEqual(output)
})

test('analyseDesignDocs - one global MapReduce', () => {
  const input = [
    {
      views: {
        one: {
          map: 'function(doc){}'
        }
      }
    }
  ]
  const output = {
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
  expect(main.analyseDesignDocs(input)).toStrictEqual(output)
})

test('analyseDesignDocs - one global MapReduce with count reducer', () => {
  const input = [
    {
      views: {
        one: {
          map: 'function(doc){}',
          reduce: '_count'
        }
      }
    }
  ]
  const output = {
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
      _count: 1,
      _sum: 0,
      _stats: 0,
      _approx_count_distinct: 0,
      none: 0,
      custom: 0
    }
  }
  expect(main.analyseDesignDocs(input)).toStrictEqual(output)
})

test('analyseDesignDocs - one global MapReduce with sum reducer', () => {
  const input = [
    {
      views: {
        one: {
          map: 'function(doc){}',
          reduce: '_sum'
        }
      }
    }
  ]
  const output = {
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
      _sum: 1,
      _stats: 0,
      _approx_count_distinct: 0,
      none: 0,
      custom: 0
    }
  }
  expect(main.analyseDesignDocs(input)).toStrictEqual(output)
})

test('analyseDesignDocs - one global MapReduce with stats reducer', () => {
  const input = [
    {
      views: {
        one: {
          map: 'function(doc){}',
          reduce: '_stats'
        }
      }
    }
  ]
  const output = {
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
      _stats: 1,
      _approx_count_distinct: 0,
      none: 0,
      custom: 0
    }
  }
  expect(main.analyseDesignDocs(input)).toStrictEqual(output)
})

test('analyseDesignDocs - one global MapReduce with approx_count_distinct reducer', () => {
  const input = [
    {
      views: {
        one: {
          map: 'function(doc){}',
          reduce: '_approx_count_distinct'
        }
      }
    }
  ]
  const output = {
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
      _approx_count_distinct: 1,
      none: 0,
      custom: 0
    }
  }
  expect(main.analyseDesignDocs(input)).toStrictEqual(output)
})

test('analyseDesignDocs - one global MapReduce with custom reducer', () => {
  const input = [
    {
      views: {
        one: {
          map: 'function(doc){}',
          reduce: 'function () { }'
        }
      }
    }
  ]
  const output = {
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
      none: 0,
      custom: 1
    }
  }
  expect(main.analyseDesignDocs(input)).toStrictEqual(output)
})

test('analyseDesignDocs - six global MapReduce with one of each reducer type', () => {
  const input = [
    {
      views: {
        one: {
          map: 'function(doc){}',
          reduce: '_count'
        },
        two: {
          map: 'function(doc){}',
          reduce: '_sum'
        },
        three: {
          map: 'function(doc){}',
          reduce: '_stats'
        },
        four: {
          map: 'function(doc){}',
          reduce: '_approx_count_distinct'
        },
        five: {
          map: 'function(doc){}',
          reduce: 'function() { }'
        },
        six: {
          map: 'function(doc){}'
        }
      }
    }
  ]
  const output = {
    global: {
      mapReduce: 6,
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
      _count: 1,
      _sum: 1,
      _stats: 1,
      _approx_count_distinct: 1,
      none: 1,
      custom: 1
    }
  }
  expect(main.analyseDesignDocs(input)).toStrictEqual(output)
})

test('analyseDesignDocs - one partitioned MapReduce', () => {
  const input = [
    {
      views: {
        one: {
          map: 'function(doc){}'
        }
      },
      options: {
        partitioned: true
      }
    }
  ]
  const output = {
    global: {
      mapReduce: 0,
      search: 0,
      geo: 0,
      mangoJSON: 0,
      mangoText: 0
    },
    partitioned: {
      mapReduce: 1,
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
  expect(main.analyseDesignDocs(input)).toStrictEqual(output)
})

test('analyseDesignDocs - three partitioned MapReduces', () => {
  const input = [
    {
      views: {
        one: {
          map: 'function(doc){}'
        },
        two: {
          map: 'function(doc){}',
          reduce: '_count'
        },
        three: {
          map: 'function(doc){}',
          reduce: '_count'
        }
      },
      options: {
        partitioned: true
      }
    }
  ]
  const output = {
    global: {
      mapReduce: 0,
      search: 0,
      geo: 0,
      mangoJSON: 0,
      mangoText: 0
    },
    partitioned: {
      mapReduce: 3,
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
      _count: 2,
      _sum: 0,
      _stats: 0,
      _approx_count_distinct: 0,
      none: 1,
      custom: 0
    }
  }
  expect(main.analyseDesignDocs(input)).toStrictEqual(output)
})

test('analyseDesignDocs - one global Search', () => {
  const input = [
    {
      indexes: {
        one: {
          index: 'function(doc){}'
        }
      }
    }
  ]
  const output = {
    global: {
      mapReduce: 0,
      search: 1,
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
      search: 1,
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
  expect(main.analyseDesignDocs(input)).toStrictEqual(output)
})

test('analyseDesignDocs - three global searches', () => {
  const input = [
    {
      indexes: {
        one: {
          index: 'function(doc){}'
        },
        two: {
          index: 'function(doc){}'
        },
        three: {
          index: 'function(doc){}'
        }
      }
    }
  ]
  const output = {
    global: {
      mapReduce: 0,
      search: 3,
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
      search: 1,
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
  expect(main.analyseDesignDocs(input)).toStrictEqual(output)
})

test('analyseDesignDocs - one partitioned Search', () => {
  const input = [
    {
      indexes: {
        one: {
          index: 'function(doc){}'
        }
      },
      options: {
        partitioned: true
      }
    }
  ]
  const output = {
    global: {
      mapReduce: 0,
      search: 0,
      geo: 0,
      mangoJSON: 0,
      mangoText: 0
    },
    partitioned: {
      mapReduce: 0,
      search: 1,
      mangoJSON: 0,
      mangoText: 0
    },
    viewGroups: {
      mapReduce: 0,
      search: 1,
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
  expect(main.analyseDesignDocs(input)).toStrictEqual(output)
})

test('analyseDesignDocs - three partitioned searches', () => {
  const input = [
    {
      indexes: {
        one: {
          index: 'function(doc){}'
        },
        two: {
          index: 'function(doc){}'
        },
        three: {
          index: 'function(doc){}'
        }
      },
      options: {
        partitioned: true
      }
    }
  ]
  const output = {
    global: {
      mapReduce: 0,
      search: 0,
      geo: 0,
      mangoJSON: 0,
      mangoText: 0
    },
    partitioned: {
      mapReduce: 0,
      search: 3,
      mangoJSON: 0,
      mangoText: 0
    },
    viewGroups: {
      mapReduce: 0,
      search: 1,
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
  expect(main.analyseDesignDocs(input)).toStrictEqual(output)
})

test('analyseDesignDocs - one global Mango/JSON', () => {
  const input = [
    {
      language: 'query',
      views: {
        'foo-json-index': {
          map: {
            fields: {
              foo: 'asc'
            },
            partial_filter_selector: {}
          },
          reduce: '_count',
          options: {
            def: {
              fields: [
                'foo'
              ]
            }
          }
        }
      }
    }
  ]
  const output = {
    global: {
      mapReduce: 0,
      search: 0,
      geo: 0,
      mangoJSON: 1,
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
      mango: 1
    },
    updates: 0,
    shows: 0,
    lists: 0,
    vdus: 0,
    dbcopy: 0,
    reducers: {
      _count: 1,
      _sum: 0,
      _stats: 0,
      _approx_count_distinct: 0,
      none: 0,
      custom: 0
    }
  }
  expect(main.analyseDesignDocs(input)).toStrictEqual(output)
})

test('analyseDesignDocs - three global Mango/JSON indexes', () => {
  const input = [
    {
      language: 'query',
      views: {
        'foo-json-index0': {
          map: {
            fields: {
              foo: 'asc'
            },
            partial_filter_selector: {}
          },
          reduce: '_count',
          options: {
            def: {
              fields: [
                'foo'
              ]
            }
          }
        },
        'foo-json-index1': {
          map: {
            fields: {
              foo: 'asc'
            },
            partial_filter_selector: {}
          },
          reduce: '_count',
          options: {
            def: {
              fields: [
                'foo'
              ]
            }
          }
        },
        'foo-json-index2': {
          map: {
            fields: {
              foo: 'asc'
            },
            partial_filter_selector: {}
          },
          reduce: '_count',
          options: {
            def: {
              fields: [
                'foo'
              ]
            }
          }
        }
      }
    }
  ]
  const output = {
    global: {
      mapReduce: 0,
      search: 0,
      geo: 0,
      mangoJSON: 3,
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
      mango: 1
    },
    updates: 0,
    shows: 0,
    lists: 0,
    vdus: 0,
    dbcopy: 0,
    reducers: {
      _count: 3,
      _sum: 0,
      _stats: 0,
      _approx_count_distinct: 0,
      none: 0,
      custom: 0
    }
  }
  expect(main.analyseDesignDocs(input)).toStrictEqual(output)
})

test('analyseDesignDocs - one partitioned Mango/JSON index', () => {
  const input = [
    {
      language: 'query',
      views: {
        'foo-json-index': {
          map: {
            fields: {
              foo: 'asc'
            },
            partial_filter_selector: {}
          },
          reduce: '_count',
          options: {
            def: {
              fields: [
                'foo'
              ]
            }
          }
        }
      },
      options: {
        partitioned: true
      }
    }
  ]
  const output = {
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
      mangoJSON: 1,
      mangoText: 0
    },
    viewGroups: {
      mapReduce: 0,
      search: 0,
      mango: 1
    },
    updates: 0,
    shows: 0,
    lists: 0,
    vdus: 0,
    dbcopy: 0,
    reducers: {
      _count: 1,
      _sum: 0,
      _stats: 0,
      _approx_count_distinct: 0,
      none: 0,
      custom: 0
    }
  }
  expect(main.analyseDesignDocs(input)).toStrictEqual(output)
})

test('analyseDesignDocs - three partitioned Mango/JSON indexes', () => {
  const input = [
    {
      language: 'query',
      views: {
        'foo-json-index0': {
          map: {
            fields: {
              foo: 'asc'
            },
            partial_filter_selector: {}
          },
          reduce: '_count',
          options: {
            def: {
              fields: [
                'foo'
              ]
            }
          }
        },
        'foo-json-index1': {
          map: {
            fields: {
              foo: 'asc'
            },
            partial_filter_selector: {}
          },
          reduce: '_count',
          options: {
            def: {
              fields: [
                'foo'
              ]
            }
          }
        },
        'foo-json-index2': {
          map: {
            fields: {
              foo: 'asc'
            },
            partial_filter_selector: {}
          },
          reduce: '_count',
          options: {
            def: {
              fields: [
                'foo'
              ]
            }
          }
        }
      },
      options: {
        partitioned: true
      }
    }
  ]
  const output = {
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
      mangoJSON: 3,
      mangoText: 0
    },
    viewGroups: {
      mapReduce: 0,
      search: 0,
      mango: 1
    },
    updates: 0,
    shows: 0,
    lists: 0,
    vdus: 0,
    dbcopy: 0,
    reducers: {
      _count: 3,
      _sum: 0,
      _stats: 0,
      _approx_count_distinct: 0,
      none: 0,
      custom: 0
    }
  }
  expect(main.analyseDesignDocs(input)).toStrictEqual(output)
})

test('analyseDesignDocs - one global Mango/Text index', () => {
  const input = [
    {
      language: 'query',
      indexes: {
        'foo-json-index': {
          index: {
            default_analyzer: 'keyword',
            default_field: {},
            partial_filter_selector: {},
            selector: {},
            fields: [
              {
                name: 'foo',
                type: 'string'
              }
            ],
            index_array_lengths: true
          },
          analyzer: {
            name: 'perfield',
            default: 'keyword',
            fields: {
              $default: 'standard'
            }
          }
        }
      }
    }
  ]
  const output = {
    global: {
      mapReduce: 0,
      search: 0,
      geo: 0,
      mangoJSON: 0,
      mangoText: 1
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
      mango: 1
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
  expect(main.analyseDesignDocs(input)).toStrictEqual(output)
})

test('analyseDesignDocs - three global Mango/Text indexes', () => {
  const input = [
    {
      language: 'query',
      indexes: {
        'foo-json-index0': {
          index: {
            default_analyzer: 'keyword',
            default_field: {},
            partial_filter_selector: {},
            selector: {},
            fields: [
              {
                name: 'foo',
                type: 'string'
              }
            ],
            index_array_lengths: true
          },
          analyzer: {
            name: 'perfield',
            default: 'keyword',
            fields: {
              $default: 'standard'
            }
          }
        },
        'foo-json-index1': {
          index: {
            default_analyzer: 'keyword',
            default_field: {},
            partial_filter_selector: {},
            selector: {},
            fields: [
              {
                name: 'foo',
                type: 'string'
              }
            ],
            index_array_lengths: true
          },
          analyzer: {
            name: 'perfield',
            default: 'keyword',
            fields: {
              $default: 'standard'
            }
          }
        },
        'foo-json-index2': {
          index: {
            default_analyzer: 'keyword',
            default_field: {},
            partial_filter_selector: {},
            selector: {},
            fields: [
              {
                name: 'foo',
                type: 'string'
              }
            ],
            index_array_lengths: true
          },
          analyzer: {
            name: 'perfield',
            default: 'keyword',
            fields: {
              $default: 'standard'
            }
          }
        }
      }
    }
  ]
  const output = {
    global: {
      mapReduce: 0,
      search: 0,
      geo: 0,
      mangoJSON: 0,
      mangoText: 3
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
      mango: 1
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
  expect(main.analyseDesignDocs(input)).toStrictEqual(output)
})

test('analyseDesignDocs - one partitioned Mango/Text index', () => {
  const input = [
    {
      language: 'query',
      indexes: {
        'foo-json-index': {
          index: {
            default_analyzer: 'keyword',
            default_field: {},
            partial_filter_selector: {},
            selector: {},
            fields: [
              {
                name: 'foo',
                type: 'string'
              }
            ],
            index_array_lengths: true
          },
          analyzer: {
            name: 'perfield',
            default: 'keyword',
            fields: {
              $default: 'standard'
            }
          }
        }
      },
      options: {
        partitioned: true
      }

    }
  ]
  const output = {
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
      mangoText: 1
    },
    viewGroups: {
      mapReduce: 0,
      search: 0,
      mango: 1
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
  expect(main.analyseDesignDocs(input)).toStrictEqual(output)
})

test('analyseDesignDocs - three partitioned Mango/Text indexes', () => {
  const input = [
    {
      language: 'query',
      indexes: {
        'foo-json-index0': {
          index: {
            default_analyzer: 'keyword',
            default_field: {},
            partial_filter_selector: {},
            selector: {},
            fields: [
              {
                name: 'foo',
                type: 'string'
              }
            ],
            index_array_lengths: true
          },
          analyzer: {
            name: 'perfield',
            default: 'keyword',
            fields: {
              $default: 'standard'
            }
          }
        },
        'foo-json-index1': {
          index: {
            default_analyzer: 'keyword',
            default_field: {},
            partial_filter_selector: {},
            selector: {},
            fields: [
              {
                name: 'foo',
                type: 'string'
              }
            ],
            index_array_lengths: true
          },
          analyzer: {
            name: 'perfield',
            default: 'keyword',
            fields: {
              $default: 'standard'
            }
          }
        },
        'foo-json-index2': {
          index: {
            default_analyzer: 'keyword',
            default_field: {},
            partial_filter_selector: {},
            selector: {},
            fields: [
              {
                name: 'foo',
                type: 'string'
              }
            ],
            index_array_lengths: true
          },
          analyzer: {
            name: 'perfield',
            default: 'keyword',
            fields: {
              $default: 'standard'
            }
          }
        }
      },
      options: {
        partitioned: true
      }
    }
  ]
  const output = {
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
      mangoText: 3
    },
    viewGroups: {
      mapReduce: 0,
      search: 0,
      mango: 1
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
  expect(main.analyseDesignDocs(input)).toStrictEqual(output)
})

test('analyseDesignDocs - three MapReduce view groups', () => {
  const input = [
    {
      views: {
        one: {
          map: 'function(doc){}'
        }
      }
    },
    {
      views: {
        one: {
          map: 'function(doc){}'
        }
      }
    },
    {
      views: {
        one: {
          map: 'function(doc){}'
        }
      }
    }
  ]
  const output = {
    global: {
      mapReduce: 3,
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
      mapReduce: 3,
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
      none: 3,
      custom: 0
    }
  }
  expect(main.analyseDesignDocs(input)).toStrictEqual(output)
})

test('analyseDesignDocs - three search view groups', () => {
  const input = [
    {
      indexes: {
        one: {
          index: 'function(doc){}'
        }
      }
    },
    {
      indexes: {
        one: {
          index: 'function(doc){}'
        }
      }
    },
    {
      indexes: {
        one: {
          index: 'function(doc){}'
        }
      }
    }
  ]
  const output = {
    global: {
      mapReduce: 0,
      search: 3,
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
      search: 3,
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
  expect(main.analyseDesignDocs(input)).toStrictEqual(output)
})

test('analyseDesignDocs - three mango view groups', () => {
  const input = [
    {
      language: 'query',
      views: {
        'foo-json-index': {
          map: {
            fields: {
              foo: 'asc'
            },
            partial_filter_selector: {}
          },
          reduce: '_count',
          options: {
            def: {
              fields: [
                'foo'
              ]
            }
          }
        }
      }
    },
    {
      language: 'query',
      views: {
        'foo-json-index': {
          map: {
            fields: {
              foo: 'asc'
            },
            partial_filter_selector: {}
          },
          reduce: '_count',
          options: {
            def: {
              fields: [
                'foo'
              ]
            }
          }
        }
      }
    },
    {
      language: 'query',
      views: {
        'foo-json-index': {
          map: {
            fields: {
              foo: 'asc'
            },
            partial_filter_selector: {}
          },
          reduce: '_count',
          options: {
            def: {
              fields: [
                'foo'
              ]
            }
          }
        }
      }
    }
  ]
  const output = {
    global: {
      mapReduce: 0,
      search: 0,
      geo: 0,
      mangoJSON: 3,
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
      mango: 3
    },
    updates: 0,
    shows: 0,
    lists: 0,
    vdus: 0,
    dbcopy: 0,
    reducers: {
      _count: 3,
      _sum: 0,
      _stats: 0,
      _approx_count_distinct: 0,
      none: 0,
      custom: 0
    }
  }
  expect(main.analyseDesignDocs(input)).toStrictEqual(output)
})

test('analyseDesignDocs - update functions', () => {
  const input = [
    {
      views: {
        one: {
          map: 'function(doc){}'
        }
      },
      updates: {
        myupdate1: 'function(doc, req) { return null }',
        myupdate2: 'function(doc, req) { return null }'
      }
    }
  ]
  const output = {
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
    updates: 2,
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
  expect(main.analyseDesignDocs(input)).toStrictEqual(output)
})

test('analyseDesignDocs - show functions', () => {
  const input = [
    {
      views: {
        one: {
          map: 'function(doc){}'
        }
      },
      shows: {
        myshow1: 'function(doc, req) { return null }',
        myshow2: 'function(doc, req) { return null }'
      }
    }
  ]
  const output = {
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
    shows: 2,
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
  expect(main.analyseDesignDocs(input)).toStrictEqual(output)
})

test('analyseDesignDocs - list functions', () => {
  const input = [
    {
      views: {
        one: {
          map: 'function(doc){}'
        }
      },
      lists: {
        mylist1: 'function(head, req) { return null }',
        mylist2: 'function(doc, req) { return null }'
      }
    }
  ]
  const output = {
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
    lists: 2,
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
  expect(main.analyseDesignDocs(input)).toStrictEqual(output)
})

test('analyseDesignDocs - vdu functions', () => {
  const input = [
    {
      views: {
        one: {
          map: 'function(doc){}'
        }
      },
      language: 'javascript',
      validate_doc_update: 'function (newDoc, oldDoc, userCtx) { return null }'
    }
  ]
  const output = {
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
    vdus: 1,
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
  expect(main.analyseDesignDocs(input)).toStrictEqual(output)
})

test('analyseDesignDocs - list functions', () => {
  const input = [
    {
      views: {
        one: {
          map: 'function(doc){}'
        }
      },
      lists: {
        mylist1: 'function(head, req) { return null }',
        mylist2: 'function(doc, req) { return null }'
      }
    }
  ]
  const output = {
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
    lists: 2,
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
  expect(main.analyseDesignDocs(input)).toStrictEqual(output)
})

test('analyseDesignDocs - dbcopy - variant 1', () => {
  const input = [
    {
      views: {
        one: {
          map: 'function(doc){}'
        }
      },
      options: {
        epi: {
          dbcopy: { one: 'two' }
        }
      }
    }
  ]
  const output = {
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
    dbcopy: 1,
    reducers: {
      _count: 0,
      _sum: 0,
      _stats: 0,
      _approx_count_distinct: 0,
      none: 1,
      custom: 0
    }
  }
  expect(main.analyseDesignDocs(input)).toStrictEqual(output)
})

test('analyseDesignDocs - dbcopy - variant 2', () => {
  const input = [
    {
      views: {
        one: {
          map: 'function(doc){}',
          dbcopy: 'target1'
        },
        two: {
          map: 'function(doc){}',
          dbcopy: 'target2'
        }
      }
    }
  ]
  const output = {
    global: {
      mapReduce: 2,
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
    dbcopy: 2,
    reducers: {
      _count: 0,
      _sum: 0,
      _stats: 0,
      _approx_count_distinct: 0,
      none: 2,
      custom: 0
    }
  }
  expect(main.analyseDesignDocs(input)).toStrictEqual(output)
})
