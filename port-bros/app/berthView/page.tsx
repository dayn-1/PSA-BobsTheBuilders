import React from 'react';
import {
  Box,
  SimpleGrid,
  Heading,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Text,
  Stack,
} from '@chakra-ui/react';
import ScrollView from '../components/scrollView';

function formatDateTime(dateString: string): string {
	const date = new Date(dateString);
  
	if (isNaN(date.getTime())) {
	  return ''; // Return an empty string if the input is not a valid date
	}
  
	const formattedDate = date.toLocaleString(undefined, {
	  year: 'numeric',
	  month: 'short',
	  day: 'numeric',
	  hour: '2-digit',
	  minute: '2-digit',
	  second: '2-digit',
	});
  
	return formattedDate;
  }
  const craneDesc = "The crane operator encounters a container jam while unloading a ship. They need assistance from maintenance to resolve the issue and ensure the smooth flow of cargo operations.";
  const supervisorDesc = "A ship carrying urgent medical supplies arrives at the dock unexpectedly. The dock supervisor must quickly rearrange the schedule to prioritize unloading this critical cargo and inform the logistics coordinator to adjust transportation plans.";
  const logisticDesc = "The logistics coordinator notices a discrepancy in container tracking information. They work with the dock supervisor and port security to investigate the issue and locate the missing container to prevent delays in transportation.";

//Activities
const Activity = ({priority, description, location, pCol}: {priority:number; description: string, location: string, pCol: string}) => {
	let dynamicBackgroundColor = "";

	if (pCol === "red") {	
	  dynamicBackgroundColor = "bg-red-400";
	} else {
	  dynamicBackgroundColor = `bg-${pCol}-400`;
	}
	
		return (
		<div>
			<Box marginLeft={125}>
			<div className={`rounded-lg p-2 mt-2 mb-2 w-3/5 ${dynamicBackgroundColor}`}>
				<Text>Priority Level: {priority}</Text>
			</div>
			<img
        src= {location}
        width="300"
        height="100"
        alt="worker"
      />
	  			<div className="bg-grey-300 rounded-lg mb-2 w-3/5">
				<Text>Task Description: {description}</Text>
			</div>
			</Box>
			<div className="border-b-4 mb-4 border-gray-30"></div> 
		</div>
		
	);
};

  

// ShipDetails component function
const ShipDetails = ({
  id,
  shipID,
  vesselName,
  type,
  flag,
  grossTonnage,
  deadWeight,
  length,
  beam,
  draught,
  eta,
  etd,
  image
}: {
  id: number;
  shipID: number;
  vesselName: string;
  type: string;
  flag: string;
  grossTonnage: number;
  deadWeight: number;
  length: number;
  beam: number;
  draught: number;
  eta: Date;
  etd: Date;
  image: string;
}) => {
  return (
    <div>
      {/* Orange box for Arrival */}
      <div className="bg-orange-400 rounded-lg p-2 mb-2 w-3/5">
        <Text>
          Arrival: {formatDateTime(eta.toString())}
        </Text>
      </div>

      {/* Blue box for Departure */}
      <div className="bg-blue-400 rounded-lg p-2 mb-4 w-3/5">
        <Text>
          Departure: {formatDateTime(etd.toString())}
        </Text>
      </div>

      <img
        src= {image}
        width="300"
        height="100"
        alt="Ship"
      />
      <div className="flex justify-between">
        <Box>
          <Menu>
            <MenuItem>ShipID: {id}</MenuItem>
            <MenuItem>Vessel Name: {vesselName}</MenuItem>
            <MenuItem>Type: {type}</MenuItem>
            <MenuItem>Country: {flag}</MenuItem>
          </Menu>
        </Box>
      </div>
      <div className="relative">
        <Box>
          <Menu>
            <MenuButton as={Button}>
              Others
            </MenuButton>
            <MenuList>
              <MenuItem>Mass: {grossTonnage.toString()}</MenuItem>
              <MenuItem>Dead Weight: {deadWeight}</MenuItem>
              <MenuItem>Length: {length}</MenuItem>
              <MenuItem>Draught: {draught}</MenuItem>
              <MenuItem>Beam: {beam}</MenuItem>
            </MenuList>
          </Menu>
        </Box>
		      {/* Grey line below the component */}
			  <div className="border-b-4 border-gray-30"></div>
      </div>
    </div>
  );
};

