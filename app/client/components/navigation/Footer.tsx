import { Link } from "react-router";
import { footerCategories } from "~/client/data/routeRegistry";

export default function Footer() {
  const year = 2026;

  return (
    <footer className="bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div id="all-tools" className="rounded-[1.5rem] bg-slate-900 px-5 py-6 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-300">
                RentConverter.com
              </p>
              <h2 className="mt-1 text-xl font-bold text-white">
                All Rental Tools
              </h2>
            </div>
            <span className="text-sm font-medium text-slate-300">
              Browse canonical rent converters, calculators, and guides
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 items-start gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
            {footerCategories.map((category) => (
              <div key={category.title} className="min-w-0">
                <div className="text-sm font-bold uppercase tracking-wide text-sky-100">
                  {category.title}
                </div>
                <ul className="mt-3 space-y-1.5 text-base leading-snug">
                  {category.links.slice(0, 12).map((item) => (
                    <li key={item.href} className="min-w-0">
                      <Link
                        to={item.href}
                        className="block cursor-pointer whitespace-normal break-words rounded-md text-slate-200 underline-offset-4 transition-colors hover:text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 text-center">
          <nav aria-label="Footer links" className="text-base">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {[
                ["About", "/about"],
                ["Contact", "/contact"],
                ["Sitemap", "/sitemap"],
                ["Privacy Policy", "/privacy-policy"],
                ["Terms of Service", "/terms-of-service"],
                ["Cookies", "/cookies"],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="cursor-pointer text-slate-200 underline-offset-4 transition-colors hover:text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <p className="text-base font-medium text-slate-300">
            (c) {year} RentConverter.com. Rent conversion and renter tools.
          </p>

          <p className="max-w-5xl text-sm leading-relaxed text-slate-400">
            Tools on this site are for informational, budgeting, and comparison
            purposes only. Always confirm payment schedules and lease terms in
            your rental agreement. This website does not provide financial,
            legal, or tax advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
