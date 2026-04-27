import type { Metadata } from "next";

export const metadata: Metadata = { title: "Make a Boner — Bonerbucks" };

export default function MakePage() {
  return (
    <div>
      <h2>MAKING A BONER IS EASY</h2>
      <br />
      <ol>
        <li>
          Download the stamp templates
          <br />
          <br />
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 32 }}>
            <a href="/B.gif" className="stamp">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/B.gif" style={{ height: 90, width: "auto" }} alt="B stamp" />
            </a>
            <a href="/R.gif" className="stamp">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/R.gif" style={{ height: 90, width: "auto" }} alt="R stamp" />
            </a>
            <a href="/trackthisboner.gif" className="stamp">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/trackthisboner.gif" style={{ height: 90, width: "auto" }} alt="Track this boner stamp" />
            </a>
          </div>
          <br />
        </li>
        <li>
          Take them to your local stamp shop.
          <br />
          (The R and B stamps should be 0.7in tall, and the Tracker stamp should be 0.8in wide.)
          <div style={{ marginTop: 8, textAlign: "center" }}>
            <a href="/stamps.png" className="stamp" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/stamps.png" alt="Stamps" style={{ maxWidth: 420 }} />
            </a>
          </div>
        </li>
        <li>
          Make a boner.
          <div style={{ marginTop: 8, textAlign: "center" }}>
            <a href="/boner.png" className="stamp" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/boner.png" alt="Boner buck" style={{ maxWidth: 420 }} />
            </a>
          </div>
        </li>
      </ol>
      <h3>
        Or buy a stamp set at the{" "}
        <a href="http://bonerbucks.bigcartel.com">BONERBUCKS FAMILY STORE</a>.
      </h3>
    </div>
  );
}
