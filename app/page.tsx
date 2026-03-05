import Image from "next/image";

// ─── Design tokens ───────────────────────────────────────────────────────────
// bg:        #FFFFFF  (pure white)
// heading:   #111827  (near-black)
// body:      #374151  (cool gray)
// meta:      #6B7280  (muted gray)
// accent:    #4F46E5  (indigo)
// card bg:   #F9FAFB  (off-white)
// border:    #E5E7EB  (light gray)
// divider:   #F3F4F6
// ─────────────────────────────────────────────────────────────────────────────

type Post = { title: string; link: string; date: string; image?: string };

function parseRSS(xml: string): Post[] {
  const posts: Post[] = [];
  for (const match of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const item = match[1];
    const title = item.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)?.[1]?.trim() ?? "";
    const link  = item.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim() ?? "";
    const raw   = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() ?? "";
    const date  = raw ? new Date(raw).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";
    const encoded = item.match(/<content:encoded>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content:encoded>/)?.[1] ?? "";
    const image = encoded.match(/<img[^>]+src="([^"]+)"/)?.[1]
      ?? item.match(/<media:content[^>]+url="([^"]+)"/)?.[1]
      ?? undefined;
    if (title && link) posts.push({ title, link, date, image });
  }
  return posts.slice(0, 5);
}

