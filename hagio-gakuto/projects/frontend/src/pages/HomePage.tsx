import React from "react";
import { useTitle } from "../hooks/useTitle";

const Home: React.FC = () => {
  useTitle("ホーム");
  return (
    <>
      <h1>ホーム</h1>
    </>
  );
};
export default Home;
