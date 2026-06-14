import api from "./api";

export const getSubjects = () => api.get("/api/quiz/subjects").then(res => res.data);
export const getTopicsBySubject = (subject) => api.get(`/api/quiz/topics/${subject}`).then(res => res.data);
export const getQuestions = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.subject) params.append("subject", filters.subject);
  if (filters.topic) params.append("topic", filters.topic);
  if (filters.limit) params.append("limit", filters.limit);
  return api.get(`/api/quiz/questions?${params}`).then(res => res.data);
};
export const saveQuizResult = (quizData) => api.post("/api/quiz/result", quizData).then(res => res.data);
export const getQuizHistory = (userId, filters = {}) => {
  const params = new URLSearchParams();
  if (filters.page) params.append("page", filters.page);
  if (filters.limit) params.append("limit", filters.limit);
  if (filters.subject) params.append("subject", filters.subject);
  if (filters.topic) params.append("topic", filters.topic);
  return api.get(`/api/quiz/history/${userId}?${params}`).then(res => res.data);
};
export const getQuizStatistics = (userId) => api.get(`/api/quiz/statistics/${userId}`).then(res => res.data);

// Helper functions for quiz management
export const prepareQuizData = (questions, userAnswers, startTime) => {
  const endTime = new Date();
  const timeTaken = Math.floor((endTime - startTime) / 1000); // Convert to seconds
  
  let correctAnswers = 0;
  const answers = questions.map((question, index) => {
    const userAnswer = userAnswers[index];
    const isCorrect = userAnswer === question.correctAnswer;
    
    if (isCorrect) correctAnswers++;
    
    return {
      questionId: question._id,
      selectedAnswer: userAnswer,
      isCorrect,
      timeSpent: 0 // You can track per-question time if needed
    };
  });
  
  return {
    subject: questions[0]?.subject || "",
    topic: questions[0]?.topic || "",
    totalQuestions: questions.length,
    correctAnswers,
    timeTaken,
    answers,
    status: "completed"
  };
};

export const calculateQuizScore = (correctAnswers, totalQuestions) => {
  return Math.round((correctAnswers / totalQuestions) * 100);
};

export const getGradeFromScore = (score) => {
  if (score >= 90) return { grade: "A+", level: "Excellent", color: "#10b981" };
  if (score >= 80) return { grade: "A", level: "Good", color: "#3b82f6" };
  if (score >= 70) return { grade: "B", level: "Average", color: "#f59e0b" };
  if (score >= 60) return { grade: "C", level: "Below Average", color: "#f97316" };
  return { grade: "F", level: "Poor", color: "#ef4444" };
};

export const formatQuizTime = (seconds) => {
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
};

// Quiz state management helper
export const createQuizState = (questions) => {
  return {
    questions,
    currentIndex: 0,
    userAnswers: new Array(questions.length).fill(null),
    startTime: new Date(),
    isCompleted: false,
    timeRemaining: questions.length * 60, // 1 minute per question by default
    reviewMode: false
  };
};

export const navigateToQuestion = (quizState, index) => {
  if (index >= 0 && index < quizState.questions.length) {
    quizState.currentIndex = index;
  }
  return quizState;
};

export const submitAnswer = (quizState, answer) => {
  quizState.userAnswers[quizState.currentIndex] = answer;
  return quizState;
};

export const nextQuestion = (quizState) => {
  if (quizState.currentIndex < quizState.questions.length - 1) {
    quizState.currentIndex++;
  }
  return quizState;
};

export const previousQuestion = (quizState) => {
  if (quizState.currentIndex > 0) {
    quizState.currentIndex--;
  }
  return quizState;
};

export const toggleReviewMode = (quizState) => {
  quizState.reviewMode = !quizState.reviewMode;
  return quizState;
};

export const validateQuizCompletion = (quizState) => {
  const unansweredQuestions = quizState.userAnswers
    .map((answer, index) => answer === null ? index : null)
    .filter(index => index !== null);
  
  return {
    isComplete: unansweredQuestions.length === 0,
    unansweredQuestions,
    canSubmit: unansweredQuestions.length === 0 || quizState.reviewMode
  };
};
