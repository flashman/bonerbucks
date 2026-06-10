import RecordForm from "@/components/RecordForm";
import { normaliseSerial } from "@/lib/utils";

export const metadata = { title: "Report a Boner — Bonerbucks" };

interface Props {
  params: Promise<{ serial: string }>;
}

export default async function NewBonerWithSerialPage({ params }: Props) {
  const { serial } = await params;
  const normSerial = normaliseSerial(decodeURIComponent(serial));

  return (
    <div className="space-y-4">
      <h2>REPORT A BONER</h2>
      <p className="text-sm">
        You&apos;re reporting boner{" "}
        <strong>{normSerial}</strong>. Fill in where you found it.
      </p>
      <RecordForm initialSerial={normSerial} />
    </div>
  );
}
