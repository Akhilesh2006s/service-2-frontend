// API Configuration
export const API_CONFIG = {
  // Production backend URL
  BASE_URL: 'https://service-2-backend-production.up.railway.app/api',
  
  // Development settings
  DEV: {
    BASE_URL: 'https://service-2-backend-production.up.railway.app/api',
    // Alternative: Use proxy in development
    // BASE_URL: '/api',
  },
  
  // Production settings
  PROD: {
    BASE_URL: 'https://service-2-backend-production.up.railway.app/api',
  }
};

// Get the appropriate API URL based on environment
export const getApiUrl = () => {
  const isDev = import.meta.env.DEV;
  return isDev ? API_CONFIG.DEV.BASE_URL : API_CONFIG.PROD.BASE_URL;
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
  
  // Organizations
  ORGANIZATIONS: {
    DASHBOARD: '/organizations/dashboard',
    PROFILE: '/organizations/profile',
  },
  
  // Employees
  EMPLOYEES: {
    DASHBOARD: '/employees/dashboard',
    PROFILE: '/employees/profile',
  },
  
  // Opportunities
  OPPORTUNITIES: {
    LIST: '/opportunities',
    CREATE: '/opportunities',
    UPDATE: (id: string) => `/opportunities/${id}`,
    DELETE: (id: string) => `/opportunities/${id}`,
  },
  
  // Applications
  APPLICATIONS: {
    SUBMIT: '/applications',
    LIST: '/applications',
    GET: (id: string) => `/applications/${id}`,
    UPDATE_STATUS: (id: string) => `/applications/${id}/status`,
    WITHDRAW: (id: string) => `/applications/${id}/withdraw`,
  },
  
  // Recommendations
  RECOMMENDATIONS: {
    OPPORTUNITIES: '/recommendations/opportunities',
    EMPLOYEES: '/recommendations/employees',
    UPDATE_SKILLS: '/recommendations/update-skills',
    UPDATE_REQUIREMENTS: '/recommendations/update-requirements',
    MATCH_SCORE: (employeeId: string, organizationId: string) => 
      `/recommendations/match-score/${employeeId}/${organizationId}`,
  },
  
  // Matching
  MATCHING: {
    CANDIDATES: (opportunityId: string) => `/matching/opportunities/${opportunityId}/candidates`,
    OPPORTUNITIES: (employeeId: string) => `/matching/employees/${employeeId}/opportunities`,
  }
};

export default API_CONFIG;
