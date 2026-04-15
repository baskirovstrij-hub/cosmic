import { calculateNatalData } from './src/services/astrologyService.js';

async function test() {
  try {
    const data = await calculateNatalData('1990-05-15', '12:00', 55.75, 37.61);
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(e);
  }
}

test();
