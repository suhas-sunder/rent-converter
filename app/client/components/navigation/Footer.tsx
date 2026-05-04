import AllRentalToolsLinks from "./AllRentalToolsLinks";

export default function Footer() {
  const year = 2026;

  return (
    <>
      <AllRentalToolsLinks />
      <footer className="bg-white/95 text-slate-700" data-nosnippet>
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="flex flex-col gap-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <div className="flex items-center justify-center gap-3 sm:justify-start">
              <img
                src="/images/rent-converter-logo-final_icon_compressed.jpg"
                alt="RentConverter"
                className="h-10 w-10 object-contain"
                loading="lazy"
                decoding="async"
              />
              <div>
                <div className="text-base font-bold tracking-tight text-slate-950">
                  RentConverter<span className="text-sky-600">.com</span>
                </div>
                <div className="text-xs font-semibold text-slate-600">
                  Fast, private rent calculators
                </div>
              </div>
            </div>

            <p className="text-sm font-semibold text-slate-600">
              (c) {year} RentConverter.com. Rent conversion and renter tools.
            </p>
          </div>

          <p className="mt-5 max-w-none text-center text-sm leading-relaxed text-slate-600 sm:text-left">
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
