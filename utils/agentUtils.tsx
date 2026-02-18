// ============================================
// Agent Avatar Utilities
// ============================================

// Robot avatar using DiceBear Bottts (consistent robot headshots)
export const getRobotAvatar = (agentId: string): string => {
  // Map of agent IDs to deterministic seeds for consistent avatars
  const seedMap: Record<string, string> = {
    'main': 'ava',
    'ava': 'ava',
    'eli': 'eli',
    'kai': 'kai',
    'luca': 'luca',
    'maya': 'maya',
    'nina': 'nina',
    'noah': 'noah',
    'omar': 'omar',
    'sophia': 'sophia',
    'zara': 'zara',
    'lily_babak': 'lily-babak',
    'lily_nikan': 'lily-nikan',
  };
  
  const seed = seedMap[agentId.toLowerCase()] || agentId.toLowerCase();
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}&backgroundColor=1a1a2e`;
};

// Agent persona colors
export const getAgentColor = (agentId: string): string => {
  const colors: Record<string, string> = {
    'main': 'text-forge-emerald',
    'ava': 'text-forge-emerald',
    'eli': 'text-forge-amber',
    'kai': 'text-purple-400',
    'luca': 'text-blue-400',
    'maya': 'text-pink-400',
    'nina': 'text-forge-rose',
    'noah': 'text-orange-400',
    'omar': 'text-teal-400',
    'sophia': 'text-indigo-400',
    'zara': 'text-blue-400',
    'lily_babak': 'text-cyan-400',
    'lily_nikan': 'text-cyan-400',
  };
  return colors[agentId.toLowerCase()] || 'text-white';
};

// Agent display name formatting
export const getAgentDisplayName = (agentId: string): string => {
  const names: Record<string, string> = {
    'main': 'AVA',
    'ava': 'AVA',
    'eli': 'ELI',
    'kai': 'KAI',
    'luca': 'LUCA',
    'maya': 'MAYA',
    'nina': 'NINA',
    'noah': 'NOAH',
    'omar': 'OMAR',
    'sophia': 'SOPHIA',
    'zara': 'ZARA',
    'lily_babak': 'LILY (Babak)',
    'lily_nikan': 'LILY (Nikan)',
  };
  return names[agentId.toLowerCase()] || agentId.toUpperCase();
};

// Agent status color
export const getAgentStatusColor = (status: string): string => {
  switch (status) {
    case 'active': return 'bg-forge-emerald';
    case 'scaffolded': return 'bg-forge-amber';
    case 'deprecated': return 'bg-forge-rose';
    default: return 'bg-forge-text-muted';
  }
};

// Agent status border color
export const getAgentStatusBorderColor = (status: string): string => {
  switch (status) {
    case 'active': return 'border-forge-emerald/30';
    case 'scaffolded': return 'border-forge-amber/30';
    case 'deprecated': return 'border-forge-rose/30';
    default: return 'border-forge-border';
  }
};
