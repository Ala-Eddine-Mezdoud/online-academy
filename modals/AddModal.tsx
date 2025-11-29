"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "lg",
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!mounted) return null;
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-xl",
  };

  const wrapperStyle: React.CSSProperties = {
    position: "fixed", // force viewport anchoring
    inset: 0,
    zIndex: 9999,
    pointerEvents: "none",
  };

  const panelStyle: React.CSSProperties = {
    position: "fixed", // also force the panel to be fixed
    top: "5.5rem", // ~ top-20; adjust if you want it closer/further from top
    left: "50%",
    transform: "translateX(-50%)",
    width: "100%",
    maxWidth: sizes[size] === "max-w-xl" ? 640 : sizes[size] === "max-w-lg" ? 512 : 384,
    margin: "0 1rem",
    zIndex: 10000,
    pointerEvents: "auto",
    maxHeight: "calc(100vh - 6rem)",
    overflowY: "auto",
  };

  const modal = (
    <div
      style={wrapperStyle}
      aria-modal="true"
      role="dialog"
      className="pointer-events-none"
    >
      {/* Backdrop */}
      <div
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.30)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
        className="pointer-events-auto"
      />

      {/* Panel */}
      <div
        style={panelStyle}
        className="bg-white rounded-lg shadow-xl border border-gray-200 animate-scaleIn"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-md"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
