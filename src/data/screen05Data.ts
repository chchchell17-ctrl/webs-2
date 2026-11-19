import type {
  DialogueStep,
  Screen05Progress,
  Screen05WritingResponses,
} from '../types/game.ts';
import { evaluateWritingDeterministic } from '../utils/writingValidator.ts';

export function createDefaultScreen05Progress(): Screen05Progress {
  return {
    enteredAinasHouse: false,
    exploredHouseLayout: false,
    wrongRoomAttempts: [],
    foundAinasRoom: false,
    enteredAinasRoom: false,
    readCaseFile: false,
    readingResponses: [],
    firstAttemptScore: 0,
    readingCompleted: false,
    writingResponses: {
      adviceSeekingQuestion: '',
      adviceGivingMessage: '',
      adviceResponseMessage: '',
      writingFeedback: [],
      submitted: false,
    },
    writingCompleted: false,
    activityCompleted: false,
    cyberCafeUnlocked: false,
    currentStage: 'arrival',
  };
}

export const SCREEN05_ARRIVAL_SCRIPT: DialogueStep[] = [
  {
    id: 's05-a1',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'happy',
    text: "This is Aina's House! She's one of the pupils in Year 5.",
  },
  {
    id: 's05-a2',
    speaker: 'player',
    expression: 'curious',
    text: 'Why are we visiting her?',
  },
  {
    id: 's05-a3',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'thinking',
    text: "She received a strange message on her phone and isn't sure what to do.",
  },
  {
    id: 's05-a4',
    speaker: 'player',
    expression: 'encouraging',
    text: "Let's help her!",
  },
  {
    id: 's05-a5',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'happy',
    text: "Good idea! First, let's look inside the house to find Aina's bedroom.",
  },
];

export type HouseRoomId = 'living-room' | 'kitchen' | 'study-room' | 'ainas-bedroom';

export interface HouseRoomDefinition {
  id: HouseRoomId;
  name: string;
  floor: 'ground' | 'upper';
  description: string;
}

export const AINA_HOUSE_ROOMS: HouseRoomDefinition[] = [
  {
    id: 'study-room',
    name: 'Study Room',
    floor: 'upper',
    description: 'Bookshelves, study desk, warm reading lamp, and potted fern.',
  },
  {
    id: 'ainas-bedroom',
    name: "Aina's Bedroom",
    floor: 'upper',
    description: 'Cozy bed, bookshelf, window curtains, and study table.',
  },
  {
    id: 'living-room',
    name: 'Living Room',
    floor: 'ground',
    description: 'Sofa cushions, coffee table, rug, and family television.',
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    floor: 'ground',
    description: 'Dining table, pastel cabinets, kettle, and fruit basket.',
  },
];

export function buildBedroomEntryScript(nickname: string): DialogueStep[] {
  return [
    {
      id: 's05-b1',
      speaker: 'aina',
      speakerName: 'Aina',
      expression: 'surprised',
      text: 'Detective Pusheen! And... a new detective?',
    },
    {
      id: 's05-b2',
      speaker: 'pusheen',
      speakerName: 'Detective Pusheen',
      expression: 'happy',
      text: `Hi, Aina! This is Detective ${nickname}. We heard you received a mystery message.`,
    },
    {
      id: 's05-b3',
      speaker: 'aina',
      speakerName: 'Aina',
      expression: 'worried',
      text: "Yes! Look at my phone. I got this message this afternoon, and I don't know if it's real or fake!",
    },
    {
      id: 's05-b4',
      speaker: 'player',
      expression: 'curious',
      text: 'What does it say?',
    },
    {
      id: 's05-b5',
      speaker: 'aina',
      speakerName: 'Aina',
      expression: 'worried',
      text: 'It says I won a free tablet! I really want a tablet... should I click the link?',
    },
    {
      id: 's05-b6',
      speaker: 'pusheen',
      speakerName: 'Detective Pusheen',
      expression: 'encouraging',
      text: 'Hold on, Aina! Remember our rule: THINK BEFORE YOU CLICK!',
    },
    {
      id: 's05-b7',
      speaker: 'player',
      expression: 'encouraging',
      text: "Let's read the message carefully together!",
    },
    {
      id: 's05-b8',
      speaker: 'aina',
      speakerName: 'Aina',
      expression: 'curious',
      text: "Can you read it with me? I'm not sure which details are important.",
    },
    {
      id: 's05-b9',
      speaker: 'pusheen',
      speakerName: 'Detective Pusheen',
      expression: 'happy',
      text: `Detective ${nickname}, read the message and the story carefully, then help Aina understand what it says!`,
    },
    {
      id: 's05-b10',
      speaker: 'aina',
      speakerName: 'Aina',
      expression: 'encouraging',
      text: 'Please help me check everything!',
    },
  ];
}

