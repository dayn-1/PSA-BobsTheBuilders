'use client'
import Timeline from 'react-calendar-timeline';
// make sure you include the timeline stylesheet or the timeline will not be styled
import 'react-calendar-timeline/lib/Timeline.css'
import moment from 'moment'
import { Box, Heading, Text, Flex, Button } from "@chakra-ui/react";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import React from "react";

const groups = [
	{ id: 1, title: 'berth 1' },
	{ id: 2, title: 'berth 2' },
	{ id: 3, title: 'berth 3' },
	{ id: 4, title: 'berth 4' },
	{ id: 5, title: 'berth 5' },
	{ id: 6, title: 'berth 6' },
	{ id: 7, title: 'berth 7' },
	{ id: 8, title: 'berth 8' },
	{ id: 9, title: 'berth 9' },
	{ id: 10, title: 'berth 10' },
  ];
  
const items = [
  {
    id: 1,
    group: 1,
    title: 'ship 1',
    start_time: moment(),
    end_time: moment().add(1, 'hour'),
    color: 'rgb(158, 14, 206)',
    selectedBgColor: 'rgba(225, 166, 244, 1)',
    bgColor : 'rgba(225, 166, 244, 0.6)',
  },
  {
    id: 2,
    group: 2,
    title: 'ship 2',
    start_time: moment().add(-0.5, 'hour'),
    end_time: moment().add(0.5, 'hour')
  },
  {
    id: 3,
    group: 1,
    title: 'ship 3',
    start_time: moment().add(2, 'hour'),
    end_time: moment().add(3, 'hour')
  },
  {
    id: 4,
    group: 4,
    title: 'ship 4',
    start_time: moment().add(2, 'hour'),
    end_time: moment().add(3, 'hour')
  },
  {
    id: 5,
    group: 5,
    title: 'ship 5',
    start_time: moment().add(2, 'hour'),
    end_time: moment().add(3, 'hour')
  },
  {
    id: 6,
    group: 6,
    title: 'ship 6',
    start_time: moment().add(2, 'hour'),
    end_time: moment().add(3, 'hour')
  },
]

const TimeLine = () => {
	return (
		<Box p={4}>
		  <Flex justifyContent="space-between" alignItems="center">
			<Heading as="h1" fontSize="3xl">
			  Berth Occupancy Display
			</Heading>
			<Button colorScheme="blue">Return</Button>
		  </Flex>
		  <Timeline
      groups={groups}
      items={items}
      defaultTimeStart={moment().add(-12, 'hour')}
      defaultTimeEnd={moment().add(12, 'hour')}
	  lineHeight = {50}
    />
		</Box>
	  );
	}

export default TimeLine;
