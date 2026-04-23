import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Make a Boner — Bonerbucks" };

export default function MakePage() {
  return (
    <div className="max-w-2xl space-y-6 text-sm leading-relaxed">
      <h2>MAKE A BONER</h2>

      <p>
        Making a boner buck is easy. All you need is a dollar bill and something to
        write with — a pen, sharpie, or stamp works great.
      </p>

      <ol className="list-decimal list-inside space-y-3">
        <li>
          <strong>FIND A DOLLAR BILL.</strong> Any denomination works, but the classic
          boner buck uses a $1 bill.
        </li>
        <li>
          <strong>FLIP IT OVER.</strong> On the back, in the center, you&apos;ll find
          the word <em>ONE</em>.
        </li>
        <li>
          <strong>WRITE &ldquo;B&rdquo; BEFORE AND &ldquo;R&rdquo; AFTER.</strong>{" "}
          So <em>ONE</em> becomes <em>BO<strong>NE</strong>R</em>. Your dollar bill is
          now a boner buck.
        </li>
        <li>
          <strong>MAKE IT BEAUTIFUL (OPTIONAL).</strong> Draw something. Add a message.
          Get creative. Every boner is unique.
        </li>
        <li>
          <strong>SPEND IT.</strong> Release your boner into the wild. Pay for coffee,
          tip your server, give it to a friend.
        </li>
        <li>
          <strong>REPORT IT HERE.</strong> Enter the serial number from your bill so
          it can be tracked across the country.{" "}
          <Link href="/boners/new">REPORT YOUR BONER NOW.</Link>
        </li>
      </ol>

      <div className="border border-black p-4 bg-gray-50">
        <h4 className="mb-2">FINDING THE SERIAL NUMBER</h4>
        <p>
          The serial number is printed twice on the front of each bill — once on the
          upper left, once on the lower right. It looks like{" "}
          <strong>A12345678B</strong>: one letter, eight digits, one letter.
        </p>
      </div>

      <p>
        Want a starter kit with stamps and ink?{" "}
        <a href="mailto:contact@bonerbucks.org">
          Drop us a line at contact@bonerbucks.org.
        </a>
      </p>
    </div>
  );
}
