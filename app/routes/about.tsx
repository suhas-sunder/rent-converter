import { Link } from "react-router";
import profileImage from "~/client/assets/images/suhas.jpg";
import { JsonLd, absoluteUrl, buildMeta, makeBreadcrumbSchema } from "~/client/utils/seo";

const SITE_URL = "https://www.rentconverter.com";
const PAGE_PATH = "/about";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const imageUrl = absoluteUrl(profileImage);

const config = {
  path: PAGE_PATH,
  title: "About RentConverter | Creator and Calculator Approach",
  description:
    "Meet the creator of RentConverter and see how its browser-based rental calculators are implemented, tested, and documented.",
  breadcrumbName: "About RentConverter",
};

export const meta = () => buildMeta(config);

export default function AboutPage() {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      name: "About Suhas Sunder and RentConverter",
      url: PAGE_URL,
      mainEntity: {
        "@type": "Person",
        name: "Suhas Sunder",
        url: PAGE_URL,
        image: imageUrl,
        jobTitle: "Software Engineer",
        description: "Creator and maintainer of RentConverter.",
        knowsAbout: [
          "web application development",
          "browser-based calculator implementation",
          "calculation testing",
          "rental calculator software",
        ],
      },
    },
    makeBreadcrumbSchema({ name: config.breadcrumbName, url: PAGE_URL }),
  ];

  return (
    <main className="min-h-screen bg-sky-50 text-slate-700">
      <JsonLd schemas={schemas} />
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="rounded-[1.75rem] bg-white px-5 py-7 sm:px-8 sm:py-9">
          <p className="rc-page-eyebrow">About RentConverter</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-sky-900 sm:text-4xl">
            Rent calculators built for clear, checkable rental math
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">
            RentConverter provides free browser-based rental calculators and
            explanatory resources for comparing rent periods, planning around
            paychecks, estimating splits, and understanding related rental math.
          </p>

          <section className="mt-9 grid gap-6 border-y border-slate-200 py-7 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-center">
            <img
              src={profileImage}
              alt="Suhas Sunder, creator of RentConverter"
              width={360}
              height={360}
              loading="eager"
              decoding="async"
              className="h-32 w-32 rounded-full object-cover sm:h-40 sm:w-40"
            />
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-sky-800">
                Suhas Sunder
              </h2>
              <p className="mt-1 font-semibold text-slate-950">
                Software engineer · Creator and maintainer of RentConverter
              </p>
              <p className="mt-3 leading-7">
                Suhas builds web applications and browser-based calculators with
                technologies including React, TypeScript, Node.js, and related
                web tooling. His work on RentConverter includes calculator
                implementation, calculation logic, testing, maintenance, and
                documentation, with experience building software for real-estate
                workflows.
              </p>
            </div>
          </section>

          <div className="mt-9 space-y-8">
            <section>
              <h2 className="text-2xl font-bold tracking-tight text-sky-800">About RentConverter</h2>
              <p className="mt-3 leading-7">
                The site was built to make common rental calculations easier to
                check. It keeps the calculator experience in the browser and
                explains the assumptions that matter when comparing weekly,
                monthly, four-week, annual, and other rent periods.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold tracking-tight text-sky-800">How the calculators are built</h2>
              <p className="mt-3 leading-7">
                Calculator work includes translating formulas into tested code,
                validating inputs, handling display rounding carefully, testing
                edge cases, keeping results consistent across server and browser
                rendering, and documenting assumptions and limitations.
              </p>
              <p className="mt-3 leading-7">
                <Link to="/methodology" className="cursor-pointer font-semibold text-sky-800 underline underline-offset-2 hover:text-sky-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">
                  Read the calculation methodology.
                </Link>
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold tracking-tight text-sky-800">Scope and limitations</h2>
              <p className="mt-3 leading-7">
                RentConverter provides arithmetic estimates and reference
                information. It does not provide legal, financial, tax, or
                accounting advice; tenancy-law or lease interpretation; approval
                decisions; or personalized affordability recommendations.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold tracking-tight text-sky-800">Corrections and feedback</h2>
              <p className="mt-3 leading-7">
                Report a calculation problem, unclear assumption, broken page,
                accessibility issue, or outdated information through the contact
                page. For details on browser storage and site policies, see the
                privacy policy and terms of service.
              </p>
              <p className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                <Link to="/contact" className="cursor-pointer font-semibold text-sky-800 underline underline-offset-2 hover:text-sky-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">Contact</Link>
                <Link to="/privacy-policy" className="cursor-pointer font-semibold text-sky-800 underline underline-offset-2 hover:text-sky-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">Privacy policy</Link>
                <Link to="/terms-of-service" className="cursor-pointer font-semibold text-sky-800 underline underline-offset-2 hover:text-sky-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">Terms of service</Link>
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
