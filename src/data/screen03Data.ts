import type { DialogueStep, Screen03Progress } from '../types/game.ts';

export function createDefaultScreen03Progress(): Screen03Progress {
  return {
    hqEntered: false,
    missionBriefingCompleted: false,
    videoCompleted: false,
    problemIdentified: false,
    decisionChoice: null,
    decisionCompleted: false,
    safetyIntroDone: false,
    rulesCompleted: {
      rule1: false,
      rule2: false,
      rule3: false,
    },
    knowledgeCheckCompleted: false,
    inductionCompleted: false,
    redFlagCentreUnlocked: false,
    currentStage: 'entrance',
  };
}

export const HQ_WELCOME_SCRIPT: DialogueStep[] = [
  {
    id: 'hq-w1',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'happy',
    text: 'Welcome to Detective HQ, Junior Detective!',
  },
  {
    id: 'hq-w2',
    speaker: 'player',
    expression: 'excited',
    text: 'Wow! This place is amazing!',
  },
  {
    id: 'hq-w3',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'encouraging',
    text: 'This is where we investigate mysterious messages, discover clues and solve digital mysteries!',
  },
  {
    id: 'hq-w4',
    speaker: 'player',
    expression: 'curious',
    text: 'So, what is our first case?',
  },
  {
    id: 'hq-w5',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'thinking',
    text: 'Excellent question! I have just received a very unusual report.',
  },
  {
    id: 'hq-w6',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'curious',
    text: "Someone has received a message promising an amazing prize. But something doesn't seem quite right...",
  },
  {
    id: 'hq-w7',
    speaker: 'player',
    expression: 'curious',
    text: "An amazing prize? What's wrong with that?",
  },
  {
    id: 'hq-w8',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'encouraging',
    text: 'Well, Detective, not every message we receive online is safe. Sometimes, messages can trick people into making unsafe choices.',
  },
  {
    id: 'hq-w9',
    speaker: 'player',
    expression: 'surprised',
    text: 'Oh! So we need to investigate?',
  },
  {
    id: 'hq-w10',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'excited',
    text: 'Exactly! Are you ready for your very first case?',
    choices: [{ id: 'lets-investigate', label: "LET'S INVESTIGATE!" }],
  },
];

export const BRIEFING_DIALOGUE_SCRIPT: DialogueStep[] = [
  {
    id: 'brief-1',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'encouraging',
    text: "Before we investigate, let's watch what happened.",
  },
  {
    id: 'brief-2',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'excited',
    text: 'Keep your detective eyes open. There might be something important in the video!',
  },
];

export const INVESTIGATION_VIDEO_SRC =
  '/assets/aistudio/WhatsApp_Video_2026-11-17_at_12.07.03_PM_e10896b5.mp4';

export interface StoryboardShot {
  id: number;
  startSec: number;
  endSec: number;
  startRatio: number;
  endRatio: number;
  title: string;
  narration: string;
}

export const VIDEO_TOTAL_DURATION_SEC = 24;

export const VIDEO_STORYBOARD_SHOTS: StoryboardShot[] = [
  {
    id: 1,
    startSec: 0,
    endSec: 6,
    startRatio: 0,
    endRatio: 0.25,
    title: 'Part 1 · Online Browsing',
    narration: 'A student is happily exploring the Wildlife Wonders website at his desk.',
  },
  {
    id: 2,
    startSec: 6,
    endSec: 12,
    startRatio: 0.25,
    endRatio: 0.5,
    title: 'Part 2 · Unexpected Pop-up',
    narration: 'Suddenly, a bright pop-up appears: "CONGRATULATIONS! YOU WON RM500!"',
  },
  {
    id: 3,
    startSec: 12,
    endSec: 17,
    startRatio: 0.5,
    endRatio: 0.72,
    title: 'Part 3 · Asking for Personal Info',
    narration: 'The message asks for his password, phone number, and home address to claim the prize.',
  },
  {
    id: 4,
    startSec: 17,
    endSec: 21,
    startRatio: 0.72,
    endRatio: 0.88,
    title: 'Part 4 · Feeling Unsure',
    narration: 'Wait a minute... he never joined any contest! Something feels suspicious.',
  },
  {
    id: 5,
    startSec: 21,
    endSec: 24,
    startRatio: 0.88,
    endRatio: 1.01,
    title: 'Part 5 · Pause & Decide',
    narration: 'The screen freezes with a question: Would YOU click this unexpected prize pop-up?',
  },
];

export interface MultipleChoiceOption {
  id: 'A' | 'B' | 'C';
  text: string;
}

export const PROBLEM_IDENTIFICATION_OPTIONS: MultipleChoiceOption[] = [
  {
    id: 'A',
    text: 'A student received an unexpected message promising a free prize and asking them to click a link.',
  },
  {
    id: 'B',
    text: 'A student could not play an online game.',
  },
  {
    id: 'C',
    text: 'A student received a homework reminder from a teacher.',
  },
];