export const AINA_SMARTPHONE_MESSAGE = {
  senderHeader: 'LUCKY REWARDS',
  senderSub: 'UNKNOWN SENDER',
  time: '3:45 PM',
  headline: 'CONGRATULATIONS, AINA!',
  paragraphs: [
    'You have been selected to receive a FREE TABLET!',
    'You are one of our lucky winners.',
    'Tap the link below before 6:00 p.m. today to claim your prize.',
    'To arrange delivery, enter your full name, home address and phone number.',
  ],
  ctaLabel: 'CLAIM YOUR PRIZE!',
  simulatedDestinationUrl: 'http://lucky-tablet-gift-claim.net/aina-winner',
};

export const AINA_READING_PASSAGE = {
  title: 'THE MYSTERY OF THE LUCKY MESSAGE',
  paragraphs: [
    'This afternoon at 3:45 p.m., Aina received a message on her phone from an unknown sender. The message claimed that she had been selected to receive a free brand-new tablet.',
    'The message told Aina to click on a link before 6:00 p.m. today to claim her prize. It also asked her to provide her full name, home address and phone number to arrange delivery.',
    'Aina felt excited at first, but she remembered that unexpected prize messages can be dangerous. She decided to ask Detective Pusheen and her friend for advice before doing anything.',
  ],
};

export interface Screen05ReadingQuestionDef {
  number: number;
  ainaQuestion: string;
  placeholder: string;
  correctResponse: string;
}

export const SCREEN05_READING_QUESTIONS: Screen05ReadingQuestionDef[] = [
  {
    number: 1,
    ainaQuestion: 'Who received the message?',
    placeholder: 'Type who received the message (e.g. Aina)...',
    correctResponse: "That's right! I received the message.",
  },
  {
    number: 2,
    ainaQuestion: 'Who sent the message to me?',
    placeholder: 'Type who sent the message...',
    correctResponse: "Exactly! We don't know who really sent the message.",
  },
  {
    number: 3,
    ainaQuestion: 'What prize did the message promise?',
    placeholder: 'Type the prize promised...',
    correctResponse: 'Yes! It promised me a free tablet.',
  },
  {
    number: 4,
    ainaQuestion: 'Before what time did I need to claim the prize?',
    placeholder: 'Type the deadline time (e.g. 6:00 p.m.)...',
    correctResponse: "That's right! The message told me to claim it before 6:00 p.m.",
  },
  {
    number: 5,
    ainaQuestion: 'What personal information did the message ask me to provide?',
    placeholder: 'List all three personal details asked...',
    correctResponse: 'Correct! It asked for my full name, home address and phone number.',
  },
];

