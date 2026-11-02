import { LoginForm } from "~/features/auth/components/LoginForm";
import { CalendarDays } from "lucide-react";

export default function LoginPage() {
  return (
    <main
      className="flex min-h-screen w-full items-center justify-center bg-cover bg-center bg-no-repeat p-4"
      style={{
        backgroundImage: "url('/login-background-image.png')",
      }}
    >
      <div className="w-full max-w-md rounded-xl bg-white/95 p-6 shadow-xl sm:p-8">
        <div className="
                flex h-16 items-center gap-2 text-2xl
              ">
          <CalendarDays className="h-6 w-6 text-sky-600" />

          <span className="text-lg font-bold text-slate-800">
            ReserveHub
          </span>
        </div>
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
          ログイン
        </h1>

        <LoginForm />
      </div>
    </main>
  );
}
