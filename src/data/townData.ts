import type {
  AvatarConfig,
  BuildingDefinition,
  DialogueStep,
  GameSettings,
  InventoryState,
  StudentGameState,
  TutorialProgress,
} from '../types/game.ts';

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  baseStyle: 'cheerful',
  skinTone: 'light',
  hairStyle: 'short',
  hairColor: 'dark-brown',
  outfitStyle: 'hoodie',
  outfitColor: 'aqua',
  accessory: 'none',
  shoesStyle: 'trainers',
  shoesColor: 'white',
};

export const DEFAULT_TUTORIAL_PROGRESS: TutorialProgress = {
  characterConfirmed: false,
  welcomeConversationDone: false,
  profileExplored: false,
  bagExplored: false,
  missionTrackerExplored: false,
  settingsExplored: false,
  buildingsDiscovered: [],
  movementCompleted: false,
  hqSelected: false,
  tutorialCompleted: false,
};

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  soundEffects: true,
  backgroundMusic: true,
  dialogueNarration: false,
  subtitles: true,
  textSize: 'medium',
  reducedMotion: false,
};

export const DEFAULT_INVENTORY: InventoryState = {
  badges: [],
  collectibles: [],
  missionItems: [],
  specialRewards: [],
};

export function createDefaultStudentGameState(): StudentGameState {
  return {
    detectiveNickname: '',
    avatarConfig: null,
    tutorialProgress: { ...DEFAULT_TUTORIAL_PROGRESS, buildingsDiscovered: [] },
    settings: { ...DEFAULT_GAME_SETTINGS },
    inventory: {
      badges: [],
      collectibles: [],
      missionItems: [],
      specialRewards: [],
    },
    xp: 0,
    stars: 0,
    level: 1,
    currentMission: 'MISSION 01: THE MYSTERY OF THE UNEXPECTED PRIZE',
    completedMissions: [],
    unlockedBuildings: ['detective-hq'],
    lastPosition: { x: 45, y: 84.5, nodeId: 'plaza-center' },
    lastScene: 'customisation',
    updatedAt: 0,
  };
}

export const TOWN_BUILDINGS: BuildingDefinition[] = [
  {
    id: 'detective-hq',
    name: 'DETECTIVE HQ',
    description: 'Your first mission starts here!',
    pusheenLine: 'This is Detective HQ! Our adventure begins here.',
    order: 1,
    x: 16.5,
    y: 44.5,
    entranceNodeId: 'hq-door',
    accentColor: '#0284C7',
    glassGradient: 'linear-gradient(155deg, rgba(224,242,254,0.95), rgba(141,217,223,0.92))',
  },
  {
    id: 'red-flag-centre',
    name: 'RED FLAG CENTRE',
    description: 'Discover the warning signs hidden in suspicious messages.',
    pusheenLine:
      "At the Red Flag Centre, we'll learn how to spot warning signs in suspicious messages.",
    order: 2,
    x: 38.2,
    y: 39,
    entranceNodeId: 'red-flag-door',
    accentColor: '#DC2626',
    glassGradient: 'linear-gradient(155deg, rgba(254,226,226,0.95), rgba(245,213,230,0.92))',
  },
  {
    id: 'ainas-house',
    name: "AINA'S HOUSE",
    description: 'Help Aina solve her mysterious online message.',
    pusheenLine: "This is Aina's house. She needs our help to solve a mysterious message!",
    order: 3,
    x: 61.5,
    y: 38.5,
    entranceNodeId: 'aina-door',
    accentColor: '#9333EA',
    glassGradient: 'linear-gradient(155deg, rgba(253,242,248,0.95), rgba(220,204,245,0.92))',
  },
  {
    id: 'cyber-cafe',
    name: 'CYBER CAFÉ',
    description: 'Investigate suspicious digital messages.',
    pusheenLine: "At the Cyber Café, we'll investigate different digital messages!",
    order: 4,
    x: 82.8,
    y: 45,
    entranceNodeId: 'cafe-door',
    accentColor: '#EA580C',
    glassGradient: 'linear-gradient(155deg, rgba(255,237,213,0.95), rgba(186,230,253,0.92))',
  },
  {
    id: 'advice-centre',
    name: 'ADVICE CENTRE',
    description: 'Learn how to ask for, give and respond to advice.',
    pusheenLine: "Here, we'll learn how to ask for advice, give advice and respond to others!",
    order: 5,
    x: 56.5,
    y: 64.5,
    entranceNodeId: 'advice-door',
    accentColor: '#0D9488',
    glassGradient: 'linear-gradient(155deg, rgba(204,251,241,0.95), rgba(168,221,242,0.92))',
  },
  {
    id: 'game-arcade',
    name: 'GAME ARCADE',
    description: 'Find Daniel and complete your final reading challenge.',
    pusheenLine: "There's a special challenge waiting at the Game Arcade. We need to find Daniel!",
    order: 6,
    x: 32.5,
    y: 66.5,
    entranceNodeId: 'arcade-door',
    accentColor: '#7C3AED',
    glassGradient: 'linear-gradient(155deg, rgba(237,233,254,0.95), rgba(168,221,242,0.92))',
  },
  {
    id: 'digital-safe-garden',
    name: 'DIGITAL SAFE GARDEN',
    description: 'Complete your Digital Safety Passport.',
    pusheenLine:
      "And finally, we'll visit the Digital Safe Garden to complete our Digital Safety Passport!",
    order: 7,
    x: 81.5,
    y: 73.5,
    entranceNodeId: 'garden-door',
    accentColor: '#16A34A',
    glassGradient: 'linear-gradient(155deg, rgba(220,252,231,0.95), rgba(197,233,139,0.92))',
  },
];

