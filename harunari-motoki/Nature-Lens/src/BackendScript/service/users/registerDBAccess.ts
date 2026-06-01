import { userInfo } from "../../../library/users/typeDefinition.js";
import { usersPool } from "../../models/users/DB.js";
import { registerSQL } from "../../models/users/userSQL.js";
import { DBAccess } from "../../models/users/DBAccess.js";
import { modifyUserInfo } from "../../service/users/modifyUseInfo.js";
import { transformData } from "../../service/users/transformData.js";


export const registerDBAccess = async(data:userInfo) =>{
    try {
    const objectData = await modifyUserInfo(data);
    const arrayData = await transformData(objectData);
    await DBAccess(usersPool, registerSQL, arrayData);
        
    } catch (error:any) {
        throw new Error(error)
    }

}
