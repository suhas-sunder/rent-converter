export default function NavBar() {
  function scrollToId(e: React.MouseEvent, id: string) {
    e.preventDefault();
    document.querySelector(`#${id}`)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <nav className="block mb-6 top-0 left-0 w-full bg-sky-950 border-b border-sky-900/60 shadow-sm z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <a
          href="/"
          className="flex items-center gap-3 text-lg font-semibold text-white"
          aria-label="RentConverter home"
        >
          <img
            src="/images/rent-converter-logo-final.png"
            alt="RentConverter"
            className="h-14 w-14 sm:h-16 sm:w-16 object-contain"
            loading="eager"
            decoding="async"
          />
          <span className="tracking-tight">
            RentConverter<span className="text-sky-300">.com</span>
          </span>
        </a>

        <div className="hidden sm:flex gap-6 text-slate-200 text-sm font-medium">
          <a
            href="#links"
            onClick={(e) => scrollToId(e, "links")}
            className="hover:text-sky-300 transition-colors"
          >
            All Conversion Tools
          </a>
          {/* <a
            href="#countries"
            onClick={(e) => scrollToId(e, "countries")}
            className="hover:text-sky-300 transition-colors"
          >
            Rent By Countries
          </a>
          <a
            href="#checklists"
            onClick={(e) => scrollToId(e, "checklists")}
            className="hover:text-sky-300 transition-colors"
          >
            Rental Checklists
          </a> */}
          <a
            href="#faq"
            onClick={(e) => scrollToId(e, "faq")}
            className="hover:text-sky-300 transition-colors"
          >
            FAQ
          </a>
        </div>
      </div>
    </nav>
  );
}
