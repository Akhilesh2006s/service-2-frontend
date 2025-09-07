import { getApiUrl } from '../config/api';

// Use Railway production backend
const API_BASE_URL = getApiUrl();

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getToken() {
    return localStorage.getItem('token');
  }

  // Set auth token in localStorage
  setToken(token) {
    localStorage.setItem('token', token);
  }

  // Remove auth token from localStorage
  removeToken() {
    localStorage.removeItem('token');
  }

  // Make HTTP request with auth headers
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.status === 'success') {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.removeToken();
    }
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Organization endpoints
  async getOrganizationDashboard() {
    return this.request('/organizations/dashboard');
  }

  async getOrganizationProfile() {
    return this.request('/organizations/profile');
  }

  async updateOrganizationProfile(profileData) {
    return this.request('/organizations/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getOrganizationOpportunities(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/organizations/opportunities?${queryString}`);
  }

  async getOrganization(organizationId) {
    return this.request(`/organizations/${organizationId}`);
  }

  async getOrganizationApplications(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/organizations/applications?${queryString}`);
  }

  async updateApplicationStatus(applicationId, status, note, interviewData = null) {
    const body = { status, note };
    if (interviewData) {
      body.interviewData = interviewData;
    }
    return this.request(`/organizations/applications/${applicationId}/status`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  // Employee endpoints
  async getEmployeeDashboard() {
    return this.request('/employees/dashboard');
  }

  async getEmployeeProfile() {
    return this.request('/employees/profile');
  }

  async updateEmployeeProfile(profileData) {
    return this.request('/employees/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getEmployeeOpportunities(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/employees/opportunities?${queryString}`);
  }

  async getEmployeeApplications(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/employees/applications?${queryString}`);
  }

  async getEmployeeRecommendations() {
    return this.request('/employees/recommendations');
  }

  // Opportunity endpoints
  async getOpportunities(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/opportunities?${queryString}`);
  }

  async getOpportunity(id) {
    return this.request(`/opportunities/${id}`);
  }

  async createOpportunity(opportunityData) {
    return this.request('/opportunities', {
      method: 'POST',
      body: JSON.stringify(opportunityData),
    });
  }

  async updateOpportunity(id, opportunityData) {
    return this.request(`/opportunities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(opportunityData),
    });
  }

  async deleteOpportunity(id) {
    return this.request(`/opportunities/${id}`, {
      method: 'DELETE',
    });
  }

  // Application endpoints
  async submitApplication(applicationData) {
    return this.request('/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  }

  async getApplication(id) {
    return this.request(`/applications/${id}`);
  }

  async getApplications(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/applications?${queryString}`);
  }

  async updateApplicationStatus(applicationId, status, note, interviewData = null) {
    const body = { status, note };
    if (interviewData) {
      body.interviewData = interviewData;
    }
    return this.request(`/applications/${applicationId}/status`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async withdrawApplication(applicationId) {
    return this.request(`/applications/${applicationId}/withdraw`, {
      method: 'PUT',
    });
  }

  // Matching endpoints
  async getMatchingCandidates(opportunityId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/matching/opportunities/${opportunityId}/candidates?${queryString}`);
  }

  async getMatchingOpportunities(employeeId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/matching/employees/${employeeId}/opportunities?${queryString}`);
  }

  async getMatchingAnalytics() {
    return this.request('/matching/analytics');
  }

  // Recommendation endpoints
  async getRecommendedOpportunities(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/recommendations/opportunities?${queryString}`);
  }

  async getRecommendedEmployees(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/recommendations/employees?${queryString}`);
  }

  async updateEmployeeSkills(skills, interests) {
    return this.request('/recommendations/update-skills', {
      method: 'POST',
      body: JSON.stringify({ skills, interests }),
    });
  }

  async updateOrganizationRequirements(requirements, culture) {
    return this.request('/recommendations/update-requirements', {
      method: 'POST',
      body: JSON.stringify({ requirements, culture }),
    });
  }

  async getMatchScore(employeeId, organizationId) {
    return this.request(`/recommendations/match-score/${employeeId}/${organizationId}`);
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;

