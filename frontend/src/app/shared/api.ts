// Determine backend base URLs - use service names in Docker, localhost for local dev
const isDocker = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1'
) ? false : true;

const customerBase = isDocker ? 'http://customer-service:8082' : 'http://localhost:8082';
const aiBase = isDocker ? 'http://ai-agent-service:8090' : 'http://localhost:8090';

export const API = {
  customer: (path: string) => `${customerBase}${path}`,
  ai: (path: string) => `${aiBase}${path}`
};