// Walkable stone-path & wooden/stone-bridge waypoint network aligned to Digital_Detective_Village_Adventure_b1d6e640.png
export interface PathNode {
  id: string;
  x: number;
  y: number;
  neighbors: string[];
  label?: string;
}

export const TOWN_PATH_NODES: Record<string, PathNode> = {
  'plaza-center': {
    id: 'plaza-center',
    x: 45,
    y: 84.5,
    neighbors: ['arcade-door', 'advice-door'],
    label: 'Cobblestone Plaza',
  },
  'hq-door': {
    id: 'hq-door',
    x: 17.5,
    y: 54.5,
    neighbors: ['west-curve', 'nw-bend'],
    label: 'Detective HQ Entrance',
  },
  'west-curve': {
    id: 'west-curve',
    x: 5.5,
    y: 57.5,
    neighbors: ['hq-door', 'sw-curve'],
  },
  'sw-curve': {
    id: 'sw-curve',
    x: 14,
    y: 71,
    neighbors: ['west-curve', 'arcade-door'],
  },
  'nw-bend': {
    id: 'nw-bend',
    x: 27,
    y: 48.5,
    neighbors: ['hq-door', 'red-flag-door', 'mid-junction'],
  },
  'red-flag-door': {
    id: 'red-flag-door',
    x: 38.2,
    y: 48.5,
    neighbors: ['nw-bend', 'top-mid'],
  },
  'top-mid': {
    id: 'top-mid',
    x: 50,
    y: 49.5,
    neighbors: ['red-flag-door', 'aina-door', 'mid-junction'],
  },
  'mid-junction': {
    id: 'mid-junction',
    x: 44,
    y: 54.5,
    neighbors: ['nw-bend', 'top-mid', 'ne-bend'],
  },
  'aina-door': {
    id: 'aina-door',
    x: 61.5,
    y: 48,
    neighbors: ['top-mid', 'ne-bend'],
  },
  'ne-bend': {
    id: 'ne-bend',
    x: 72,
    y: 52,
    neighbors: ['aina-door', 'mid-junction', 'cafe-door', 'east-loop'],
  },
  'cafe-door': {
    id: 'cafe-door',
    x: 82.8,
    y: 55.5,
    neighbors: ['ne-bend'],
  },
  'east-loop': {
    id: 'east-loop',
    x: 73.5,
    y: 63,
    neighbors: ['ne-bend', 'advice-door'],
  },
  'arcade-door': {
    id: 'arcade-door',
    x: 32.5,
    y: 77.5,
    neighbors: ['sw-curve', 'plaza-center'],
  },
  'advice-door': {
    id: 'advice-door',
    x: 56.5,
    y: 75.5,
    neighbors: ['plaza-center', 'east-loop', 'bridge-west'],
  },
  'bridge-west': {
    id: 'bridge-west',
    x: 63.5,
    y: 81.5,
    neighbors: ['advice-door', 'bridge-east'],
  },
  'bridge-east': {
    id: 'bridge-east',
    x: 71.5,
    y: 82,
    neighbors: ['bridge-west', 'garden-door'],
    label: 'Stream Bridge',
  },
  'garden-door': {
    id: 'garden-door',
    x: 78.5,
    y: 83.5,
    neighbors: ['bridge-east'],
  },
};

