import { RowDataPacket } from "mysql2";
export interface User {
  id: number;
  user_name: string;
  pic_path: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserDB extends User, RowDataPacket {}
