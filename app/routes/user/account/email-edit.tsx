import { EmailEditForm } from "~/features/account/components/EmailEditCard"

export default function EmailEditPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          メールアドレス変更
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          新しいメールアドレスを入力してください。
        </p>
      </div>
      <EmailEditForm />
    </div>
  )
}
