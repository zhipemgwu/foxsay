const fs = require('fs');

const file = 'C:/FoxSay/src/data/quizBank.ts';
let code = fs.readFileSync(file, 'utf8');

const utils = `

export function getQuestionById(id: string): Question | undefined {
  return QUIZ_BANK.find(q => q.id === id);
}

export function getByCategory(category: string): Question[] {
  return QUIZ_BANK.filter(q => q.category === category);
}
`;

if (!code.includes('getQuestionById')) {
  fs.writeFileSync(file, code + utils);
  console.log('Appended utils.');
} else {
  console.log('Already has utils');
}
