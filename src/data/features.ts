/** The four launch differentiators, in display order. */
export interface Feature {
  id: string;
  title: string;
  description: string;
  /** Inline SVG path(s) drawn on a 24px grid, 1.5px stroke — per brand icon spec. */
  iconPaths: string[];
}

export const FEATURES: Feature[] = [
  {
    id: 'one-tap-logging',
    title: 'One tap logs everyone',
    description:
      'Tandem feed? Synced naps? Log it for all your babies in a single tap — not once per profile. Because at 3am, every tap counts.',
    iconPaths: [
      'M12 5v14M5 12h14', // plus
      'M12 21a9 9 0 1 0-9-9', // open circle
    ],
  },
  {
    id: 'side-by-side',
    title: 'Everyone, side by side',
    description:
      'One screen shows every baby’s feeds, sleep and diapers together. Spot who’s cluster feeding and who’s short on sleep — no profile-flipping, no mental math.',
    iconPaths: [
      'M4 4h6.5v16H4zM13.5 4H20v16h-6.5z', // two columns
    ],
  },
  {
    id: 'shared-caregivers',
    title: 'Built for the whole team',
    description:
      'You, your partner, grandma, the night nurse — everyone logs to one shared record, live. Handoffs without the twenty questions.',
    iconPaths: [
      'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20a6 6 0 0 1 12 0', // person
      'M16 8a3 3 0 1 1 2 5.2M21 20a6 6 0 0 0-4-5.7', // second person
    ],
  },
  {
    id: 'pediatrician-notes',
    title: 'Pediatrician-ready notes',
    description:
      'Export a clean visit summary for each baby — feeds, sleep, diapers, growth. Answer “how’s each of them eating?” with data, not a guess.',
    iconPaths: [
      'M7 3h10a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z', // document
      'M9 8h6M9 12h6M9 16h4', // lines
    ],
  },
];
