const fs = require('fs');

const updates = {
  "Sun_Aries": "Вы обладаете огромной жизненной силой. Ваша задача — научиться направлять этот огонь в созидательное русло, избегая излишней импульсивности. Вы рождены, чтобы вести за собой. В любви вы страстны, в работе — нетерпеливы, но всегда идете к цели до конца.",
  "Sun_Taurus": "Вы цените комфорт, надежность и красоту. Ваша сила — в терпении и умении доводить начатое до конца. Вам важно окружать себя качественными вещами и чувствовать почву под ногами. В финансах вы консервативны, а в отношениях — верны и надежны.",
  "Sun_Gemini": "Вы — вечный ученик. Вам жизненно необходим обмен информацией и новые впечатления. Ваша задача — научиться концентрироваться на главном, не распыляясь на множество мелких дел. Ваш интеллект — ваш главный инструмент успеха в любой сфере."
};

const seedPath = './interpretations_seed.json';
const data = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

const updatedData = data.map(item => {
  if (updates[item.key]) {
    return { ...item, detailedContent: updates[item.key] };
  }
  return item;
});

fs.writeFileSync(seedPath, JSON.stringify(updatedData, null, 2), 'utf8');
console.log('Updated interpretations.');
