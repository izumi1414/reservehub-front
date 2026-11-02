import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { login } from "../api";
import { ApiError } from "~/lib/api/errors";
import { Input } from "~/components/ui/Input";
import { Button } from "~/components/ui/Button";
import { useAuth } from "~/features/auth/useAuth";

export function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useAuth();

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const response = await login({
        email,
        password,
      });

      // Contextにログインユーザー情報を設定
      setUser(response.user);

      // ログイン後の遷移先をロールで分岐
      if (response.user.role === "admin") {
        navigate("/admin/slots");
      } else {
        navigate("/reservations");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError("メールアドレスまたはパスワードが正しくありません。");
        } else {
          setError("ログインに失敗しました。");
        }
      } else {
        setError("通信エラーが発生しました。");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="メールアドレス"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="パスワード"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}

        <Button
          type="submit"
          isLoading={isLoading}
          disabled={!email || !password}
          className="w-full"
        >
          ログイン
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        <Link
          to="/register"
          className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          会員登録はこちら
        </Link>
      </p>
    </div>
  );
}
