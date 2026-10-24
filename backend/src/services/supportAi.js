const SUPPORT_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

function isAiAvailable() {
  return Boolean(process.env.GROQ_API_KEY);
}

async function generateSupportReply({ category, subject, messages }) {
  if (!isAiAvailable()) return null;

  const system = [
    'You are AGSTYA support assistant for an Indian agriculture marketplace.',
    'Give concise, practical, safe guidance for farmers and buyers.',
    'Use only the conversation and the platform context; do not invent account data, order status, prices, or policies.',
    'Never ask for or repeat passwords, OTPs, payment card numbers, API keys, or other secrets.',
    'If the issue requires account access, a dispute decision, payment action, or human judgement, say that a human support admin should review it.',
    'Do not claim to be a human or claim an action was completed.',
    'Answer in the user’s language when it is clear from the latest message; otherwise use English.',
  ].join(' ');

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: SUPPORT_MODEL,
      temperature: 0.2,
      max_tokens: 500,
      messages: [
        { role: 'system', content: system },
        { role: 'system', content: `Support category: ${category}. Subject: ${subject}.` },
        ...messages.map((message) => ({
          role: message.sender_type === 'USER' ? 'user' : 'assistant',
          content: message.body,
        })),
      ],
    }),
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    const error = new Error(`Groq support request failed with status ${response.status}`);
    error.providerStatus = response.status;
    error.providerBody = errorBody.slice(0, 500);
    throw error;
  }

  const data = await response.json();
  const reply = data?.choices?.[0]?.message?.content?.trim();
  if (!reply) throw new Error('Groq returned an empty support response');
  return reply.slice(0, 4000);
}

async function generateIssueSummary({ category, subject, messages }) {
  if (!isAiAvailable() || messages.length === 0) return null;
  return generateSupportReply({
    category,
    subject: `Summarize this support issue in two concise sentences: ${subject}`,
    messages,
  });
}

module.exports = { isAiAvailable, generateSupportReply, generateIssueSummary };
