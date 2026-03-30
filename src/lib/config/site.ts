import type { DestinationId } from '../store';

/* ── Destination config ── */
export interface DestinationConfig {
  id: DestinationId;
  label: string;
  href: string;
  description: string;
  gridZone: string;
  dofFocusDistance: number;
}

export const DESTINATIONS: Record<DestinationId, DestinationConfig> = {
  pulse: {
    id: 'pulse',
    label: 'Pulse',
    href: 'https://pulse.elevendots.dev',
    description: 'Writing & signal',
    gridZone: 'left',
    dofFocusDistance: 4.0,
  },
  axiom: {
    id: 'axiom',
    label: 'Axiom',
    href: 'https://elevendots.substack.com',
    description: 'Projects & proof',
    gridZone: 'right',
    dofFocusDistance: 6.0,
  },
  about: {
    id: 'about',
    label: 'About',
    href: '/about',
    description: 'Who & why',
    gridZone: 'center',
    dofFocusDistance: 2.5,
  },
};

export const DESTINATION_LIST = Object.values(DESTINATIONS);

/* ── About content ── */
export const ABOUT = {
  heading: 'Parikshit Dubey',
  subheading: 'Hardware\u2013software co-design engineer, researcher, and writer.',
  bio: [
    'My work begins with first principles and follows the full arc of computation, from physics and silicon to software, systems, and intelligent machines. I am drawn to the layers that shape modern computing: devices, architecture, operating systems, performance, reliability, and the ideas that connect them.',
    'ElevenDots is the field for that pursuit: a place for technical writing, thoughtful experiments, and the slow study of how complexity is built from fundamentals.',
  ],
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/iparikshitdubey/' },
  ],
} as const;

/* ── Dormant dots constellation ── */
export interface DormantDot {
  position: [number, number, number];
  depth: number;
  constellationIndex: number;
}

export const DORMANT_DOTS: DormantDot[] = [
  { position: [-3.2, 1.8, -2.0], depth: 0.7, constellationIndex: 0 },
  { position: [-1.5, 2.5, -3.5], depth: 0.9, constellationIndex: 1 },
  { position: [0.8, 1.2, -1.5], depth: 0.5, constellationIndex: 2 },
  { position: [2.5, 2.0, -4.0], depth: 1.0, constellationIndex: 3 },
  { position: [-2.0, -1.5, -2.5], depth: 0.6, constellationIndex: 4 },
  { position: [1.0, -0.8, -3.0], depth: 0.8, constellationIndex: 5 },
  { position: [3.5, -1.2, -1.8], depth: 0.4, constellationIndex: 6 },
  { position: [-0.5, -2.2, -4.5], depth: 1.0, constellationIndex: 7 },
];
