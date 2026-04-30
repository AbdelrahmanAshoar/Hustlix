import type { ProfilePageData } from "./types";

interface HiringHistoryTabProps {
  data: ProfilePageData;
}

export default function HiringHistoryTab({ data }: HiringHistoryTabProps) {
  const { hiringHistory } = data;

  if (!hiringHistory) {
    return <p className="text-center text-gray-400">No hiring history yet.</p>;
  }

  return <div className="grid gap-4 md:grid-cols-3">No implementation yet.</div>;
}
