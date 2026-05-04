import { Link, useLocation } from "react-router";
import { toolDirectorySections } from "~/client/data/routeRegistry";

function normalizePath(path: string) {
  if (!path || path === "/") return "/";
  return path.endsWith("/") ? path.slice(0, -1) : path;
}

export default function AllRentalToolsLinks() {
  const { pathname } = useLocation();
  const currentPath = normalizePath(pathname);

  return (
    <section
      id="all-tools"
      aria-labelledby="all-rental-tools-heading"
      className="bg-sky-50 px-4 py-12 sm:px-6 lg:py-14"
      data-nosnippet
    >
      <div className="mx-auto max-w-6xl rounded-[2rem] bg-white px-5 py-8 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="rc-page-eyebrow">RentConverter.com</p>
            <h2
              id="all-rental-tools-heading"
              className="mt-4 max-w-2xl text-3xl font-extrabold tracking-tight text-sky-800 sm:text-4xl"
            >
              All rental calculators and guides
            </h2>
            <p className="mt-3 max-w-none text-base leading-8 text-slate-700 sm:text-lg">
              Browse the canonical rent converters, affordability tools,
              increase calculators, split calculators, date tools, and rental
              guides available on RentConverter.
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-9">
          {toolDirectorySections.map((section) => (
            <div key={section.title}>
              <div className="mb-4">
                <h3 className="text-lg font-extrabold tracking-tight text-sky-800 sm:text-xl">
                  {section.title}
                </h3>
                <p className="mt-1 max-w-none text-sm leading-relaxed text-slate-700 sm:text-base">
                  {section.description}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {section.links.map((item) => {
                  const isCurrent = currentPath === normalizePath(item.href);

                  return (
                    <Link
                      key={`${section.title}-${item.href}`}
                      to={item.href}
                      aria-current={isCurrent ? "page" : undefined}
                      className={[
                        "group flex min-w-0 cursor-pointer flex-col rounded-2xl p-4 transition-colors",
                        "hover:bg-sky-100/80",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                        isCurrent
                          ? "bg-sky-100 text-sky-900"
                          : "bg-sky-50/70 text-slate-800",
                      ].join(" ")}
                    >
                      <span className="block text-[1.03rem] font-bold leading-snug text-sky-800 group-hover:text-sky-900">
                        {item.label}
                      </span>
                      {item.description ? (
                        <span className="mt-2 block text-[15px] leading-7 text-slate-700">
                          {item.description}
                        </span>
                      ) : null}
                      <span
                        className={[
                          "mt-4 inline-flex w-fit items-center gap-2 text-sm font-bold leading-none transition-colors",
                          isCurrent
                            ? "text-sky-900"
                            : "text-sky-800 group-hover:text-sky-900",
                        ].join(" ")}
                      >
                        <span className="leading-none">
                          {isCurrent ? "Current page" : "Open page"}
                        </span>
                        {!isCurrent ? (
                          <svg
                            className="block h-4 w-4 shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path
                              d="M5 12h14m-6-6 6 6-6 6"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : null}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
