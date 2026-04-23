"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="text-center space-y-4 py-12">
      <h2>SOMETHING WENT WRONG</h2>
      <p className="text-sm text-red-600">{error.message}</p>
      <button onClick={reset} className="btn">TRY AGAIN</button>
    </div>
  );
}
