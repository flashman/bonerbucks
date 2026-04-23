import type { Metadata } from "next";

export const metadata: Metadata = { title: "About — Bonerbucks" };

export default function AboutPage() {
  return (
    <div className="max-w-2xl space-y-6 text-sm leading-relaxed">
      <h2>ABOUT BONERBUCKS.ORG</h2>

      <p>
        Welcome to bonerbucks.org, the boner tracking project. If you&apos;ve found
        your way to this site, then you have most likely stumbled upon a boner buck.
        Congratulations! And thank you for taking the time to visit. Before you read
        any further, track your boner. We can only do this together.
      </p>

      <p>
        How much better would the world be if you could buy your cup of coffee with a
        boner. How much better would the world be if we were not driven by the desire
        to have but instead by the desire to give. What if the conversation went:{" "}
        <em>
          &ldquo;Hey man, I&apos;m down on my luck. Can you lend me a boner?&rdquo;
          &ldquo;Sure man, of course. Keep it too. That&apos;s what it means to be
          family.&rdquo;
        </em>{" "}
        Our mission is to make every dollar in circulation a boner buck. Through the
        simple act of defacing currency, of &ldquo;bonerfication,&rdquo; we strip
        away that bill&apos;s god-given importance, leaving it exposed to the world
        for what it is. At worst, a piece of paper, and at best a device of love.
        Through this simple act, we hope to change the way that people relate to
        money and more importantly to each other.
      </p>

      <p>
        Boners are great, but they are just the start. As the project grows, we want
        to encourage and support the collective effort of money beautification in the
        US and abroad. Check out some of these fine websites for wonderful examples:{" "}
        <a href="http://artasmoney.com">exchangehibition bank</a>,{" "}
        <a href="http://www.flickr.com/groups/612007@N21/pool/">
          defaced presidents on Flickr
        </a>
        ,{" "}
        <a href="http://www.johnnyburrito.com/uglymoney.htm">Johnny Burrito</a>. So,
        when you find a boner in your hand, express yourself, make that boner
        beautiful, and share it with the world.
      </p>

      <p>
        If you like what we&apos;re doing and want to support the effort, consider
        starting your own bonerbuck campaign. Drop us a line at{" "}
        <a href="mailto:contact@bonerbucks.org">contact@bonerbucks.org</a> and
        we&apos;ll send you your very own starter kit, complete with stamps and ink.
        Or just grab some pens/sharpies/white-out and do your thing. Every boner is
        beautiful.
      </p>
    </div>
  );
}
