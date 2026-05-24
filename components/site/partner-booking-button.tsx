"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { BookingModal } from "./booking-modal";

export function PartnerBookingButton({
  src,
  label = "Check availability & book",
  variant = "primary",
  modalTitle = "Reservar",
}: {
  src: string;
  label?: string;
  variant?: "primary" | "secondary";
  modalTitle?: string;
}) {
  const [open, setOpen] = useState(false);

  // Strip any existing iframe params and ensure a clean URL for embedding
  const cleanSrc = src.replace(/[?&]iframe=(true|1)/i, "").replace(/\?$/, "");

  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-colors";
  const sizeClasses = "px-6 py-3.5 text-[15px]";
  const variantClasses =
    variant === "primary"
      ? "bg-brand-yellow hover:bg-brand-yellow-hover text-navy-900"
      : "bg-navy-800 hover:bg-navy-900 text-white";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${baseClasses} ${sizeClasses} ${variantClasses} w-full`}
      >
        <Calendar className="w-4 h-4" />
        {label}
      </button>

      {open ? (
        <BookingModal
          src={cleanSrc}
          title={modalTitle}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}
