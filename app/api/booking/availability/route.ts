import { json, listBookings, options } from "../../live-chat-store";

const timeSlots = ["10:00", "11:30", "13:30", "15:00", "16:30"];
const timezone = "Europe/London";

export async function OPTIONS() {
  return options();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const meetingType = searchParams.get("meetingType") || "Discovery Call";
  const durationMinutes = durationFor(meetingType);
  const bookings = await listBookings();
  const taken = new Set(bookings.filter((booking) => booking.status !== "cancelled").map((booking) => `${booking.selectedDate}T${booking.selectedTime}`));
  const today = startOfDay(new Date());
  const days = [];

  for (let offset = 1; days.length < 18 && offset < 42; offset++) {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);
    const day = date.getDay();
    if (day === 0 || day === 6) continue;
    const iso = date.toISOString().slice(0, 10);
    const slots = timeSlots
      .filter((time) => !taken.has(`${iso}T${time}`))
      .map((time) => ({ time, available: true }));
    days.push({
      date: iso,
      label: new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "2-digit", month: "short", timeZone: timezone }).format(date),
      slots
    });
  }

  return json({ timezone, meetingType, durationMinutes, days });
}

function durationFor(meetingType: string) {
  if (meetingType.toLowerCase().includes("pricing")) return 20;
  return 30;
}

function startOfDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}
