
export default function HiringHistoryTab({ data }) {
  const { hiringHistory } = data;

  if (!hiringHistory) {
    return (
      <p className="text-center text-gray-400">
        No Hiring History yet 🚀
      </p>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-4">
        No Implement yet 🚀
    </div>
  );
}