// Walkable path segments for click-to-move hit testing
export const WALKABLE_SEGMENTS: Array<[string, string]> = [
  ['hq-door', 'west-curve'],
  ['west-curve', 'sw-curve'],
  ['sw-curve', 'arcade-door'],
  ['arcade-door', 'plaza-center'],
  ['plaza-center', 'advice-door'],
  ['advice-door', 'bridge-west'],
  ['bridge-west', 'bridge-east'],
  ['bridge-east', 'garden-door'],
  ['hq-door', 'nw-bend'],
  ['nw-bend', 'red-flag-door'],
  ['red-flag-door', 'top-mid'],
  ['top-mid', 'aina-door'],
  ['aina-door', 'ne-bend'],
  ['ne-bend', 'cafe-door'],
  ['nw-bend', 'mid-junction'],
  ['mid-junction', 'top-mid'],
  ['mid-junction', 'ne-bend'],
  ['ne-bend', 'east-loop'],
  ['east-loop', 'advice-door'],
];

function distToSegment(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): { distance: number; projX: number; projY: number } {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) {
    return { distance: Math.hypot(px - x1, py - y1), projX: x1, projY: y1 };
  }
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lenSq));
  const projX = x1 + t * dx;
  const projY = y1 + t * dy;
  return {
    distance: Math.hypot(px - projX, py - projY),
    projX,
    projY,
  };
}

/**
 * Checks whether a clicked (x%, y%) point on the town map is on a walkable stone path or bridge.
 * Returns the snapped walkable coordinates and nearest graph node, or null if off-path.
 */
export function resolveWalkableClick(
  x: number,
  y: number,
  tolerance = 7.5
): { x: number; y: number; nearestNodeId: string } | null {
  let bestDist = Infinity;
  let bestProjX = x;
  let bestProjY = y;
  let bestNodeId = 'plaza-center';

  for (const [aId, bId] of WALKABLE_SEGMENTS) {
    const a = TOWN_PATH_NODES[aId];
    const b = TOWN_PATH_NODES[bId];
    const result = distToSegment(x, y, a.x, a.y, b.x, b.y);
    if (result.distance < bestDist) {
      bestDist = result.distance;
      bestProjX = result.projX;
      bestProjY = result.projY;
      const distA = Math.hypot(result.projX - a.x, result.projY - a.y);
      const distB = Math.hypot(result.projX - b.x, result.projY - b.y);
      bestNodeId = distA <= distB ? aId : bId;
    }
  }

  if (bestDist > tolerance) {
    return null;
  }

  return {
    x: Number(bestProjX.toFixed(2)),
    y: Number(bestProjY.toFixed(2)),
    nearestNodeId: bestNodeId,
  };
}

/**
 * BFS shortest path between two path network nodes so the avatar never cuts across buildings or streams.
 */
export function findPathBetweenNodes(startId: string, endId: string): PathNode[] {
  if (!TOWN_PATH_NODES[startId] || !TOWN_PATH_NODES[endId]) {
    return [];
  }
  if (startId === endId) {
    return [TOWN_PATH_NODES[endId]];
  }
  const queue: string[][] = [[startId]];
  const visited = new Set<string>([startId]);

  while (queue.length > 0) {
    const currentPath = queue.shift()!;
    const lastId = currentPath[currentPath.length - 1];
    const neighbors = TOWN_PATH_NODES[lastId]?.neighbors ?? [];
    for (const nextId of neighbors) {
      if (visited.has(nextId)) continue;
      const nextPath = [...currentPath, nextId];
      if (nextId === endId) {
        return nextPath.map((id) => TOWN_PATH_NODES[id]);
      }
      visited.add(nextId);
      queue.push(nextPath);
    }
  }

  return [TOWN_PATH_NODES[endId]];
}

