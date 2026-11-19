import type {
  DialogueStep,
  Screen04ClueId,
  Screen04Progress,
} from '../types/game.ts';

export function createDefaultScreen04Progress(): Screen04Progress {
  return {
    enteredCentre: false,
    learningExamplesExplored: {
      example1: false,
      example2: false,
      example3: false,
    },
    discoveredClues: [],
    missedInspectionClicks: 0,
    hintsUsed: 0,
    knowledgeAttempts: {},
    firstAttemptScore: 0,
    masteryAchieved: false,
    activityCompleted: false,
    ainasHouseUnlocked: false,
    currentStage: 'arrival',
  };
}

export const SCREEN04_WELCOME_SCRIPT: DialogueStep[] = [
  {
    id: 's04-w1',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'happy',
    text: 'Welcome to the Red Flag Centre! This bright glass laboratory is where detectives inspect tricky messages.',
  },
  {
    id: 's04-w2',
    speaker: 'player',
    expression: 'curious',
    text: 'Wait... why is it called the Red Flag Centre? Are there actual red flags inside?',
  },
  {
    id: 's04-w3',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'encouraging',
    text: 'Good question! In online safety, a RED FLAG is a warning sign or clue that a message might not be safe or true.',
  },
  {
    id: 's04-w4',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'thinking',
    text: 'Some messages look bright and friendly on the outside, so we have to read every detail carefully with our detective eyes!',
  },
  {
    id: 's04-w5',
    speaker: 'player',
    expression: 'excited',
    text: 'Got it! So Mission 02 is all about spotting those hidden red flags?',
  },
  {
    id: 's04-w6',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'celebrating',
    text: 'Yes! Welcome to MISSION 02: THE HIDDEN RED FLAGS! First, let us visit the Red Flag Learning Corner.',
    choices: [{ id: 'learn-signs', label: "LET'S LEARN THE SIGNS!" }],
  },
];

export interface RedFlagLearningCard {
  id: 'example1' | 'example2' | 'example3';
  number: number;
  title: string;
  tag: string;
  exampleHeadline: string;
  exampleSample: string;
  whatToWatch: string;
  pusheenTip: string;
  accentBg: string;
  borderColor: string;
  accentText: string;
}

export const RED_FLAG_LEARNING_CARDS: RedFlagLearningCard[] = [
  {
    id: 'example1',
    number: 1,
    title: 'STRANGE OR UNKNOWN SENDERS',
    tag: 'CHECK WHO SENT IT',
    exampleHeadline: 'Mystery Sender Address',
    exampleSample: 'From: Prize Team <helper@fast-gift-check.biz>',
    whatToWatch:
      'Unknown people or strange email addresses that do not match your school, family, or trusted website.',
    pusheenTip:
      'Always look closely at the sender name and email address after the @ symbol before trusting a message!',
    accentBg: 'from-rose-50 to-orange-50',
    borderColor: 'border-rose-300',
    accentText: 'text-[#BE123C]',
  },
  {
    id: 'example2',
    number: 2,
    title: 'UNEXPECTED PRIZES & RUSHED DEADLINES',
    tag: 'WATCH OUT FOR PRESSURE',
    exampleHeadline: 'Too Good To Be True + Hurry!',
    exampleSample: 'You won a FREE scooter! Reply in 15 minutes or lose it!',
    whatToWatch:
      'Surprises you never joined (like free tablets or cash) paired with urgent countdowns pushing you to act fast.',
    pusheenTip:
      'Tricky messages rush you so you forget to pause and think! Real prizes never demand an instant panic click.',
    accentBg: 'from-amber-50 to-yellow-50',
    borderColor: 'border-amber-300',
    accentText: 'text-[#B45309]',
  },
  {
    id: 'example3',
    number: 3,
    title: 'ODD LINKS & PRIVATE INFO REQUESTS',
    tag: 'PROTECT YOUR SECRETS',
    exampleHeadline: 'Clickable Trap + Personal Details',
    exampleSample: 'Tap win-now-claim.net and type your address & phone number.',
    whatToWatch:
      'Unfamiliar web links and requests for your full name, home address, phone number, school, or password.',
    pusheenTip:
      'Never tap a strange link or share private details online without asking a trusted adult first!',
    accentBg: 'from-purple-50 to-sky-50',
    borderColor: 'border-purple-300',
    accentText: 'text-[#6D28D9]',
  },
];

export const SCREEN04_COMPUTER_INTRO_SCRIPT: DialogueStep[] = [
  {
    id: 's04-ci1',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'happy',
    text: 'Now take a seat at our AeroMail Investigation Workstation!',
  },
  {
    id: 's04-ci2',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'encouraging',
    text: 'A suspicious email arrived in the test inbox. Use your magnifying cursor to inspect the message and find ALL FIVE hidden warning signs!',
  },
];

