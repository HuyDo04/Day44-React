import useDebounce from "@/hooks/useDebounce";
import useUser from "@/hooks/useUser";
import { useEffect, useState } from "react";

function Home() {
  const [searchValue, setSearchValue] = useState("");
  const [preview, setPreview] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const debounceValue = useDebounce(searchValue, 800);

  const user = useUser();
  console.log(user);
  useEffect(() => {
    if (debounceValue) {
      console.log(`Call API ${debounceValue}`);
    }
  }, [debounceValue]);

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div>
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Search"
      />
      <input
        type="file"
        onChange={(e) => {
          setAvatar(e.target.files[0]);
          setPreview(URL.createObjectURL(e.target.files[0]));
        }}
      />
      {preview && <img src={preview} width={200} />}
      {user && <p>Xin chào {user.firstName}</p>}
    </div>
  );
}

export default Home;
