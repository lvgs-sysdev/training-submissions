import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Home } from "./pages/Home/HomePage";
import { Regist } from "./pages/Regist/RegistPage";
import { Login } from "./pages/Login/LoginPage";
import { UserPage } from "./pages/User/UserPage";
import { EditUser } from "./pages/EditUser/EditUserPage";
import { CratePostPage } from "./pages/CreatePostPage/CreatePostPage";
import { PostDetailPage } from "./pages/PostDetail/PostDetailPage";
import { ReplyPostPage } from "./pages/ReplyPost/ReplyPostPage";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/regist" element={<Regist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user" element={<UserPage />} />
        <Route
          path="/editUser"
          element={
            <EditUser
              currentHeaderFileName="defaultBG.png"
              currentIconFileName="cat_meam.jpg"
              currentUserId="cat_meam"
              currentUserName="Catmeam"
              currentLink="neko.net"
              currentProfileContext="ぱくぱく！"
            />
          }
        />
        <Route
          path="/createPost"
          element={<CratePostPage iconImgFileName="cat_meam.jpg" />}
        />
        <Route
          path="/postDetail"
          element={<PostDetailPage>ぱくぱく！</PostDetailPage>}
        />
        <Route
          path="/reply"
          element={
            <ReplyPostPage
              targetPostContent="ほへ"
              replyUserIconFileName="cat_meam.jpg"
              replyUserId="cat_meam"
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
