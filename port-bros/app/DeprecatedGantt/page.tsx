'use client'
import { Box, Heading, Text, Flex, Button } from "@chakra-ui/react";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import React from "react";
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'


// Define the GanttDataType type to match your data structure

interface Task {
	start: Date;
	end: Date;
	name: string;
	id: string;
	type: string;
	progress: number;
	isDisabled: boolean;
	dependencies: string[];
	styles: {
	  progressColor: string;
	  progressSelectedColor: string;
	};
  }

const tasks: Task[] = [];

const averageDurationInHours = 14.4; // Average duration in hours
const numShips = 10; // Number of ships

let startTime = new Date(2023, 1, 2, 8, 0); // Initial start time

for (let i = 0; i < numShips; i++) {
  // Calculate the end time based on the average duration
  const endTime = new Date(startTime.getTime() + (averageDurationInHours * 60 * 60 * 1000));

  // Create the ship task object
  const shipTask = {
    start: new Date(startTime),
    end: new Date(endTime),
    name: `Ship ${i + 1}`,
    id: `Ship-${i + 1}`,
    type: 'task',
    progress: 45,
    isDisabled: true,
	dependencies: [`Ship-${i}`],
    styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
  };

  // Add the ship task to the tasks array
  tasks.push(shipTask);

  // Update the start time for the next ship
  startTime = new Date(endTime);
}
const shipTest = {
    start: new Date(2023, 1, 2, 8, 0),
    end: new Date(2023, 1, 2, 8, 0),
    name: `Ship 1`,
    id: `Ship-1`,
    type: 'task',
    progress: 45,
    isDisabled: true,
	dependencies: [`Ship-1`],
    styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
  }

tasks.push(shipTest);

let totalTimeInSeconds: bigint = BigInt(0);
const dateArb = new Date(2023, 1, 2, 8, 0);
const aWeek = new Date(dateArb);
aWeek.setDate(dateArb.getDate() + 7);

// Calculate the time difference in seconds
const timeDiffTotal = aWeek.getTime() - dateArb.getTime();
const timeTotal = BigInt(Math.floor(timeDiffTotal / 1000));

console.log(`The number of seconds from ${dateArb} to one week later is: ${timeTotal} seconds`);

for (let i = 0; i < tasks.length; i++) {
  if (tasks[i].start < aWeek) {
    const timeDifferenceMilliseconds = tasks[i].end.getTime() - tasks[i].start.getTime();
    const timeDifferenceInSeconds = timeDifferenceMilliseconds / 1000; // Convert milliseconds to seconds
    const timeDifferenceBigInt = BigInt(Math.floor(timeDifferenceInSeconds)); // Convert to BigInt
    totalTimeInSeconds += timeDifferenceBigInt;
  }
}

const percentage = Number((totalTimeInSeconds) / (timeTotal));


const GanttChartPage = () => {
	return (
		<Box p={4}>
		  <Flex justifyContent="space-between" alignItems="center">
			<Heading as="h1" fontSize="3xl">
			  Berth Occupancy Display
			</Heading>
			<Button colorScheme="blue">Return</Button>
		  </Flex>
		  <Gantt
			tasks={tasks}
			viewMode={ViewMode.QuarterDay}
			arrowColor="grey"
			arrowIndent={5}
			preStepsCount={1}
		  />
    <Flex align="center" justify="center">
      <CircularProgress
        value={75}
        size="120px" // Adjust the size as needed
        thickness="12px" // Adjust the thickness as needed
      >
        <Text fontSize="24px">{75}%</Text>
      </CircularProgress>
    </Flex>
		</Box>
	  );
	}

export default GanttChartPage;
