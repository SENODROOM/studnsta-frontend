import api from "./api";

// Teacher Live Quiz Management
export const createLiveQuiz = (data) => api.post("/api/live-quiz/create", data).then(res => res.data);

export const getTeacherLiveQuizzes = (filters) => {
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);
  if (filters.status) params.append('status', filters.status);
  
  return api.get(`/api/live-quiz/teacher/my-quizzes?${params}`).then(res => res.data);
};

export const updateLiveQuizSettings = (id, settings) => api.put(`/api/live-quiz/${id}/settings`, settings).then(res => res.data);

export const getLiveQuizResults = (id, filters) => {
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);
  
  return api.get(`/api/live-quiz/${id}/results?${params}`).then(res => res.data);
};

// Student Live Quiz Access
export const getLiveQuizById = (id) => api.get(`/api/live-quiz/${id}`).then(res => res.data);

export const submitLiveQuizResults = (id, results) => api.post(`/api/live-quiz/${id}/submit`, results).then(res => res.data);

// Helper functions
export const generateQuizLink = (quizId) => {
  return `${window.location.origin}/quiz/live/${quizId}`;
};

export const validateQuizAccess = (quiz) => {
  if (!quiz.isLive) {
    return { valid: false, message: "This is not a live quiz" };
  }
  
  if (!quiz.isPublished) {
    return { valid: false, message: "Quiz is not active" };
  }
  
  return { valid: true };
};

export const calculateLiveQuizStats = (results) => {
  if (!results || results.length === 0) {
    return {
      totalParticipants: 0,
      averageScore: 0,
      bestScore: 0,
      worstScore: 0,
      averageTime: 0,
      passRate: 0,
      gradeDistribution: {}
    };
  }

  const scores = results.map(r => r.score);
  const times = results.map(r => r.timeTaken);
  
  // Calculate grade distribution
  const gradeDistribution = {
    'A+': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0
  };
  
  results.forEach(result => {
    const grade = result.grade || 'F';
    if (gradeDistribution.hasOwnProperty(grade)) {
      gradeDistribution[grade]++;
    }
  });

  return {
    totalParticipants: results.length,
    averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    bestScore: Math.max(...scores),
    worstScore: Math.min(...scores),
    averageTime: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
    passRate: Math.round((results.filter(r => r.score >= 60).length / results.length) * 100),
    gradeDistribution
  };
};

export const formatLiveQuizData = (quiz) => {
  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    subject: quiz.subject,
    topic: quiz.topic,
    duration: quiz.duration,
    questionCount: quiz.questionCount,
    isPublished: quiz.isPublished,
    liveSettings: quiz.liveSettings || {
      allowRetake: false,
      showResults: true,
      randomizeQuestions: false,
      randomizeOptions: true
    },
    participants: quiz.participants || 0,
    quizLink: generateQuizLink(quiz.id),
    createdAt: quiz.createdAt,
    tags: quiz.tags || []
  };
};

export const prepareLiveQuizForStudent = (quiz, settings) => {
  let questions = [...quiz.questions];
  
  // Randomize options if enabled
  if (settings.randomizeOptions) {
    questions = questions.map(q => {
      const options = [...q.options];
      const correctAnswer = q.correctAnswer;
      
      // Fisher-Yates shuffle
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
      
      // Find new correct answer index
      const newCorrectIndex = options.indexOf(q.options[correctAnswer]);
      
      return {
        ...q,
        options,
        correctAnswer: newCorrectIndex
      };
    });
  }
  
  // Randomize questions if enabled
  if (settings.randomizeQuestions) {
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
  }
  
  return {
    ...quiz,
    questions: questions.map(q => ({
      questionId: q.questionId,
      question: q.question,
      options: q.options
      // Note: correctAnswer and explanation are excluded for students
    }))
  };
};
