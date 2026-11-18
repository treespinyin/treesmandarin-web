/**
 * TreesMandarin Cloud API Client (Cloudflare Worker + D1)
 */
const TM_API = {
  async request(path, options = {}) {
    try {
      const res = await fetch(path, {
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        ...options
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`[TM_API] Fallback triggered for ${path}:`, err.message);
      return null;
    }
  },

  getTutors() {
    return this.request('/api/tutors');
  },

  certifyTutor(payload) {
    return this.request('/api/certify', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  getHomework(classCode) {
    return this.request(`/api/homework?class_code=${encodeURIComponent(classCode)}`);
  },

  createHomework(payload) {
    return this.request('/api/homework', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  submitVoiceScore(payload) {
    return this.request('/api/submissions', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  getLibrary() {
    return this.request('/api/library');
  },

  publishUgc(payload) {
    return this.request('/api/library', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  recordReferral(payload) {
    return this.request('/api/referral', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
};
