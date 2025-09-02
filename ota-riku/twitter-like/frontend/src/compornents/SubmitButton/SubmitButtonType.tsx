import React from "react";

export type SubmitButtonProps = {
  children: React.ReactNode;
  type?: "submit" | "reset" | "button";
  onClick?: () => void;
};
