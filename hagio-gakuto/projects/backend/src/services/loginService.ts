import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LoginDao } from "../dao/loginDao";

export class LoginService {
  private dao = new LoginDao();
  private secret = "your-secret-key";

  async login(email: string, password: string): Promise<string | null> {
    const user = await this.dao.findUserByEmail(email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return null;

    const token = jwt.sign({ id: user.id, email: user.email }, this.secret, {
      expiresIn: "1h",
    });
    return token;
  }
}
