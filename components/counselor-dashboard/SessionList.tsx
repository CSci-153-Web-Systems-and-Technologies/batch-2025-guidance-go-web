import { AppointmentCard, type Appointment } from "./AppointmentCard";

export function SessionList({ items, title }: { items: Appointment[]; title: string }) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="space-y-4">
        {items.map((appt, idx) => (
          <AppointmentCard appt={appt} key={idx} />
        ))}
      </div>
    </section>
  );
}
