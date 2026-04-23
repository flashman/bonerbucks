import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/lib/types";
import SafeImage from "@/components/SafeImage";

export const metadata: Metadata = { title: "Blog — Bonerbucks" };
export const revalidate = 300;

export default async function BlogPage() {
  const supabase = await createClient();

  const { data: dbPosts } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      {/* DB-driven posts (newest, added via admin) */}
      {(dbPosts ?? []).map((post: Post) => (
        <div key={post.id} className="post">
          <h5><a>{formatDate(post.created_at)}</a></h5>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      ))}

      {/* ── Hardcoded historical posts, faithfully ported from the original ERB ── */}

      <div className="post">
        <h5><a>March 18 2014</a></h5>
        <p><q>Imagine you are being born and society tells you: Welcome, you will be cared for, and asks you what you want to do with your life, what is your calling? Imagine that feeling, that&apos;s a whole different atmosphere</q> &mdash;Daniel Straub, Co-founder, Basic Income Initiative</p>
        <p>This is Switzerland. They are going to start paying their citizens a living wage. What a novel idea. Invest in a stable and happy society to let people find their calling. I honestly wonder if this will work...but it worked for Alaska, and they are doing great. <a href="http://xposethereal.com/swiss-to-pay-basic-income-2500-francs-per-month-to-every-adult.html">Swiss to pay basic income 2,500 Francs per month to every adult</a>.</p>
      </div>

      <div className="post">
        <h5><a>Jan 20 2014</a></h5>
        <p>Here&apos;s a funny little op-ed on money addiction as experienced by a former addict: <a href="http://www.nytimes.com/2014/01/19/opinion/sunday/for-the-love-of-money.html?_r=0">For the Love of Money</a>. I find the sales pitch at the end of the piece mildly offensive.</p>
      </div>

      <div className="post">
        <h5><a>Dec 6 2013</a></h5>
        <p>Structural virality is well described by the weiner index, which address the shortcomings of both depth and average depth. Ok, sorry that was a timely but worthless post. Welcome to the nothing that is life.</p>
      </div>

      <div className="post">
        <h5><a>Nov 15 2013</a></h5>
        <p>Mark Wagner expores the material quality of money to stuning effect!!</p>
        <div className="media">
          <iframe src="//player.vimeo.com/video/79148964" width={500} height={281} allowFullScreen title="Mark Wagner - Money is Material" />
          <p><a href="http://vimeo.com/79148964">Mark Wagner - Money is Material</a> from <a href="http://vimeo.com/avantgardediaries">The Avant/Garde Diaries</a> on <a href="https://vimeo.com">Vimeo</a>.</p>
        </div>
      </div>

      <div className="post">
        <h5><a>Nov 8 2013</a></h5>
        <p>A billion dollars, 5 cents at a time...<a href="http://news-hound.net/samsung-pays-apple-1-billion-sending-30-trucks-full-of-5-cent-coins/">Yea for patents.</a></p>
        <div className="media">
          <SafeImage src="http://i.imgur.com/CRNnLvG.jpg" alt="Samsung pays Apple" />
        </div>
      </div>

      <div className="post">
        <h5><a>Sep 27 2013</a></h5>
        <p>Help remove money from politics! Deface government property! The <a href="http://www.stampstampede.org">StampStampede</a> is an organization and social movement promoting a constitutional amendment to remove money from politics...by stamping messages on dollar bills. Messages include: <q>Stamp money out of politics</q>, <q>Not To Be Used for Bribing Politicians</q>, <q>Corporations are Not People</q>, and <q>Not to be used for buying elections</q>. Check them out. You can sign a petition, or buy some stamps.</p>
        <div className="media">
          <SafeImage src="http://www.winastamp.com/galleries/images/photo_2_large.JPG" alt="Stamp Stampede" />
        </div>
      </div>

      <div className="post">
        <h5><a>Aug 21 2013</a></h5>
        <p>Ok, this is not the most complicated thought I have ever had. (And technically it is not even mine.) Oh well.</p>
        <div className="media">
          <a href="http://crouton.us/">
            <SafeImage src="http://31.media.tumblr.com/0da91b169fbcd68368debfc62dd5ef6d/tumblr_mq92arKvO41ruo7zfo1_500.jpg" alt="" />
          </a>
        </div>
      </div>

      <br />
      <div className="post">
        <h5><a>Aug 12 2013</a></h5>
        <p>It that time of year...crunch time for all those residents of Black Rock City. As you scramble to the finish line, you are probably noticing that your wallet feels just a little bit lighter than usual. This is normal, an unspoken reality and tension that underlies the event. In honor of this fact, I am devoting this post to the beautiful currencies of Black Rock City.</p>
        <div className="media">
          <a href="https://s3.amazonaws.com/bonerbucks-s3-assets/blog/life_is_hard.jpg">
            <SafeImage src="https://s3.amazonaws.com/bonerbucks-s3-assets/blog/life_is_hard.jpg" alt="Life is hard" />
          </a>
        </div>
        <div className="media">
          <a href="http://pic.templetons.com/brad/photo/bm05/">
            <SafeImage src="http://pic.templetons.com/images/giftart.png" alt="Gift art" />
          </a>
        </div>
        <div className="media">
          <a href="http://blog.artasmoney.com/">
            <SafeImage src="http://blog.artasmoney.com/wp-content/uploads/2011/02/onemillionbacksmall.jpg" alt="One million back" />
          </a>
        </div>
        <div className="media">
          <a href="http://www.digitalartist.com/art/burningman/BurningManCash.pdf">
            <SafeImage src="https://s3.amazonaws.com/bonerbucks-s3-assets/blog/burningbuck.jpg" alt="Burning buck" />
          </a>
        </div>
        <div className="media">
          <a href="http://laurakimpton.com/">
            <SafeImage src="http://burnersxxx.files.wordpress.com/2013/03/money1.jpg" alt="Laura Kimpton" />
          </a>
        </div>
      </div>

      <br />
      <div className="post">
        <h5><a>August 2 2013</a></h5>
        <p>Gifting, by John &quot;Halcyon&quot; Styn (reposted from <a href="http://blog.burningman.com/2013/08/playa-tips/tips-tricks-5-gifting/">the burning blog</a>)</p>
        <p><strong>1) Gifting is a physical demonstration of Love.</strong><br />&ldquo;I want you to have this because it makes me happy to see you happy.&rdquo;</p>
        <p><strong>2) Gifting dissolves separation.</strong><br />When you Gift, you are breaking down the wall between me and you. If you EXCHANGE, then you are re-enforcing the separation. But to GIFT is to say, You and I are one.</p>
        <p><strong>3) A Gift can be ANYTHING.</strong><br />It can be a song, an idea, a massage, a sculpture, a compliment, a sticker, a shoulder to lean on, a wet-nap, a walk home, or a hug.</p>
        <p><strong>4) Gifting eliminates hoarding and creates abundance.</strong></p>
        <p><strong>5) Gifting helps dissolve the Ego.</strong></p>
        <p><strong>6) Gifting breaks the commerce paradigm.</strong><br />Traditional commerce = an even exchange. Sum total = Zero (0). But in a gift, You receive the gift (+1) AND I feel good for giving (+1). Sum total = Two (2).</p>
        <p><strong>7) Gifting releases the flow of energy between people.</strong></p>
        <p><strong>8) Gifting opens up the world.</strong></p>
        <p><strong>9) Gifting is never required.</strong><br />A feeling of obligation cancels out the Gift.</p>
        <p><strong>10) EVERY interaction can be seen as an act of Gifting.</strong></p>
      </div>

      <br />
      <div className="post">
        <h5><a>July 30 2013</a></h5>
        <p>The folks from <a href="http://www.artasmoney.com/">Art as Money</a> just released a short collection of interviews on money and society, taken during Burning Man 2012. Enjoy!</p>
        <div className="media">
          <iframe width={560} height={315} src="//www.youtube.com/embed/rr6LtOCFwVM" allowFullScreen title="Art as Money interviews" />
        </div>
      </div>

      <br />
      <div className="post">
        <h5><a>April 7 2013</a></h5>
        <p>Hey check it out. Another artist abusing the system!!! <a href="http://en.wikipedia.org/wiki/J._S._G._Boggs">J.S.G Boggs</a> creates detailed one sided drawings of bank notes, sometimes modified and sometimes not, then spends them, or trades them, depending on how you count. Collectors will pay upwards of a thousand dollars for one of these notes, but he asks that they be spent at face value.</p>
        <div className="media">
          <SafeImage src="http://24.media.tumblr.com/4ef30ca434da8ff72c5c8e16cf12d655/tumblr_mge0vfOCtq1qio96io1_1280.jpg" alt="J.S.G. Boggs" />
        </div>
        <p>It&apos;s not too surprising that he&apos;s had his run-ins with the law. He&apos;s been arrested for his art in England and Australia, but was acquitted in both cases on the basis that he was only selling his art.</p>
        <div className="media">
          <SafeImage src="http://lostatsea.net/LAS/archives/features/art/jsgboggs/jsgboggs_ban6.jpg" alt="J.S.G. Boggs bill" />
        </div>
        <p>He makes no effort to conceal the counterfeit nature of the bills. Instead, he invites the recipient to treat the bills as legal tender despite the fact that the bills have no monetary value. He lived for a year without money by persuading people to take his bills at face value.</p>
      </div>

      <br />
      <div className="post">
        <h5><a>Jan 13 2013</a></h5>
        <p>I asked someone from the financial industry how I might write &quot;boner&quot; on a billion dollars. He seemed confused by the question. But with the potential minting of a <a href="http://www.wired.com/business/2013/01/trillion-dollar-coin-inventor/">trillion dollar coin</a> to stave off the most recent debt crisis, I think my problem might be solved.</p>
        <div className="media">
          <SafeImage src="http://www.wired.com/images_blogs/business/2013/01/origin_8349514053.jpg" alt="Trillion dollar coin" />
        </div>
      </div>

      <br />
      <div className="post">
        <h5><a>Jan 3 2013</a></h5>
        <p>Welcome to a new year. I&apos;m really optimistic about this one. 2013 has a good ring to it...kindof feels like the future. Now, an update on the <a href="http://blogs.villagevoice.com/runninscared/2012/12/the_rolling_jub.php">Rolling Jubilee</a> (via the Village Voice). Aside from some legal hiccups, it sounds like they have managed to get some well deserved attention and support.</p>
        <div className="media">
          <SafeImage src="http://blogs.villagevoice.com/runninscared/RollingJubileeGiftBox1.jpg" alt="Rolling Jubilee" />
        </div>
      </div>

      <br />
      <div className="post">
        <h5><a>Dec 23 2012</a></h5>
        <p>It takes everyone.</p>
        <div className="media">
          <SafeImage src="https://s3.amazonaws.com/bonerbucks-s3-assets/blog/christian-patriots-for-gun-control.jpg" alt="Christian patriots for gun control" />
        </div>
      </div>

      <br />
      <div className="post">
        <h5><a>Dec 10 2012</a></h5>
        <p>I think I&apos;m about two years too late with this one...but James Charles is doing some wonderful art work on the dollar bills. What&apos;s really impressive is the care with which he has taken to make his modified bills nearly indistinguishable from the real thing. He has gone so far as to track down the inks used by the mint. Sadly, you won&apos;t find this money in circulation. You can see some of his works <a href="http://www.shootinggallerysf.com/artists/james-charles/">here</a>.</p>
        <div className="media">
          <SafeImage src="http://www.shootinggallerysf.com/media/artists/gallery/james-charles/alladinsane_m.jpg" alt="James Charles dollar art" />
        </div>
      </div>

      <br />
      <div className="post">
        <h5><a>Dec 5 2012</a></h5>
        <p>An excellent use of money. A little rough for my taste. (via the <a href="http://theelectrictemple.tumblr.com/post/24329130073">internet</a>)</p>
        <div className="media">
          <SafeImage src="http://24.media.tumblr.com/tumblr_m51ntn1uX41rqpzwyo1_500.jpg" alt="Money art" />
        </div>
      </div>

      <br />
      <div className="post">
        <h5><a>Dec 4 2012</a></h5>
        <p>Just ran across another wonderful project in money modification and community building. This one comes from Christian Nold &amp; Imagine IC of Amsterdam. <q>The Bijlmer Euro is a complementary local currency for South East of Amsterdam which creates economic benefits for local people, inspires social connections and builds a complex network identity for the Bijlmer.</q>&mdash;<a href="http://www.bijlmereuro.net">www.bijlmereuro.net</a></p>
        <div className="media">
          <SafeImage src="http://www.bijlmereuro.net/wp-content/uploads/cover.png" alt="Bijlmer Euro" />
        </div>
      </div>

      <br />
      <div className="post">
        <h5><a>Nov 29 2012</a></h5>
        <p><a href="http://www.telegraph.co.uk/finance/financialcrisis/9682263/Occupy-Wall-St-protesters-wipe-5m-off-Americas-debt.html">Occupy Wall St protesters wipe $5m off America&apos;s debt</a>. Visit <a href="http://rollingjubilee.org/">rollingjubilee.org</a> to help.</p>
        <div className="media">
          <iframe width={560} height={315} src="http://www.youtube.com/embed/1Qs9w1XlJKE" allowFullScreen title="Rolling Jubilee" />
        </div>
      </div>

      <br />
      <div className="post">
        <h5><a>Nov 25 2012</a></h5>
        <p>What if money didn&apos;t matter? (via <a href="http://blog.artasmoney.com">art as money</a>)</p>
        <div className="media">
          <iframe width={560} height={315} src="http://www.youtube.com/embed/8nif01WZ9aI" allowFullScreen title="What if money didn't matter?" />
        </div>
      </div>
    </div>
  );
}

