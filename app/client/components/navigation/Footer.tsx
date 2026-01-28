import { Link } from "react-router";

export default function NavBar() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} RentConverter.com • Rent conversion
            and renter tools
          </p>

          <nav aria-label="Footer" className="text-sm">
            <ul className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-2 text-slate-600">
              <li>
                <Link
                  to="/rent-converter"
                  className="hover:text-slate-900 hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 rounded"
                >
                  Rent Converter
                </Link>
              </li>
              <li>
                <Link
                  to="/rent-calculator"
                  className="hover:text-slate-900 hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 rounded"
                >
                  Rent Calculator
                </Link>
              </li>
              <li>
                <Link
                  to="/rent-per-day-calculator"
                  className="hover:text-slate-900 hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 rounded"
                >
                  Rent Per Day
                </Link>
              </li>
              <li>
                <Link
                  to="/rent-split-calculator"
                  className="hover:text-slate-900 hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 rounded"
                >
                  Rent Split
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-slate-900 hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 rounded"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  to="/cookies"
                  className="hover:text-slate-900 hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 rounded"
                >
                  Cookies
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="hover:text-slate-900 hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 rounded"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-slate-900 hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 rounded"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <p className="mt-4 text-xs text-slate-500 leading-relaxed text-center sm:text-left">
          Tools on this site are for informational, budgeting, and comparison
          purposes only. Always confirm payment schedules and lease terms in
          your rental agreement.
        </p>
      </div>
    </footer>
  );
}
