import React from "react";
import Breadcrumbs from "./Breadcrumbs";

const Header: React.FC = () => {
  return (
    <header>
      <Breadcrumbs />
      <div className="flex">
        <h1>ヘッダー</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
        </nav>
      </div>
    </header>
  );
};
export default Header;