/**
 * Smooth continuous movement along the cobblestone pathway network for WASD / Arrow keys.
 * Automatically glides along curves and turns cleanly onto connected branches at intersections.
 */
export function stepAlongTownPath(
  x: number,
  y: number,
  dirX: number,
  dirY: number,
  stepDist: number
): { x: number; y: number; nodeId: string } {
  const dirLen = Math.hypot(dirX, dirY);
  if (dirLen === 0 || stepDist <= 0) {
    const snapped = resolveWalkableClick(x, y, 100);
    return { x, y, nodeId: snapped?.nearestNodeId ?? 'plaza-center' };
  }
  const ux = dirX / dirLen;
  const uy = dirY / dirLen;

  const rawX = Math.max(4, Math.min(92, x + ux * stepDist));
  const rawY = Math.max(44, Math.min(89, y + uy * stepDist));

  // Fast path: if raw target stays nicely inside the wide cobblestone corridor, move directly
  const directCheck = resolveWalkableClick(rawX, rawY, 3.2);
  if (directCheck && Math.hypot(rawX - directCheck.x, rawY - directCheck.y) <= 3.2) {
    return {
      x: Number(rawX.toFixed(2)),
      y: Number(rawY.toFixed(2)),
      nodeId: directCheck.nearestNodeId,
    };
  }

  // Otherwise, slide smoothly along the best-aligned walkable segment or branch at a junction
  let bestScore = -Infinity;
  let bestPoint: { x: number; y: number; nodeId: string } | null = null;

  for (const [aId, bId] of WALKABLE_SEGMENTS) {
    const a = TOWN_PATH_NODES[aId];
    const b = TOWN_PATH_NODES[bId];
    const segInfo = distToSegment(x, y, a.x, a.y, b.x, b.y);
    if (segInfo.distance > 6.5) continue;

    const segDx = b.x - a.x;
    const segDy = b.y - a.y;
    const segLen = Math.hypot(segDx, segDy);
    if (segLen === 0) continue;

    const tx = segDx / segLen;
    const ty = segDy / segLen;
    const dot = ux * tx + uy * ty;

    if (Math.abs(dot) < 0.1) continue;

    const sign = dot > 0 ? 1 : -1;
    const moveTx = tx * sign;
    const moveTy = ty * sign;
    const alignment = Math.abs(dot);

    // Pull gently toward segment centerline while advancing along tangent
    const pullX = segInfo.projX - x;
    const pullY = segInfo.projY - y;
    const advance = stepDist * Math.max(0.65, alignment);

    const candX = x + moveTx * advance + pullX * 0.35;
    const candY = y + moveTy * advance + pullY * 0.35;

    // Clamp candidate onto the segment so we don't overshoot past endpoints
    const clamped = distToSegment(candX, candY, a.x, a.y, b.x, b.y);
    const movedX = clamped.projX - x;
    const movedY = clamped.projY - y;
    const movedDist = Math.hypot(movedX, movedY);
    if (movedDist < 0.04) continue;

    const progressDot = (movedX * ux + movedY * uy) / movedDist;
    if (progressDot <= 0.05) continue;

    const score = alignment * 2 + progressDot - segInfo.distance * 0.18;
    if (score > bestScore) {
      bestScore = score;
      const distA = Math.hypot(clamped.projX - a.x, clamped.projY - a.y);
      const distB = Math.hypot(clamped.projX - b.x, clamped.projY - b.y);
      bestPoint = {
        x: Number(clamped.projX.toFixed(2)),
        y: Number(clamped.projY.toFixed(2)),
        nodeId: distA <= distB ? aId : bId,
      };
    }
  }

  if (bestPoint) {
    return bestPoint;
  }

  // Fallback: check nearest path node's neighbors so corners never stall
  let nearestNode = TOWN_PATH_NODES['plaza-center'];
  let minNodeDist = Infinity;
  for (const node of Object.values(TOWN_PATH_NODES)) {
    const d = Math.hypot(node.x - x, node.y - y);
    if (d < minNodeDist) {
      minNodeDist = d;
      nearestNode = node;
    }
  }

  let bestNeighbor: PathNode | null = null;
  let bestNeighborDot = 0.1;
  for (const neighborId of nearestNode.neighbors) {
    const neighbor = TOWN_PATH_NODES[neighborId];
    if (!neighbor) continue;
    const dx = neighbor.x - x;
    const dy = neighbor.y - y;
    const d = Math.hypot(dx, dy);
    if (d < 0.05) continue;
    const dot = (dx / d) * ux + (dy / d) * uy;
    if (dot > bestNeighborDot) {
      bestNeighborDot = dot;
      bestNeighbor = neighbor;
    }
  }

  if (bestNeighbor) {
    const dx = bestNeighbor.x - x;
    const dy = bestNeighbor.y - y;
    const d = Math.hypot(dx, dy);
    const move = Math.min(stepDist, d);
    const nx = x + (dx / d) * move;
    const ny = y + (dy / d) * move;
    return {
      x: Number(nx.toFixed(2)),
      y: Number(ny.toFixed(2)),
      nodeId: move >= d * 0.6 ? bestNeighbor.id : nearestNode.id,
    };
  }

  const fallback = resolveWalkableClick(x, y, 100);
  return {
    x: fallback?.x ?? x,
    y: fallback?.y ?? y,
    nodeId: fallback?.nearestNodeId ?? nearestNode.id,
  };
}

