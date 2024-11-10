import { useState, useEffect } from "react";

function useViewport() {
  const [viewWidth, setViewWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setViewWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { viewWidth };
}

export default useViewport;
