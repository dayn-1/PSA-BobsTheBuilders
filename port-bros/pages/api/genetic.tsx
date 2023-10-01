import { PrismaClient } from "@prisma/client";

interface Berth {
  id: number;
  berthId: string;
  terminal: string;
  numCranes: number;
  lat: number;
  long: number;
  length: number;
  width: number;
  draught: number;
  occupied: boolean;
  nextAvail: Date;
}

interface Shipment {
  id: number;
  shipId: number;
  vesselName: string;
  type: string;
  flag: string;
  grossTonnage: number;
  deadweight: number;
  length: number;
  beam: number;
  draught: number;
  eta: Date;
  etd: Date;
  berth?: number;
  linkedId: number;
}

type Solution = {
  shipments: Shipment[];
  berths: Berth[];
};

export default async function Home() {
  const prisma = new PrismaClient();

  const shipmentz = await prisma.shipment.findMany();
  // console.log(shipments);
  const berths = await prisma.berth.findMany();
  // console.log(berths);

  const timeNow = new Date("2023-09-30T17:00:00.000Z");
  const sixHoursFromNow = new Date(timeNow);
  sixHoursFromNow.setHours(timeNow.getHours() + 6);

  const shipments6Hours = shipmentz.filter((shipment) => {
    // Convert shipment's eta date to a Date object
    const eta = new Date(shipment.eta);
    return eta >= timeNow && eta <= sixHoursFromNow;
  });

  function changeBerthToMinusOne(shipments: Shipment[]): Shipment[] {
    const updatedShipments = shipments.map((shipment) => ({
      ...shipment,
      berth: -1,
    }));
    return updatedShipments;
  }
  const shipments = changeBerthToMinusOne(shipmentz);

  //check if can fit
  function validateAllocation(shipments: Shipment[], berths: Berth[]): boolean {
    function shipmentFitsBerth(shipment: Shipment, berth: Berth): boolean {
      return (
        shipment.length <= berth.length &&
        shipment.beam <= berth.width &&
        shipment.draught <= berth.draught
      );
    }

    for (const shipment of shipments) {
      if (shipment.berth !== -1) {
        const otherShipments = shipments.filter(
          (otherShipment) =>
            otherShipment.berth === shipment.berth && otherShipment !== shipment
        );

        const allocatedBerth = berths.find(
          (berth) =>
            berth.id === shipment.berth &&
            shipmentFitsBerth(shipment, berth) &&
            (otherShipments.length === 0 ||
              otherShipments.every(
                (otherShipment) =>
                  otherShipment.eta >= shipment.etd ||
                  otherShipment.etd <= shipment.eta
              ))
        );
        if (!allocatedBerth) {
          return false; // At least one shipment doesn't fit any berth or overlaps in time
        }
      }
    }
    return true; // All shipments fit into berths and do not overlap in time
  }

  // calculates total waiting time based on assumption that next available berth can be used
  function calculateWaitingTime(
    shipments: Shipment[],
    berths: Berth[]
  ): number {
    let earliestNextAvail = berths[0].nextAvail;
    for (const berth of berths) {
      if (berth.nextAvail < earliestNextAvail) {
        earliestNextAvail = berth.nextAvail;
      }
    }
    let waitingTime = 0;
    for (const shipment of shipments) {
      if (shipment.berth == -1) {
        // Shipment is unassigned
        const eta = shipment.eta;
        const elapsedTime = earliestNextAvail.getTime() - eta.getTime();
        waitingTime += Math.floor(Math.max(0, elapsedTime / (60 * 1000))); // Add 6 hours after ETA
      }
    }

    return waitingTime;
  }

  //assumes gross tonnage as gauge of cargo count => should be allocated to berth with more cranes
  function calculateCraneEfficiency(
    shipments: Shipment[],
    berths: Berth[]
  ): number {
    let efficiencyScore = 0;

    // Iterate through shipments and calculate the total gross tonnage
    // and the total number of cranes at allocated berths
    for (const shipment of shipments) {
      if (shipment.berth != -1) {
        const allocatedBerth = berths.find(
          (berth) => berth.id === shipment.berth
        );
        if (allocatedBerth) {
          efficiencyScore += shipment.grossTonnage / allocatedBerth.numCranes;
        }
      }
    }
    // Calculate the efficiency factor by dividing total gross tonnage by total cranes
    return Math.floor(efficiencyScore / 1000);
  }

  function calculateDistance(berth1: Berth, berth2: Berth): number {
    const earthRadius = 6371; // Earth's radius in kilometers
    const lat1 = berth1.lat;
    const lon1 = berth1.long;
    const lat2 = berth2.lat;
    const lon2 = berth2.long;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    return distance;
  }

  function calculateTransshipment(
    shipments: Shipment[],
    berths: Berth[]
  ): number {
    let totalDistance = 0;
    let numberOfTransshipments = 0;

    for (const shipment of shipments) {
      if (shipment.linkedId != -1) {
        const linkedShipment = shipments.find(
          (s) => s.shipId === shipment.linkedId
        );

        if (linkedShipment) {
          numberOfTransshipments++;
          const berth1 = berths.find((berth) => berth.id === shipment.berth);
          const berth2 = berths.find(
            (berth) => berth.id === linkedShipment.berth
          );

          if (berth1 && berth2) {
            const distance = calculateDistance(berth1, berth2);
            totalDistance += distance;
          } else {
            totalDistance += 1000; //arbitrary large number to penalise no berth allocated for linked shipments
          }
        }
      }
    }
    const transshipmentScore =
      numberOfTransshipments > 0
        ? (numberOfTransshipments / totalDistance) * 100
        : 0;
    return transshipmentScore;
  }

  function calculateAverageOccupancyTime(
    shipments: Shipment[],
    berths: Berth[]
  ): number {
    let totalOccupancyTimeInMinutes = 0;
    let numberOfShipmentsWithBerth = 0;

    for (const shipment of shipments) {
      if (shipment.berth !== -1) {
        const etdTime = shipment.etd.getTime();
        const etaTime = shipment.eta.getTime();
        const occupancyTimeInMinutes =
          Math.max(0, etdTime - etaTime) / (60 * 1000);
        totalOccupancyTimeInMinutes += occupancyTimeInMinutes;
        numberOfShipmentsWithBerth++;
      }
    }
    if (numberOfShipmentsWithBerth === 0) {
      return 0; // Avoid division by zero
    }
    const averageOccupancyTime =
      totalOccupancyTimeInMinutes / numberOfShipmentsWithBerth;
    return Math.floor(averageOccupancyTime) / 2;
  }

  // console.log(validateAllocation(shipments, berths));
  // console.log(calculateWaitingTime(shipments, berths));
  // console.log(calculateCraneEfficiency(shipments, berths));
  // console.log(calculateTransshipment(shipments, berths));
  // console.log(calculateAverageOccupancyTime(shipments, berths));

  function heuristic(shipments: Shipment[], berths: Berth[]): number {
    if (!validateAllocation(shipments, berths)) return -1000;

    const weights = {
      waitingTimeWeight: 1,
      craneEfficiencyWeight: 1,
      transshipmentWeight: 1,
      occupancyTimeWeight: 1,
    };
    const waitingTime = calculateWaitingTime(shipments, berths);
    const craneEfficiency = calculateCraneEfficiency(shipments, berths);
    const transshipment = calculateTransshipment(shipments, berths);
    const averageOccupancyTime = calculateAverageOccupancyTime(
      shipments,
      berths
    );

    // Calculate the weighted sum
    const score =
      -weights.waitingTimeWeight * calculateWaitingTime(shipments, berths) -
      weights.craneEfficiencyWeight *
        calculateCraneEfficiency(shipments, berths) +
      weights.transshipmentWeight * calculateTransshipment(shipments, berths) +
      weights.occupancyTimeWeight *
        calculateAverageOccupancyTime(shipments, berths);
    return score;
  }

  function generateRandomSolution(
    shipments: Shipment[],
    berths: Berth[]
  ): { shipments: Shipment[]; berths: Berth[] } {
    // Create copies of the shipments and berths arrays
    const shuffledShipments = changeBerthToMinusOne([...shipments]);
    // const shuffledShipments = [...shipments];
    const shuffledBerths = [...berths];

    // Shuffle the copies
    function shuffleArray<T>(array: T[]) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
    shuffleArray(shuffledShipments);
    shuffleArray(shuffledBerths);
    // console.log(shuffledShipments);

    const numberOfAssignments = Math.min(
      shuffledShipments.length,
      shuffledBerths.length
    );
    for (let i = 0; i < numberOfAssignments; i++) {
      const shipment = shuffledShipments[i];
      const berth = shuffledBerths[i];

      // Update the berth field in the Shipment
      shipment.berth = berth.id;

      // Update the nextAvail time in the Berth (assuming a 6-hour interval)
      berth.nextAvail = shipment.etd;
      berth.occupied = true;
    }

    // Create copies of the updated arrays to avoid modifying the original ones
    const updatedShipments = [...shuffledShipments];
    const updatedBerths = [...shuffledBerths];

    const occupiedShipments = updatedShipments.filter(
      (shipment) => shipment.berth !== -1
    );

    // Map the berth numbers to actual berths
    const occupiedBerthNumbers = occupiedShipments.map((shipment) => {
      return shipment.berth;
    });

    // console.log(occupiedBerthNumbers);

    return { shipments: updatedShipments, berths: updatedBerths };
  }

  // allPermutations now contains all possible outcomes with 1-to-1 swaps

  // Define a function to mutate a solution (e.g., swap shipments between berths)
  function getRandomParent(currentSolution: {
    shipments: Shipment[];
    berths: Berth[];
  }): { shipments: Shipment[]; berths: Berth[] } {
    const { shipments, berths } = currentSolution;
    const mutatedShipments = [...shipments];
    const mutatedBerths = [...berths];

    // Select two random shipments to swap
    const randomIndex1 = Math.floor(Math.random() * mutatedShipments.length);
    const randomIndex2 = Math.floor(Math.random() * mutatedShipments.length);

    // Swap the berths between the selected shipments
    const tempBerthId = mutatedShipments[randomIndex1].berth;
    mutatedShipments[randomIndex1].berth = mutatedShipments[randomIndex2].berth;
    mutatedShipments[randomIndex2].berth = tempBerthId;

    // Update the corresponding berths
    const berth1 = mutatedBerths.find((berth) => berth.id === tempBerthId);
    const berth2 = mutatedBerths.find(
      (berth) => berth.id === mutatedShipments[randomIndex1].berth
    );

    if (berth1 && berth2) {
      // Otherwise, perform a standard berth swap
      const tempOccupied1 = berth1.occupied;
      const tempNextAvail1 = berth1.nextAvail;

      // Update berth1 with berth2's information
      berth1.occupied = berth2.occupied;
      berth1.nextAvail = berth2.nextAvail;

      // Update berth2 with berth1's information
      berth2.occupied = tempOccupied1;
      berth2.nextAvail = tempNextAvail1;
    } else if (berth1) {
      berth1.nextAvail = mutatedShipments[randomIndex1].etd;
    } else if (berth2) {
      berth2.nextAvail = mutatedShipments[randomIndex2].etd;
    }

    return { shipments: mutatedShipments, berths: mutatedBerths };
  }

  // Roulette Wheel method to select parents
  function selectParentByRouletteWheel(population: Solution[]): Solution {
    // Calculate fitness scores for all solutions in the population
    const scores = population.map((solution) =>
      heuristic(solution.shipments, solution.berths)
    );
    // Calculate the total fitness score
    const totalScores = scores.reduce((acc, score) => acc + score, 0);
    // Generate a random value between 0 and 1
    const randomValue = Math.random();

    // Initialize variables for roulette wheel selection
    let cumulativeProbability = 0;
    let selectedIndex = 0;

    // Spin the roulette wheel to select a parent
    while (
      cumulativeProbability < randomValue &&
      selectedIndex < population.length
    ) {
      const selectionProbability = scores[selectedIndex] / totalScores;
      cumulativeProbability += selectionProbability;
      selectedIndex++;
    }
    // The solution at `selectedIndex - 1` is the selected parent
    const selectedParent = population[selectedIndex - 1];
    return selectedParent;
  }
  // Function to get the best solution from a population
  function getBestSolution(population: Solution[]): Solution {
    let bestSolution = population[0]; // Initialize with the first solution
    let bestFitness = heuristic(bestSolution.shipments, bestSolution.berths);

    for (let i = 1; i < population.length; i++) {
      const currentSolution = population[i];
      const currentFitness = heuristic(
        currentSolution.shipments,
        currentSolution.berths
      );

      // Compare fitness scores and update if current solution is better
      if (currentFitness > bestFitness) {
        bestSolution = currentSolution;
        bestFitness = currentFitness;
      }
    }
    // Filter shipments that have an allocated berth
    // const occupiedShipments = bestSolution.shipments.filter(
    //   (shipment) => shipment.berth !== -1
    // );

    // // Map the berth numbers to actual berths
    // const occupiedBerths = occupiedShipments.map((shipment) => {
    //   return shipment.berth;
    // });
    // console.log(occupiedBerths);
    return bestSolution;
  }

  // Define the hill-climbing algorithm with genetic randomness
  function geneticAlgorithm(
    initialPopulation: Solution[],
    maxGenerations: number,
    mutationRate: number
  ): Solution {
    let population = initialPopulation;
    for (let generation = 0; generation < maxGenerations; generation++) {
      // Select parents based on fitness scores
      const parents = selectParentByRouletteWheel(population);
      // console.log(parents);
      // Create a new generation through crossover and mutation
      const newGeneration = [];

      while (newGeneration.length < initialPopulation.length) {
        const offspring = getRandomParent(parents);
        // const parent2 = getRandomParent(parents);
        // const offspring = crossover(parent1, parent2);

        if (Math.random() < mutationRate) {
          getRandomParent(offspring);
        }

        newGeneration.push(offspring);
      }

      // Evaluate fitness of the new generation
      const newScores = newGeneration.map((solution) =>
        heuristic(solution.shipments, solution.berths)
      );

      // Replace the old population with the new generation
      population = newGeneration;
    }

    // Return the best solution from the final generation
    return getBestSolution(population);
  }

  function generateRandomSolutions(
    shipments: Shipment[],
    berths: Berth[],
    count: number
  ): Solution[] {
    const randomSolutions: Solution[] = [];

    for (let i = 0; i < count; i++) {
      const randomSolution = generateRandomSolution(shipments, berths);
      // // Filter shipments that have an allocated berth
      // const occupiedShipments = randomSolution.shipments.filter(
      //   (shipment) => shipment.berth !== -1
      // );

      // // Map the berth numbers to actual berths
      // const occupiedBerths = occupiedShipments.map((shipment) => {
      //   return shipment.berth;
      // });
      // console.log(occupiedBerths);
      randomSolutions.push(randomSolution);
    }

    return randomSolutions;
  }

  async function updateDatabaseWithSolution(solution: Solution) {
    console.log("running...");
    try {
      // Example: Update shipments in the database
      for (const shipment of solution.shipments) {
        await prisma.shipment.update({
          where: { id: shipment.id }, // Specify the unique identifier of the shipment
          data: {
            // Update the fields you need to update in the database
            // For example, to update 'berth' field:
            berth: shipment.berth, // Connect to the corresponding berth
          },
        });
      }

      // Similar code for updating berths if necessary

      console.log("Database updated successfully.");
    } catch (error) {
      console.error("Error updating database:", error);
    } finally {
      // Close the Prisma Client connection
      await prisma.$disconnect();
    }
  }

  const initialPopulation = generateRandomSolutions(shipments, berths, 1000);
  const optimizedSolution = geneticAlgorithm(initialPopulation, 100, 0.1);
  console.log("Optimized Solution:", optimizedSolution);
  console.log(heuristic(optimizedSolution.shipments, optimizedSolution.berths));
  updateDatabaseWithSolution(optimizedSolution);

  // const optimizedSolution = hillClimbingWithGeneticRandomness(
  //   initialSolution,
  //   100000,
  //   0.1
  // );
  // console.log("Optimized Solution:", optimizedSolution);
  // console.log(heuristic(optimizedSolution.shipments, optimizedSolution.berths));

  return (
    <main>
      {/* {vessels.map((vessel) => (
        <div key={vessel.id}>{vessel.name}</div>
      ))} */}
    </main>
  );
}
