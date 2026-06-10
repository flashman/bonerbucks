import RecordForm from "@/components/RecordForm";

export const metadata = { title: "Report a Boner — Bonerbucks" };

export default function NewBonerPage() {
  return (
    <div className="space-y-4">
      <h2>REPORT A BONER</h2>
      <p className="text-sm">
        Found a boner in the wild? Tell us where it&apos;s been.
      </p>
      <RecordForm />
    </div>
  );
}
