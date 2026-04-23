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
          <div style={{ textAlign: "center" }}>
            <a href="/B.gif" className="stamp">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/B.gif" height={150} style={{ marginRight: 30 }} alt="B stamp" />
            </a>
            <a href="/R.gif" className="stamp">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/R.gif" height={150} alt="R stamp" />
            </a>
            <a href="/trackthisboner.gif" className="stamp">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/trackthisboner.gif" height={150} alt="Track this boner stamp" />
            </a>
          </div>
          <br />
        </li>
        <li>
          Take them to your local stamp shop.
          <br />
          (The R and B stamps should be 0.7in tall, and the Tracker stamp should be 0.8in wide.)
          <div style={{ textAlign: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/stamps.png" alt="Stamps" style={{ maxWidth: "100%" }} />
          </div>
        </li>
        <li>
          Make a boner.
          <div style={{ textAlign: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/boner.png" alt="Boner buck" style={{ maxWidth: "100%" }} />
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
