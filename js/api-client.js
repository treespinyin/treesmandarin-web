/**
 * TreesMandarin Cloud API Client v2.0 (Cloudflare Worker + D1)
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

  // 1. 認證大使名錄與核發認證
  getTutors() {
    return this.request('/api/tutors');
  },

  certifyTutor(payload) {
    return this.request('/api/certify', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // 2. 防作弊隨機考題與後端判分
  getRandomExam(limit = 10) {
    return this.request(`/api/exam/random?limit=${limit}`);
  },

  gradeExam(answers) {
    return this.request('/api/exam/grade', {
      method: 'POST',
      body: JSON.stringify({ answers })
    });
  },

  // 3. 雙層共創庫（forum / official）與記憶法分裂查詢
  getLibrary(status = 'official', targetWord = '') {
    const qs = new URLSearchParams({ status });
    if (targetWord) qs.set('target_word', targetWord);
    return this.request(`/api/library?${qs.toString()}`);
  },

  publishUgc(payload) {
    return this.request('/api/library', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // 4. 論壇互動（endorse / brilliant / cite / report_error）與自動晉升官方庫
  interactLibrary(payload) {
    return this.request('/api/library/interact', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // 5. 修改老師提交實質修正（觸發 15% 份額轉移或 45% 優化池平分）
  editLibrary(payload) {
    return this.request('/api/library/edit', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // 6. 班級作業、語音成績與推薦記帳
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

  recordReferral(payload) {
    return this.request('/api/referral', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // 7. 瀏覽器端插畫壓縮工具（上傳 R2 前自動轉 WebP，上限 1080px，節省空間與零伺服器記憶體）
  compressImageToWebP(file, maxWidth = 1080, quality = 0.75) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => { img.src = e.target.result; };
      reader.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error('WebP compression failed'))),
          'image/webp',
          quality
        );
      };
      reader.readAsDataURL(file);
    });
  }
};