export const AEROMAIL_SUSPICIOUS_EMAIL = {
  folder: 'Test Inbox',
  subject: 'Your reward details',
  senderName: 'Rewards Desk',
  senderEmail: 'updates@bright-reward-mail.com',
  recipient: 'student-inbox@sjkcmingtao.edu.my',
  timeLabel: 'Today · 4:42 PM',
  greeting: 'Hello Friend,',
  prizeSentence:
    'Great news! Your account was picked in our special draw to receive a FREE brand-new gaming tablet worth RM1,200—even though you did not enter any contest!',
  urgencySentence:
    'You must claim your prize before 5:30 PM today or your reward will be given away forever!',
  ctaLabel: 'View reward details',
  ctaSimulatedUrl: 'http://bright-reward-check.net/claim',
  infoRequestSentence:
    'To arrange courier delivery, please reply with your full name, home address, school name, and parent phone number.',
  signOff: 'Warm regards, The Rewards Team',
};

export interface Screen04ClueDefinition {
  id: Screen04ClueId;
  order: number;
  label: string;
  boardTitle: string;
  boardSummary: string;
  pusheenFoundLine: string;
  hintText: string;
}

export const SCREEN04_CLUES: Screen04ClueDefinition[] = [
  {
    id: 'unknown-sender',
    order: 1,
    label: 'Sender Address',
    boardTitle: 'Red Flag #1: Unknown Sender',
    boardSummary: 'Sent by Rewards Desk <updates@bright-reward-mail.com>, an unfamiliar address.',
    pusheenFoundLine:
      'Spot on! "Rewards Desk <updates@bright-reward-mail.com>" is an unknown outside address—not from your school or family!',
    hintText: 'Look closely at the top header where it shows who sent the email.',
  },
  {
    id: 'unexpected-prize',
    order: 2,
    label: 'Unexpected Free Prize',
    boardTitle: 'Red Flag #2: Unexpected Free Prize',
    boardSummary: 'Promises a FREE RM1,200 gaming tablet even though you never joined a contest.',
    pusheenFoundLine:
      'Great detective work! Offering an expensive FREE tablet when you never entered a contest is a classic trick!',
    hintText: 'Read the opening paragraph—what amazing gift is it promising out of nowhere?',
  },
  {
    id: 'urgent-deadline',
    order: 3,
    label: 'Urgent Deadline',
    boardTitle: 'Red Flag #3: Urgent Time Pressure',
    boardSummary: 'Pressures you to claim before 5:30 PM today or lose it forever.',
    pusheenFoundLine:
      'Sharp eyes! "Before 5:30 PM today or given away forever" tries to rush you so you forget to check with an adult!',
    hintText: 'Look for a time limit or deadline trying to hurry the reader.',
  },
  {
    id: 'suspicious-link',
    order: 4,
    label: 'Suspicious Link',
    boardTitle: 'Red Flag #4: Suspicious Web Link',
    boardSummary: 'CTA button leads to an unfamiliar link: bright-reward-check.net/claim.',
    pusheenFoundLine:
      'Bullseye! Hovering or previewing "View reward details" reveals an untrusted web link (bright-reward-check.net/claim). Never open unfamiliar links directly!',
    hintText: 'Check the "View reward details" action button inside the email.',
  },
  {
    id: 'personal-info',
    order: 5,
    label: 'Personal Info Request',
    boardTitle: 'Red Flag #5: Personal Information Ask',
    boardSummary: 'Asks for full name, home address, school name, and parent phone number.',
    pusheenFoundLine:
      'Fantastic catch! Asking for your full name, home address, school, and phone number is a major online safety warning sign!',
    hintText: 'Look near the bottom of the email body—what private details is it asking you to send?',
  },
];

export const NON_CLUE_FEEDBACK: Record<string, string> = {
  subject:
    'The subject "Your reward details" looks polite and ordinary on its own—keep reading inside the email for the real warning signs!',
  timestamp:
    '"Today · 4:42 PM" is just the time the message arrived. Time stamps alone are normal message details!',
  greeting:
    '"Hello Friend," is a polite greeting, though slightly vague. Look deeper at what the email promises and asks for!',
  signoff:
    'A friendly sign-off like "Warm regards" is ordinary text—tricky messages often copy polite endings. Check the details above it!',
  sidebar:
    'That is just the AeroMail folder menu on the left. Focus your magnifying glass inside the suspicious email!',
};

export interface Screen04KnowledgeQuestion {
  id: string;
  number: number;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  retryPrompt: string;
}

