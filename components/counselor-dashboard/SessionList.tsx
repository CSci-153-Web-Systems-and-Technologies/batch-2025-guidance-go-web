import { AppointmentCard, type Appointment } from "./AppointmentCard";

export function SessionList({ items, title, onApprove, onCancel, onReschedule, busyActionById }: { items: Appointment[]; title: string; onApprove?: (id?: string) => void; onCancel?: (id?: string) => void; onReschedule?: (id?: string) => void; busyActionById?: Record<string, "approve" | "cancel" | undefined> }) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="space-y-4">
        {items.map((appt, idx) => (
          <AppointmentCard
            appt={appt}
            key={idx}
            onApprove={onApprove}
            onCancel={onCancel}
            onReschedule={onReschedule}
            busyAction={busyActionById?.[appt.appointmentId ?? ""]}
          />
        ))}
      </div>
    </section>
  );
}
