function mockSummarize(title, description, category, severity) {
  const cleanDesc = description.substring(0, 150) + '...';
  return `[${category} - ${severity}] ${cleanDesc}`;
}

module.exports = { generateSummary: async (title, desc, cat, sev) => mockSummarize(title, desc, cat, sev) };