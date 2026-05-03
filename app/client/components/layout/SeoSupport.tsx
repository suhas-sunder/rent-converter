import { Link } from "react-router";

type SeoLink = {
  to: string;
  label: string;
};

type SeoStep = {
  title: string;
  body: string;
};

type SeoExample = {
  title: string;
  body: string;
};

type SeoHowItWorksProps = {
  title: string;
  intro: string;
  steps: SeoStep[];
  examples?: SeoExample[];
  notes?: string[];
  relatedLinks?: SeoLink[];
};

type SeoToolFitProps = {
  title?: string;
  bestFor: string[];
  notFor?: string[];
  nextSteps?: SeoLink[];
};

function RelatedLinks({ links }: { links?: SeoLink[] }) {
  if (!links?.length) return null;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-sky-900 tracking-tight">
        Related calculators
      </h3>
      <div className="mt-4 flex flex-wrap gap-3 text-base">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="cursor-pointer rounded-2xl bg-slate-100 px-4 py-2 font-semibold text-sky-800 underline-offset-4 transition hover:bg-sky-100 hover:text-sky-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function SeoHowItWorks({
  title,
  intro,
  steps,
  examples,
  notes,
  relatedLinks,
}: SeoHowItWorksProps) {
  return (
    <section id="how-it-works" className="bg-white px-6 py-14 sm:py-16 rc-no-print">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-900 tracking-tight leading-tight">
            {title}
          </h2>
          <p className="mt-3 text-lg leading-8 text-slate-700">{intro}</p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.92fr)]">
          <div>
            <h3 className="text-xl font-bold text-sky-900 tracking-tight">
              What this calculation clarifies
            </h3>
            <ol className="mt-5 space-y-5">
              {steps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-800">
                    {index + 1}
                  </span>
                  <div>
                    <div className="font-semibold text-slate-950">
                      {step.title}
                    </div>
                    <p className="mt-1 leading-7 text-slate-700">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-8">
            {examples?.length ? (
              <div>
                <h3 className="text-xl font-bold text-sky-900 tracking-tight">
                  Real situations
                </h3>
                <div className="mt-4 space-y-4">
                  {examples.map((example) => (
                    <div key={example.title} className="relative pl-5">
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-2.5 h-2.5 w-2.5 rounded-full bg-sky-400"
                      />
                      <div className="font-semibold text-slate-950">
                        {example.title}
                      </div>
                      <p className="mt-1 leading-7 text-slate-700">
                        {example.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {notes?.length ? (
              <div>
                <h3 className="text-xl font-bold text-sky-900 tracking-tight">
                  Useful context
                </h3>
                <ul className="mt-4 space-y-3">
                  {notes.map((note) => (
                    <li key={note} className="flex gap-3 leading-7 text-slate-700">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500"
                      />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>

        <RelatedLinks links={relatedLinks} />
      </div>
    </section>
  );
}

export function SeoToolFit({
  title = "When this calculator fits",
  bestFor,
  notFor,
  nextSteps,
}: SeoToolFitProps) {
  return (
    <section id="tool-fit" className="bg-sky-50/60 px-6 py-14 rc-no-print">
      <div className="mx-auto max-w-6xl grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.72fr)]">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-sky-900 tracking-tight">
            {title}
          </h2>
          <ul className="mt-5 space-y-3">
            {bestFor.map((item) => (
              <li key={item} className="flex gap-3 leading-7 text-slate-700">
                <span
                  aria-hidden="true"
                  className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sky-500"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {notFor?.length || nextSteps?.length ? (
          <div>
            {notFor?.length ? (
              <>
                <h3 className="text-lg font-bold text-sky-900 tracking-tight">
                  Check before relying on it
                </h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                  {notFor.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            ) : null}

            <RelatedLinks links={nextSteps} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
