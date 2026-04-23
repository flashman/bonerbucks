import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/lib/types";

export const metadata: Metadata = { title: "Blog — Bonerbucks" };
export const revalidate = 300;

// ── Historical posts migrated from the original Rails view ────────────────
const STATIC_POSTS = [
  {
    date: "March 18 2014",
    content: (
      <>
        <blockquote className="border-l-2 border-black pl-3 italic my-2">
          Imagine you are being born and society tells you: Welcome, you will be cared
          for, and asks you what you want to do with your life, what is your calling?
          Imagine that feeling, that&apos;s a whole different atmosphere.
        </blockquote>
        <p className="text-xs text-gray-500 mb-2">—Daniel Straub, Co-founder, Basic Income Initiative</p>
        <p>
          Switzerland was going to start paying citizens a living wage. What a novel
          idea. Invest in a stable and happy society and let people find their calling.{" "}
          <a href="http://xposethereal.com/swiss-to-pay-basic-income-2500-francs-per-month-to-every-adult.html">
            Swiss to pay basic income 2,500 Francs per month to every adult.
          </a>
        </p>
      </>
    ),
  },
  {
    date: "Jan 20 2014",
    content: (
      <p>
        Here&apos;s a funny little op-ed on money addiction as experienced by a former
        addict:{" "}
        <a href="http://www.nytimes.com/2014/01/19/opinion/sunday/for-the-love-of-money.html">
          For the Love of Money
        </a>
        . I find the sales pitch at the end of the piece mildly offensive.
      </p>
    ),
  },
  {
    date: "Dec 6 2013",
    content: (
      <p>
        Structural virality is well described by the Wiener index, which addresses the
        shortcomings of both depth and average depth. Ok, sorry that was a timely but
        worthless post. Welcome to the nothing that is life.
      </p>
    ),
  },
  {
    date: "Nov 15 2013",
    content: (
      <>
        <p>Mark Wagner explores the material quality of money to stunning effect!!</p>
        <div className="media my-4">
          <iframe
            src="//player.vimeo.com/video/79148964"
            width="500"
            height="281"
            allowFullScreen
            className="max-w-full"
          />
        </div>
      </>
    ),
  },
  {
    date: "Sep 27 2013",
    content: (
      <p>
        Help remove money from politics! The{" "}
        <a href="http://www.stampstampede.org">Stamp Stampede</a> is an organization
        promoting a constitutional amendment to remove money from politics — by stamping
        messages on dollar bills. Messages include: &ldquo;Stamp money out of
        politics,&rdquo; &ldquo;Corporations are Not People,&rdquo; and &ldquo;Not to
        be used for buying elections.&rdquo; Check them out.
      </p>
    ),
  },
  {
    date: "Aug 2 2013",
    content: (
      <>
        <p>
          Gifting, by John &ldquo;Halcyon&rdquo; Styn (reposted from{" "}
          <a href="http://blog.burningman.com/2013/08/playa-tips/tips-tricks-5-gifting/">
            the Burning Man blog
          </a>
          ):
        </p>
        <ol className="list-decimal list-inside space-y-1 mt-2">
          <li><strong>Gifting is a physical demonstration of Love.</strong></li>
          <li><strong>Gifting dissolves separation.</strong></li>
          <li><strong>A Gift can be ANYTHING.</strong></li>
          <li><strong>Gifting eliminates hoarding and creates abundance.</strong></li>
          <li><strong>Gifting helps dissolve the Ego.</strong></li>
          <li><strong>Gifting breaks the commerce paradigm.</strong> Traditional commerce = zero-sum. A gift = positive sum.</li>
          <li><strong>Gifting releases the flow of energy between people.</strong></li>
          <li><strong>Gifting opens up the world.</strong></li>
          <li><strong>Gifting is never required.</strong> A feeling of obligation cancels out the Gift.</li>
          <li><strong>EVERY interaction can be seen as an act of Gifting.</strong></li>
        </ol>
      </>
    ),
  },
  {
    date: "April 7 2013",
    content: (
      <p>
        <a href="http://en.wikipedia.org/wiki/J._S._G._Boggs">J.S.G. Boggs</a> creates
        detailed one-sided drawings of bank notes, then spends them at face value.
        Collectors pay upwards of a thousand dollars for one of these notes, but he
        asks that they be spent at face value. He&apos;s been arrested for his art in
        England and Australia, but was acquitted in both cases on the basis that he was
        only selling his art.
      </p>
    ),
  },
  {
    date: "Nov 29 2012",
    content: (
      <p>
        <a href="http://www.telegraph.co.uk/finance/financialcrisis/9682263/Occupy-Wall-St-protesters-wipe-5m-off-Americas-debt.html">
          Occupy Wall St protesters wipe $5m off America&apos;s debt.
        </a>{" "}
        Visit <a href="http://rollingjubilee.org/">rollingjubilee.org</a> to help.
      </p>
    ),
  },
];

export default async function BlogPage() {
  const supabase = await createClient();

  // DB posts from admin (newer posts added via admin tooling)
  const { data: dbPosts } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-2xl space-y-2">
      <h2 className="mb-6">BLOG</h2>

      {/* DB-driven posts (newest) */}
      {(dbPosts ?? []).map((post: Post) => (
        <article key={post.id} className="post">
          <h5>{formatDate(post.created_at)}</h5>
          <div
            className="mt-2 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      ))}

      {/* Historical static posts */}
      {STATIC_POSTS.map((p) => (
        <article key={p.date} className="post">
          <h5>{p.date}</h5>
          <div className="mt-2 text-sm leading-relaxed">{p.content}</div>
        </article>
      ))}
    </div>
  );
}
