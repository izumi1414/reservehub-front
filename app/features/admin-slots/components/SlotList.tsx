import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/Button";
import { DataTable } from "~/components/ui/DataTable";
import { Modal } from "~/components/ui/Modal";
import { StatusBadge } from "~/components/ui/StatusBadge";
import { ApiError, getApiErrorMessage } from "~/lib/api/errors";
import { deleteSlot, getSlotsList } from "../api";
import type { Slot } from "../types";

export function SlotList() {
  const navigate = useNavigate();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [target, setTarget] = useState<Slot>();
  const [isDeleting, setIsDeleting] = useState(false);

  async function loadSlots() {
    try {
      setError("");
      const data = await getSlotsList();
      setSlots(data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setError("予約枠一覧を表示する権限がありません。");
      } else if (err instanceof ApiError && err.status === 401) {
        setError("ログインセッションの有効期限が切れました。再度ログインしてください。");
      } else {
        setError("予約枠一覧の取得に失敗しました。");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadSlots();
  }, []);

  async function handleDelete() {
    if (!target) return;
    setIsDeleting(true);
    setError("");
    try {
      await deleteSlot(target.id);
      setTarget(undefined);
      await loadSlots();
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setError(getApiErrorMessage(
            err,
            "予約済みまたは予約履歴があるため削除できません。"
          ));
        } else if (err.status === 404) {
          setError("対象の予約枠が見つかりません。すでに削除された可能性があります。");
        } else if (err.status === 401) {
          setError("ログインセッションの有効期限が切れました。再度ログインしてください。");
        } else if (err.status === 403) {
          setError("予約枠を削除する権限がありません。");
        } else {
          setError("予約枠の削除に失敗しました。");
        }
      } else {
        setError("予約枠の削除に失敗しました。通信状態を確認してください。");
      }
      setTarget(undefined);
    } finally {
      setIsDeleting(false);
    }
  }

  function formatDateTime(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  return (
    <>
      {error && <p className="mb-4 text-sm text-red-500" role="alert">{error}</p>}
      <DataTable<Slot>
        columns={[
          {
            id: "start_at",
            header: "開始日時",
            render: (slot) => formatDateTime(slot.start_at),
          },
          {
            id: "end_at",
            header: "終了日時",
            render: (slot) => formatDateTime(slot.end_at),
          },
          {
            id: "status",
            header: "予約状態",
            render: (slot) => (
              <StatusBadge
                label={slot.status === "available" ? "予約可能" : "予約済み"}
                variant={slot.status === "available" ? "success" : "info"}
              />
            ),
          },
          {
            id: "accepting",
            header: "受付状態",
            render: (slot) => (
              <StatusBadge
                label={slot.is_accepting ? "受付中" : "受付停止"}
                variant={slot.is_accepting ? "success" : "neutral"}
              />
            ),
          },
          {
            id: "actions",
            header: "操作",
            render: (slot) => (
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/admin/slots/${slot.id}/edit`)}
                >
                  <Pencil className="h-4 w-4" />
                  編集
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  disabled={slot.status === "reserved"}
                  onClick={() => setTarget(slot)}
                >
                  <Trash2 className="h-4 w-4" />
                  削除
                </Button>
              </div>
            ),
          },
        ]}
        data={slots}
        rowKey={(slot) => slot.id}
        isLoading={isLoading}
        emptyMessage="予約枠がありません"
      />
      <Modal
        isOpen={Boolean(target)}
        onClose={() => setTarget(undefined)}
        title="予約枠を削除しますか？"
        description={target ? `${formatDateTime(target.start_at)} の予約枠を削除します。` : undefined}
        footer={
          <>
            <Button variant="secondary" onClick={() => setTarget(undefined)} disabled={isDeleting}>
              キャンセル
            </Button>
            <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
              削除
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          削除すると元に戻せません。
        </p>
      </Modal>
    </>
  );
}
