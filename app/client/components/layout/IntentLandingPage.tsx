import { Link } from "react-router";

export type IntentLink = {
  to: string;
  label: string;
  description?: string;
};

export type IntentSection = {
  title: string;
  body: string;
  bullets?: string[];
};

export type IntentExample = {
  title: string;
  body: string;
};

export type IntentTableRow = {
  term: string;
  meaning: string;
  note: string;
};

export type IntentFaq = {
  q: string;
  a: string;
};

type IntentLandingPageProps = {
  eyebrow: string;
  title: string;
  lead: string;
  answerTitle: string;
  answer: string;
  formula?: string;
  caveat?: string;
  primaryCta: IntentLink;
  secondaryCta?: IntentLink;
  sections: IntentSection[];
  examples?: IntentExample[];
  tableTitle?: string;
  tableRows?: IntentTableRow[];
  relatedLinks?: IntentLink[];
  faq: IntentFaq[];
};

function CtaLink({
  link,
  variant = "primary",
}: {
  link: IntentLink;
  variant?: "primary" | "secondary";
}) {
  const className =
    variant === "primary"
      ? "inline-flex cursor-pointer items-center justify-center rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      : "inline-flex cursor-pointer items-center justify-center rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

  return (
    <Link to={link.to} className={className}>
      {link.label}
    </Link>
  );
}

function RelatedLinks({ links }: { links?: IntentLink[] }) {
  if (!links?.length) return null;

  return (
    <section className="bg-sky-50 px-6 py-14 rc-no-print">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-2xl font-bold tracking-tight text-sky-900">
          Related calculators and guides
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="cursor-pointer rounded-2xl bg-white px-5 py-4 transition hover:bg-sky-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-50"
            >
              <span className="block font-semibold text-sky-900">
                {link.label}
              </span>
              {link.description ? (
                <span className="mt-1 block text-sm leading-6 text-slate-700">
                  {link.description}
                </span>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function IntentLandingPage({
  eyebrow,
  title,
  lead,
  answerTitle,
  answer,
  formula,
  caveat,
  primaryCta,
  secondaryCta,
  sections,
  examples,
  tableTitle,
  tableRows,
  relatedLinks,
  faq,
}: IntentLandingPageProps) {
  return (
    <main className="min-h-screen bg-sky-50 text-slate-700 scroll-smooth antialiased">
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="overflow-hidden rounded-[1.75rem] bg-white px-5 py-7 sm:px-8 sm:py-8">
          <p className="rc-page-eyebrow">{eyebrow}</p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-sky-900 sm:text-3xl">
            {title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-700">
            {lead}
          </p>

          <div className="mt-6 overflow-hidden rounded-[1.5rem] bg-sky-50">
            <div className="h-1 bg-gradient-to-r from-sky-500 to-emerald-400" />
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-sky-600"
                />
                <h2 className="text-base font-bold text-slate-950">
                  {answerTitle}
                </h2>
              </div>
              <p className="mt-3 text-base leading-7 text-slate-800">
                {answer}
              </p>
              {formula ? (
                <div className="mt-4 rounded-2xl bg-white px-4 py-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                    Formula
                  </div>
                  <div className="mt-1 font-mono text-base font-semibold text-slate-950">
                    {formula}
                  </div>
                </div>
              ) : null}
              {caveat ? (
                <p className="mt-3 text-sm leading-6 text-slate-700">
                  {caveat}
                </p>
              ) : null}
              <div className="mt-5 flex flex-wrap gap-3" data-nosnippet>
                <CtaLink link={primaryCta} />
                {secondaryCta ? (
                  <CtaLink link={secondaryCta} variant="secondary" />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-14 rc-no-print">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.82fr)]">
          <div className="space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-2xl font-bold tracking-tight text-sky-900">
                  {section.title}
                </h2>
                <p className="mt-3 leading-8 text-slate-700">
                  {section.body}
                </p>
                {section.bullets?.length ? (
                  <ul className="mt-4 space-y-3">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3 leading-7">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sky-500"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>

          <div className="space-y-8">
            {examples?.length ? (
              <section>
                <h2 className="text-2xl font-bold tracking-tight text-sky-900">
                  Real situations
                </h2>
                <div className="mt-4 space-y-4">
                  {examples.map((example) => (
                    <div key={example.title} className="relative pl-5">
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-2.5 h-2.5 w-2.5 rounded-full bg-emerald-500"
                      />
                      <h3 className="font-semibold text-slate-950">
                        {example.title}
                      </h3>
                      <p className="mt-1 leading-7 text-slate-700">
                        {example.body}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {tableRows?.length ? (
              <section>
                <h2 className="text-2xl font-bold tracking-tight text-sky-900">
                  {tableTitle ?? "Common terms"}
                </h2>
                <div className="mt-4 overflow-hidden rounded-2xl bg-sky-50">
                  {tableRows.map((row) => (
                    <div
                      key={row.term}
                      className="grid gap-2 px-4 py-3 sm:grid-cols-[120px_minmax(0,1fr)]"
                    >
                      <div className="font-bold text-slate-950">
                        {row.term}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">
                          {row.meaning}
                        </div>
                        <div className="mt-1 text-sm leading-6 text-slate-700">
                          {row.note}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </section>

      <RelatedLinks links={relatedLinks} />

      <section id="faq" className="bg-white px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold tracking-tight text-sky-800">
            Frequently Asked Questions
          </h2>
          <div className="mt-10 space-y-3">
            {faq.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl bg-slate-50 px-5 py-4"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl text-lg font-semibold text-sky-800 transition hover:text-sky-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50">
                  <span>{item.q}</span>
                  <span
                    aria-hidden="true"
                    className="text-slate-700 transition-transform group-open:rotate-180"
                  >
                    v
                  </span>
                </summary>
                <div className="mt-2 leading-relaxed text-slate-700">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
