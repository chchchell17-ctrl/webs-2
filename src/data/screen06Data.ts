import type {
  DialogueStep,
  Screen06Classification,
  Screen06Progress,
} from '../types/game.ts';

export function createDefaultScreen06Progress(): Screen06Progress {
  return {
    enteredCafe: false,
    selectedSeatId: null,
    casesCompleted: [],
    caseAttempts: {},
    partCChoice: null,
    partCCompleted: false,
    miniChallengeCompleted: false,
    challengeAttempts: {},
    firstAttemptCasesScore: 0,
    badgeAwarded: false,
    activityCompleted: false,
    adviceCentreUnlocked: false,
    currentStage: 'exterior',
  };
}

export interface CafeHotspotZone {
  id: string;
  label: string;
  x: number;
  y: number;
  description: string;
  pusheenTip: string;
}

export const CAFE_EXPLORE_ZONES: CafeHotspotZone[] = [
  {
    id: 'cafe-counter',
    label: 'Café Counter',
    x: 52,
    y: 48,
    description: 'Smoothies, cookies, and friendly Cyber Café digital safety menus!',
    pusheenTip: 'Always pause for a snack and think carefully before clicking strange pop-ups!',
  },
  {
    id: 'byte-station',
    label: "Byte's Workstation",
    x: 42,
    y: 28,
    description: 'Twin holographic displays monitoring Detective Town message traffic.',
    pusheenTip: 'Byte the helpful computer robot is waiting here to sort 10 digital message files with us!',
  },
  {
    id: 'computer-area',
    label: 'Computer Area',
    x: 18,
    y: 55,
    description: 'Row of glowing aqua café workstations ready for pupil detectives.',
    pusheenTip: 'Look for an empty computer seat so we can log in and inspect the messages.',
  },
  {
    id: 'seating-area',
    label: 'Seating Booths',
    x: 84,
    y: 66,
    description: 'Cosy booth tables where classmates talk about staying safe online.',
    pusheenTip: 'Talking to friends and trusted adults helps us spot sneaky tricks faster!',
  },
];

export interface CafeSeatOption {
  id: string;
  label: string;
  stationName: string;
  occupied: boolean;
  occupantName?: string;
  seatNote: string;
  xPct: number;
  yPct: number;
}

export const CAFE_COMPUTER_SEATS: CafeSeatOption[] = [
  {
    id: 'seat-1',
    label: 'Station 01',
    stationName: 'Window Desk A',
    occupied: true,
    occupantName: 'Mei Ling',
    seatNote: 'Classmate researching a science poster',
    xPct: 14,
    yPct: 58,
  },
  {
    id: 'seat-2',
    label: 'Station 02',
    stationName: 'Sunny Desk B',
    occupied: false,
    seatNote: 'Empty workstation · Freshly sanitized & ready!',
    xPct: 26,
    yPct: 51,
  },
  {
    id: 'seat-3',
    label: 'Station 03',
    stationName: 'Corner Desk C',
    occupied: true,
    occupantName: 'Hafiz',
    seatNote: 'Classmate practising typing',
    xPct: 78,
    yPct: 37,
  },
  {
    id: 'seat-4',
    label: 'Station 04',
    stationName: 'Byte Desk D',
    occupied: false,
    seatNote: "Empty workstation right beside Byte's monitor!",
    xPct: 89,
    yPct: 39,
  },
];

export const SCREEN06_MEET_BYTE_SCRIPT: DialogueStep[] = [
  {
    id: 's06-mb1',
    speaker: 'byte',
    speakerName: 'Byte',
    expression: 'happy',
    text: 'Hello there! My name is Byte!',
  },
  {
    id: 's06-mb2',
    speaker: 'player',
    expression: 'curious',
    text: 'Hi, Byte! Who are you?',
  },
  {
    id: 's06-mb3',
    speaker: 'byte',
    speakerName: 'Byte',
    expression: 'excited',
    text: "I'm a helper here at the Cyber Café! People receive lots of messages here every day.",
  },
  {
    id: 's06-mb4',
    speaker: 'byte',
    speakerName: 'Byte',
    expression: 'worried',
    text: 'Some of the messages are safe... some are suspicious... and some need more information before we decide!',
  },
  {
    id: 's06-mb5',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'encouraging',
    text: 'That sounds like a job for a Junior Digital Detective!',
  },
  {
    id: 's06-mb6',
    speaker: 'byte',
    speakerName: 'Byte',
    expression: 'curious',
    text: 'Could you sit at one of the empty computers and help me check our message files?',
  },
  {
    id: 's06-mb7',
    speaker: 'player',
    expression: 'excited',
    text: "Yes! We'd love to help!",
  },
];

