import { Link } from "react-router";
import AllRentalToolsLinks from "./AllRentalToolsLinks";

const FOOTER_LINKS = [
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Sitemap", to: "/sitemap" },
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms of Service", to: "/terms-of-service" },
  { label: "Cookies", to: "/cookies" },
];

export default function Footer() {
  const year = 2026;

  return (
    <>
      <AllRentalToolsLinks />
      <footer className="bg-white/95 text-slate-700" data-nosnippet>
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="flex flex-col gap-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <Link
              to="/"
              className="group flex cursor-pointer items-center justify-center gap-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:justify-start"
              aria-label="RentConverter home"
            >
              <img
                src="/images/rent-converter-logo-final_icon_compressed.jpg"
                alt="RentConverter"
                className="h-10 w-10 object-contain"
                loading="lazy"
                decoding="async"
              />
              <div>
                <div className="text-base font-bold tracking-tight text-slate-950 group-hover:text-sky-800">
                  RentConverter<span className="text-sky-600">.com</span>
                </div>
                <div className="text-xs font-semibold text-slate-600">
                  Fast, private rent calculators
                </div>
              </div>
            </Link>

            <nav
              aria-label="Footer"
              className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:justify-end"
            >
              {FOOTER_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="cursor-pointer rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-sky-50 hover:text-sky-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <p className="mt-6 text-center text-sm font-semibold text-slate-600">
            (c) {year} RentConverter.com. Rent conversion and renter tools.
          </p>

          <p className="mt-4 max-w-none text-center text-sm leading-relaxed text-slate-600">
            Tools on this site are for informational, budgeting, and comparison
            purposes only. Always confirm payment schedules and lease terms in
            your rental agreement. This website does not provide financial,
            legal, or tax advice.
          </p>
        </div>
      </footer>
    </>
  );
}
