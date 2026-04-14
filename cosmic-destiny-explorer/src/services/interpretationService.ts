import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getInterpretationByKey(key: string) {
  try {
    const interpretation = await prisma.interpretation.findUnique({
      where: { key },
    });
    
    if (interpretation) {
      return {
        category: interpretation.category,
        content: interpretation.content,
        detailedContent: interpretation.detailedContent,
        key: interpretation.key
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching interpretation:', error);
    return null;
  }
}

export async function mapNatalDataToInterpretations(natalData: any) {
  const results: { category: string; key: string; content: string }[] = [];

  // 1. Planets in Signs & Houses
  for (const planet of natalData.planets) {
    // Check Planet in Sign
    const signKey = `${planet.name}_${planet.sign}`;
    const signInterp = await getInterpretationByKey(signKey);
    if (signInterp) {
      results.push(signInterp);
    }

    // Check Planet in House
    const houseNumber = findHouseForPlanet(planet.longitude, natalData.houses);
    const houseKey = `${planet.name}_House_${houseNumber}`;
    const houseInterp = await getInterpretationByKey(houseKey);
    if (houseInterp) {
      results.push(houseInterp);
    }
  }

  // 2. Aspects
  if (natalData.aspects) {
    for (const aspect of natalData.aspects) {
      const aspectKey = `${aspect.point1}_${aspect.point2}_${aspect.type}`;
      const aspectInterp = await getInterpretationByKey(aspectKey);
      if (aspectInterp) {
        results.push(aspectInterp);
      }
    }
  }

  // 3. Houses in Signs
  if (natalData.houses) {
    for (const house of natalData.houses) {
      const houseSignKey = `House_${house.number}_${house.sign}`;
      const houseSignInterp = await getInterpretationByKey(houseSignKey);
      if (houseSignInterp) {
        results.push(houseSignInterp);
      }
    }
  }

  return results;
}

function findHouseForPlanet(planetLong: number, houses: any[]) {
  for (let i = 0; i < houses.length; i++) {
    const currentHouse = houses[i];
    const nextHouse = houses[(i + 1) % houses.length];
    
    let isInside = false;
    if (currentHouse.longitude < nextHouse.longitude) {
      isInside = planetLong >= currentHouse.longitude && planetLong < nextHouse.longitude;
    } else {
      // House spans across 0°
      isInside = planetLong >= currentHouse.longitude || planetLong < nextHouse.longitude;
    }
    
    if (isInside) return currentHouse.number;
  }
  return 1;
}