export type Screen06PlatformType =
  | 'email-inbox'
  | 'school-portal'
  | 'gaming-chat'
  | 'smartphone-sms'
  | 'classroom-platform'
  | 'mobile-game-popup'
  | 'social-dm'
  | 'phone-notification'
  | 'security-alert'
  | 'private-contest-dm';

export interface Screen06MessageCase {
  id: number;
  title: string;
  platformType: Screen06PlatformType;
  platformLabel: string;
  sender: string;
  subjectOrTitle: string;
  timestamp: string;
  body: string;
  requests?: string;
  simulatedLink?: string;
  isTenseAlert: boolean;
  question: string;
  correctClassification: Screen06Classification;
  byteClueExplanation: string;
  pusheenSupportiveNote: string;
  wrongChoiceHint: string;
}

export const SCREEN06_MESSAGE_CASES: Screen06MessageCase[] = [
  {
    id: 1,
    title: 'Case 01 · Free Coins Offer',
    platformType: 'email-inbox',
    platformLabel: 'AeroMail Inbox',
    sender: 'Unknown Sender <rewards-drop@coin-bonus-now.xyz>',
    subjectOrTitle: 'YOU WON 1,000 FREE GAME COINS!',
    timestamp: 'Today · 4:10 PM',
    body: 'Congratulations, player! You won 1,000 FREE GAME COINS. Click the link below now and enter your game account username and password before midnight to claim!',
    requests: 'Game Username & Account Password',
    simulatedLink: 'http://free-coins-vault-claim.xyz/login',
    isTenseAlert: true,
    question: 'Should you trust this message?',
    correctClassification: 'suspicious',
    byteClueExplanation:
      'Warning sign! An unknown sender promises 1,000 free game coins, rushes you with a link, and asks for your game account password.',
    pusheenSupportiveNote:
      'Good eye! Never enter your game username or password on a strange link.',
    wrongChoiceHint:
      'Look closely at what it promises AND what it asks for: 1,000 free coins + a click link + your game password!',
  },
  {
    id: 2,
    title: 'Case 02 · Homework Reminder',
    platformType: 'school-portal',
    platformLabel: 'SJKC Ming Tao School Portal',
    sender: 'Teacher Chelsea (Class 5M Teacher)',
    subjectOrTitle: 'Homework Reminder: Year 5 English Reading',
    timestamp: 'Today · 2:30 PM',
    body: 'Dear Year 5 pupils, please remember to read Unit 4 pages 32–34 for tomorrow’s English class. Bring your exercise book and pencil case. No reply or private details needed!',
    requests: 'None (Class reading homework)',
    isTenseAlert: false,
    question: 'Is this message safe?',
    correctClassification: 'safe',
    byteClueExplanation:
      'Everything checks out! It comes from your known school teacher on the official school platform and asks for zero links or personal details.',
    pusheenSupportiveNote:
      'Spot on! Normal school homework reminders from your real teacher are safe.',
    wrongChoiceHint:
      'Who sent it, where did it arrive, and does it ask for secrets, links, or money? Check all 4 clues!',
  },
  {
    id: 3,
    title: 'Case 03 · Online Stranger Asking to Meet',
    platformType: 'gaming-chat',
    platformLabel: 'PixelQuest Lobby Chat',
    sender: 'ShadowFox_99 (Unknown Player)',
    subjectOrTitle: 'Hey want to meet at the mall?',
    timestamp: 'Online Now',
    body: "Hi! You play really well! Where do you go to school? Let's meet at the mall tomorrow afternoon—don't tell your parents so it stays our secret!",
    requests: 'School name & secret in-person meetup',
    isTenseAlert: true,
    question: 'What kind of message is this?',
    correctClassification: 'suspicious',
    byteClueExplanation:
      'Major danger red flag! A stranger online is asking where you go to school, asking to meet in person, and telling you to hide it from your parents.',
    pusheenSupportiveNote:
      'Great catch! Never share your school or meet an online stranger—tell a trusted adult immediately!',
    wrongChoiceHint:
      'Wait! An unknown person is asking personal questions and telling you to keep secrets from your parents!',
  },
  {
    id: 4,
    title: 'Case 04 · Fake Bank / Parent Alert',
    platformType: 'smartphone-sms',
    platformLabel: 'Smartphone SMS Alert',
    sender: '+60-19-884-0011 (Unverified Number)',
    subjectOrTitle: 'URGENT ACCOUNT LOCKED',
    timestamp: '3:52 PM',
    body: 'URGENT! Your family bank account is locked immediately! Tap the link within 15 minutes and send your card PIN and home address to verify.',
    requests: 'Card PIN & Home Address within 15 minutes',
    simulatedLink: 'http://verify-mybank-alert-fix.net/pin',
    isTenseAlert: true,
    question: 'What should you do with this message?',
    correctClassification: 'suspicious',
    byteClueExplanation:
      'Scam alert! Real banks never panic you with a 15-minute countdown SMS asking for your PIN and home address via a strange link.',
    pusheenSupportiveNote:
      'Excellent detective thinking! Urgent threats + PIN requests = huge red flag!',
    wrongChoiceHint:
      'Check the urgent countdown timer, strange link, and request for a card PIN!',
  },
  {
    id: 5,
    title: 'Case 05 · School Library Book Fair',
    platformType: 'classroom-platform',
    platformLabel: 'Year 5 Classroom Noticeboard',
    sender: 'SJKC Ming Tao School Library',
    subjectOrTitle: 'Annual Book Fair This Friday!',
    timestamp: 'Yesterday · 9:00 AM',
    body: 'Hello pupils and parents! Our School Library Book Fair takes place in the school hall this Friday from 8:00 AM to 1:00 PM. Everyone is welcome to browse storybooks!',
    requests: 'None (Official school hall event)',
    isTenseAlert: false,
    question: 'How would you classify this message?',
    correctClassification: 'safe',
    byteClueExplanation:
      'Official notice inside your verified school classroom platform! No strange links, no urgent threats, and no personal info requested.',
    pusheenSupportiveNote:
      'Purr-fect! Clear school announcements from verified school accounts are safe.',
    wrongChoiceHint:
      'Check the sender and platform carefully: this is a verified school event with no suspicious requests.',
  },
  {
    id: 6,
    title: 'Case 06 · Surprise Phone Pop-Up',
    platformType: 'mobile-game-popup',
    platformLabel: 'Mobile Game Pop-Up Banner',
    sender: 'LuckySpin Prize System',
    subjectOrTitle: 'YOU ARE OUR 1,000,000TH VISITOR!',
    timestamp: 'Just Now',
    body: 'CONGRATULATIONS! YOU ARE OUR 1,000,000TH VISITOR! Claim your brand-new smartphone in 30 SECONDS before someone else steals your spot! Tap NOW!',
    requests: 'Instant tap within 30 seconds',
    simulatedLink: 'http://win-free-phone-1million.biz/claim-now',
    isTenseAlert: true,
    question: 'Is this pop-up trustworthy?',
    correctClassification: 'suspicious',
    byteClueExplanation:
      'Classic pop-up trap! Fake "millionth visitor" prize + 30-second countdown pressure + unfamiliar web link.',
    pusheenSupportiveNote:
      'You spotted the rushing trick right away! Always close fake pop-up prizes.',
    wrongChoiceHint:
      'Look at the countdown pressure ("30 SECONDS") and "1,000,000th visitor" prize promise!',
  },
  {
    id: 7,
    title: 'Case 07 · Unfamiliar Cousin Check',
    platformType: 'social-dm',
    platformLabel: 'FamilyChat Direct Message',
    sender: 'Daniel_M99 (Unfamiliar Username)',
    subjectOrTitle: 'Hey, remember me from Raya?',
    timestamp: '11:20 AM',
    body: "Hi! It's me, your cousin! I changed my account username—can you tell me if you're at home later so I can drop something off?",
    requests: 'Checking if you are home',
    isTenseAlert: false,
    question: 'What should you decide here?',
    correctClassification: 'need-more-info',
    byteClueExplanation:
      'Smart pause! It could be a real cousin with a new account OR someone pretending—you cannot tell from a username alone without checking with your parents first!',
    pusheenSupportiveNote:
      'Exactly! When you are not 100% sure who someone really is, classify it as NEED MORE INFORMATION and ask your parents!',
    wrongChoiceHint:
      'Wait—there is no scam link here, yet we don’t actually recognize the username! Should we trust it automatically, or check with parents first?',
  },
  {
    id: 8,
    title: 'Case 08 · Official School Holiday Notice',
    platformType: 'phone-notification',
    platformLabel: 'Official School Parent-Pupil App',
    sender: 'SJKC Ming Tao Administration',
    subjectOrTitle: 'Reminder: Public Holiday Tomorrow',
    timestamp: 'Yesterday · 4:00 PM',
    body: 'Reminder to all pupils and parents: School will be closed tomorrow for the Public Holiday. Classes resume as usual the following school day.',
    requests: 'None (Official calendar update)',
    isTenseAlert: false,
    question: 'Is this message safe?',
    correctClassification: 'safe',
    byteClueExplanation:
      'Verified school announcement! No urgent link, no password request, and matches the official school calendar.',
    pusheenSupportiveNote:
      'Spot on! Calm, verified school notices with no personal info requests are safe.',
    wrongChoiceHint:
      'Examine the sender and message body: no links, no prize bait, and no personal info requested.',
  },
  {
    id: 9,
    title: 'Case 09 · Password Sharing Trap',
    platformType: 'security-alert',
    platformLabel: 'AeroMail Urgent Alert',
    sender: 'support-team@account-security-fix99.com',
    subjectOrTitle: 'FINAL NOTICE: Your Account Will Be Deleted!',
    timestamp: 'Today · 5:01 PM',
    body: 'ALERT! Your email account will be permanently deleted in 2 hours! Reply with your CURRENT PASSWORD immediately to keep your account active.',
    requests: 'Your Current Password',
    simulatedLink: 'http://account-security-fix99.com/keep-active',
    isTenseAlert: true,
    question: 'What kind of message is this?',
    correctClassification: 'suspicious',
    byteClueExplanation:
      'Huge red flag! Real companies and teachers NEVER ask you to send your password to keep an account.',
    pusheenSupportiveNote:
      'Well spotted! Your password is private—never reply with it to any message!',
    wrongChoiceHint:
      'Read the request line again: it is demanding your CURRENT PASSWORD with a 2-hour threat!',
  },
  {
    id: 10,
    title: 'Case 10 · Secret Contest Notice',
    platformType: 'private-contest-dm',
    platformLabel: 'Private Messenger DM',
    sender: 'MysteryGift_Admin (Not on friend list)',
    subjectOrTitle: 'SPECIAL SECRET CONTEST FOR KIDS',
    timestamp: 'Just Now',
    body: 'You have been chosen for a SPECIAL SECRET CONTEST! Send a selfie photo and your home address right now—and DO NOT tell your teacher or parents or you will lose your gift!',
    requests: 'Photo + Home Address + Keep it secret from adults',
    isTenseAlert: true,
    question: 'How should you classify this message?',
    correctClassification: 'suspicious',
    byteClueExplanation:
      'Extreme warning sign! Asking for a child’s photo, home address, and telling you to keep secrets from parents and teachers is NEVER safe.',
    pusheenSupportiveNote:
      'Bravo! Any message that tells you to hide things from your parents or teachers is a giant red flag!',
    wrongChoiceHint:
      'Look at all three danger signs: asks for your photo + home address + says DO NOT tell parents or teachers!',
  },
];

