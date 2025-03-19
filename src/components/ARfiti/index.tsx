/* eslint-disable react/prop-types */
import { useCallback, useRef, useState } from 'react';
import React from 'react';
import Webcam from 'react-webcam';

import { MapSecondaryButton } from './styled';
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
  // const [squareCssList, setSquareCssList] = useState(['base-square']);
  // const [mapCssList, setMapCssList] = useState(['base-map']);
  // const [isSelected, setSelection] = useState(true);

  const [squareCssList] = useState(['base-square-expanded']);
  const [mapCssList] = useState(['base-map-expanded']);
  const [isSelected] = useState(true);

  // const [deviceId, setDeviceId] = useState<MediaDeviceInfo>();

  const [isModalOpen] = useState(true);

  // const handleOnClick = () => {
  //   // if (!isSelected) {
  //     // setCssList(cssList.filter((item) => item !== 'clicked'));
  //     setSquareCssList(['base-square-expanded']);
  //     setMapCssList(['base-map-expanded']);
  //     setSelection(true);
  //   // } else {
  //   //   // setCssList([...cssList, 'clicked'])
  //   //   setSquareCssList(['base-square']);
  //   //   setMapCssList(['base-map']);
  //   //   setSelection(false);
  //   // }
  // };

  return (
    <div className={squareCssList.join(' ')}>
      {/* // onClick={handleOnClick}> */}
      {/* <BaseSquare> */}
      <BaseRoundButton />
      <div className={mapCssList.join(' ')}>
        <h1>Base map </h1>
        {isModalOpen && <MapModal />}
      </div>
      {isSelected && <MapDetails />}
      {/* </BaseSquare> */}
    </div>
  );
}

// interface MapDetailsProps {
//   devicesList: string[];
//   setDeviceId: (deviceId: string) => void;
// }

function MapDetails() {
  // const webcamRef = useRef(null);
  // const [imgSrc, setImgSrc] = useState(null);
  // const capture = useCallback(() => {
  //   // @ts-ignore
  //   const imageSrc = webcamRef?.current?.getScreenshot();
  //   setImgSrc(imageSrc);
  //   // console.log(imageSrc);
  // }, [webcamRef]);

  const [deviceId, setDeviceId] = useState<MediaDeviceInfo>();
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  const handleDevices = useCallback(
    (mediaDevices: MediaDeviceInfo[]) =>
      setDevices(mediaDevices.filter(({ kind }) => kind === 'videoinput')),
    [setDevices],
  );

  React.useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  return (
    <div className="map-details">
      <br />
      {/* {deviceId &&  <Webcam className="z-0 rounded-2xl m-0 "
                ref={webcamRef}
                audio={false}
                height={720}
                screenshotFormat="image/jpeg"
                width={1280}
                videoConstraints={videoConstraints}
             />} */}
      {devices.length > 0 &&
        devices.map((device) => (
          <MapSecondaryButton
            key={device.deviceId}
            isSelected={deviceId?.deviceId === deviceId}
            onClick={() => setDeviceId(device)}
          >
            {' '}
            {device.label || 'Habilitar device'}
          </MapSecondaryButton>
        ))}

      {/* )} */}
      <MapButton />
      <MapInfoSkeleton />
      <MapInfoSkeleton />
    </div>
  );
}

function MapButton() {
  return <button className="map-button">+</button>;
}

// interface MapSecondaryButtonProps {
//   name: string;
//   description?: string;
// }

// function MapSecondaryButton(props: MapSecondaryButtonProps) {
//   const { name, description } = props;
//   return <button className="map-second-button">{name}</button>;
// }

function MapInfoSkeleton() {
  return <div className="map-skeleton">+</div>;
}

const videoConstraints = {
  width: 1080,
  height: 1080,
  facingMode: 'front',
};

function MapModal() {
  const webcamRef = useRef<Webcam>(null);
  // const [imgSrc, setImgSrc] = useState<string | null | undefined>(null);
  // const capture = useCallback(() => {
  //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   // @ts-ignore
  //   const imageSrc = webcamRef?.current?.getScreenshot();
  //   setImgSrc(imageSrc);
  //   // console.log(imageSrc);
  // }, [webcamRef]);

  return (
    <div className="map-modal">
      <Webcam
        className="modal-webcam "
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />
      {/* <ModalCamera/> */}
    </div>
  );
}

// function ModalCamera() {
//     const webcamRef = useRef(null);
//     const [imgSrc, setImgSrc] = useState(null);
//     const capture = useCallback(() => {
//       const imageSrc = webcamRef?.current?.getScreenshot();
//       setImgSrc(imageSrc);
//       // console.log(imageSrc);
//     }, [webcamRef]);

//     const [deviceId, setDeviceId] = useState<MediaDeviceInfo>();
//     const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

//     const handleDevices = useCallback(
//       (mediaDevices: MediaDeviceInfo[]) =>
//         setDevices(mediaDevices.filter(({ kind }) => kind === 'videoinput')),
//       [setDevices],
//     );

//     React.useEffect(() => {
//       navigator.mediaDevices.enumerateDevices().then(handleDevices);
//     }, [handleDevices]);

//    return (
//         <div className="bg-gray-200 p-4 border rounded-xl border-gray-500 ">
//             <div className="relative ">
//            {deviceId &&  <Webcam className="z-0 rounded-2xl m-0 "
//                 ref={webcamRef}
//                 audio={false}
//                 height={720}
//                 screenshotFormat="image/jpeg"
//                 width={1280}
//                 videoConstraints={videoConstraints}
//              />}
//             <div className="z-1 bg-gray-200 p-4 border rounded-xl border-gray-500 my-3 relative">
//                 <button className="bg-green-500 text-white px-4 py-2 mx-2 rounded-lg "
//                 onClick={()=>alert('photo')}>
//                     trocar camera
//                 </button>
//                 <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg "
//                 onClick={()=>alert('photo')}>
//                     Postar
//                 </button>
//             </div>
//             <div className="z-1 bg-gray-200 p-4 border rounded-xl border-gray-500  relative my-3">
//                 <h5 className='text-black'> Cameras</h5>
//                 {devices && (
//                     devices.map((device, key) => (
//                     <button key={device.deviceId} className="bg-yellow-500 text-white px-4 py-2 mx-2 rounded-lg "
//                         onClick={()=>setDeviceId(device)}>
//                              {device.label || `Device ${key + 1}`}
//                     </button>
//                     ))
//                 )}
//             </div>
//             <div className="z-1 bg-gray-200 p-4 border rounded-xl border-gray-500  relative">
//                 <button className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
//                 onClick={()=>capture()}>
//                     Tirar foto
//                 </button>
//             </div>
//             <div>

//             </div>
//              {imgSrc &&
//                 <div className="z-1 bg-gray-200 p-4 border rounded-xl border-gray-500  relative">
//                     {/* <Image src={imgSrc} width={1280} height={720} alt='foto tirada' /> */}
//                 </div>}
//             </div>
//         </div>
//     );

// }

// =-----------

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
