/** @jsx React.createElement */
import React from "react";
import { createRoot } from "react-dom/client";
import { LoginForm } from "./login";

export const initLogin = (containerId: string) => {
  const container = document.getElementById(containerId);
  if (container) {
    const root = createRoot(container);
    root.render(<LoginForm containerId={containerId} />);
  }
};
