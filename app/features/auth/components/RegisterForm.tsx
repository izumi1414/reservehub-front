import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { register } from "../api";
import { ApiError } from "~/lib/api/errors";
import { Input } from "~/components/ui/Input";
import { Button } from "~/components/ui/Button";

export function RegisterForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const response = await register({
        email,
        password,
      });

      navigate("/login");

    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setError("このメールアドレスはすでに登録されています");
        } else {
          setError("登録に失敗しました");
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
          label="パスワード(8文字以上)"
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
          登録
        </Button>

      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        <Link
          to="/login"
          className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          ログインはこちら
        </Link>
      </p>
    </div>

  );
}
