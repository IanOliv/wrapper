import { useEffect, useState } from 'react';

// import { useWrapperSessionState } from '@/store/session';
// import { WrapperSession } from '@/store/session/types';
import { AreaW, ColumnContainer, DeckContainer, List, ListItem } from './styled';

interface Sensor {
  name: string;
}

const getSensors = async () => {
  const data = await fetch('http://localhost:3000/sensors');
  console.log(data);
  if (!data.ok) {
    throw new Error('Failed to fetch sensors');
  }
  const json = await data.json();

  console.log('Login successful');
  console.log(json);
  return json;
};

function Item() {
  // const textRef = useRef<HTMLTextAreaElement>(null);
  // const [wrapperSession, { addSession }] = useWrapperSessionState();

  // // Login form state
  // const [login, setLogin] = useState({ username: '', password: '' });
  // const [error, setError] = useState('');
  const [sensors, setSensors] = useState<Sensor[]>([]);
  // const [sensorDetails, setSensorDetails] = useState<Sensor[]>([]);

  const getAsyncSensors = async () => {
    try {
      const sensorsData = await getSensors();
      console.log('Sensors data:', sensorsData);
      setSensors(sensorsData);
    } catch (error) {
      console.error('Error fetching sensors:', error);
    }
  };

  // const getAsyncSensorDetails = async (sensorId: string) => {
  //   try {
  //     const data = await fetch(`http://localhost:3000/sensors/${sensorId}`);
  //     if (!data.ok) {
  //       throw new Error('Failed to fetch sensor details');
  //     }
  //     const sensorDetails = await data.json();
  //     console.log('Sensor details:', sensorDetails);
  //     setSensorDetails(sensorDetails);
  //     return sensorDetails;
  //   } catch (error) {
  //     console.error('Error fetching sensor details:', error);
  //     throw error;
  //   }
  // };

  useEffect(() => {
    getAsyncSensors();
  }, []);

  return (
    <DeckContainer>
      <ColumnContainer>
        <AreaW>
          <List>
            {sensors.map((sensor, index) => (
              <ListItem key={index}>{sensor.name}</ListItem>
            ))}
          </List>
        </AreaW>
        <br />
        <br />
        <AreaW></AreaW>
      </ColumnContainer>
    </DeckContainer>
  );
}

export default Item;
