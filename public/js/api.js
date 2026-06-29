// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

class LoanWebAPI {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  // Auth Methods
  async register(email, username, password, full_name) {
    return this.post('/auth/register', { email, username, password, full_name });
  }

  async login(email, password) {
    const response = await this.post('/auth/login', { email, password });
    if (response.token) {
      this.token = response.token;
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  }

  async logout() {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Loan Methods
  async createLoan(borrower_name, principal_amount, interest_rate, tenure_months, start_date, description) {
    return this.post('/loans', { borrower_name, principal_amount, interest_rate, tenure_months, start_date, description });
  }

  async getLoans() {
    return this.get('/loans');
  }

  async getLoanDetails(id) {
    return this.get(`/loans/${id}`);
  }

  async updateLoan(id, data) {
    return this.put(`/loans/${id}`, data);
  }

  async deleteLoan(id) {
    return this.delete(`/loans/${id}`);
  }

  async getLoanStats() {
    return this.get('/loans/stats/summary');
  }

  // Payment Methods
  async addPayment(loan_id, amount, payment_date, month, notes) {
    return this.post('/payments', { loan_id, amount, payment_date, month, notes });
  }

  async getPayments(loan_id) {
    return this.get(`/payments/loan/${loan_id}`);
  }

  async updatePayment(id, data) {
    return this.put(`/payments/${id}`, data);
  }

  async deletePayment(id) {
    return this.delete(`/payments/${id}`);
  }

  async getPaymentStats() {
    return this.get('/payments/stats/summary');
  }

  // Helper Methods
  async get(endpoint) {
    return this.request('GET', endpoint);
  }

  async post(endpoint, data) {
    return this.request('POST', endpoint, data);
  }

  async put(endpoint, data) {
    return this.request('PUT', endpoint, data);
  }

  async delete(endpoint) {
    return this.request('DELETE', endpoint);
  }

  async request(method, endpoint, data = null) {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (this.token) {
      options.headers.Authorization = `Bearer ${this.token}`;
    }

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'API request failed');
      }
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  isAuthenticated() {
    return !!this.token;
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}

// Create global API instance
const api = new LoanWebAPI();
