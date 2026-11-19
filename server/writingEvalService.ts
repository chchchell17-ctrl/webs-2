import { GoogleGenAI, Type } from '@google/genai';
import express, { type Request, type Response } from 'express';

export type WritingActivityContext = 'screen05' | 'screen07';
export type WritingStepNumber = 1 | 2 | 3;

export interface WritingEvaluationResult {
  acceptable: boolean;
  feedback: string;
  tip?: string;
  evaluatedByAi: boolean;
}

const COMMON_ENGLISH_FUNCTION_WORDS = new Set([
  'i', 'you', 'we', 'they', 'he', 'she', 'it', 'me', 'my', 'your', 'our', 'the', 'a', 'an',
  'is', 'am', 'are', 'was', 'were', 'be', 'do', 'does', 'did', 'can', 'could', 'should',
  'shouldnt', "shouldn't", 'would', 'will', 'wont', "won't", 'what', 'why', 'how', 'when',
  'where', 'who', 'if', 'to', 'for', 'of', 'in', 'on', 'at', 'with', 'about', 'from', 'not',
  'no', 'yes', 'please', 'thank', 'thanks', 'sorry', 'okay', 'ok', 'sure', 'hello', 'hi',
  'help', 'advice', 'ask', 'tell', 'stop', 'think', 'click', 'tap', 'link', 'message',
  'password', 'prize', 'tablet', 'coins', 'coin', 'free', 'game', 'phone', 'adult', 'parent',
  'parents', 'mum', 'mom', 'mother', 'dad', 'father', 'teacher', 'friend', 'unknown',
  'stranger', 'sender', 'safe', 'unsafe', 'suspicious', 'strange', 'weird', 'real', 'fake',
  'private', 'personal', 'information', 'details', 'name', 'address', 'number', 'understand',
  'idea', 'good', 'great', 'right', 'careful', 'check', 'never', 'dont', "don't", 'must',
  'need', 'got', 'get', 'received', 'got', 'sent', 'enter', 'share', 'give', 'show', 'ignore',
  'delete', 'block', 'report', 'trusted', 'someone', 'this', 'that', 'these', 'those', 'and',
  'or', 'but', 'so', 'because', 'very', 'really', 'now', 'first', 'before', 'after', 'today',
]);

