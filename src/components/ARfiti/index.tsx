/* eslint-disable react/prop-types */
import { useState } from 'react';

import './styles.css';

export function ARfiti() {
  return (
    <>
      <BaseMap />
      {/* <BaseStructure /> */}
      <BaseList />
    </>
  );
}

// function BaseStructure() {
//   return (
//     <div className="base-structure">
//       <h1>Base</h1>
//     </div>
//   );
// }

// function BaseSquare({ children }: { children: React.ReactNode }) {
//   return <div className="base-square">{children}</div>;
// }

function BaseRoundButton() {
  return <button className="base-round-button">+</button>;
}

function BaseMap() {
  const [squareCssList, setSquareCssList] = useState(['base-square']);
  const [mapCssList, setMapCssList] = useState(['base-map']);
  const [isSelected, setSelection] = useState(false);
  const handleOnClick = () => {
    if (isSelected) {
      // setCssList(cssList.filter((item) => item !== 'clicked'));
      setSquareCssList(['base-square-expanded']);
      setMapCssList(['base-map-expanded']);
    } else {
      // setCssList([...cssList, 'clicked'])
      setSquareCssList(['base-square']);
      setMapCssList(['base-map']);
    }
    setSelection(!isSelected);
  };

  return (
    <div className={squareCssList.join(' ')} onClick={handleOnClick}>
      {/* <BaseSquare> */}
      <BaseRoundButton />
      <div className={mapCssList.join(' ')}>
        <h1>Base map </h1>
      </div>
      {!isSelected && <MapDetails />}
      {/* </BaseSquare> */}
    </div>
  );
}

function MapDetails() {
  return (
    <div className="map-details">
      <h1>Map Details</h1>
    </div>
  );
}

function BaseList() {
  return (
    <div className="base-list">
      <BaseListItem />
      <BaseListItem />
      <BaseListItem />
      <BaseListItem />
      <BaseListItem />
    </div>
  );
}

function BaseListItem() {
  const [cssList, setCssList] = useState(['base-list-component', 'clickable']);
  const [isSelected, setSelection] = useState(false);
  const handleOnClick = () => {
    if (isSelected) {
      setCssList(cssList.filter((item) => item !== 'clicked'));
    } else {
      setCssList([...cssList, 'clicked']);
    }
    setSelection(!isSelected);
  };

  return (
    <div className={cssList.join(' ')} onClick={handleOnClick}>
      <h1>Base List</h1>
      {isSelected && <ItemDetail />}
    </div>
  );
}

function ItemDetail() {
  return (
    <div className="item-detail">
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur sapiente dolores
        tenetur blanditiis, deserunt voluptate earum quis animi itaque porro in, ipsa quod ipsum
        corrupti numquam mollitia officiis! Sunt, voluptatem!
      </p>
    </div>
  );
}
