import { cn } from "@/lib/utils";
import { Video } from "lucide-react";

type Appointment = {
  counselor: string;
  role: string;
  timeLabel: string;
  dateLabel: string;
  avatar?: string;
};

export function NextAppointmentCard({
  appointment,
  compact = false,
}: {
  appointment: Appointment;
  compact?: boolean;
}) {
  return (
    <div className={cn(
      "rounded-2xl border bg-white p-0 shadow-sm overflow-hidden",
      compact ? "" : ""
    )}>
      {/* Blue gradient header bar with time on right */}
      <div className="flex items-center justify-between gap-4 bg-gradient-to-r from-[#2d7cf7] to-[#3aa0ff] px-5 py-4 text-white">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-white/20" />
          <div>
            <div className="text-xs opacity-90">Next Session</div>
            <div className="text-sm font-semibold">
              {appointment.counselor}
            </div>
            <div className="text-xs opacity-90">{appointment.role}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold leading-none">{appointment.timeLabel}</div>
          <div className="text-xs opacity-90">{appointment.dateLabel}</div>
        </div>
      </div>
      <div className="px-5 py-5">
        <button className="w-full inline-flex items-center justify-center gap-3 rounded-xl bg-blue-600 px-5 py-4 text-white text-base font-semibold hover:bg-blue-700 shadow-sm">
          <Video className="h-5 w-5" />
          Make an Appointment
        </button>
      </div>
    </div>
  );
}
