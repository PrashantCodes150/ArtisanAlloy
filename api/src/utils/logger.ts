// Simple logger utility for the application
// In production, you might want to use Winston or Pino

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LoggerConfig {
  enableTimestamp: boolean;
  enableColors: boolean;
}

const config: LoggerConfig = {
  enableTimestamp: true,
  enableColors: process.env.NODE_ENV !== 'production',
};

const colors = {
  reset: '\x1b[0m',
  info: '\x1b[36m',    // Cyan
  warn: '\x1b[33m',    // Yellow
  error: '\x1b[31m',   // Red
  debug: '\x1b[35m',   // Magenta
  timestamp: '\x1b[90m', // Gray
};

const formatMessage = (level: LogLevel, message: string, ...args: any[]): string => {
  const timestamp = config.enableTimestamp 
    ? `[${new Date().toISOString()}] ` 
    : '';
  
  const levelStr = level.toUpperCase().padEnd(5);
  
  if (config.enableColors) {
    return `${colors.timestamp}${timestamp}${colors.reset}${colors[level]}${levelStr}${colors.reset} ${message}`;
  }
  
  return `${timestamp}${levelStr} ${message}`;
};

export const logger = {
  info: (message: string, ...args: any[]) => {
    console.log(formatMessage('info', message), ...args);
  },
  
  warn: (message: string, ...args: any[]) => {
    console.warn(formatMessage('warn', message), ...args);
  },
  
  error: (message: string, ...args: any[]) => {
    console.error(formatMessage('error', message), ...args);
  },
  
  debug: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(formatMessage('debug', message), ...args);
    }
  },
};

export default logger;