async function getPosts(): Promise<Post[]> {
  try {
    const res = await fetch("https://alexhersham.substack.com/feed", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return parseRSS(await res.text());
  } catch {
    return [];
  }
}

const FALLBACK_IMG =
  "https://substackcdn.com/image/fetch/w_256,c_fill,f_auto,q_auto:best/https%3A%2F%2Fsubstack.com%2Fimg%2Flogo%2Fsubstack.png";

export default async function Home() {
  const posts = await getPosts();

  const track = [
    {
      period: "2023 – Present",
      company: "Abe Bio",
      role: "Founder & CEO",
      sector: "Dystrophic EB",
      highlights:
        "Building a rare-disease venture builder focused on Dystrophic EB. Building ReadOn Tx (small molecule) and a Gene Therapy Holdco, alongside various investments.",
    },
    {
      period: "2016 – 2023",
      company: "Zencargo",
      role: "Founder & CEO",
      sector: "Supply Chain Technology",
      highlights:
        "Scaled to $100M+. Raised $60M+ in VC funding. Grew to 150 employees across 6 countries. Now Chairman as Zencargo continues to grow.",
    },
    {
      period: "2012 – 2015",
      company: "Cerberus Capital",
      role: "Special Situations",
      sector: "Private Equity",
      highlights: "Distressed debt investing. Operational turnarounds.",
    },
    {
      period: "2008 – 2012",
      company: "Goldman Sachs",
      role: "Distressed Debt",
      sector: "Trading",
      highlights:
        "NY & London. Structured credit, high-yield, and leveraged loan markets.",
    },
  ];

  const projects = [
    {
      name: "ReadOn Tx",
      tag: "Biotech",
      meta: "Nonsense Readthrough · 35% of severe RDEB cases · $10M funded",
      description:
        "We are developing small-molecule therapies to read through premature termination codons caused by nonsense mutations, initially focusing on RDEB.",
    },
    {
      name: "Gene Therapy HoldCo",
      tag: "Biotech",
      meta: "Multiple CGT programmes · $50M available",
      description:
        "A holding company structure designed to incubate and scale multiple gene therapy ideas across DEB subtypes and adjacent rare skin conditions, including a personalised gene editing platform.",
    },
    {
      name: "Abe Fund",
      tag: "Capital",
      meta: "$15M deployed with partners",
      description:
        "Early-stage investment vehicle backing science and companies aligned with the DEB ecosystem.",
    },
    {
      name: "Unblocking a Cure",
      tag: "Infrastructure",
      meta: "Delivery · Speed to clinic · Regulatory path",
      description:
        "Removing bottlenecks between science and the clinic — delivery, regulatory strategy, and patient access.",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-[#111827] antialiased">
      <div className="max-w-[820px] mx-auto px-6 sm:px-12">

        {/* ── Nav ──────────────────────────────────────────── */}
        <nav className="flex items-center gap-7 pt-8 pb-0 flex-wrap border-b border-[#F3F4F6] pb-5">
          {[
            { label: "About",             href: "#about"             },
            { label: "Current Projects",  href: "#current-projects"  },
            { label: "Scientific Thesis", href: "#scientific-thesis" },
            { label: "Experience",        href: "#experience"        },
            { label: "Writing",           href: "#writing"           },
          ].map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="text-[11px] font-medium tracking-[0.1em] uppercase text-[#6B7280] hover:text-[#4F46E5] transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="pt-14 pb-12">
          <div className="flex flex-col sm:flex-row items-start gap-10 sm:gap-14">

            {/* Left — identity */}
            <div className="flex-1 min-w-0">
              <h1 className="text-[2.8rem] sm:text-[3.5rem] font-semibold tracking-tight leading-[1.08] text-[#111827] mb-5">
                Alex Hersham
              </h1>
              <p className="text-[17px] text-[#374151] leading-[1.7] mb-9 max-w-[400px]">
                A venture builder approach to cure Dystrophic EB.
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] font-medium">
                <a
                  href="mailto:alex@abe-bio.com"
                  className="text-[#4F46E5] hover:text-[#3730a3] transition-colors"
                >
                  Email →
                </a>
                <a
                  href="https://www.abe-bio.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4F46E5] hover:text-[#3730a3] transition-colors"
                >
                  abe-bio.com →
                </a>
                <a
                  href="https://linkedin.com/in/alex-hersham-b7508093"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4F46E5] hover:text-[#3730a3] transition-colors"
                >
                  LinkedIn →
                </a>
              </div>
            </div>

            {/* Right — portrait */}
            <div className="shrink-0">
              <div className="w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] md:w-[300px] md:h-[300px] overflow-hidden rounded-2xl shadow-md bg-[#E5E7EB]">
                <Image
                  src="/alex.jpg"
                  alt="Alex Hersham"
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>

          </div>
        </section>

        <hr className="border-[#F3F4F6]" />

        {/* ── About ────────────────────────────────────────── */}
        <section id="about" className="py-12 md:py-14">
          <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#9CA3AF] mb-8">
            About
          </p>
          <div className="space-y-5 text-[16px] text-[#374151] leading-[1.85] max-w-[600px] font-serif">
            <p>
              I'm an entrepreneur building and backing companies focused on
              curing Dystrophic EB (DEB).
            </p>
            <p>
              My son Abe was born with the disease, which is caused by mutations
              in the{" "}
              <span className="font-sans font-mono text-[#111827] text-[13px]">COL7A1</span>{" "}
              gene. The recent success of Krystal Biotech's gene therapy — now
              on a path toward $1B in peak sales in DEB — has validated both the
              science and the market opportunity. But significant unmet need
              remains, particularly for therapies that can deliver more durable
              and systemic benefit for patients.
            </p>
            <p>
              I started Abe Bio to help accelerate that progress, building and
              investing in companies developing new therapeutic approaches for EB
              and related rare skin diseases.
            </p>
            <p>
              Previously I founded Zencargo, a supply chain technology company
              that scaled to $100M+ in revenue across six countries. I now apply
              the same venture-building approach to rare disease — working with
              scientists, entrepreneurs, and investors to turn promising ideas
              into real medicines.
            </p>
          </div>
        </section>

        <hr className="border-[#F3F4F6]" />

        {/* ── Current Projects ─────────────────────────────── */}
        <section id="current-projects" className="py-12 md:py-14">
          <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#9CA3AF] mb-8">
            Current Projects
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {projects.map((p) => (
              <div
                key={p.name}
                className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-6 flex flex-col gap-4 hover:border-[#C7D2FE] transition-colors"
              >
                <span className="text-[9px] font-semibold tracking-[0.18em] uppercase text-[#4F46E5]">
                  {p.tag}
                </span>
                <p className="text-[16px] font-semibold tracking-tight text-[#111827] leading-snug">
                  {p.name}
                </p>
                <p className="text-[11px] font-mono text-[#9CA3AF] leading-relaxed">
                  {p.meta}
                </p>
                <p className="text-[13px] text-[#6B7280] leading-relaxed">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-[#F3F4F6]" />

        {/* ── Scientific Thesis ────────────────────────────── */}
        <section id="scientific-thesis" className="py-12 md:py-14">
          <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#9CA3AF] mb-8">
            Scientific Thesis
          </p>
          <div className="border border-[#E5E7EB] rounded-xl p-8 sm:p-10">
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[#9CA3AF]">
                Abstract
              </span>
              <span className="font-mono text-sm font-medium text-[#111827]">
                COL7A1
              </span>
            </div>
            <div className="space-y-5 text-[15px] text-[#374151] leading-[1.9] font-serif">
              <p>
                Dystrophic Epidermolysis Bullosa (DEB) is caused by mutations in{" "}
                <span className="font-sans font-mono font-medium text-[#111827] text-[13px]">
                  COL7A1
                </span>
                , the gene responsible for producing{" "}
                <span className="font-sans font-semibold text-[#111827]">Collagen VII</span>.
              </p>
              <p>
                Collagen VII forms{" "}
                <span className="font-sans font-semibold text-[#111827]">anchoring fibrils</span>,
                that bind the epidermis to the dermis beneath it. These fibrils
                act as the mechanical glue that keeps the skin structurally intact.
              </p>
              <p>
                When Collagen VII is absent or non-functional, the two layers of
                skin cannot properly attach. Even minor friction can cause the
                skin to blister or tear, leading to chronic wounds that struggle
                to heal.
              </p>
              <p>
                Over time, this persistent wounding drives severe complications
                including infection, fibrosis, and aggressive{" "}
                <span className="font-sans font-semibold text-[#111827]">squamous cell carcinoma</span>,
                which in severe forms of the disease often develops in early
                adulthood and is the leading cause of death.
              </p>
              <p>
                The consequences extend beyond the skin. Collagen VII is also
                critical to the structural integrity of epithelial tissues in the{" "}
                <span className="font-sans font-semibold text-[#111827]">
                  eyes, mouth, esophagus, and rectum
                </span>
                , which is why DEB is a systemic disease rather than simply a
                dermatological condition.
              </p>
            </div>
          </div>
        </section>

        <hr className="border-[#F3F4F6]" />

        {/* ── Experience ────────────────────────────────────── */}
        <section id="experience" className="py-12 md:py-14">
          <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#9CA3AF] mb-8">
            Experience
          </p>
          <div>
            {track.map((row) => (
              <div
                key={row.company}
                className="py-6 border-b border-[#F3F4F6] last:border-0 grid grid-cols-[5.5rem_1fr] gap-8 items-start"
              >
                <p className="text-[10px] font-mono text-[#9CA3AF] pt-0.5 leading-relaxed">
                  {row.period}
                </p>
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
                    <p className="font-semibold text-[#111827]">{row.company}</p>
                    <span className="text-xs text-[#9CA3AF]">{row.role}</span>
                    <span className="text-[9px] font-semibold tracking-[0.12em] uppercase text-[#4F46E5] ml-auto">
                      {row.sector}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#6B7280] leading-relaxed">
                    {row.highlights}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-[#F3F4F6]" />

        {/* ── Writing ───────────────────────────────────────── */}
        <section id="writing" className="py-12 md:py-14">
          <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#9CA3AF] mb-8">
            Writing
          </p>
          {posts.length === 0 ? (
            <p className="text-sm text-[#9CA3AF]">No posts yet.</p>
          ) : (
            <div className="flex flex-col divide-y divide-[#F3F4F6]">
              {posts.map((post) => (
                <a
                  key={post.link}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-5 py-5 hover:opacity-80 transition-opacity"
                >
                  {/* Thumbnail */}
                  <div className="shrink-0 w-[100px] h-[64px] overflow-hidden rounded-lg bg-[#E5E7EB]">
                    <img
                      src={post.image ?? FALLBACK_IMG}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Title + date */}
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-[15px] text-[#111827] leading-snug mb-1.5 group-hover:text-[#4F46E5] transition-colors">
                      {post.title}
                    </p>
                    <span className="text-[11px] text-[#9CA3AF]">{post.date}</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="border-t border-[#F3F4F6] py-7 flex items-center justify-between">
          <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-[#9CA3AF]">
            Alex Hersham
          </span>
          <span className="text-[11px] text-[#9CA3AF]">
            © {new Date().getFullYear()}
          </span>
        </footer>

      </div>
    </main>
  );
}
