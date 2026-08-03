"use client";

import { FormEvent, useState } from "react";

const eventTypes = [
  "Wedding",
  "Corporate event",
  "Private celebration",
  "Destination experience",
  "Festival / venue night",
  "Other",
] as const;

type FormStatus = "idle" | "submitting" | "success" | "error";

export function BookForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          event_type: formData.get("event_type"),
          event_date: formData.get("event_date"),
          message: formData.get("message"),
          company: formData.get("company"),
        }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      form.reset();
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-sm border border-[rgba(196,128,106,0.22)] bg-[#080808]/55 p-8 md:p-10">
        <p className="text-[10px] font-semibold tracking-[0.28em] text-[#C4806A] uppercase">
          Enquiry sent
        </p>
        <h2 className="font-display mt-4 text-[clamp(1.8rem,5vw,2.6rem)] leading-tight text-[#F5F0EE] italic">
          Thank you
        </h2>
        <p className="mt-4 max-w-xl text-[15px] leading-[1.9] text-[rgba(245,240,238,0.72)]">
          Your message is on its way. We&apos;ll be in touch soon to discuss your
          event.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-8 inline-flex items-center justify-center border border-[rgba(196,128,106,0.35)] px-6 py-3 text-[9px] font-bold tracking-[0.24em] text-[#E8C4B8] uppercase transition-colors hover:border-[#C4806A] hover:text-[#F5F0EE]"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative rounded-sm border border-[rgba(196,128,106,0.22)] bg-[#080808]/55 p-6 md:p-8"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-[10px] font-semibold tracking-[0.2em] text-[#C4806A] uppercase">
            Full name
          </span>
          <input
            required
            disabled={status === "submitting"}
            name="name"
            type="text"
            className="h-11 border border-[rgba(196,128,106,0.26)] bg-[#12100f] px-3 text-[14px] text-[#F5F0EE] outline-none placeholder:text-[rgba(245,240,238,0.36)] focus:border-[#C4806A] disabled:opacity-60"
            placeholder="Your name"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-[10px] font-semibold tracking-[0.2em] text-[#C4806A] uppercase">
            Email
          </span>
          <input
            required
            disabled={status === "submitting"}
            name="email"
            type="email"
            className="h-11 border border-[rgba(196,128,106,0.26)] bg-[#12100f] px-3 text-[14px] text-[#F5F0EE] outline-none placeholder:text-[rgba(245,240,238,0.36)] focus:border-[#C4806A] disabled:opacity-60"
            placeholder="you@email.com"
          />
        </label>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-[10px] font-semibold tracking-[0.2em] text-[#C4806A] uppercase">
            Event type
          </span>
          <select
            required
            disabled={status === "submitting"}
            name="event_type"
            defaultValue=""
            className="h-11 border border-[rgba(196,128,106,0.26)] bg-[#12100f] px-3 text-[14px] text-[#F5F0EE] outline-none focus:border-[#C4806A] disabled:opacity-60"
          >
            <option value="" disabled>
              Select event type
            </option>
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-[10px] font-semibold tracking-[0.2em] text-[#C4806A] uppercase">
            Event date
          </span>
          <input
            disabled={status === "submitting"}
            name="event_date"
            type="date"
            className="h-11 border border-[rgba(196,128,106,0.26)] bg-[#12100f] px-3 text-[14px] text-[#F5F0EE] outline-none [color-scheme:dark] focus:border-[#C4806A] disabled:opacity-60"
          />
        </label>
      </div>

      <label className="mt-5 flex flex-col gap-2">
        <span className="text-[10px] font-semibold tracking-[0.2em] text-[#C4806A] uppercase">
          Message
        </span>
        <textarea
          required
          disabled={status === "submitting"}
          name="message"
          rows={6}
          className="resize-y border border-[rgba(196,128,106,0.26)] bg-[#12100f] px-3 py-2.5 text-[14px] leading-relaxed text-[#F5F0EE] outline-none placeholder:text-[rgba(245,240,238,0.36)] focus:border-[#C4806A] disabled:opacity-60"
          placeholder="Tell us about your event, location, and what kind of set you have in mind."
        />
      </label>

      <input
        tabIndex={-1}
        autoComplete="off"
        name="company"
        type="text"
        aria-hidden="true"
        className="pointer-events-none absolute h-0 w-0 opacity-0"
      />

      <p className="mt-5 text-[12px] text-[rgba(245,240,238,0.52)]">
        Pricing is handled one-to-one after enquiry, based on your event details.
      </p>

      {status === "error" ? (
        <p className="mt-5 text-[13px] text-[#E8A090]" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-7 inline-flex items-center justify-center bg-gradient-to-br from-[#C4806A] to-[#A0604A] px-8 py-3.5 text-[9px] font-bold tracking-[0.28em] text-[#080808] uppercase transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "submitting" ? "Sending..." : "Send enquiry"}
      </button>
    </form>
  );
}
