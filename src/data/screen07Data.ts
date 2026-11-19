import type { DialogueStep, Screen07Progress } from '../types/game.ts';

export function createDefaultScreen07Progress(): Screen07Progress {
  return {
    enteredAdviceCentre: false,
    learningCardsExplored: {
      card1: false,
      card2: false,
      card3: false,
    },
    writingPortfolio: {
      mission1Asking: '',
      mission2Giving: '',
      mission3Responding: '',
      feedbackNotes: [],
      evaluatedByAi: false,
      submittedAt: 0,
    },
    selfCheck: {
      askAdvice: false,
      giveAdvice: false,
      respondAdvice: false,
    },
    activityCompleted: false,
    gameArcadeUnlocked: false,
    currentStage: 'exterior',
  };
}

export interface AdviceCentreZone {
  id: string;
  label: string;
  x: number;
  y: number;
  description: string;
  pusheenNote: string;
}

export const ADVICE_CENTRE_ZONES: AdviceCentreZone[] = [
  {
    id: 'advice-desk',
    label: 'Advice Desk',
    x: 34,
    y: 52,
    description: 'Central pastel advice counter where pupils seek help with tricky messages.',
    pusheenNote: 'Always come to a trusted person when a digital message makes you feel unsure!',
  },
  {
    id: 'communication-wall',
    label: 'Communication Wall',
    x: 34,
    y: 28,
    description: 'Soft lavender & mint speech bubbles celebrating kind, helpful words.',
    pusheenNote: 'Asking, giving, and responding politely make online safety teamwork possible!',
  },
  {
    id: 'writing-corner',
    label: 'Writing Corner',
    x: 84,
    y: 52,
    description: 'Sunny wooden writing desk with notebooks, lamp, and cushion chair.',
    pusheenNote: 'This is our main mission station—we will write helpful advice messages right here!',
  },
  {
    id: 'conversation-area',
    label: 'Conversation Area',
    x: 70,
    y: 66,
    description: 'Calm pastel armchairs where friends talk through safe digital choices together.',
    pusheenNote: 'Good advice uses calm, friendly sentences so your friends listen and stay safe.',
  },
];

export const SCREEN07_PUSHEEN_INTRO_SCRIPT: DialogueStep[] = [
  {
    id: 's07-i1',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'happy',
    text: 'Welcome to the Advice Centre!',
  },
  {
    id: 's07-i2',
    speaker: 'player',
    expression: 'curious',
    text: 'What do we do here?',
  },
  {
    id: 's07-i3',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'encouraging',
    text: 'Earlier, you helped Aina and Byte spot dangerous messages. Now, it is time to learn how to use WORDS THAT HELP!',
  },
  {
    id: 's07-i4',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'excited',
    text: 'In this mission, you will write real messages to ASK for advice, GIVE safe advice, and RESPOND politely to advice!',
  },
  {
    id: 's07-i5',
    speaker: 'player',
    expression: 'excited',
    text: "Let's start!",
  },
];

export interface AdviceLearningCard {
  id: 'card1' | 'card2' | 'card3';
  badge: string;
  title: string;
  accentColor: string;
  summary: string;
  expressions: string[];
  exampleSpeaker: string;
  exampleLine: string;
  pusheenTip: string;
}

