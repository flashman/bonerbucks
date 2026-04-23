"use client";

interface Props {
  notice?: string | null;
  error?: string | null;
}

export default function FlashMessage({ notice, error }: Props) {
  return (
    <>
      {notice && <p className="notice mb-4">{notice}</p>}
      {error && <p className="error mb-4">{error}</p>}
    </>
  );
}