export function validateReadingAnswer(
  questionNumber: number,
  rawInput: string
): { correct: boolean; feedback: string } {
  const normalized = rawInput.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!normalized) {
    return {
      correct: false,
      feedback: 'Please type your answer after reading the story beside Aina’s phone!',
    };
  }

  switch (questionNumber) {
    case 1: {
      const hasAina = /\baina\b/.test(normalized);
      if (hasAina) {
        return {
          correct: true,
          feedback: SCREEN05_READING_QUESTIONS[0].correctResponse,
        };
      }
      return {
        correct: false,
        feedback: "I don't think so. Read again!",
      };
    }

    case 2: {
      const hasUnknownCue =
        /\bunknown\b|\bmystery\b|\bmysterious\b|\bstranger\b|\bnot known\b|\bdon't know\b|\bdo not know\b|\bunfamiliar\b|\bno one knows\b|\bsomeone we don't know\b|\banonymous\b/.test(
          normalized
        );
      const mentionsLuckyRewardsOnly =
        /lucky rewards/.test(normalized) && !hasUnknownCue;

      if (mentionsLuckyRewardsOnly) {
        return {
          correct: false,
          feedback:
            "I don't think so. Read again! That's the name displayed on the message, but do we know who is really behind it?",
        };
      }
      if (hasUnknownCue) {
        return {
          correct: true,
          feedback: SCREEN05_READING_QUESTIONS[1].correctResponse,
        };
      }
      return {
        correct: false,
        feedback: "I don't think so. Read again!",
      };
    }

    case 3: {
      const hasTablet = /\btablet\b/.test(normalized);
      if (hasTablet) {
        return {
          correct: true,
          feedback: SCREEN05_READING_QUESTIONS[2].correctResponse,
        };
      }
      return {
        correct: false,
        feedback: "I don't think so. Read again!",
      };
    }

    case 4: {
      const hasSixPm =
        /\b6[:.]?00\s*(p\.?m\.?|pm)?\b/.test(normalized) ||
        /\b6\s*(p\.?m\.?|pm|o'?clock|in the evening)\b/.test(normalized) ||
        /\bsix\s*(o'?clock|p\.?m\.?|pm|in the evening)?\b/.test(normalized) ||
        /\b18[:.]?00\b/.test(normalized);

      if (hasSixPm) {
        return {
          correct: true,
          feedback: SCREEN05_READING_QUESTIONS[3].correctResponse,
        };
      }
      return {
        correct: false,
        feedback: "I don't think so. Read again!",
      };
    }

    case 5: {
      const hasName = /\bfull\s*name\b|\bname\b/.test(normalized);
      const hasAddress = /\bhome\s*address\b|\baddress\b/.test(normalized);
      const hasPhone =
        /\bphone(\s*number)?\b|\btelephone(\s*number)?\b|\bcontact(\s*number)?\b|\bmobile(\s*number)?\b|\bhp\s*number\b/.test(
          normalized
        );

      if (hasName && hasAddress && hasPhone) {
        return {
          correct: true,
          feedback: SCREEN05_READING_QUESTIONS[4].correctResponse,
        };
      }
      return {
        correct: false,
        feedback:
          "I don't think so. Read again! Look carefully at the second paragraph.",
      };
    }

    default:
      return {
        correct: false,
        feedback: "I don't think so. Read again!",
      };
  }
}

export const SCREEN05_TRANSITION_WRITING_SCRIPT: DialogueStep[] = [
  {
    id: 's05-tw1',
    speaker: 'aina',
    speakerName: 'Aina',
    expression: 'surprised',
    text: 'Oh! Now I understand why that message looked suspicious!',
  },
  {
    id: 's05-tw2',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'happy',
    text: 'Yes! It promised a free prize, rushed you with a time limit and asked for personal information!',
  },
  {
    id: 's05-tw3',
    speaker: 'aina',
    speakerName: 'Aina',
    expression: 'curious',
    text: 'What should I do when I get a message like this?',
  },
  {
    id: 's05-tw4',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'encouraging',
    text: 'Asking for advice and giving good advice are very important online-safety skills!',
  },
  {
    id: 's05-tw5',
    speaker: 'player',
    expression: 'curious',
    text: 'How do we give good advice?',
  },
  {
    id: 's05-tw6',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'happy',
    text: "In English, we can use helpful phrases like 'You should...', 'You shouldn't...' and 'You could...'!",
  },
  {
    id: 's05-tw7',
    speaker: 'aina',
    speakerName: 'Aina',
    expression: 'excited',
    text: 'Can you show me how to ask for advice and give advice?',
  },
  {
    id: 's05-tw8',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'celebrating',
    text: "Exactly! Let's practise together.",
  },
];

export const WRITING_WORD_BANK = [
  'STOP',
  'ASK',
  'TELL',
  'TRUSTED ADULT',
  'DO NOT CLICK',
  'PERSONAL INFORMATION',
  'SUSPICIOUS MESSAGE',
];

export function validateWritingStage(
  stage: 1 | 2 | 3,
  text: string
): { valid: boolean; feedback: string } {
  const res = evaluateWritingDeterministic('screen05', stage, text);
  return {
    valid: res.acceptable,
    feedback: res.tip ? `${res.feedback} ${res.tip}` : res.feedback,
  };
}

export function buildWritingRubricFeedback(
  responses: Pick<
    Screen05WritingResponses,
    'adviceSeekingQuestion' | 'adviceGivingMessage' | 'adviceResponseMessage'
  >
): string[] {
  const notes: string[] = [];
  if (responses.adviceSeekingQuestion.includes('?')) {
    notes.push('Asking for Advice: Clear question punctuation and polite help-seeking.');
  } else {
    notes.push('Asking for Advice: Clear request for help; remember to use "?" for questions.');
  }

  const lowerAdvice = responses.adviceGivingMessage.toLowerCase();
  if (/\byou should\b|\byou shouldn't\b|\byou should not\b|\byou could\b/.test(lowerAdvice)) {
    notes.push("Giving Advice: Used Year 5 modal advice structure ('You should / shouldn't / could').");
  } else {
    notes.push('Giving Advice: Shared clear online safety guidance to protect Aina.');
  }

  notes.push('Responding Politely: Closed the chat respectfully and confirmed safe next steps.');
  return notes;
}

export const SCREEN05_THANK_YOU_SCRIPT: DialogueStep[] = [
  {
    id: 's05-ty1',
    speaker: 'aina',
    speakerName: 'Aina',
    expression: 'celebrating',
    text: 'Thank you so much for helping me understand the message and giving me such great advice!',
  },
  {
    id: 's05-ty2',
    speaker: 'player',
    expression: 'happy',
    text: "You're welcome, Aina! I'm glad we could help!",
  },
  {
    id: 's05-ty3',
    speaker: 'aina',
    speakerName: 'Aina',
    expression: 'happy',
    text: "I won't click the link, and I'm going to show the message to my mother right away.",
  },
  {
    id: 's05-ty4',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'celebrating',
    text: 'That is the smartest decision, Aina!',
  },
  {
    id: 's05-ty5',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'happy',
    text: 'And Detective, you just used BOTH reading and writing skills to solve a real-life digital mystery!',
  },
  {
    id: 's05-ty6',
    speaker: 'aina',
    speakerName: 'Aina',
    expression: 'excited',
    text: 'Thank you, Detective! You helped me stay safe online!',
  },
];

export const SCREEN05_UNLOCK_CAFE_SCRIPT: DialogueStep[] = [
  {
    id: 's05-uc1',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'celebrating',
    text: "Case closed at Aina's House! Look at the Detective Town map—the Cyber Café is lighting up now!",
  },
  {
    id: 's05-uc2',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'excited',
    text: 'Ready for your next stop? Click VISIT CYBER CAFÉ when you are ready to head over!',
  },
];