function isLikelyGibberish(text: string): { gibberish: boolean; reason?: string } {
  const trimmed = text.trim();
  if (trimmed.length < 10) {
    return {
      gibberish: true,
      reason: 'Please write a full sentence (more than a couple of words) so your meaning is clear!',
    };
  }

  const words = trimmed
    .toLowerCase()
    .replace(/[^a-z'\s?!.,]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  if (words.length < 3) {
    return {
      gibberish: true,
      reason: 'Try writing at least 3 meaningful words in a complete English sentence!',
    };
  }

  // Repeated same word spam (e.g. "help help help help")
  const uniqueWords = new Set(words);
  if (uniqueWords.size <= 1 || (words.length >= 4 && uniqueWords.size <= 2 && words.every((w) => w.length < 5))) {
    return {
      gibberish: true,
      reason: 'Please write a genuine sentence instead of repeating the same word.',
    };
  }

  // Keyboard smash / gibberish token detection
  const gibberishRegex =
    /(asdf|qwer|zxcv|hjkl|yuio|bnm|fghj|dfgh|jkl;|aaaa|ssss|dddd|ffff|xxxx|zzzz)/i;
  if (gibberishRegex.test(trimmed)) {
    return {
      gibberish: true,
      reason: 'That looks like random keyboard letters! Write a clear sentence about what you want to say.',
    };
  }

  let oddWordCount = 0;
  let recognizedCount = 0;
  for (const rawWord of words) {
    const clean = rawWord.replace(/[^a-z']/g, '');
    if (!clean) continue;
    if (COMMON_ENGLISH_FUNCTION_WORDS.has(clean)) {
      recognizedCount += 1;
    }
    const noVowels = clean.length >= 3 && !/[aeiouy]/.test(clean);
    const fiveConsonants = /[bcdfghjklmnpqrstvwxz]{5,}/.test(clean);
    const tripleSameChar = /(.)\1\1/.test(clean);
    if (noVowels || fiveConsonants || tripleSameChar) {
      oddWordCount += 1;
    }
  }

  if (oddWordCount >= 1 && oddWordCount >= Math.ceil(words.length / 2)) {
    return {
      gibberish: true,
      reason: 'Some of those words look jumbled or like random letters. Try writing clear English words!',
    };
  }

  if (words.length >= 3 && recognizedCount === 0) {
    return {
      gibberish: true,
      reason:
        'Your answer does not seem to connect to the online safety conversation yet. Try using clear words or the Word Bank!',
    };
  }

  return { gibberish: false };
}

function hasNegationNearby(lower: string): boolean {
  return /\b(don't|do not|shouldn't|should not|never|stop|avoid|not|no|mustn't|must not|refuse)\b/.test(
    lower
  );
}

export function evaluateStudentWritingDeterministic(
  context: WritingActivityContext,
  step: WritingStepNumber,
  rawText: string
): WritingEvaluationResult {
  const trimmed = rawText.trim();
  const lower = trimmed.toLowerCase();

  const gibCheck = isLikelyGibberish(trimmed);
  if (gibCheck.gibberish) {
    return {
      acceptable: false,
      feedback: gibCheck.reason || 'Please write a clear, meaningful English sentence.',
      evaluatedByAi: false,
    };
  }

  if (step === 1) {
    // Asking for advice
    const looksLikeQuestion =
      trimmed.includes('?') ||
      /\b(what should|should i|could you|can you|how should|do you think|is this safe|is it safe|help me|please advise|for advice)\b/.test(
        lower
      );
    const hasRelevantTopic =
      context === 'screen05'
        ? /\b(message|link|tablet|prize|sender|unknown|stranger|real|fake|click|tap|safe|do|help|advice|phone)\b/.test(
            lower
          )
        : /\b(message|link|password|coins|coin|game|sender|unknown|friend|safe|click|enter|do|help|advice|real|fake)\b/.test(
            lower
          );

    if (!looksLikeQuestion || !hasRelevantTopic) {
      return {
        acceptable: false,
        feedback:
          context === 'screen05'
            ? 'Make sure you are asking a clear question about the suspicious message or link (for example: "What should I do with this strange message?").'
            : 'Ask a clear question seeking advice about the suspicious message or password request (remember "?" at the end!).',
        tip: 'Try starting with: "What should I do if..." or "Could you help me..."',
        evaluatedByAi: false,
      };
    }

    return {
      acceptable: true,
      feedback:
        'Well done! Your question clearly asks for help about a suspicious online message.',
      evaluatedByAi: false,
    };
  }

  if (step === 2) {
    // Giving online safety advice
    const unsafeClickOrPassword =
      /\b(click|tap|open)\b.{0,18}\blink\b/.test(lower) ||
      /\b(enter|give|share|send|type)\b.{0,20}\b(password|details|address|phone)\b/.test(lower) ||
      /\byou should\b.{0,12}\b(click|enter|share|give)\b/.test(lower);

    if (unsafeClickOrPassword && !hasNegationNearby(lower)) {
      return {
        acceptable: false,
        feedback:
          'Careful! Telling someone to click a suspicious link or share their password is NOT safe. Advise them NOT to click or share private info, and to ask a trusted adult.',
        tip: 'Try: "You shouldn\'t click the link or enter your password. You should ask a trusted adult."',
        evaluatedByAi: false,
      };
    }

    const hasAdviceStructure =
      /\b(you should|you shouldn't|you should not|you could|do not|don't|never|remember to|please|stop and|stop,|make sure)\b/.test(
        lower
      );
    const hasSafetyGuidance =
      /\b(click|tap|link|password|private|personal|info|information|name|address|phone|adult|parent|parents|teacher|mother|father|mum|dad|stop|delete|ignore|block|report|check|ask|tell|unknown|safe)\b/.test(
        lower
      );

    if (!hasAdviceStructure || !hasSafetyGuidance) {
      return {
        acceptable: false,
        feedback:
          'Give clear online safety advice using "You should...", "You shouldn\'t...", or "You could..." with safe actions like stopping, not clicking, or asking a trusted adult.',
        tip: 'Example: "You shouldn\'t enter your password. You should stop and ask a trusted adult."',
        evaluatedByAi: false,
      };
    }

    return {
      acceptable: true,
      feedback:
        'Excellent advice! You used clear advice language and gave a safe, helpful recommendation.',
      evaluatedByAi: false,
    };
  }

  // Step 3: Responding politely to advice
  const hasPolitePhrase =
    /\b(thank|thanks|appreciate|grateful|good idea|great idea|helpful|kind|understand|got it|makes sense)\b/.test(
      lower
    );
  const hasSafeCommitment =
    /\b(i will|i'll|i won't|i will not|ask|tell|parent|parents|mother|father|mum|dad|teacher|adult|careful|not click|don't click|keep safe|safe)\b/.test(
      lower
    );

  if (!hasPolitePhrase && !hasSafeCommitment) {
    return {
      acceptable: false,
      feedback:
        'Write a polite response thanking the person for their advice and saying what safe step you will take next.',
      tip: 'Example: "Thank you! I understand now. I will not click the link and I will ask my parents."',
      evaluatedByAi: false,
    };
  }

  if (!hasPolitePhrase) {
    return {
      acceptable: false,
      feedback:
        'Good safety plan! Remember to add a polite phrase too—like "Thank you!" or "That\'s a good idea."',
      tip: 'Start with "Thank you for the advice!" or "I understand, thanks!"',
      evaluatedByAi: false,
    };
  }

  return {
    acceptable: true,
    feedback:
      'Polite and thoughtful response! You thanked your helper and showed safe digital habits.',
    evaluatedByAi: false,
  };
}

export async function evaluateStudentWritingWithGemini(params: {
  context: WritingActivityContext;
  step: WritingStepNumber;
  text: string;
}): Promise<WritingEvaluationResult> {
  const { context, step, text } = params;
  const trimmed = text.trim();

  // Always block obvious gibberish / random keysmashing immediately
  const gibCheck = isLikelyGibberish(trimmed);
  if (gibCheck.gibberish) {
    return {
      acceptable: false,
      feedback: gibCheck.reason || 'Please write a clear sentence in English.',
      evaluatedByAi: false,
    };
  }

  const deterministicFallback = evaluateStudentWritingDeterministic(context, step, trimmed);
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return deterministicFallback;
  }

  const stagePromptDescription =
    step === 1
      ? context === 'screen05'
        ? 'Task 1 (Asking for advice): The Year 5 pupil writes as Aina asking a friend or trusted adult for advice about a suspicious "FREE TABLET" link message. Must meaningfully ask for advice/help or ask what to do.'
        : 'Task 1 (Asking for advice): The Year 5 pupil writes a question asking a friend or trusted adult for advice about a suspicious "5,000 FREE GAME COINS + enter password" message. Must meaningfully ask for advice/help or ask whether it is safe.'
      : step === 2
        ? context === 'screen05'
          ? 'Task 2 (Giving online safety advice): The pupil replies giving safe online-safety advice (do not click link / do not share personal details / ask trusted adult), ideally using advice words like should/shouldn\'t/could/stop/ask. Unsafe advice (telling Aina to click the link or share personal info) MUST be rejected.'
          : 'Task 2 (Giving online safety advice): Friend asks "Should I enter my password?". The pupil must give SAFE online safety advice (e.g. do not click, never share password, stop and ask a trusted adult/parents). Unsafe advice MUST be rejected.'
        : 'Task 3 (Responding politely to advice): After receiving safe advice, the pupil writes a polite response thanking the person and/or confirming they understand and will stay safe. Random unrelated sentences or rude replies MUST be rejected.';

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: [
        `You are an encouraging Year 5 Malaysian English & Online Safety teacher.`,
        `Evaluate if the pupil's message makes genuine, safe sense for the assigned task.`,
        `Reject random disconnected words, off-topic sentences, nonsense, or UNSAFE advice (e.g. "yes enter your password" or "click it").`,
        `Accept simple honest Year 5 English sentences even with minor spelling/grammar slips, as long as the meaning fits the task cleanly.`,
        `Task: ${stagePromptDescription}`,
        `Pupil's message: """${trimmed}"""`,
      ].join('\n\n'),
      config: {
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            acceptable: {
              type: Type.BOOLEAN,
              description: 'True only if the message is coherent, safe, and meaningfully accomplishes the task.',
            },
            feedback: {
              type: Type.STRING,
              description: 'Short, warm Year-5-friendly feedback sentence (1-2 sentences).',
            },
            tip: {
              type: Type.STRING,
              description: 'Optional brief hint or example if acceptable is false.',
            },
          },
          required: ['acceptable', 'feedback'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}') as {
      acceptable?: boolean;
      feedback?: string;
      tip?: string;
    };

    if (typeof parsed.acceptable === 'boolean' && typeof parsed.feedback === 'string') {
      return {
        acceptable: parsed.acceptable,
        feedback: parsed.feedback,
        tip: parsed.tip,
        evaluatedByAi: true,
      };
    }

    return deterministicFallback;
  } catch (err) {
    console.warn('Gemini writing evaluation fallback triggered:', err);
    return deterministicFallback;
  }
}

export function createWritingRouter(): express.Router {
  const router = express.Router();
  router.use(express.json({ limit: '24kb' }));

  router.post('/evaluate', async (req: Request, res: Response) => {
    const context = req.body?.context === 'screen05' ? 'screen05' : 'screen07';
    const rawStep = Number(req.body?.step);
    const step: WritingStepNumber = rawStep === 1 || rawStep === 2 || rawStep === 3 ? rawStep : 1;
    const text = typeof req.body?.text === 'string' ? req.body.text : '';

    const result = await evaluateStudentWritingWithGemini({ context, step, text });
    res.json({ ok: true, ...result });
  });

  return router;
}
