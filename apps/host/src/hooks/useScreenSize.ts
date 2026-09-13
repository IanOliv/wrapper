import { useEffect, useState } from 'react';

function getScreenSize() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

function useScreenSize() {
  const [screenSize, setScreenSize] = useState(getScreenSize());

  useEffect(() => {
    function handleResize() {
      setScreenSize(getScreenSize());
    }

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
}

export default useScreenSize;
