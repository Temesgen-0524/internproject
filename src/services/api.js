const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthToken() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.token || null;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: credentials,
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: userData,
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  // User endpoints
  async getUsers() {
    return this.request('/users');
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: userData,
    });
  }

  // Complaint endpoints
  async getComplaints() {
    const response = await this.request('/complaints');
    return response.complaints || response.data || response || [];
  }

  async createComplaint(complaintData) {
    return this.request('/complaints', {
      method: 'POST',
      body: complaintData,
    });
  }

  async addComplaintResponse(complaintId, responseData) {
    return this.request(`/complaints/${complaintId}/responses`, {
      method: 'POST',
      body: responseData,
    });
  }

  async updateComplaintStatus(complaintId, status) {
    return this.request(`/complaints/${complaintId}/status`, {
      method: 'PATCH',
      body: { status },
    });
  }

  // Club endpoints
  async getClubs() {
    const response = await this.request('/clubs');
    return response.clubs || response.data || response || [];
  }

  async createClub(clubData) {
    return this.request('/clubs', {
      method: 'POST',
      body: clubData,
    });
  }

  async joinClub(clubId, memberData) {
    return this.request(`/clubs/${clubId}/join`, {
      method: 'POST',
      body: memberData,
    });
  }

  async approveClubMember(clubId, memberId) {
    return this.request(`/clubs/${clubId}/members/${memberId}/approve`, {
      method: 'PATCH',
    });
  }

  async rejectClubMember(clubId, memberId) {
    return this.request(`/clubs/${clubId}/members/${memberId}/reject`, {
      method: 'PATCH',
    });
  }

  async getClubJoinRequests(clubId) {
    return this.request(`/clubs/${clubId}/join-requests`);
  }

  // Post endpoints
  async getPosts() {
    const response = await this.request('/posts');
    return response.posts || response.data || response || [];
  }

  async createPost(postData) {
    return this.request('/posts', {
      method: 'POST',
      body: postData,
    });
  }

  async deletePost(postId) {
    return this.request(`/posts/${postId}`, {
      method: 'DELETE',
    });
  }

  // Election endpoints
  async getElections() {
    const response = await this.request('/elections');
    return response.elections || response.data || response || [];
  }

  async createElection(electionData) {
    return this.request('/elections', {
      method: 'POST',
      body: electionData,
    });
  }

  async voteInElection(electionId, candidateId) {
    return this.request(`/elections/${electionId}/vote`, {
      method: 'POST',
      body: { candidateId },
    });
  }

  async announceElectionResults(electionId) {
    return this.request(`/elections/${electionId}/announce`, {
      method: 'POST',
    });
  }

  // Contact endpoints
  async submitContactMessage(contactData) {
    return this.request('/contact', {
      method: 'POST',
      body: contactData,
    });
  }

  async getContactMessages() {
    const response = await this.request('/contact');
    return response.contacts || response.data || response || [];
  }
}

export const apiService = new ApiService();
export default apiService;