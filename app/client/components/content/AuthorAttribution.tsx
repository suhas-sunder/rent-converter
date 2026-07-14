import { Link } from "react-router";

type AuthorAttributionProps = {
  includeMethodologyLink?: boolean;
};

/** A compact byline for editorial guides, not calculator interfaces. */
export default function AuthorAttribution({
  includeMethodologyLink = true,
}: AuthorAttributionProps) {
  return (
    <aside
      aria-label="Guide author"
      className="border-y border-slate-200 py-4 text-sm leading-6 text-slate-700"
    >
      <p>
        <span className="font-semibold text-slate-950">
          Written and maintained by Suhas Sunder
        </span>{" "}
        <span aria-hidden="true">·</span>{" "}
        <Link
          to="/about"
          className="cursor-pointer font-semibold text-sky-800 underline underline-offset-2 transition hover:text-sky-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        >
          Creator of RentConverter
        </Link>
        {includeMethodologyLink ? (
          <>
            {" "}<span aria-hidden="true">·</span>{" "}
            <Link
              to="/methodology"
              className="cursor-pointer font-semibold text-sky-800 underline underline-offset-2 transition hover:text-sky-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              Calculation methodology
            </Link>
          </>
        ) : null}
      </p>
    </aside>
  );
}
