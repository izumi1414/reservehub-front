import { Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/Button";
import { PageHeader } from "~/components/layout/shared/PageHeader";
import { SlotList } from "~/features/admin-slots/components/SlotList";

export default function SlotsPage() {
  const navigate = useNavigate();
  return (
    <div>
      <PageHeader
        title="予約枠管理"
        description="予約枠の確認、作成、編集、削除を行います。"
        action={
          <Button onClick={() => navigate("/admin/slots/new")}>
            <Plus className="h-4 w-4" />
            新規作成
          </Button>
        }
      />
      <SlotList />
    </div>
  );
}
