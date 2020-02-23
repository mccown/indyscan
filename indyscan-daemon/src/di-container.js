const logger = require('./logging/logger-main')

let instances = {}

function registerInstance (id, instance) {
  logger.info(`Registering instance '${id}'`)
  if (!instance) {
    throw Error(`Registering instance '${id}' but provided instance is null or undefined.`)
  }
  if (instances[id]) {
    throw Error(`Instance with id '${id}' was already registered in dependency injection container.`)
  }
  instances[id] = instance
}

function requestInstance (id) {
  return instances[id]
}

function injectDependencies (object) {
  const injected = []
  for (const [key, value] of Object.entries(object)) {
    if (typeof value === 'object') {
      injectDependencies(value)
    } else if (typeof value === 'string' && value.match(/^@@.*/)) {
      const dependencyId = value.substr(2)
      const dependency = requestInstance(dependencyId)
      if (!dependency) {
        throw Error(`Found reference to dependency identified as '${dependencyId}' but no such object was registered.`)
      }
      object[key] = dependency
      injected.push({ [key]: value })
    }
  }
  logger.info(`Injected dependencies ${JSON.stringify(injected)}. Final injected object: ${JSON.stringify(object)}`)
}

function flushDiContainer () {
  instances = {}
}

module.exports.registerInstance = registerInstance
module.exports.injectDependencies = injectDependencies
module.exports.flushDiContainer = flushDiContainer