import React, { useEffect, useState } from "react";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { ApiError } from "~/lib/api/errors";
import { getMonthlyReport } from "../api";
import type { MonthlyReport as MonthlyReportData } from "../types";

function getCurrentMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function formatMonth(month: string) {
  const [year, monthNumber] = month.split("-");
  return `${year}年${Number(monthNumber)}月`;
}

export function MonthlyReport() {
  const [month, setMonth] = useState(getCurrentMonth());
  const [report, setReport] = useState<MonthlyReportData>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadReport(targetMonth: string) {
    if (!/^\d{4}-\d{2}$/.test(targetMonth)) {
      setError("対象月を選択してください。");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await getMonthlyReport(targetMonth);
      setReport(data);
    } catch (err) {
      setReport(undefined);
      if (err instanceof ApiError && err.status === 400) {
        setError("対象月の指定が正しくありません。");
      } else if (err instanceof ApiError && err.status === 401) {
        setError("ログインセッションの有効期限が切れました。再度ログインしてください。");
      } else if (err instanceof ApiError && err.status === 403) {
        setError("月次レポートを表示する権限がありません。");
      } else {
        setError("月次レポートの取得に失敗しました。通信状態を確認してください。");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadReport(getCurrentMonth());
  }, []);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    loadReport(month);
  }

  return (
    <div className="space-y-6">
      <form
        className="flex max-w-md items-end gap-3"
        onSubmit={handleSubmit}
      >
        <Input
          id="report-month"
          name="month"
          label="対象月"
          type="month"
          value={month}
          onChange={(event) => setMonth(event.target.value)}
          isRequired
          disabled={isLoading}
        />
        <Button type="submit" isLoading={isLoading}>
          表示
        </Button>
      </form>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
          レポートを読み込んでいます...
        </div>
      ) : report ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              {formatMonth(report.month)}の予約総数
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-800">
              {report.totalReservations}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">確定済み</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {report.confirmedReservations}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">キャンセル済み</p>
            <p className="mt-2 text-3xl font-bold text-red-500">
              {report.cancelledReservations}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
