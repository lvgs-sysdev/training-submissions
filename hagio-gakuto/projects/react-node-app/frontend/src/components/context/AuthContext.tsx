import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { getMe } from "../../api/getAuth";

// ユーザーの型を定義
interface User {
  id: number;
  name: string;
  // 他に必要なプロパティを追加
}

// Contextが持つ値の型を定義
interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

type AuthProviderProps = {
  children: ReactNode;
};

// ★修正点1: createContextに正しい型と初期値を設定
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // ★修正点2: useStateにも型を指定
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 初回およびフォーカス時のチェックを行う関数
    const checkUser = async () => {
      try {
        const res = await getMe();
        setUser(res.data);
      } catch (error) {
        // 認証エラーの場合はユーザーをnullに設定（ログアウト状態）
        setUser(null);
      }
    };

    // 1. 初回ロード時にチェック
    checkUser();

    // 2. ウィンドウにフォーカスが当たった時に再度チェック
    window.addEventListener("focus", checkUser);

    // 3. クリーンアップ関数：コンポーネントが不要になったらイベントリスナーを削除
    return () => {
      window.removeEventListener("focus", checkUser);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// ★修正点3: カスタムフックでContextがundefinedでないことを保証する
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
