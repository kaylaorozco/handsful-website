/**
 * FAQ content — written around real parent-of-multiples search queries.
 * Rendered on the page AND emitted as FAQPage structured data, so keep
 * answers plain-text friendly (no HTML).
 */
export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Is there a baby tracker app designed for twins?',
    answer:
      'Yes — that’s exactly what Handsful is. Most baby apps are built around one baby and let you “add another” as an afterthought. Handsful is designed for multiples from the first screen: one tap logs a feed, nap or diaper for all your babies at once, and every view shows them together.',
  },
  {
    question: 'Does Handsful work for triplets or more?',
    answer:
      'Yes. Handsful supports any number of babies — twins, triplets, quads and beyond. Logging, side-by-side comparison and exports all scale to however many little ones you’ve got.',
  },
  {
    question: 'How is this different from adding a second baby to a regular tracker app?',
    answer:
      'Single-baby trackers make you switch profiles for every log and every question — log baby A, switch, log baby B, switch back. Handsful never makes you switch: simultaneous one-tap logging, true side-by-side comparison views, and per-baby exports are all built in from day one.',
  },
  {
    question: 'Can my partner and other caregivers use it too?',
    answer:
      'Yes. Handsful is built for shared care: invite your partner, grandparents or a night nurse and everyone logs to the same live record. Same kids, same data, no re-typing — and no “wait, did anyone feed her?”',
  },
  {
    question: 'Can I share tracking data with my pediatrician?',
    answer:
      'Yes. Handsful generates a clean, exportable visit summary for each baby — feeds, sleep, diapers and growth — so checkup questions get real answers instead of bleary 4am guesses.',
  },
  {
    question: 'Can I turn the AI features on or off?',
    answer:
      'Yes — they’re your choice. Features like AI visit summaries are optional, and you can switch them on or off anytime in settings. Turned off, Handsful is a fast, fully manual tracker: your logging works exactly the same, and your data isn’t sent to any AI service.',
  },
  {
    question: 'What can I track in Handsful?',
    answer:
      'Feeds (breast, bottle and pumping), sleep and naps, diapers, growth and milestones — for every baby, together. If it happens in a day with multiples, it’s one tap away.',
  },
  {
    question: 'When does Handsful launch, and how much will it cost?',
    answer:
      'Handsful launches soon on iOS and Android. Join the waitlist and you’ll be the first to know the launch date and pricing — and you’ll get access before everyone else. No spam, ever.',
  },
  {
    question: 'Is my babies’ data private?',
    answer:
      'Your family’s data belongs to your family. Handsful uses it to power your tracking and sharing between the caregivers you invite — never to sell. Full details will be in our Privacy Policy before launch.',
  },
];
