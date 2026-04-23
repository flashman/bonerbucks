import Link from "next/link";
import HomeMap from "@/components/HomeMap";

export const revalidate = 60; // ISR — re-render every minute

export default function HomePage() {
  return (
    <div className="text-center space-y-6">
      <h1 className="text-2xl leading-snug">
        WELCOME TO BONERBUCKS.ORG
        <br />
        THE BONER TRACKING PROJECT
      </h1>

      <div className="text-left max-w-2xl mx-auto space-y-3 text-sm">
        <p>
          Boner bucks were started by the [people] at 4chan with help of an AIDS
          victim. It is the act of defacing one dollar bills. On the back of the
          dollar the word <em>one</em> appears, and to make your one a boner
          buck you simply write B and R in front and after the one. Therefore
          making it a BoneR buck.
        </p>
        <p className="italic text-xs pl-4 border-l-2 border-black space-y-1">
          <span className="block">GUY 1: Oh shit, we are a little short on tip...</span>
          <span className="block">GUY 2: Don't look at me! This is my last boner buck!</span>
          <span className="block">GUY 3: Dude here, [Hands Guy 2 a sharpie] shut up and pitch in.</span>
          <span className="block text-right">—urbandictionary.com</span>
        </p>
      </div>

      <h3>
        WHERE&apos;S YOUR BONER?{" "}
        <Link href="/boners/new">ADD IT TO THE LIST</Link>
      </h3>

      {/* Map component is a Client Component — loads Google Maps */}
      <HomeMap />

      <h3>
        <Link href="/signup">JOIN THE BONER TRACKING PROJECT</Link>
      </h3>
    </div>
  );
}