export function findNearestBuildingToPoint(
  x: number,
  y: number,
  maxDistance = 12
): BuildingDefinition | null {
  let closest: BuildingDefinition | null = null;
  let minDist = maxDistance;
  for (const building of TOWN_BUILDINGS) {
    const door = TOWN_PATH_NODES[building.entranceNodeId];
    const targetX = door ? door.x : building.x;
    const targetY = door ? door.y : building.y;
    const d = Math.hypot(targetX - x, targetY - y);
    if (d <= minDist) {
      minDist = d;
      closest = building;
    }
  }
  return closest;
}

export const WELCOME_DIALOGUE_SCRIPT: DialogueStep[] = [
  {
    id: 'w1',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'curious',
    text: 'Hmm... Who do we have here?',
  },
  {
    id: 'w2',
    speaker: 'player',
    expression: 'curious',
    text: 'Hello? Who are you?',
  },
  {
    id: 'w3',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'surprised',
    text: 'Oh! You must be our new Junior Detective!',
  },
  {
    id: 'w4',
    speaker: 'player',
    expression: 'thinking',
    text: 'Junior Detective?',
  },
  {
    id: 'w5',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'happy',
    text: "That's right! My name is Detective Pusheen. And I have been waiting for you!",
  },
  {
    id: 'w6',
    speaker: 'player',
    expression: 'curious',
    text: 'Waiting for me? Why?',
  },
  {
    id: 'w7',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'encouraging',
    text: 'Because we have a very important mission ahead of us!',
  },
  {
    id: 'w8',
    speaker: 'player',
    expression: 'curious',
    text: 'What kind of mission?',
  },
  {
    id: 'w9',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'excited',
    text: 'A digital mystery! There are messages, clues and secrets waiting to be discovered.',
  },
  {
    id: 'w10',
    speaker: 'player',
    expression: 'excited',
    text: 'That sounds exciting!',
  },
  {
    id: 'w11',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'encouraging',
    text: 'It certainly is! But before we begin, I need to show you how everything works.',
  },
  {
    id: 'w12',
    speaker: 'player',
    expression: 'happy',
    text: 'Okay!',
  },
  {
    id: 'w13',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'excited',
    text: 'Are you ready to become a Junior Digital Detective?',
    choices: [
      { id: 'yes-show', label: 'Yes! Show me!' },
      { id: 'im-ready', label: "I'm ready, Detective!" },
    ],
  },
  {
    id: 'w14',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'celebrating',
    text: "Fantastic! Let's explore!",
  },
];
