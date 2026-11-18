// ✏️ EDIT THIS FILE to personalise the website.

export const NAME = "Ayishu";
export const FROM = "your friend";

// Page 1: hidden treasures. x / y = position on the map in percent (0 to 100).
export const TREASURES = [
  { x: 24, y: 34, icon: "🗝️", title: "The Golden Key", msg: "Some treasures are found, and some find you. You found this one first." },
  { x: 70, y: 30, icon: "🧭", title: "The Lucky Compass", msg: "Wherever you go, you point somebody’s heart in the right direction." },
  { x: 50, y: 56, icon: "💌", title: "A Secret Love Note", msg: "You turn ordinary days into little adventures, and you’re loved more than you know." },
  { x: 28, y: 72, icon: "💎", title: "The Heart Gem", msg: "Rare, sparkly and one of a kind. Just like you." },
  { x: 74, y: 70, icon: "🌹", title: "The Last Rose", msg: "Here’s to love, laughter and a lifetime of beautiful days." },
];

// [x, y, emoji] decorations on the island
export const DECOR = [
  [18, 18, "⛵"], [84, 16, "🐚"], [12, 50, "🌴"], [86, 52, "🌴"],
  [48, 22, "🪨"], [40, 86, "🦀"], [88, 86, "🐙"], [10, 86, "🌊"],
];

// Page 2: romantic questions (no wrong answers). Set text: true for a typed answer.
export const QS = [
  { q: "What does your perfect date night look like?", o: ["Candlelit dinner 🕯️", "Stargazing 🌌", "Movie and cuddles 🍿", "A spontaneous road trip 🚗"], r: "Lovely choice. Any of them feels magical with the right person." },
  { q: "Which love language speaks to you most?", o: ["Kind words", "Quality time", "Little gifts", "Warm hugs", "Thoughtful acts"], r: "Good to know. Love is best when it’s spoken in your language." },
  { q: "Where would you watch a sunset with someone special?", o: ["On a quiet beach 🏖️", "On a mountain top 🏔️", "On a rooftop 🌆", "From a cozy balcony ☕"], r: "Perfect. The sky always looks better when you’re happy." },
  { q: "What’s the sweetest thing someone can say to you?", o: ["“I’m proud of you”", "“I missed you”", "“You make me smile”", "“I’m always here for you”"], r: "That’s the kind of sentence that stays in the heart." },
  { q: "Which dream trip would you take with your person?", o: ["Paris 🗼", "Maldives 🌴", "Santorini 🌅", "Switzerland 🏔️"], r: "Pack your bags. Wonderful memories are waiting there." },
  { q: "Finish the sentence: love feels like…", text: true, r: "What a beautiful thought. It’s going into the treasure chest." },
];

// Page 5: scratch cards [emoji, text]
export const COUPONS = [
  ["🍝", "One dinner date, wherever you choose"],
  ["🤗", "A big hug, redeemable any time"],
  ["🌅", "A sunset picnic, planned just for you"],
];

// Page 6: the final letter
export const LETTER = `Dear ${NAME},

You dug up every treasure, but the real one has been right here all along: you. The warmth you bring, the way you love, and the way you make people feel at home.

May this year be full of love, surprises and every wish you made.

Happy Birthday! 🎉💖

With love,
${FROM}`;
