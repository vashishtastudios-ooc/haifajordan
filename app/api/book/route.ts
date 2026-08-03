import { NextResponse } from "next/server";
import { Resend } from "resend";

type BookingPayload = {
  name?: unknown;
  email?: unknown;
  event_type?: unknown;
  event_date?: unknown;
  message?: unknown;
  company?: unknown;
};

function asTrimmedString(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  let payload: BookingPayload;

  try {
    payload = (await request.json()) as BookingPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot — bots fill this; real users never see it
  if (asTrimmedString(payload.company, 120)) {
    return NextResponse.json({ ok: true });
  }

  const name = asTrimmedString(payload.name, 120);
  const email = asTrimmedString(payload.email, 254);
  const eventType = asTrimmedString(payload.event_type, 80);
  const eventDate = asTrimmedString(payload.event_date, 40);
  const message = asTrimmedString(payload.message, 4000);

  if (!name || !email || !eventType || !message) {
    return NextResponse.json(
      { error: "Please fill in all required fields." },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.BOOKING_TO_EMAIL ?? "hello@haifajordan.com";
  const fromEmail =
    process.env.BOOKING_FROM_EMAIL ?? "Haifa Jordan <bookings@haifajordan.com>";

  if (!apiKey) {
    console.error("Missing RESEND_API_KEY");
    return NextResponse.json(
      { error: "Email service is not configured yet." },
      { status: 503 },
    );
  }

  const subject = `New booking enquiry — ${eventType}`;
  const text = [
    "New booking enquiry from the website",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Event type: ${eventType}`,
    `Event date: ${eventDate || "Not provided"}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: fromEmail,
    to: [toEmail],
    replyTo: email,
    subject,
    text,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json(
      { error: "Could not send your enquiry. Please try again shortly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
