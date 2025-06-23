import { FC } from "react";

// TODO: アイコンのパスを指定してあげる
export const Header: FC = () => {
  const headerStyle = {
    alignItems: "center",
    margin: "0",
    padding: "0",
    display: "flex",
    height: "90px",
    width: "1000px",
    backgroundColor: "black",
    zIndex: "1",
    textAlign: "center",
  } as React.CSSProperties;

  const logoStyle = {
    fontSize: "50px",
    color: "white",
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto",
  } as React.CSSProperties;

  const iconStyle = {
    alignContent: "center",
    width: "50px",
    height: "50px",
    objectFit: "cover",
    borderRadius: "50%",
    marginLeft: "20px",
  } as React.CSSProperties;

  const notificateIcon = {
    alignContent: "center",
    width: "50px",
    height: "50px",
    paddingRight: "20px",
  };

  return (
    <>
      <header style={headerStyle}>
        <img
          src={`${process.env.PUBLIC_URL}/images/cat_meam.jpg`}
          style={iconStyle}
        />
        <h1 style={logoStyle}>X</h1>
        <img
          src={`${process.env.PUBLIC_URL}/images/bell.png`}
          style={notificateIcon}
        />
      </header>
    </>
  );
};
