import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [address, setAddress] = useState("");
  useEffect(() => {
    getAddress();
  }, []);

  const getAddress = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/get_address`);
      setAddress(response.data.data.address);
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <div className="min-h-screen bg-grey px-32 py-16">
      <div className="">
        <p className="text-3xl">
          Pay to this Address to play:{" "}
          <span className="font-semibold">{address}</span>
        </p>
      </div>
      <form className="w-full mt-16 flex justify-center items-center flex-col">
        <input
          className="w-full bg-white p-4 rounded-3xl text-lg"
          placeholder="Enter Transaction ID"
        />
        <button className=" bg-green-dark py-3 font-medium px-14 rounded text-white my-5">
          Play
        </button>
      </form>
    </div>
  );
}

export default App;
