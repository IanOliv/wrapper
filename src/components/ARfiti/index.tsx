/* eslint-disable react/prop-types */
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
  return (
    <div className="base-square">
      {/* <BaseSquare> */}
      <BaseRoundButton />
      <div className="base-map">
        <h1>Base map </h1>
      </div>
      {/* </BaseSquare> */}
    </div>
  );
}

function BaseList() {
  return (
    <div className="base-list">
      <div className="base-list-component">
        <h1>Base List</h1>
      </div>
      <div className="base-list-component">
        <h1>Base List</h1>
      </div>
      <div className="base-list-component">
        <h1>Base List</h1>
      </div>
      <div className="base-list-component">
        <h1>Base List</h1>
      </div>
      <div className="base-list-component">
        <h1>Base List</h1>
      </div>
    </div>
  );
}
