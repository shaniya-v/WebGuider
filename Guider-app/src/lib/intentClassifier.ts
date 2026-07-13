export interface IntentResult {
  intent: 'conversation' | 'website_task' | 'unclear';
  confidence: number;
}

const CONVERSATION_PATTERNS: [RegExp, number][] = [
  [/^(hi|hello|hey|hii?|hlo|hellow|howdy|greetings|what's up|sup)\b/i, 95],
  [/^(good\s*(morning|afternoon|evening|night|day))\b/i, 95],
  [/^(thanks|thank\s*you|thankyou|thx|ty|tq)\b/i, 95],
  [/^(bye|goodbye|see\s*you|later|cya|take\s*care)\b/i, 95],
  [/^how\s*(are|r)\s*(you|u)\b/i, 95],
  [/^(who\s*(are|r)\s*(you|u)|what\s*(are|r)\s*(you|u))\b/i, 95],
  [/^what\s*can\s*(you|u)\s*(do|help)\b/i, 95],
  [/^(i'?m\s*(fine|good|great|ok|okay))\b/i, 85],
  [/^(nice|great|awesome|cool)\s*(to\s*meet\s*you)?\b/i, 85],
  [/^(yes|no|maybe|sure|okay|ok)\s*$/i, 80],
  [/^(tell\s*me\s*about\s*yourself)\b/i, 95],
  [/^what('?s| is)\s*(your|ur)\s*(name|purpose|function)\b/i, 95],
  [/^(how\s*do\s*you\s*work|what\s*can\s*you\s*help\s*me\s*with)\b/i, 90],
  [/^(what('?s| is)\s*new|what('?s| is)\s*up)\b/i, 90],
  [/^(how('?s| is)\s*(it\s*going|everything|life))\b/i, 90],
  [/^(are\s*you\s*(a\s*)?(real|human|bot|ai))\b/i, 90],
  [/^(do\s*you\s*(have\s*)?(feelings|emotions|consciousness))\b/i, 90],
  [/^(i\s*(have|got)\s*(a\s*)?(question|doubt|query))\s*$/i, 75],
  [/^(can\s*i\s*ask\s*you\s*(a\s*)?(question|something))\s*$/i, 75],
  [/^(ok|okay|kk|alright|fine)\s*$/i, 80],
  [/^(hmm|hm|aha|oh\s*i\s*see|i\s*see)\s*$/i, 85],
];

const WEBSITE_TASK_KEYWORDS = [
  { words: ['login', 'sign in', 'log in', 'signin', 'authenticate'], score: 30 },
  { words: ['create', 'make', 'new', 'add', 'register', 'sign up', 'setup'], score: 25 },
  { words: ['upload', 'download', 'save', 'export', 'import'], score: 30 },
  { words: ['book', 'reserve', 'order', 'purchase', 'buy', 'checkout', 'pay'], score: 30 },
  { words: ['search', 'find', 'look up', 'query'], score: 20 },
  { words: ['fill', 'submit', 'apply for', 'apply to'], score: 25 },
  { words: ['change', 'update', 'edit', 'modify', 'delete', 'remove'], score: 20 },
  { words: ['click', 'press', 'select', 'choose', 'pick'], score: 20 },
  { words: ['navigate', 'go to', 'open', 'visit', 'browse'], score: 20 },
  { words: ['settings', 'preferences', 'profile', 'account', 'password'], score: 20 },
  { words: ['dashboard', 'homepage', 'feed', 'inbox', 'messages'], score: 20 },
  { words: ['how do i', 'how to', 'guide me', 'walk me', 'step by step'], score: 25 },
  { words: ['upload', 'attach', 'add my', 'upload my'], score: 30 },
  { words: ['apply', 'apply for', 'apply to'], score: 25 },
  { words: ['this page', 'this website', 'this site', 'this app', 'this form'], score: 15 },
  { words: ['find the', 'locate the', 'get to the', 'find my', 'locate my'], score: 20 },
  { words: ['hire', 'recruit', 'post a job', 'create a job'], score: 25 },
  { words: ['comment', 'post', 'share', 'like', 'follow', 'unfollow'], score: 20 },
  { words: ['configure', 'customize', 'personalize', 'set up'], score: 20 },
  { words: ['github', 'repository', 'repo', 'commit', 'push', 'pull'], score: 20 },
  { words: ['email', 'send', 'message', 'inbox'], score: 20 },
  { words: ['schedule', 'calendar', 'appointment', 'meeting'], score: 25 },
  { words: ['print', 'preview', 'view', 'show'], score: 15 },
  { words: ['ticket', 'flight', 'hotel', 'train', 'bus', 'cab', 'uber'], score: 30 },
  { words: ['resume', 'cv', 'portfolio', 'application'], score: 25 },
];

const CONVERSATION_KEYWORDS = [
  'your name', 'who created', 'who made', 'what are you', 'explain yourself',
  'tell me a joke', 'make me laugh', 'tell me something',
  'how are you', 'how is it going',
  'i am bored', 'i am tired', 'i am happy',
];

function scoreConversation(input: string): number {
  let maxScore = 0;
  for (const [pattern, score] of CONVERSATION_PATTERNS) {
    if (pattern.test(input)) {
      maxScore = Math.max(maxScore, score);
    }
  }
  for (const phrase of CONVERSATION_KEYWORDS) {
    if (input.includes(phrase)) {
      maxScore = Math.max(maxScore, 80);
    }
  }
  return maxScore;
}

function scoreWebsiteTask(input: string): number {
  let score = 0;
  for (const { words, score: wordScore } of WEBSITE_TASK_KEYWORDS) {
    for (const word of words) {
      if (input.includes(word)) {
        score += wordScore;
      }
    }
  }
  return Math.min(score, 100);
}

function getConversationResponse(input: string): string {
  const lower = input.toLowerCase().trim();

  if (/^(hi|hello|hey|hii?|hlo|hellow|howdy|greetings|what's up|sup)\b/i.test(lower)) {
    const replies = [
      'Hello! How can I help you today?',
      'Hi there! If you need help with anything on this website, just let me know!',
      'Hey! I\'m here to help you navigate and use websites. What do you need?',
      'Hello! Feel free to ask me to help with tasks on this page.',
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }

  if (/^(good\s*(morning|afternoon|evening|night|day))/i.test(lower)) {
    return 'Good day! How can I assist you with this website?';
  }

  if (/^(thanks|thank\s*you|thankyou|thx|ty|tq)/i.test(lower)) {
    return "You're welcome! Let me know if you need anything else on this page.";
  }

  if (/^(who\s*(are|r)\s*(you|u)|tell\s*me\s*about\s*yourself)\b/i.test(lower)) {
    return 'I\'m **Web-Guider**, your AI assistant for browsing and learning. I can help you accomplish tasks on websites step by step. Just tell me what you want to do — like logging in, signing up, booking tickets, or finding settings — and I\'ll guide you through it!';
  }

  if (/^what\s*can\s*(you|u)\s*(do|help)\b/i.test(lower)) {
    return 'I can help you with tasks on this website! Try asking me something like:\n\n- "Login to GitHub"\n- "Create a new repository"\n- "Book a flight ticket"\n- "Find the settings page"\n- "Change my password"\n- "Upload my resume"\n\nJust tell me what you want to do, and I\'ll guide you step by step!';
  }

  if (/^(bye|goodbye|see\s*you|later|cya|take\s*care)\b/i.test(lower)) {
    return 'Goodbye! Feel free to come back anytime you need help with a website.';
  }

  if (/^(how\s*(are|r)\s*(you|u)|how('?s| is)\s*(it\s*going|everything))\b/i.test(lower)) {
    return 'I\'m doing great, thanks for asking! Ready to help you with anything on this website. What do you need?';
  }

  if (/^(are\s*you\s*(a\s*)?(real|human|bot|ai))\b/i.test(lower)) {
    return 'I\'m an AI assistant built to help you browse and use websites more effectively. I can guide you through tasks like filling forms, navigating pages, and finding information!';
  }

  if (/^(do\s*you\s*(have\s*)?(feelings|emotions|consciousness))\b/i.test(lower)) {
    return 'I don\'t have feelings like humans do, but I\'m here to help you get things done on this website. What can I assist you with?';
  }

  if (/^(yes|no|maybe|sure|okay|ok|kk|alright)\s*$/i.test(lower)) {
    return 'Got it! What would you like me to help you with on this page?';
  }

  if (/^(hmm|hm|aha|oh\s*i\s*see|i\s*see)\s*$/i.test(lower)) {
    return 'Let me know if there\'s something specific you\'d like to do on this website!';
  }

  if (/^(tell\s*me\s*a\s*joke|make\s*me\s*laugh)\b/i.test(lower)) {
    return 'Why do programmers prefer dark mode? Because light attracts bugs! 😄\n\nNow, what would you like help with on this page?';
  }

  return 'I\'m here to help you navigate and use this website. Tell me what you\'d like to do — for example: "Help me log in", "Create an account", or "Find the settings page".';
}

function getUnclearResponse(input: string): string {
  return `I'm not quite sure what you mean. Are you looking for help with something on this website?

If you want me to guide you through a task, try something like:
- "Login to my account"
- "Create a new post"
- "Find the settings page"
- "Upload a file"

Or if you just want to chat, feel free to say hello!`;
}

export function classifyIntent(input: string): IntentResult {
  const trimmed = input.toLowerCase().trim();
  if (!trimmed) return { intent: 'unclear', confidence: 0 };

  const convScore = scoreConversation(trimmed);
  const taskScore = scoreWebsiteTask(trimmed);

  if (convScore >= 70 && convScore > taskScore) {
    return { intent: 'conversation', confidence: convScore };
  }

  if (taskScore >= 30 && taskScore >= convScore) {
    return { intent: 'website_task', confidence: Math.min(taskScore, 95) };
  }

  if (convScore > 50 && convScore > taskScore) {
    return { intent: 'conversation', confidence: convScore };
  }

  const wordCount = trimmed.split(/\s+/).length;
  if (wordCount <= 2 && taskScore < 20) {
    return { intent: 'unclear', confidence: 0 };
  }

  return { intent: 'website_task', confidence: Math.max(taskScore, 30) };
}

export { getConversationResponse, getUnclearResponse };
