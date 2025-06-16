export function getCallTypeColor(type?: string): string {
  switch (type?.toLowerCase()) {
    case "voicemail":
      return "#325AE7";
    case "answered":
      return "#1DC9B7";
    case "missed":
      return "#C91D3E";
    default:
      return "#888"; // fallback color
  }
}
