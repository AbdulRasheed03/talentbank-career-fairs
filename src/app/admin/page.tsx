import { redirect } from "next/navigation";

// /admin is just an entry point. The middleware only lets admins reach it, so
// send them straight to the events dashboard. (Login now lives at /login.)
export default function AdminIndexPage() {
  redirect("/admin/events");
}