export const SCREEN04_KNOWLEDGE_QUESTIONS: Screen04KnowledgeQuestion[] = [
  {
    id: 's04-q1',
    number: 1,
    prompt: 'What is a "red flag" in online safety?',
    options: [
      'A warning sign that a message or link might be unsafe or fake',
      'A fun decoration inside every school email',
      'A fast button that lets you download prizes quicker',
    ],
    correctIndex: 0,
    explanation: 'Correct! A red flag is a warning sign or clue that tells us to stop and be careful.',
    retryPrompt: 'Not quite! Think about what Detective Pusheen taught us at the Learning Corner.',
  },
  {
    id: 's04-q2',
    number: 2,
    prompt: 'Who was listed as the sender of the suspicious email in AeroMail?',
    options: [
      'Teacher Chelsea from SJKC Ming Tao',
      'Rewards Desk <updates@bright-reward-mail.com>',
      'Aina from Class 5M',
    ],
    correctIndex: 1,
    explanation: 'Spot on! It came from an unfamiliar outside address: Rewards Desk <updates@bright-reward-mail.com>.',
    retryPrompt: 'Check your Evidence Board! Who sent the email in AeroMail?',
  },
  {
    id: 's04-q3',
    number: 3,
    prompt: 'Why is the deadline "before 5:30 PM today" a warning sign?',
    options: [
      'Because computers automatically switch off at 5:30 PM',
      'Because it tries to rush you so you click without thinking or asking an adult',
      'Because prizes are always delivered only at 5:30 PM',
    ],
    correctIndex: 1,
    explanation: 'Exactly! Tricky messages use urgent deadlines to pressure you into clicking fast.',
    retryPrompt: 'Think carefully—why do suspicious messages try to make you hurry?',
  },
  {
    id: 's04-q4',
    number: 4,
    prompt: 'What personal details did the suspicious email ask the reader to reply with?',
    options: [
      'Only your favourite colour and pet name',
      'Your full name, home address, school name, and parent phone number',
      'Your Maths homework answers',
    ],
    correctIndex: 1,
    explanation: 'Great reading! Asking for private details like your name, home address, school, and phone number is unsafe.',
    retryPrompt: 'Read the Evidence Board note on Red Flag #5 and try again!',
  },
  {
    id: 's04-q5',
    number: 5,
    prompt: 'What is the safest thing to do when you spot red flags in an unexpected email?',
    options: [
      'Click "View reward details" quickly to check if it is real',
      'Reply politely with your home address so the courier knows where to go',
      'STOP, do not click any links or share personal info, and ASK a trusted adult',
    ],
    correctIndex: 2,
    explanation: 'Purr-fect decision! STOP, CHECK the red flags, and ASK a trusted adult such as your parent or teacher.',
    retryPrompt: 'Remember our Detective Safety Rule! Should you click or stop and ask a trusted adult?',
  },
];

export const SCREEN04_COMPLETION_SCRIPT: DialogueStep[] = [
  {
    id: 's04-c1',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'celebrating',
    text: 'Bravo, Detective! You spotted ALL FIVE red flags and showed sharp reading skills on the Knowledge Check!',
  },
  {
    id: 's04-c2',
    speaker: 'player',
    expression: 'happy',
    text: 'I can spot strange senders, fake free prizes, urgent deadlines, sketchy links, and requests for private info now!',
  },
  {
    id: 's04-c3',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'encouraging',
    text: 'Keep these three core reminders in mind wherever you go online: STOP, CHECK, and ASK!',
  },
];

export const THREE_CORE_REMINDERS = [
  {
    word: 'STOP',
    color: 'from-rose-500 to-red-600',
    bg: 'bg-rose-50 border-rose-200',
    textColor: 'text-[#BE123C]',
    detail: 'Pause before clicking any link, button, or unexpected pop-up.',
  },
  {
    word: 'CHECK',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50 border-amber-200',
    textColor: 'text-[#B45309]',
    detail: 'Inspect the sender, prize claims, time pressure, and private info asks.',
  },
  {
    word: 'ASK',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50 border-emerald-200',
    textColor: 'text-[#15803D]',
    detail: 'Talk to a parent, guardian, or teacher whenever something feels strange.',
  },
];

export const SCREEN04_UNLOCK_SCRIPT: DialogueStep[] = [
  {
    id: 's04-u1',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'surprised',
    text: 'Wait—an alert just came in from across Detective Town! Our classmate Aina received a lucky message on her phone and is worried!',
  },
  {
    id: 's04-u2',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'excited',
    text: "Aina's House is now unlocked on the Detective Town map! Let's walk over right away and help her!",
  },
];
