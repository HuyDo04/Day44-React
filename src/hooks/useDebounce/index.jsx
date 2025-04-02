import { useEffect, useState } from "react";

function useDebounce(value, time) {
  const [searchValue, setSearchValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchValue(value);
    }, time);

    return () => {
      clearTimeout(timer);
    };
  }, [value, time]);

  return searchValue;
}

export default useDebounce;
