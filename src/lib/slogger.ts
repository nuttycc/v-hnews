import debug from 'debug'

// Base namespace for the entire application
const APP_NAMESPACE = 'v-hnews'

if (import.meta.env.DEV) {
  debug.enable(`${APP_NAMESPACE}:*`)
}

/**
 * Creates a namespace-specific logger with convenient methods
 * @param namespace - The specific module/component namespace
 * @returns An object with logging methods for different levels
 */
export function createLogger(namespace: string) {
  // Create namespace with format: app:module
  const fullNamespace = `${APP_NAMESPACE}:${namespace}`

  // Create debuggers for different log levels
  const debugLogger = debug(`${fullNamespace}:debug`)
  const infoLogger = debug(`${fullNamespace}:info`)
  const warnLogger = debug(`${fullNamespace}:warn`)
  const errorLogger = debug(`${fullNamespace}:error`)

  return {
    debug: debugLogger,
    info: infoLogger,
    warn: warnLogger,
    error: errorLogger,
    log: (message: string, ...args: unknown[]) => {
      infoLogger(message, ...args)
    },
    namespace: fullNamespace,
  }
}

/**
 * Helper to enable all logs in development environment
 */
// export function enableAllLogs() {
//   if (import.meta.env.DEV) {
//     // localStorage.setItem('debug', `${APP_NAMESPACE}:*`)
//     debug.enable(`${APP_NAMESPACE}:*`)
//   }
// }

/**
 * Helper to disable all logs
 */
// export function disableAllLogs() {
//   // localStorage.removeItem('debug')
//   debug.disable()
// }

/**
 * Enable only specific log levels (e.g., only errors and warnings)
 */
export function enableLogLevels(levels: ('debug' | 'info' | 'warn' | 'error')[]) {
  const patterns = levels.map((level) => `${APP_NAMESPACE}:*:${level}`)
  // localStorage.setItem('debug', patterns.join(','))
  debug.enable(patterns.join(','))
}

/**
 * Enable logs for specific modules/components
 */
export function enableModuleLogs(modules: string[]) {
  const patterns = modules.map((module) => `${APP_NAMESPACE}:${module}:*`)
  // localStorage.setItem('debug', patterns.join(','))
  debug.enable(patterns.join(','))
}

// Export a root logger for app-wide logging
export const rootLogger = createLogger('app')

// Default export for convenience
export default createLogger
