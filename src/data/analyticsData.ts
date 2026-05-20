export interface Party {
  id: number;
  name: string;
  abbreviation: string;
  color: string;
  emoji: string;
  votes: number;
  previousVotes: number;
}

export interface Booth {
  boothId: string;
  location: string;
  registered: number;
  voted: number;
  turnout: number;
  fraudFlags: number;
  status: 'Active' | 'Closed';
}

export interface Constituency {
  id: number;
  name: string;
  totalVoters: number;
  votesCast: number;
  turnout: number;
  leadingParty: string;
  partyBreakdown: { party: string; votes: number }[];
  booths: Booth[];
}

export const partiesInitial: Party[] = [
  { id: 1, name: 'Bharatiya Janata Party', abbreviation: 'BJP', color: '#FF9933', emoji: '🌸', votes: 1205, previousVotes: 1180 },
  { id: 2, name: 'Indian National Congress', abbreviation: 'INC', color: '#00BFFF', emoji: '🌿', votes: 876, previousVotes: 860 },
  { id: 3, name: 'Aam Aadmi Party', abbreviation: 'AAP', color: '#0066FF', emoji: '🧹', votes: 654, previousVotes: 640 },
  { id: 4, name: 'Trinamool Congress', abbreviation: 'TMC', color: '#20B2AA', emoji: '🌺', votes: 423, previousVotes: 415 },
  { id: 5, name: 'Bahujan Samaj Party', abbreviation: 'BSP', color: '#1560BD', emoji: '🐘', votes: 342, previousVotes: 335 },
];

export const liveTurnoutInitial = {
  totalRegistered: 5000,
  totalVoted: 3500,
  turnoutPercentage: 70.0,
  votesRemaining: 1500,
  pollingOpen: true,
  pollingEndsAt: '18:00',
  lastUpdated: new Date(),
};

export const constituenciesInitial: Constituency[] = [
  {
    id: 1, name: 'Shivajinagar', totalVoters: 1200, votesCast: 847, turnout: 70.6, leadingParty: 'BJP',
    partyBreakdown: [
      { party: 'BJP', votes: 312 }, { party: 'INC', votes: 198 }, { party: 'AAP', votes: 187 },
      { party: 'TMC', votes: 89 }, { party: 'BSP', votes: 61 },
    ],
    booths: [
      { boothId: 'KA-147-007', location: 'Govt. High School, MG Road', registered: 300, voted: 218, turnout: 72.7, fraudFlags: 2, status: 'Active' },
      { boothId: 'KA-147-008', location: 'Municipal Primary School', registered: 280, voted: 195, turnout: 69.6, fraudFlags: 0, status: 'Active' },
      { boothId: 'KA-147-009', location: 'Community Hall, Brigade Rd', registered: 320, voted: 234, turnout: 73.1, fraudFlags: 1, status: 'Active' },
      { boothId: 'KA-147-010', location: 'Govt. Girls School', registered: 300, voted: 200, turnout: 66.7, fraudFlags: 0, status: 'Active' },
    ],
  },
  {
    id: 2, name: 'Mahadevapura', totalVoters: 1100, votesCast: 720, turnout: 65.5, leadingParty: 'INC',
    partyBreakdown: [
      { party: 'BJP', votes: 198 }, { party: 'INC', votes: 234 }, { party: 'AAP', votes: 156 },
      { party: 'TMC', votes: 87 }, { party: 'BSP', votes: 45 },
    ],
    booths: [
      { boothId: 'KA-148-001', location: 'ITPL Community Center', registered: 350, voted: 220, turnout: 62.9, fraudFlags: 3, status: 'Active' },
      { boothId: 'KA-148-002', location: 'Whitefield School', registered: 400, voted: 280, turnout: 70.0, fraudFlags: 0, status: 'Active' },
      { boothId: 'KA-148-003', location: 'Marathahalli Booth', registered: 350, voted: 220, turnout: 62.9, fraudFlags: 1, status: 'Closed' },
    ],
  },
  {
    id: 3, name: 'Jayanagar', totalVoters: 950, votesCast: 712, turnout: 74.9, leadingParty: 'BJP',
    partyBreakdown: [
      { party: 'BJP', votes: 287 }, { party: 'INC', votes: 198 }, { party: 'AAP', votes: 134 },
      { party: 'TMC', votes: 56 }, { party: 'BSP', votes: 37 },
    ],
    booths: [
      { boothId: 'KA-149-001', location: '4th Block Primary School', registered: 320, voted: 245, turnout: 76.6, fraudFlags: 0, status: 'Active' },
      { boothId: 'KA-149-002', location: 'Jayanagar Complex', registered: 330, voted: 248, turnout: 75.2, fraudFlags: 1, status: 'Active' },
      { boothId: 'KA-149-003', location: 'South End Circle Hall', registered: 300, voted: 219, turnout: 73.0, fraudFlags: 0, status: 'Active' },
    ],
  },
  {
    id: 4, name: 'Rajajinagar', totalVoters: 800, votesCast: 432, turnout: 54.0, leadingParty: 'AAP',
    partyBreakdown: [
      { party: 'BJP', votes: 98 }, { party: 'INC', votes: 112 }, { party: 'AAP', votes: 134 },
      { party: 'TMC', votes: 56 }, { party: 'BSP', votes: 32 },
    ],
    booths: [
      { boothId: 'KA-150-001', location: 'Palace Road School', registered: 400, voted: 198, turnout: 49.5, fraudFlags: 4, status: 'Active' },
      { boothId: 'KA-150-002', location: 'West of Chord Rd Hall', registered: 400, voted: 234, turnout: 58.5, fraudFlags: 0, status: 'Active' },
    ],
  },
  {
    id: 5, name: 'Chickpet', totalVoters: 600, votesCast: 498, turnout: 83.0, leadingParty: 'BSP',
    partyBreakdown: [
      { party: 'BJP', votes: 89 }, { party: 'INC', votes: 98 }, { party: 'AAP', votes: 112 },
      { party: 'TMC', votes: 78 }, { party: 'BSP', votes: 121 },
    ],
    booths: [
      { boothId: 'KA-151-001', location: 'Chickpet Market Hall', registered: 300, voted: 251, turnout: 83.7, fraudFlags: 1, status: 'Active' },
      { boothId: 'KA-151-002', location: 'Avenue Road School', registered: 300, voted: 247, turnout: 82.3, fraudFlags: 0, status: 'Active' },
    ],
  },
  {
    id: 6, name: 'Basavanagudi', totalVoters: 350, votesCast: 291, turnout: 83.1, leadingParty: 'INC',
    partyBreakdown: [
      { party: 'BJP', votes: 56 }, { party: 'INC', votes: 89 }, { party: 'AAP', votes: 67 },
      { party: 'TMC', votes: 45 }, { party: 'BSP', votes: 34 },
    ],
    booths: [
      { boothId: 'KA-152-001', location: 'Gandhi Bazaar School', registered: 200, voted: 167, turnout: 83.5, fraudFlags: 0, status: 'Closed' },
      { boothId: 'KA-152-002', location: 'Basavanagudi Grounds', registered: 150, voted: 124, turnout: 82.7, fraudFlags: 2, status: 'Active' },
    ],
  },
];
