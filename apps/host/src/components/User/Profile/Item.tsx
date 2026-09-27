import { useEffect, useState } from 'react';

import { useWrapperSessionState } from '@/store/session';

import { AreaW, ColumnContainer, DeckContainer, List, ListItem } from './styled';

// interface Sensor {
//   name: string;
// }

interface Profile {
  tenant_name: string;
  id: number;
  role: string;
  tenant_id: number;
  user_id: number;
  permissions: unknown;
}

// const getSensors = async () => {
//   const data = await fetch('http://localhost:3000/sensors');
//   console.log(data);
//   if (!data.ok) {
//     throw new Error('Failed to fetch sensors');
//   }
//   const json = await data.json();

//   console.log('Login successful');
//   console.log(json);
//   return json;
// };

function Item() {
  // const textRef = useRef<HTMLTextAreaElement>(null);
  const [wrapperSession] = useWrapperSessionState();

  // Login form state
  // const [login, setLogin] = useState({ username: '', password: '' });
  // const [error, setError] = useState('');
  // const [sensors, setSensors] = useState<Sensor[]>([]);
  const [profile, setProfile] = useState<Profile[]>([]);
  // const [sensorDetails, setSensorDetails] = useState<Sensor[]>([]);

  // const getAsyncSensors = async () => {
  //   try {
  //     const sensorsData = await getSensors();
  //     console.log('Sensors data:', sensorsData);
  //     setSensors(sensorsData);
  //   } catch (error) {
  //     console.error('Error fetching sensors:', error);
  //   }
  // };

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

  const getAsyncProfile = async () => {
    console.log('Fetching profile...');
    console.log(wrapperSession);
    try {
      const response = await fetch('http://localhost:3000/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${wrapperSession.token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const profileData = await response.json();
      console.log('Profile data:', profileData);
      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    // getAsyncSensors();
    getAsyncProfile();
  });

  return (
    <DeckContainer>
      <ColumnContainer>
        <AreaW>
          <List>
            {profile.map((profile) => (
              <ListItem key={profile.id}>
                {profile.role} {profile.tenant_name}
              </ListItem>
            ))}
          </List>
        </AreaW>
        <br />
        <br />
        <AreaW>
          <button onClick={() => getAsyncProfile()}>Get Profile</button>
        </AreaW>
      </ColumnContainer>
    </DeckContainer>
  );
}

export default Item;