export interface PartCActionOption {
  id: 'A' | 'B' | 'C' | 'D';
  label: string;
  isCorrect: boolean;
  consequenceTitle: string;
  consequenceText: string;
}

export const SCREEN06_PART_C_SCENARIO = {
  title: 'SCENARIO: YOU JUST SPOTTED A SUSPICIOUS MESSAGE',
  prompt:
    'You notice an unfamiliar message promising free game coins if you click a link and type your password right now. WHAT SHOULD YOU DO?',
  options: [
    {
      id: 'A',
      label: 'A · Click the link immediately to see what happens',
      isCorrect: false,
      consequenceTitle: 'Oh no! Unsafe choice!',
      consequenceText:
        'Clicking suspicious links can open fake websites or harmful downloads on your computer!',
    },
    {
      id: 'B',
      label: 'B · Send them your personal details so they trust you',
      isCorrect: false,
      consequenceTitle: 'Danger! Never share private details!',
      consequenceText:
        'Strangers can misuse your name, home address, phone number, or password.',
    },
    {
      id: 'C',
      label: 'C · Stop and ask a trusted adult for help',
      isCorrect: true,
      consequenceTitle: 'Wise Detective Decision!',
      consequenceText:
        'Stopping right away and showing a parent, guardian, or teacher keeps you completely safe online!',
    },
    {
      id: 'D',
      label: 'D · Share the suspicious link with your friends',
      isCorrect: false,
      consequenceTitle: 'Wait! That spreads the risk!',
      consequenceText:
        'Forwarding a suspicious link might trick one of your friends into clicking a scam!',
    },
  ] as PartCActionOption[],
};

