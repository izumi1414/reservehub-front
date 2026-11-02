import { useState, type FormEvent } from "react";

export type ReservationFormValues = {
  customerName: string;
  customerEmail: string;
};

type ReservationFormProps = {
  initialEmail: string;
  isSubmitting?: boolean;
  onSubmit: (values: ReservationFormValues) => void;
};

export function ReservationForm({
  initialEmail,
  isSubmitting = false,
  onSubmit,
}: ReservationFormProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState(initialEmail);

  const [errors, setErrors] = useState<
    Partial<Record<keyof ReservationFormValues, string>>
  >({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!customerName.trim()) {
      newErrors.customerName = "氏名を入力してください。";
    }

    if (!customerEmail.trim()) {
      newErrors.customerEmail = "メールアドレスを入力してください。";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())
    ) {
      newErrors.customerEmail =
        "正しいメールアドレスを入力してください。";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) return;

    onSubmit({
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="customerName"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          氏名 <span className="text-red-500">*</span>
        </label>

        <input
          id="customerName"
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="例：予約 太郎"
          disabled={isSubmitting}
          className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:bg-gray-100"
        />

        {errors.customerName && (
          <p className="mt-1 text-sm text-red-500">
            {errors.customerName}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="customerEmail"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          メールアドレス <span className="text-red-500">*</span>
        </label>

        <input
          id="customerEmail"
          type="email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          placeholder="example@example.com"
          disabled={isSubmitting}
          className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:bg-gray-100"
        />

        {errors.customerEmail && (
          <p className="mt-1 text-sm text-red-500">
            {errors.customerEmail}
          </p>
        )}
      </div>

      <div className="flex justify-end border-t border-gray-200 pt-5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "処理中..." : "確認画面へ"}
        </button>
      </div>
    </form>
  );
}
