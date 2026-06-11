const logger = require('../utils/logger');

let openaiClient = null;
let isMockMode = false;

async function initAzureOpenAI() {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;

  if (!endpoint || !apiKey) {
    isMockMode = true;
    return null;
  }
  try {
    const { OpenAIClient, AzureKeyCredential } = await import('@azure/openai');
    openaiClient = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));
    return openaiClient;
  } catch (err) {
    isMockMode = true;
    return null;
  }
}

module.exports = { 
  initAzureOpenAI, 
  isInMockMode: () => isMockMode || !openaiClient,
  callOpenAI: async () => null 
};