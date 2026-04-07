import pool from "../../shared/database/db.js";

export const getAllBreeds = async () => {
  const [rows] = await pool.execute(
    "SELECT id, name FROM breeds ORDER BY name ASC",
  );
  return rows;
};
