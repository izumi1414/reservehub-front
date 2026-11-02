import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  // トップページ
  index("routes/home.tsx"),

  // 認証
  route("login", "routes/auth/login.tsx"),
  route("register", "routes/auth/register.tsx"),

  // 一般ユーザー
  layout("routes/user/layout.tsx", [
    route("reservations", "routes/user/reservations/index.tsx"),
    route("reservations/new", "routes/user/reservations/new.tsx"),
    route("reservations/confirm", "routes/user/reservations/confirm.tsx"),
    route("reservations/complete", "routes/user/reservations/complete.tsx"),

    route(
      "my/reservations",
      "routes/user/reservations/my-reservations/index.tsx"
    ),
    route(
      "my/reservations/:reservationId",
      "routes/user/reservations/my-reservations/detail.tsx"
    ),

    route("account", "routes/user/account/index.tsx"),
    route("account/email-edit", "routes/user/account/email-edit.tsx"),
    route("account/password-edit", "routes/user/account/password-edit.tsx"),
  ]),

  // 管理者
  layout("routes/admin/layout.tsx", [
    route("admin/slots", "routes/admin/slots/index.tsx"),
    route("admin/slots/new", "routes/admin/slots/new.tsx"),
    route("admin/slots/:slotId/edit", "routes/admin/slots/edit.tsx"),

    route("admin/reservations", "routes/admin/reservations/index.tsx"),
    route(
      "admin/reservations/:reservationId",
      "routes/admin/reservations/detail.tsx"
    ),

    route("admin/reports/monthly", "routes/admin/reports/monthly.tsx"),
  ]),
] satisfies RouteConfig;
