"use client";

import { QRCodeCanvas } from "qrcode.react";

interface Props {
  value: string;
  size?: number;
}

export default function QRDisplay({ value, size = 140 }: Props) {
  return (
    <div
      className="inline-flex items-center justify-center bg-white rounded-xl p-3"
      style={{ border: "2px solid #e2e8f0" }}
    >
      <QRCodeCanvas
        value={value}
        size={size}
        bgColor="#ffffff"
        fgColor="#01003d"
        level="M"
        imageSettings={{
          src: "",
          width: 0,
          height: 0,
          excavate: false,
        }}
      />
    </div>
  );
}
