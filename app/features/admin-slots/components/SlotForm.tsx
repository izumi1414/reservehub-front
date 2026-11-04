import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Select } from "~/components/ui/Select";
import { ApiError, getApiErrorMessage } from "~/lib/api/errors";
import { createSlot, getSlotById, updateSlot } from "../api";
import type { Slot } from "../types";

type SlotFormProps = {
  slotId?: string;
};

function toDateTimeLocal(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

const startHourOptions = Array.from({ length: 10 }, (_, index) => {
  const hour = 9 + index;
  const label = `${String(hour).padStart(2, "0")}:00`;
  return { label, value: label };
});

function getDatePart(value: string) {
  return toDateTimeLocal(value).slice(0, 10);
}

function getHourPart(value: string) {
  const dateTimeLocal = toDateTimeLocal(value);
  return dateTimeLocal ? `${dateTimeLocal.slice(11, 13)}:00` : "";
}

export function SlotForm({ slotId }: SlotFormProps) {
  const navigate = useNavigate();
  const [slot, setSlot] = useState<Slot>();
  const [slotDate, setSlotDate] = useState(() => {
    return toDateTimeLocal(new Date().toISOString()).slice(0, 10);
  });
  const [startHour, setStartHour] = useState("");
  const [isAccepting, setIsAccepting] = useState("true");
  const [isLoading, setIsLoading] = useState(Boolean(slotId));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slotId) return;
    const id = slotId;
    async function loadSlot() {
      try {
        const data = await getSlotById(id);
        setSlot(data);
        setSlotDate(getDatePart(data.start_at));
        setStartHour(getHourPart(data.start_at));
        setIsAccepting(data.is_accepting ? "true" : "false");
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          setError("対象の予約枠が見つかりません。");
        } else if (err instanceof ApiError && err.status === 401) {
          setError("ログインセッションの有効期限が切れました。再度ログインしてください。");
        } else if (err instanceof ApiError && err.status === 403) {
          setError("予約枠を表示する権限がありません。");
        } else {
          setError("予約枠情報の取得に失敗しました。通信状態を確認してください。");
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadSlot();
  }, [slotId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!slotDate || !startHour) {
      setError("日付と開始時刻を選択してください。");
      return;
    }

    const hour = Number(startHour.slice(0, 2));
    if (!Number.isInteger(hour) || hour < 9 || hour > 18) {
      setError("開始時刻は9時から18時の間で選択してください。");
      return;
    }

    const start = new Date(`${slotDate}T${String(hour).padStart(2, "0")}:00:00`);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    if (Number.isNaN(start.getTime()) || start.getHours() !== hour || start.getMinutes() !== 0) {
      setError("日時の形式が正しくありません。");
      return;
    }
    if (slot?.status === "reserved" && (
      getDatePart(slot.start_at) !== slotDate ||
      getHourPart(slot.start_at) !== startHour
    )) {
      setError("予約済みの予約枠では日時を変更できません。");
      return;
    }

    setIsSubmitting(true);
    try {
      const params = {
        startAt: start.toISOString(),
        endAt: end.toISOString(),
      };
      if (slotId) {
        await updateSlot(slotId, { ...params, isAccepting: isAccepting === "true" });
      } else {
        await createSlot(params);
      }
      navigate("/admin/slots", { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setError(getApiErrorMessage(
            err,
            slotId
              ? "予約済みまたは競合しているため更新できません。"
              : "指定した日時と重複する予約枠が既に存在します。"
          ));
        } else if (err.status === 404) {
          setError("対象の予約枠が見つかりません。");
        } else if (err.status === 400) {
          setError(getApiErrorMessage(err, "入力内容が正しくありません。"));
        } else if (err.status === 401) {
          setError("ログインセッションの有効期限が切れました。再度ログインしてください。");
        } else if (err.status === 403) {
          setError("予約枠を保存する権限がありません。");
        } else {
          setError("予約枠の保存に失敗しました。");
        }
      } else {
        setError("予約枠の保存に失敗しました。");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
        予約枠情報を読み込んでいます...
      </div>
    );
  }

  const selectedHour = Number(startHour.slice(0, 2));
  const endHour = Number.isInteger(selectedHour) && selectedHour >= 9 && selectedHour <= 18
    ? `${String(selectedHour + 1).padStart(2, "0")}:00`
    : "";

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
        <h2 className="text-base font-semibold text-gray-800">予約枠情報</h2>
        {slot?.status === "reserved" && (
          <p className="mt-1 text-sm text-amber-600">
            この予約枠は予約済みです。受付状態のみ変更できます。
          </p>
        )}
      </div>
      <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
        <Input
          id="slot-date"
          label="日付"
          type="date"
          value={slotDate}
          onChange={(event) => {
            setSlotDate(event.target.value);
            setError("");
          }}
          disabled={slot?.status === "reserved"}
          isRequired
          required
        />
        <Select
          id="start-hour"
          label="開始時刻"
          value={startHour}
          onChange={(event) => {
            setStartHour(event.target.value);
            setError("");
          }}
          disabled={slot?.status === "reserved"}
          options={startHourOptions}
          placeholder="開始時刻を選択"
          isRequired
          required
        />
        <Input
          id="end-hour"
          label="終了時刻"
          value={endHour ? `${endHour}（1時間枠）` : ""}
          disabled
          helperText="開始時刻から必ず1時間後になります。"
        />
        {slotId && (
          <div className="sm:col-span-2">
            <Select
              id="is-accepting"
              label="受付状態"
              value={isAccepting}
              onChange={(event) => setIsAccepting(event.target.value)}
              options={[
                { label: "受付中", value: "true" },
                { label: "受付停止", value: "false" },
              ]}
            />
          </div>
        )}
      </div>
      {error && (
        <p className="px-5 pb-4 text-sm text-red-500 sm:px-6" role="alert">
          {error}
        </p>
      )}
      <div className="flex flex-col-reverse gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
        <Link
          to="/admin/slots"
          className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          キャンセル
        </Link>
        <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
          {slotId ? "更新" : "作成"}
        </Button>
      </div>
    </form>
  );
}
