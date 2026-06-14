import api from "./api";

// Quiz Result CRUD Operations
export const createQuizResult = (data) => api.post("/api/quiz-results/", {
  ...data,
  tags: data.tags ? (Array.isArray(data.tags) ? data.tags : data.tags.split(',').map(t => t.trim())) : []
});

export const getAllQuizResults = (filters) => {
  const params = new URLSearchParams();
  if (filters.studentId) params.append('studentId', filters.studentId);
  if (filters.subject) params.append('subject', filters.subject);
  if (filters.topic) params.append('topic', filters.topic);
  if (filters.status) params.append('status', filters.status);
  if (filters.difficulty) params.append('difficulty', filters.difficulty);
  if (filters.quizType) params.append('quizType', filters.quizType);
  if (filters.tags) params.append('tags', filters.tags.join(','));
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);

  return api.get(`/api/quiz-results/?${params}`);
};

export const getQuizResultById = (id) => api.get(`/api/quiz-results/${id}`);

export const getMyQuizResults = (filters) => {
  const params = new URLSearchParams();
  if (filters.subject) params.append('subject', filters.subject);
  if (filters.topic) params.append('topic', filters.topic);
  if (filters.status) params.append('status', filters.status);
  if (filters.difficulty) params.append('difficulty', filters.difficulty);
  if (filters.quizType) params.append('quizType', filters.quizType);
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);

  return api.get(`/api/quiz-results/my-results?${params}`);
};

export const getStudentQuizResults = (studentId, filters) => {
  const params = new URLSearchParams();
  if (filters.subject) params.append('subject', filters.subject);
  if (filters.topic) params.append('topic', filters.topic);
  if (filters.status) params.append('status', filters.status);
  if (filters.difficulty) params.append('difficulty', filters.difficulty);
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);

  return api.get(`/api/quiz-results/student/${studentId}?${params}`);
};

export const updateQuizResult = (id, data) => api.put(`/api/quiz-results/${id}`, {
  ...data,
  tags: data.tags ? (Array.isArray(data.tags) ? data.tags : data.tags.split(',').map(t => t.trim())) : []
});

export const deleteQuizResult = (id) => api.delete(`/api/quiz-results/${id}`);

// Analytics and Statistics
export const getTopScores = (filters) => {
  const params = new URLSearchParams();
  if (filters.subject) params.append('subject', filters.subject);
  if (filters.topic) params.append('topic', filters.topic);
  if (filters.limit) params.append('limit', filters.limit || 10);

  return api.get(`/api/quiz-results/top-scores?${params}`);
};

export const getStudentSubjectStats = (studentId, subject) =>
  api.get(`/api/quiz-results/student/${studentId}/subject/${subject}/stats`);

export const getUserPerformanceOverview = (studentId) => {
  if (studentId) {
    return api.get(`/api/quiz-results/performance-overview?studentId=${studentId}`);
  }
  return api.get("/api/quiz-results/performance-overview");
};

// Helper functions
export const calculateQuizStats = (quizResults) => {
  if (!quizResults || quizResults.length === 0) {
    return {
      totalQuizzes: 0,
      averageScore: 0,
      bestScore: 0,
      worstScore: 0,
      totalTime: 0,
      averageTime: 0,
      completionRate: 0,
      subjectBreakdown: {}
    };
  }

  const completedQuizzes = quizResults.filter(result => result.status === 'completed');
  const totalQuizzes = quizResults.length;
  const scores = completedQuizzes.map(result => result.score);
  const times = completedQuizzes.map(result => result.timeTaken);

  const subjectBreakdown = {};
  completedQuizzes.forEach(result => {
    if (!subjectBreakdown[result.subject]) {
      subjectBreakdown[result.subject] = { count: 0, totalScore: 0, avgScore: 0, bestScore: 0 };
    }
    subjectBreakdown[result.subject].count++;
    subjectBreakdown[result.subject].totalScore += result.score;
    subjectBreakdown[result.subject].avgScore =
      subjectBreakdown[result.subject].totalScore / subjectBreakdown[result.subject].count;
    subjectBreakdown[result.subject].bestScore = Math.max(
      subjectBreakdown[result.subject].bestScore,
      result.score
    );
  });

  return {
    totalQuizzes,
    completedQuizzes: completedQuizzes.length,
    averageScore: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
    bestScore: scores.length > 0 ? Math.max(...scores) : 0,
    worstScore: scores.length > 0 ? Math.min(...scores) : 0,
    totalTime: times.reduce((a, b) => a + b, 0),
    averageTime: times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0,
    completionRate: Math.round((completedQuizzes.length / totalQuizzes) * 100),
    subjectBreakdown
  };
};

export const getPerformanceLevel = (score) => {
  if (score >= 90) return { level: 'Excellent', color: '#10b981', icon: 'trophy' };
  if (score >= 80) return { level: 'Good', color: '#3b82f6', icon: 'star' };
  if (score >= 70) return { level: 'Average', color: '#f59e0b', icon: 'check' };
  if (score >= 60) return { level: 'Below Average', color: '#f97316', icon: 'warning' };
  return { level: 'Poor', color: '#ef4444', icon: 'x-circle' };
};

export const formatTime = (seconds) => {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

export const getImprovementTrend = (recentResults) => {
  if (!recentResults || recentResults.length < 2) return { trend: 'stable', change: 0 };

  const recent = recentResults.slice(0, Math.min(5, recentResults.length));
  const scores = recent.map(result => result.score);
  const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
  const secondHalf = scores.slice(Math.floor(scores.length / 2));
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  const change = secondAvg - firstAvg;

  if (change > 5) return { trend: 'improving', change: Math.round(change) };
  if (change < -5) return { trend: 'declining', change: Math.round(change) };
  return { trend: 'stable', change: Math.round(change) };
};
