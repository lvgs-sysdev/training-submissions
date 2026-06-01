import { userInfo } from "../../../library/users/typeDefinition.js";
import { usersPool } from "../../models/users/DB.js";
import { loginSQL } from "../../models/users/userSQL.js";
import { DBAccess } from "../../models/users/DBAccess.js";
import { transformData } from "./transformData.js";


export const loginDBAccess = async(data:userInfo) =>{
    const arrayData = await transformData(data);
    const user_ID = [arrayData[0]];
    const password = arrayData[1];
    const { user_id, user_name, password_hash } = await DBAccess(
        usersPool,
        loginSQL,
        user_ID,
    );
    
    return {user_id, user_name, password, password_hash}
}
