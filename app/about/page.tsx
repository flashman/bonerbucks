import type { Metadata } from "next";

export const metadata: Metadata = { title: "About — Bonerbucks" };

export default function AboutPage() {
  return (
    <div className="max-w-2xl space-y-6 text-sm leading-relaxed">
      <h2>ABOUT BONERBUCKS.ORG</h2>
      <p>
        Welcome to bonerbucks.org, the money beautification project. If
        you&apos;ve found your way to this site, then you have most likely
        stumbled upon a BoneRbuck. Congratulations! And thank you for taking the
        time to visit. Before you read any further, track your BoneR. Thanks!
      </p>
      <p>
        Bonerbucks.org was started in 2012, as the garbage idea of a graduate
        student seeking low brow respite from a high brow world. Initially it
        was just going to be a crappy knock-off of <a href="https://www.wheresgeorge.com/">
        Where&apos;s George
        </a>
        for BoneRs. Since
        then, and after some occasional hiatus, it's developed into a slightly less crappy
        knock-off, in support of decommodification, artistic expression, and social action,
        through simple creative acts of defacement.
      </p>


      <p>
        We&apos;re certainly not the first to do this — please check out some of these more
        established websites for some wonderful and creative examples:
      </p>
      <ul className="list-none ml-4">
        <li>
          <a href="http://artasmoney.com">Exchangehibition Bank</a>
        </li>
        <li>
          <a href="http://www.flickr.com/groups/612007@N21/pool/">
            Deface presidents on Flickr
          </a>
        </li>
        <li>
          <a href="http://www.johnnyburrito.com/uglymoney.htm">
            Johnny Burrito
          </a>
        </li>
      </ul>

      <h2>LEGAL MATTERS</h2>
      <p>
        You may be wondering, is it illegal to deface paper currency? As its written:
      </p>

      <blockquote className="italic ml-4">
        Whoever mutilates, cuts, defaces, disfigures, or perforates, or unites or cements
        together, or does any other thing to any bank bill, draft, note, or other evidence of debt
        issued by any national banking association, or Federal Reserve bank, or the Federal
        Reserve System, with intent to render such bank bill, draft, note, or other evidence of
        debt unfit to be reissued, shall be fined under this title or imprisoned not more than six
        months, or both. - 18 U.S. Code § 333
      </blockquote>

      <p>
        and
      </p>

      <blockquote className="italic ml-4">
        Whoever designs, engraves, prints, makes, or executes, or utters, issues, distributes,
        circulates, or uses any business or professional card, notice, placard, circular, handbill,
        or advertisement in the likeness or similitude of any obligation or security of the United
        States issued under or authorized by any Act of Congress or writes, prints, or otherwise
        impresses upon or attaches to any such instrument, obligation, or security, or any coin of
        the United States, any business or professional card, notice, or advertisement, or any
        notice or advertisement whatever, shall be fined under this title. Nothing in this section
        applies to evidence of postage payment approved by the United States Postal Service. - 18
        U.S. Code § 475
      </blockquote>

      <p>
        So in short… probably not ¯\_(ツ)_/¯
      </p>

      <p>
        With love,<br/>
        M
      </p>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/bonerbucksAtTransformoneyTree-s.gif"
            width={600}
            height={450}
            alt="Bonerbucks at Transformoney Tree"
          />
          <p className="italic">
            BoneRbucks at the Transformoney Tree, Burning Man 2012
          </p>
        </div>
    </div>
  );
}
