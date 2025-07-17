export const WORD_CATEGORIES = {
  food: [
    'APPLE', 'BANANA', 'ORANGE', 'GRAPE', 'PIZZA', 'BURGER', 'PASTA', 'BREAD',
    'CHEESE', 'CHICKEN', 'FISH', 'RICE', 'SOUP', 'SALAD', 'CAKE', 'COOKIE'
  ],
  animals: [
    'CAT', 'DOG', 'BIRD', 'FISH', 'LION', 'TIGER', 'BEAR', 'WOLF',
    'RABBIT', 'HORSE', 'COW', 'PIG', 'SHEEP', 'DUCK', 'FROG', 'SNAKE'
  ],
  objects: [
    'CHAIR', 'TABLE', 'BOOK', 'PEN', 'PHONE', 'CAR', 'HOUSE', 'TREE',
    'FLOWER', 'CLOCK', 'LAMP', 'MIRROR', 'WINDOW', 'DOOR', 'KEY', 'BAG'
  ]
};

export const DIFFICULTY_SETTINGS = {
  easy: {
    gridSize: 12,
    wordCount: 8,
    directions: ['horizontal', 'vertical'] as const
  },
  medium: {
    gridSize: 15,
    wordCount: 12,
    directions: ['horizontal', 'vertical', 'diagonal-down'] as const
  },
  hard: {
    gridSize: 18,
    wordCount: 16,
    directions: ['horizontal', 'vertical', 'diagonal-down', 'diagonal-up'] as const
  }
};