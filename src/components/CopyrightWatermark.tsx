/**
 * طبقة علامة مائية خفيفة فوق المحتوى — لا تعترض النقرات (pointer-events: none).
 * تُستخدم لتوضيح أن المحتوى والصور والعلامة محمية بحقوق Elite Furniture.
 */
export function CopyrightWatermark() {
  const line =
    "© Elite Furniture — جميع الحقوق محفوظة — المحتوى والصور والعلامة للاستخدام المعروض فقط — Unauthorized use prohibited.";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="520" height="240" viewBox="0 0 520 240">
  <text x="260" y="120" fill="%230a0a0a" fill-opacity="0.06" font-size="15" font-family="Georgia, 'Times New Roman', serif" text-anchor="middle" transform="rotate(-24 260 120)">${escapeXml(line)}</text>
</svg>`;
  const uri = `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 select-none"
      style={{
        backgroundImage: uri,
        backgroundRepeat: "repeat",
        backgroundSize: "520px 240px",
      }}
    />
  );
}

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
