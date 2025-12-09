import { redirect } from "next/navigation";

export default function DashboardRedirect() {
  // Redirect old /dashboard path to the new /student-dashboard route
  redirect("/student-dashboard");
}
