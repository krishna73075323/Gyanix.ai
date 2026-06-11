const EMOTIONS = {
  Fear: ['scared', 'afraid', 'fear', 'threat'],
  Anger: ['angry', 'hate', 'furious'],
  Distress: ['trauma', 'help', 'suffering'],
};

function mockSentiment(text) {
  const lower = text.toLowerCase();
  let label = 'Neutral';
  for (const [emo, words] of Object.entries(EMOTIONS)) {
    if (words.some(w => lower.includes(w))) label = emo;
  }
  return { score: label === 'Neutral' ? 0 : -0.8, label };
}

module.exports = { analyzeSentiment: async (text) => mockSentiment(text) };