export const SAFETY_INTRO_SCRIPT: DialogueStep[] = [
  {
    id: 'si-1',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'encouraging',
    text: "Now, Detective, let's learn something important.",
  },
  {
    id: 'si-2',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'curious',
    text: 'Do you know what online safety means?',
  },
  {
    id: 'si-3',
    speaker: 'player',
    expression: 'thinking',
    text: 'Not really!',
  },
  {
    id: 'si-4',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'happy',
    text: "That's okay! Online safety means protecting ourselves and making smart choices whenever we use the internet.",
  },
  {
    id: 'si-5',
    speaker: 'player',
    expression: 'curious',
    text: 'Does that mean when I play games or use the internet?',
  },
  {
    id: 'si-6',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'excited',
    text: 'Exactly! It includes websites, online games, apps, emails and messages.',
  },
  {
    id: 'si-7',
    speaker: 'player',
    expression: 'curious',
    text: 'So, how can I stay safe?',
  },
  {
    id: 'si-8',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'encouraging',
    text: 'Let me show you three important detective rules!',
  },
];

export interface OnlineSafetyRuleItem {
  id: 'rule1' | 'rule2' | 'rule3';
  number: number;
  heading: string;
  shortTag: string;
  pusheenSays: string[];
  exampleTitle: string;
  exampleItems: string[];
  remember: string;
  accentGradient: string;
  borderColor: string;
  accentText: string;
}

export const ONLINE_SAFETY_RULES: OnlineSafetyRuleItem[] = [
  {
    id: 'rule1',
    number: 1,
    heading: 'STOP BEFORE YOU CLICK',
    shortTag: 'Pause & Think First',
    pusheenSays: [
      'Never rush to click an unexpected message or link. Take a moment to think first.',
    ],
    exampleTitle: 'Think about this example:',
    exampleItems: [
      'You receive a message saying you have won a prize you never entered for. Should you click immediately?',
    ],
    remember: 'STOP AND THINK BEFORE CLICKING.',
    accentGradient: 'from-sky-50 via-white to-cyan-50',
    borderColor: 'border-sky-300',
    accentText: 'text-[#0369A1]',
  },
  {
    id: 'rule2',
    number: 2,
    heading: 'KEEP PERSONAL INFORMATION PRIVATE',
    shortTag: 'Protect Your Details',
    pusheenSays: ['Never share private information with strangers online.'],
    exampleTitle: 'Keep these private details safe:',
    exampleItems: ['Full name', 'Home address', 'School name', 'Password', 'Phone number'],
    remember: 'KEEP YOUR PERSONAL INFORMATION PRIVATE.',
    accentGradient: 'from-purple-50 via-white to-fuchsia-50',
    borderColor: 'border-purple-300',
    accentText: 'text-[#6D28D9]',
  },
  {
    id: 'rule3',
    number: 3,
    heading: 'ASK A TRUSTED ADULT',
    shortTag: 'Get Help Right Away',
    pusheenSays: [
      "If you receive a strange message or something makes you uncomfortable, don't handle it alone.",
      'Show it to someone you trust, such as your parent, guardian or teacher.',
    ],
    exampleTitle: 'Who can help you?',
    exampleItems: ['Parents or guardians at home', 'Teachers at school'],
    remember: 'ASKING FOR HELP IS A SMART DETECTIVE DECISION.',
    accentGradient: 'from-emerald-50 via-white to-teal-50',
    borderColor: 'border-emerald-300',
    accentText: 'text-[#0F766E]',
  },
];

export const KNOWLEDGE_CHECK_OPTIONS: MultipleChoiceOption[] = [
  { id: 'A', text: 'Click the link immediately.' },
  { id: 'B', text: 'Give the sender your personal information.' },
  { id: 'C', text: 'Stop and ask a trusted adult.' },
];

export const COMPLETION_DIALOGUE_SCRIPT: DialogueStep[] = [
  {
    id: 'comp-1',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'celebrating',
    text: "Fantastic work, Detective! Today, you've discovered why we must be careful when using the internet.",
  },
  {
    id: 'comp-2',
    speaker: 'player',
    expression: 'curious',
    text: 'So, not every message online can be trusted?',
  },
  {
    id: 'comp-3',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'encouraging',
    text: "That's right! We need to think carefully before clicking links, sharing information or responding to strangers.",
  },
  {
    id: 'comp-4',
    speaker: 'player',
    expression: 'happy',
    text: 'I understand!',
  },
  {
    id: 'comp-5',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'excited',
    text: 'Wonderful! But this is only the beginning. There are more clues waiting for us.',
  },
];

export const UNLOCK_DIALOGUE_SCRIPT: DialogueStep[] = [
  {
    id: 'unl-1',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'excited',
    text: 'Look, Detective! Our next location is ready!',
  },
  {
    id: 'unl-2',
    speaker: 'player',
    expression: 'curious',
    text: 'Where are we going?',
  },
  {
    id: 'unl-3',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'happy',
    text: "The Red Flag Centre! We'll learn how to spot warning signs hidden in digital messages.",
  },
  {
    id: 'unl-4',
    speaker: 'player',
    expression: 'excited',
    text: "Let's go!",
  },
];
