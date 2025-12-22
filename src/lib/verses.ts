// src/lib/verses.ts

export interface Verse {
  text: string;
  reference: string;
}

export const verses: Verse[] = [
  { text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud.", reference: "1 Corinthians 13:4" },
  { text: "Be kind to one another, tenderhearted, forgiving one another, as God in Christ forgave you.", reference: "Ephesians 4:32" },
  { text: "Above all, keep loving one another earnestly, since love covers a multitude of sins.", reference: "1 Peter 4:8" },
  { text: "Behold, how good and pleasant it is when brothers dwell in unity!", reference: "Psalm 133:1" },
  { text: "Let all that you do be done in love.", reference: "1 Corinthians 16:14" },
  { text: "A friend loves at all times, and a brother is born for adversity.", reference: "Proverbs 17:17" },
  { text: "Bear one another's burdens, and so fulfill the law of Christ.", reference: "Galatians 6:2" },
  { text: "And over all these virtues put on love, which binds them all together in perfect unity.", reference: "Colossians 3:14" },
  { text: "Honor your father and your mother, that your days may be long in the land that the Lord your God is giving you.", reference: "Exodus 20:12" },
  { text: "Children's children are a crown to the aged, and parents are the pride of their children.", reference: "Proverbs 17:6" },
  { text: "We love because he first loved us.", reference: "1 John 4:19" },
  { text: "Trust in the Lord with all your heart, and do not lean on your own understanding.", reference: "Proverbs 3:5" },
  { text: "I have no greater joy than to hear that my children are walking in the truth.", reference: "3 John 1:4" },
  { text: "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope.", reference: "Jeremiah 29:11" },
  { text: "The Lord is my shepherd; I shall not want.", reference: "Psalm 23:1" },
  { text: "But the fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness.", reference: "Galatians 5:22" },
  { text: "Cast all your anxiety on him because he cares for you.", reference: "1 Peter 5:7" },
  { text: "This is the day that the Lord has made; let us rejoice and be glad in it.", reference: "Psalm 118:24" },
  { text: "As for me and my house, we will serve the Lord.", reference: "Joshua 24:15" },
  { text: "Train up a child in the way he should go; even when he is old he will not depart from it.", reference: "Proverbs 22:6" },
];

export function getDailyVerse(): Verse {
  // 1. Get current time
  const now = new Date();
  
  // 2. Convert to Eastern Time string to handle DST automatically
  const estString = now.toLocaleString("en-US", { timeZone: "America/New_York" });
  const estDate = new Date(estString);

  // 3. Adjust for 7 AM cutoff
  // If it's before 7 AM, we subtract 1 day so we are still showing "yesterday's" verse.
  // This effectively makes the "new day" start at 7 AM.
  if (estDate.getHours() < 7) {
    estDate.setDate(estDate.getDate() - 1);
  }

  // 4. Create a unique seed string for this "day" (YYYY-MM-DD)
  const seedString = `${estDate.getFullYear()}-${estDate.getMonth()}-${estDate.getDate()}`;
  
  // 5. Simple hash function to turn string into integer
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = ((hash << 5) - hash) + seedString.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  
  // 6. Pick a verse deterministically
  const index = Math.abs(hash) % verses.length;
  return verses[index];
}