export interface MiniChallengeMessage {
  id: 'msg-a' | 'msg-b' | 'msg-c';
  label: string;
  sender: string;
  title: string;
  body: string;
  simulatedLink?: string;
  correctClassification: Screen06Classification;
  feedbackCorrect: string;
  feedbackWrong: string;
}

export const SCREEN06_MINI_CHALLENGE_MESSAGES: MiniChallengeMessage[] = [
  {
    id: 'msg-a',
    label: 'MESSAGE A',
    sender: 'School Librarian (Mdm. Tan)',
    title: 'Book Fair Flyer Tomorrow',
    body: 'Reminder: Tomorrow is the school book fair! Bring your pocket money or bookmark card if you want to browse in the library during recess.',
    correctClassification: 'safe',
    feedbackCorrect: 'Right! This comes from your known School Librarian about a real school event.',
    feedbackWrong: 'Check again! Does the School Librarian ask for any secret links or passwords?',
  },
  {
    id: 'msg-b',
    label: 'MESSAGE B',
    sender: 'SUPER-PRIZE-BOT <free-phones-2026.biz>',
    title: 'CLAIM YOUR FREE PHONE IN 1 HOUR!',
    body: 'URGENT! Click this link within 1 hour and enter your home address and phone number to claim your FREE brand-new phone!',
    simulatedLink: 'http://super-prize-free-phone-now.biz',
    correctClassification: 'suspicious',
    feedbackCorrect: 'Spot on! Urgent deadline + free phone + link + personal info = SUSPICIOUS!',
    feedbackWrong: 'Look closely! Urgent 1-hour limit + free phone + link + asking for address!',
  },
  {
    id: 'msg-c',
    label: 'MESSAGE C',
    sender: 'Adam_Lee_5M (Friend? Unverified Profile)',
    title: 'Hey check out this weird short link!',
    body: 'Hey, look at this! https://short-url.test/x92k — tell me what you see!',
    simulatedLink: 'https://short-url.test/x92k',
    correctClassification: 'need-more-info',
    feedbackCorrect:
      'Smart detective work! We cannot tell where that shortened link goes OR if it is really Adam—check with Adam in person or ask an adult first!',
    feedbackWrong:
      'Hold on! There is no prize scam here, yet a random shortened link with zero explanation means we should check first before trusting it!',
  },
];

export const SCREEN06_COMPLETION_SCRIPT: DialogueStep[] = [
  {
    id: 's06-c1',
    speaker: 'byte',
    speakerName: 'Byte',
    expression: 'celebrating',
    text: 'Amazing work, Detective! You helped me check EVERY message at the Cyber Café!',
  },
  {
    id: 's06-c2',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'happy',
    text: 'Look how smart you are at spotting Safe messages, Suspicious scams, and times we Need More Information!',
  },
  {
    id: 's06-c3',
    speaker: 'byte',
    speakerName: 'Byte',
    expression: 'excited',
    text: "I want to give you my special \"Byte's Helper\" badge! And I heard the Advice Centre across town is ready for you next!",
  },
];
