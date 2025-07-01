import { FC } from "react";
import { EditUserType } from "./EditUserType";
import { EditHeader } from "./EditHeader/EditHeaderElem";
import { EditBody } from "./EditBody/EditBodyElem";

export const EditUser: FC<EditUserType> = ({
  currentHeaderFileName,
  currentIconFileName,
  currentUserId,
  currentUserName,
  currentProfileContext,
  currentLink,
}) => {
  return (
    <>
      <form action="/editUser" method="post">
        <EditHeader imageFileName={currentHeaderFileName}></EditHeader>
        <EditBody
          currentIconFileName={currentIconFileName}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          currentProfileContext={currentProfileContext}
          currentLink={currentLink}
        ></EditBody>
      </form>
    </>
  );
};