// Define the SplitWithImage component
const SplitWithImage = () => {
  // Define the variables for the ShipDetails component
  const id = 1;
  const shipID = 1;
  const vesselName = "Princess Diana";
  const type = "Big";
  const flag = "Malaysia";
  const grossTonnage = 1000;
  const deadWeight = 100;
  const length = 100;
  const beam = 5;
  const draught = 10;
  const eta = new Date('2023-01-01');
  const etd = new Date(eta);
  etd.setHours(eta.getHours() + 6);
  const eta1 = new Date('2023-01-02');
  const etd1 = new Date('2023-01-03');

  return (
    <Box m={15}>
<div className="bg-gray-300 p-4 mb-4 font-poppins">
  <h1 className="text-center font-semibold text-2xl">
    Berth 1
  </h1>
</div>

	  <SimpleGrid columns={2}>
		<Box>
		<h1 className="text-center font-semibold text-3xl">Incoming Vessel</h1>		
		<Box justifyContent={"center"} marginLeft={75}>
		<ScrollView>
		<div className="relative">

      {/* ShipDetails component */}
      <div className="relative z-10 p-3">
        <ShipDetails
          id={id}
          shipID={shipID}
          vesselName="Prince Henry"
          type={type}
          flag="England"
          grossTonnage={grossTonnage}
          deadWeight={deadWeight}
          length={length}
          beam={beam}
          draught={draught}
          eta={eta}
          etd={etd}
		  image = "https://lloydslist.maritimeintelligence.informa.com/-/media/lloyds-list/images/containers/2023-new-pictures/northern-vigour-credit-hasenpusch-photo.jpg?rev=a9e5b1eafa624bc9a4d1fdf9f6818546"
        />
      </div>
	  <div className="relative z-10 p-4">
        <ShipDetails
          id={id}
          shipID={shipID}
          vesselName={vesselName}
          type={type}
          flag={flag}
          grossTonnage={grossTonnage}
          deadWeight={deadWeight}
          length={length}
          beam={beam}
          draught={draught}
          eta={eta1}
          etd={etd1}
		  image = "https://www.freightwaves.com/wp-content/uploads/2021/03/Ever_Given_blocking_1.jpg"
        />
      </div>
	  <div className="relative z-10 p-4">
        <ShipDetails
          id={id}
          shipID={shipID}
          vesselName={vesselName}
          type={type}
          flag={flag}
          grossTonnage={grossTonnage}
          deadWeight={deadWeight}
          length={length}
          beam={beam}
          draught={draught}
          eta={eta}
          etd={etd}
		  image = "https://upload.wikimedia.org/wikipedia/commons/9/9c/M%C3%A6rsk_Triple_E_%28cropped%29.jpg"
        />
      </div>
    </div>
	</ScrollView>
	  </Box>
	  </Box>
	  <Box>

	  <h1 className="text-center font-semibold text-3xl mb-2">Activities</h1>		
	  <ScrollView>
		<Activity priority = {1} pCol = "red" description = {supervisorDesc} location = "https://www.ziprecruiter.com/svc/fotomat/public-ziprecruiter/cms/1071582304DockWorker.jpg=ws1280x960"/>
	  
		<Activity priority = {2} pCol = "orange" description = {craneDesc} location = "https://pbs.twimg.com/media/F30d6tRXoAAF1Gi?format=jpg&name=small"/>
	
	  <Activity priority = {2} pCol = "orange" description = {logisticDesc} location = "https://www.supplychainbrain.com/ext/resources/0-images/article-images/2022/0228_LAPortDockworkers.jpg?t=1646001331&width=864"/>

	  </ScrollView>


   
   </Box>
	  </SimpleGrid>
    </Box>
  );
};

export default SplitWithImage;
