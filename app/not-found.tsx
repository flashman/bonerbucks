import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center space-y-4 py-12">
      <h2>404 — BONER NOT FOUND</h2>
      <p className="text-sm">That boner seems to have gone missing.</p>
      <p>
        <Link href="/boners">BACK TO ALL BONERS</Link>
        {" | "}
        <Link href="/">HOME</Link>
      </p>
    </div>
  );
}
