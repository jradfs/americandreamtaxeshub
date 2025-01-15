type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: any
  error?: Error
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}

const CURRENT_LOG_LEVEL = (process.env.LOG_LEVEL || 'info') as LogLevel

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[CURRENT_LOG_LEVEL]
}

function formatError(error: Error): Record<string, any> {
  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
    cause: error.cause
  }
}

function createLogEntry(
  level: LogLevel,
  message: string,
  data?: any,
  error?: Error
): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    data: data ? (typeof data === 'object' ? { ...data } : data) : undefined,
    error: error ? formatError(error) : undefined
  }
}

function writeLog(entry: LogEntry) {
  const logString = JSON.stringify(entry)
  
  if (process.env.NODE_ENV === 'development') {
    switch (entry.level) {
      case 'error':
        console.error(logString)
        break
      case 'warn':
        console.warn(logString)
        break
      case 'info':
        console.info(logString)
        break
      case 'debug':
        console.debug(logString)
        break
    }
  } else {
    // In production, always use console.log for consistent log collection
    console.log(logString)
  }
}

export const logger = {
  debug(message: string, data?: any) {
    if (shouldLog('debug')) {
      writeLog(createLogEntry('debug', message, data))
    }
  },

  info(message: string, data?: any) {
    if (shouldLog('info')) {
      writeLog(createLogEntry('info', message, data))
    }
  },

  warn(message: string, data?: any, error?: Error) {
    if (shouldLog('warn')) {
      writeLog(createLogEntry('warn', message, data, error))
    }
  },

  error(message: string, error?: Error, data?: any) {
    if (shouldLog('error')) {
      writeLog(createLogEntry('error', message, data, error))
    }
  },

  // Helper for logging API requests
  logRequest(req: Request, context?: any) {
    if (shouldLog('debug')) {
      this.debug('API Request', {
        method: req.method,
        url: req.url,
        headers: Object.fromEntries(req.headers),
        context
      })
    }
  },

  // Helper for logging API responses
  logResponse(req: Request, response: Response, duration: number) {
    const level = response.ok ? 'debug' : 'error'
    if (shouldLog(level)) {
      this[level]('API Response', {
        method: req.method,
        url: req.url,
        status: response.status,
        duration: `${duration}ms`
      })
    }
  }
} 