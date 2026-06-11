const KEYWORD_MAP = {
  Ragging: ['ragging', 'rag', 'seniors', 'juniors force', 'hostel torture'],
  Harassment: ['harass', 'harassment', 'molest', 'sexual', 'abuse', 'bully'],
  Corruption: ['bribery', 'bribe', 'money', 'marks', 'paper leak'],
  'Academic Grievance': ['marks', 'grade', 'attendance', 'exams', 'syllabus'],
};

function mockClassify(text) {
  const lower = text.toLowerCase();
  const scores = {};
  for (const [cat, keywords] of Object.entries(KEYWORD_MAP)) {
    scores[cat] = keywords.filter(kw => lower.includes(kw)).length;
  }
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topCategory = sorted[0][1] > 0 ? sorted[0][0] : 'Other';

  const distress = ['force', 'violence', 'beat', 'threat', 'emergency'];
  const count = distress.filter(w => lower.includes(w)).length;
  let severity = 'Low';
  if (count >= 2) severity = 'Critical';
  else if (count >= 1) severity = 'High';

  return { category: topCategory, severity, confidence: 90 };
}

module.exports = { classifyReport: async (title, desc) => mockClassify(`${title} ${desc}`) };