import { RowDataPacket } from "mysql2";

export interface AccountInfo {
  id: number;
  user_name: string;
  email: string;
  pic_path: string;
  created_at: Date;
  updated_at: Date;
}

export interface AccountInfoDB extends AccountInfo, RowDataPacket {}