export const ADVICE_LEARNING_CARDS: AdviceLearningCard[] = [
  {
    id: 'card1',
    badge: 'CARD 01 · ASKING FOR ADVICE',
    title: 'ASKING FOR ADVICE',
    accentColor: '#0284C7',
    summary: 'When you feel unsure about a strange link or message, ask a friend or trusted adult politely.',
    expressions: [
      'What should I do?',
      'Could you give me some advice?',
      'Should I click this link?',
      'Can you help me?',
    ],
    exampleSpeaker: 'Pupil asking parent/friend',
    exampleLine: '"I received a strange message offering free game coins. What should I do?"',
    pusheenTip: 'Always end a question with a question mark (?) and tell them what happened!',
  },
  {
    id: 'card2',
    badge: 'CARD 02 · GIVING ADVICE',
    title: 'GIVING ADVICE',
    accentColor: '#7C3AED',
    summary: 'Help others stay safe online by using kind advice words like SHOULD, SHOULDN’T, and COULD.',
    expressions: [
      'You should...',
      "You shouldn't...",
      'You could...',
      'Remember to ask a trusted adult.',
    ],
    exampleSpeaker: 'Detective giving advice',
    exampleLine:
      '"You shouldn\'t enter your password. You should stop and ask a trusted adult!"',
    pusheenTip: '"Should" tells someone a smart step to do; "shouldn\'t" warns against an unsafe action!',
  },
  {
    id: 'card3',
    badge: 'CARD 03 · RESPONDING TO ADVICE',
    title: 'RESPONDING TO ADVICE',
    accentColor: '#0D9488',
    summary: 'After someone helps you, reply politely to show appreciation and confirm your safe choice.',
    expressions: [
      'Thank you for your advice!',
      "That's a good idea.",
      'I understand now.',
      'I will ask my parents.',
    ],
    exampleSpeaker: 'Pupil replying politely',
    exampleLine: '"Thank you for your advice! I will not click the link and I will ask my mother."',
    pusheenTip: 'Saying thank you and repeating your safe plan shows you are ready to protect yourself!',
  },
];

export const SCREEN07_SCENARIO_MESSAGE = {
  sender: 'GameRewards_Team (Unknown)',
  time: '4:25 PM',
  title: 'CLAIM 5,000 FREE GAME COINS NOW!',
  body: 'CONGRATULATIONS! You are selected for 5,000 FREE GAME COINS! Just click below and enter your account password to receive your reward!',
  friendQuestion:
    '"Hey! Look at this message I just got on my phone... 5,000 free game coins! Should I enter my password to get them?"',
};

export const SCREEN07_MISSION1_WORD_BANK = [
  'MESSAGE',
  'UNKNOWN SENDER',
  'PASSWORD',
  'HELP',
  'ADVICE',
  'SAFE',
];

export const SCREEN07_MISSION1_STARTERS = [
  'What should I do ',
  'Should I ',
  'Could you help me? ',
  'Is this message safe? ',
];

export const SCREEN07_MISSION2_WORD_BANK = [
  'STOP',
  'DO NOT CLICK',
  'PASSWORD',
  'TRUSTED ADULT',
  'PRIVATE',
  'UNKNOWN SENDER',
  'CHECK',
  'ASK FOR HELP',
];

export const SCREEN07_MISSION2_EXPRESSIONS = [
  'You should ',
  "You shouldn't ",
  'You could ',
];

export const SCREEN07_MISSION3_WORD_BANK = [
  'THANK YOU',
  'UNDERSTAND',
  'ASK',
  'PARENTS',
  'TRUSTED ADULT',
  'NOT CLICK',
  'BE CAREFUL',
];

export const SCREEN07_MISSION3_STARTERS = [
  'Thank you for your advice! ',
  'I understand now. ',
  'I will ask my parents and ',
];

export const SCREEN07_SELF_CHECK_ITEMS: Array<{
  key: 'askAdvice' | 'giveAdvice' | 'respondAdvice';
  label: string;
  subtitle: string;
}> = [
  {
    key: 'askAdvice',
    label: 'I CAN ASK FOR ADVICE',
    subtitle: 'I can ask questions like "What should I do?" or "Could you help me?" when unsure online.',
  },
  {
    key: 'giveAdvice',
    label: 'I CAN GIVE ADVICE',
    subtitle: 'I can use "You should...", "You shouldn\'t...", or "You could..." to warn friends safely.',
  },
  {
    key: 'respondAdvice',
    label: 'I CAN RESPOND TO ADVICE',
    subtitle: 'I can thank my helper politely and explain the safe step I will take next.',
  },
];

export const SCREEN07_COMPLETION_SCRIPT: DialogueStep[] = [
  {
    id: 's07-end1',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'celebrating',
    text: 'Wonderful writing, Detective! You used caring, clear English to ask for advice, give safe advice, and respond politely!',
  },
  {
    id: 's07-end2',
    speaker: 'player',
    expression: 'happy',
    text: 'Words really can help keep our friends safe online!',
  },
  {
    id: 's07-end3',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'excited',
    text: 'You have completed Activity 4: Words That Help! Look—the Game Arcade across Detective Town is now unlocked!',
  },
];
