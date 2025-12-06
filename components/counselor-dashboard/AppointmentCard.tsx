import { CalendarDays, Clock } from "lucide-react";

export type Appointment = {
  student: string;
  studentId: string;
  dateLabel: string;
  timeLabel: string;
  topic: string;
  status?: "Pending" | "Approved" | "Canceled";
};

export function AppointmentCard({ appt }: { appt: Appointment }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-muted" />
          <div>
            <div className="font-semibold">{appt.student}</div>
            <div className="text-xs text-muted">Student ID: {appt.studentId}</div>
          </div>
        </div>
        {appt.status && (
          <span className="rounded-full bg-yellow-100 text-yellow-700 px-2 py-1 text-xs">{appt.status}</span>
        )}
      </div>
      <div className="mt-3 space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted">
          <CalendarDays className="h-4 w-4" />
          <span>{appt.dateLabel}</span>
        </div>
        <div className="flex items-center gap-2 text-muted">
          <Clock className="h-4 w-4" />
          <span>{appt.timeLabel}</span>
        </div>
        <div className="flex items-start gap-2 text-muted">
          <div className="h-4 w-4 rounded-full bg-blue-500/20" />
          <span>{appt.topic}</span>
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <button className="rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700">Approve</button>
        <button className="rounded-md border px-3 py-2 hover:bg-muted">Reschedule</button>
        <button className="rounded-md bg-red-100 px-3 py-2 text-red-700 hover:bg-red-200">Cancel</button>
      </div>
    </div>
  );
}
