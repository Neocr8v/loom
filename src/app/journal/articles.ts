export type JournalArticle = {
  slug: string;
  category: string;
  city: string;
  title: string;
  excerpt: string;
  imageClass: string;
  publishedAt: string;
  readTime: string;
  paragraphs: string[];
  quote: string;
};

export const journalArticles: JournalArticle[] = [
  {
    slug: "clothes-begin-with-a-conversation",
    category: "Design notes",
    city: "Accra",
    title: "Why the best clothes begin with a conversation.",
    excerpt: "For Aduke Studio, thoughtful design starts by listening: to the people who will wear a piece, and to the life they want it to lead.",
    imageClass: "journal-image-one",
    publishedAt: "October 12, 2026",
    readTime: "4 min read",
    paragraphs: [
      "At Aduke Studio, the first fitting rarely begins with a tape measure. It begins with a question: where do you want this to take you? A dress for a long afternoon should move differently from one saved for a celebration, and a good designer pays attention before making the first cut.",
      "That instinct to listen shapes the studio’s approach to clothing. Familiar silhouettes are refined through small, deliberate choices: a wrap that adjusts easily, a seam placed for comfort, a fabric that feels as good at the end of the day as it did at the start.",
      "Working in small runs gives the team room to keep asking questions. They can learn from the people who wear each piece, make thoughtful adjustments, and keep the work personal rather than chasing a trend that will be gone by next season.",
      "The result is clothing that feels considered without feeling precious. Pieces are made to join real lives: to be worn, cared for, and reached for again.",
    ],
    quote: "Good design is a conversation that keeps going after the piece leaves the studio.",
  },
  {
    slug: "tradition-reworked-for-right-now",
    category: "The maker edit",
    city: "Kumasi",
    title: "Tradition, reworked for right now.",
    excerpt: "Kasa Goods brings patient weaving and contemporary utility together, making accessories that carry craft into everyday life.",
    imageClass: "journal-image-two",
    publishedAt: "October 6, 2026",
    readTime: "3 min read",
    paragraphs: [
      "In Kumasi, making begins with attention to material. At Kasa Goods, woven forms take shape slowly, strand by strand, with the maker’s hands guiding the rhythm and the structure.",
      "The studio’s bags are designed for a life beyond the display shelf. Clean proportions, useful space and considered finishing make each piece easy to carry from the market to the rest of the day.",
      "That balance is the point: heritage craft does not need to be held still to be respected. It can be useful, expressive and entirely at home in the present, while the skill behind it remains visible.",
      "Because each run is small, no two pieces feel quite the same. Subtle variations are part of the work, a reminder that a person—not a production line—made the object you carry.",
    ],
    quote: "A handmade object brings the time and care of its making along with it.",
  },
  {
    slug: "a-new-generation-of-ghanaian-design",
    category: "On our radar",
    city: "Cape Coast",
    title: "A new generation of Ghanaian design.",
    excerpt: "At Next Store, heritage references meet an open-minded, modern wardrobe built around how people want to dress now.",
    imageClass: "journal-image-three",
    publishedAt: "September 28, 2026",
    readTime: "4 min read",
    paragraphs: [
      "A new generation of Ghanaian labels is making space for many points of view. From Cape Coast, Next Store looks to the details, materials and memories that make a design feel rooted, then gives them room to move.",
      "The collection is not a costume or a quotation. It is a working wardrobe: pieces that can be layered, styled in different ways and worn on the wearer’s own terms.",
      "For the studio, contemporary design is less about leaving tradition behind and more about deciding what to carry forward. A familiar pattern can become a new shape; a reference can become a quiet detail rather than the whole story.",
      "That freedom makes the work feel personal. It invites people to bring their own ideas to each piece and make it part of a style that is unmistakably theirs.",
    ],
    quote: "Heritage is not a rulebook. It is a starting point for making something new.",
  },
];
