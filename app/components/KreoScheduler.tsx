"use client";

import React, { useEffect, useMemo, useState } from "react";

type Day = { date: string; label: string; slots: Array<{ time: string; available: boolean }> };

const meetingTypes = [
  { label: "Discovery Call", duration: "30 min", note: "Best for a new brand, website, design or campaign brief." },
  { label: "Pricing / Scope Review", duration: "20 min", note: "Use this if you already know the rough project and want clarity." },
  { label: "Property Campaign Consult", duration: "30 min", note: "For estate agents, developers and launch campaigns." }
];

const projectTypes = ["Brand identity", "Logo design", "Website", "Property marketing", "Motion / CGI", "Pitch deck", "Print / packaging", "Not sure yet"];

export default function KreoScheduler() {
  const [meetingType, setMeetingType] = useState(meetingTypes[0].label);
  const [days, setDays] = useState<Day[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", businessName: "", phone: "", projectType: projectTypes[0], notes: "" });
  const selectedDay = useMemo(() => days.find((day) => day.date === selectedDate) || days[0], [days, selectedDate]);
  const selectedMeeting = meetingTypes.find((type) => type.label === meetingType) || meetingTypes[0];

  useEffect(() => {
    let cancelled = false;
    setStatus("Checking studio availability...");
    fetch(`/api/booking/availability?meetingType=${encodeURIComponent(meetingType)}`, { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (cancelled) return;
        const nextDays = Array.isArray(data.days) ? data.days : [];
        setDays(nextDays);
        setSelectedDate(nextDays[0]?.date || "");
        setSelectedTime(nextDays[0]?.slots?.[0]?.time || "");
        setStatus("");
      })
      .catch(() => {
        if (!cancelled) setStatus("I could not check live availability. You can still send a message instead.");
      });
    return () => {
      cancelled = true;
    };
  }, [meetingType]);

  async function book() {
    if (!form.name.trim() || !form.email.trim() || !selectedDate || !selectedTime) {
      setStatus("Add your name, email and a slot so I can confirm the booking.");
      return;
    }
    setSaving(true);
    setStatus("Reserving your KREO slot...");
    try {
      const response = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          meetingType,
          selectedDate,
          selectedTime,
          timezone: "Europe/London",
          durationMinutes: selectedMeeting.label.includes("Pricing") ? 20 : 30
        })
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Booking failed.");
      setStatus(`Booked. Brandon will see this inside KREO Intelligence: ${selectedDay?.label} at ${selectedTime}.`);
      setForm({ name: "", email: "", businessName: "", phone: "", projectType: projectTypes[0], notes: "" });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Booking failed. Please use the message form.");
    } finally {
      setSaving(false);
    }
  }

  function openMessageForm() {
    window.dispatchEvent(new CustomEvent("kreo:cinema-open"));
  }

  return (
    <div className="kreo-scheduler">
      <div className="kreo-scheduler-top">
        <div>
          <p className="kreo-scheduler-kicker">KREO booking desk</p>
          <h3>Book a studio call</h3>
          <p>Choose a focused slot. Your booking is sent straight into KREO Intelligence, so it can be tracked like a real lead rather than disappearing into a third-party widget.</p>
        </div>
        <span>{selectedMeeting.duration}</span>
      </div>

      <div className="kreo-scheduler-types">
        {meetingTypes.map((type) => (
          <button key={type.label} type="button" className={meetingType === type.label ? "active" : ""} onClick={() => setMeetingType(type.label)}>
            <strong>{type.label}</strong>
            <small>{type.note}</small>
          </button>
        ))}
      </div>

      <div className="kreo-scheduler-grid">
        <div>
          <label>Choose a day</label>
          <div className="kreo-scheduler-days">
            {days.map((day) => (
              <button key={day.date} type="button" className={selectedDate === day.date ? "active" : ""} onClick={() => {
                setSelectedDate(day.date);
                setSelectedTime(day.slots[0]?.time || "");
              }}>
                {day.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label>Available times</label>
          <div className="kreo-scheduler-times">
            {(selectedDay?.slots || []).map((slot) => (
              <button key={slot.time} type="button" className={selectedTime === slot.time ? "active" : ""} onClick={() => setSelectedTime(slot.time)}>
                {slot.time}
              </button>
            ))}
          </div>
          <p className="kreo-scheduler-note">UK time. Weekday slots include a built-in handover buffer.</p>
        </div>
      </div>

      <div className="kreo-scheduler-form">
        <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your name" />
        <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Email" type="email" />
        <input value={form.businessName} onChange={(event) => setForm({ ...form, businessName: event.target.value })} placeholder="Business / studio / agency" />
        <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="Phone, optional" />
        <select value={form.projectType} onChange={(event) => setForm({ ...form, projectType: event.target.value })}>
          {projectTypes.map((type) => <option key={type}>{type}</option>)}
        </select>
        <textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="What are you hoping to create?" />
      </div>

      {status && <p className="kreo-scheduler-status">{status}</p>}
      <div className="kreo-scheduler-actions">
        <button type="button" className="btn b-teal" onClick={book} disabled={saving}>{saving ? "Booking..." : "Reserve Studio Slot"}</button>
        <button type="button" className="btn outline" onClick={openMessageForm}>Send message instead</button>
      </div>
    </div>
  );
}
