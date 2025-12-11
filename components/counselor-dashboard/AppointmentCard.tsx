import { CalendarDays, Clock } from "lucide-react";

export type Appointment = {
  appointmentId?: string;
  student: string;
  studentId: string;
  email?: string | null;
  dateLabel: string;
  timeLabel: string;
  topic: string;
  type?: string;
  mode?: string;
  durationLabel?: string;
  status?: "Pending" | "Approved" | "Canceled";
};

export function AppointmentCard({ appt, onApprove, onCancel, onReschedule, busy }: { appt: Appointment; onApprove?: (id?: string) => void; onCancel?: (id?: string) => void; onReschedule?: (id?: string) => void; busy?: boolean }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-muted" />
          <div>
            <div className="font-semibold">{appt.student}</div>
            {appt.email && <div className="text-xs text-zinc-600">{appt.email}</div>}
            <div className="text-xs text-zinc-600">{appt.studentId}</div>
          </div>
        </div>
        {appt.status && (
          <span className="rounded-full bg-yellow-100 text-yellow-700 px-2 py-1 text-xs">{appt.status}</span>
        )}
      </div>
      <div className="mt-3 space-y-2 text-sm">
        <div className="flex items-center gap-2 text-zinc-700">
          <CalendarDays className="h-4 w-4" />
          <span>{appt.dateLabel}</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-700">
          <Clock className="h-4 w-4" />
          <span>{appt.timeLabel}</span>
        </div>
        {appt.durationLabel && (
          <div className="flex items-center gap-2 text-zinc-700">
            <Clock className="h-4 w-4" />
            <span>{appt.durationLabel}</span>
          </div>
        )}
        <div className="flex items-start gap-2 text-zinc-700">
          <div className="h-4 w-4 rounded-full bg-blue-500/20" />
          <span>{appt.topic}</span>
        </div>
        {(appt.type || appt.mode) && (
          <div className="flex items-center gap-2 text-zinc-700">
            <div className="h-4 w-4 rounded-full bg-zinc-300" />
            <span>
              {appt.type ? `Type: ${appt.type}` : ""}
              {appt.type && appt.mode ? " • " : ""}
              {appt.mode ? `Mode: ${appt.mode}` : ""}
            </span>
          </div>
        )}
      </div>
      <div className="mt-4 flex gap-3">
        <button disabled={busy} onClick={() => onApprove?.(appt.appointmentId)} className={`rounded-md px-3 py-2 text-white ${busy ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}>{busy ? "Approving…" : "Approve"}</button>
        <button disabled={busy} onClick={() => onReschedule?.(appt.appointmentId)} className="rounded-md border px-3 py-2 hover:bg-muted">Reschedule</button>
        <button disabled={busy} onClick={() => onCancel?.(appt.appointmentId)} className={`rounded-md px-3 py-2 ${busy ? "bg-red-200 text-red-700" : "bg-red-100 text-red-700 hover:bg-red-200"}`}>Cancel</button>
      </div>
    </div>
  );
}
