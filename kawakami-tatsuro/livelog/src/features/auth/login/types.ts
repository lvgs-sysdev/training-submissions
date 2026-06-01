import { RowDataPacket } from "mysql2";

export interface UserLogin extends RowDataPacket {
  id: number;
  user_name: string;
  password: string;
}
