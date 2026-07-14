import type { Route } from "./+types/cookies";
import { useAnalyticsConsent } from "~/provider";
import { buildMeta, JsonLd, makePageSchemas } from "~/client/utils/seo";
import { ANALYTICS_CONSENT_STORAGE_KEY } from "~/client/utils/analyticsConsent.js";

const seo = {
  title: "Cookie and Browser Storage Policy | RentConverter.com",
  description:
    "Learn how RentConverter uses localStorage, sessionStorage, consent preferences, and optional PostHog analytics without active advertising cookies.",
  path: "/cookies",
  breadcrumbName: "Cookie and Browser Storage Policy",
};

export const meta: Route.MetaFunction = () => buildMeta(seo);

export default function CookiesPolicy() {
  const { openPreferences } = useAnalyticsConsent();

  return (
    <main className="min-h-screen bg-sky-50 text-slate-700">
      <JsonLd schemas={makePageSchemas(seo)} />

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <article className="rounded-[1.75rem] bg-white px-5 py-7 sm:px-8 sm:py-9">
          <p className="rc-page-eyebrow">Cookies and browser storage</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-sky-900 sm:text-4xl">
            Cookie and Browser Storage Policy
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Last updated <time dateTime="2026-07-13">July 13, 2026</time>
          </p>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-700">
            RentConverter uses browser storage for calculator restoration and for your
            analytics preference. These entries are not all cookies. Optional analytics
            remains disabled unless you accept it.
          </p>

          <section className="mt-9">
            <h2 className="text-2xl font-bold tracking-tight text-sky-900">
              Storage used by the site
            </h2>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
              <table className="min-w-[760px] w-full border-collapse text-left text-sm">
                <thead className="bg-sky-50 text-sky-950">
                  <tr>
                    <th className="px-4 py-3 font-bold">Category</th>
                    <th className="px-4 py-3 font-bold">Purpose</th>
                    <th className="px-4 py-3 font-bold">Mechanism</th>
                    <th className="px-4 py-3 font-bold">Optional?</th>
                    <th className="px-4 py-3 font-bold">Duration</th>
                    <th className="px-4 py-3 font-bold">Service or owner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="align-top">
                    <td className="px-4 py-3 font-semibold text-slate-950">Consent preference</td>
                    <td className="px-4 py-3">Remembers accept or reject so the prompt does not repeat.</td>
                    <td className="px-4 py-3 break-all">localStorage: {ANALYTICS_CONSENT_STORAGE_KEY}</td>
                    <td className="px-4 py-3">Essential preference storage; analytics itself remains optional.</td>
                    <td className="px-4 py-3">No application-set expiry; until replaced or cleared.</td>
                    <td className="px-4 py-3">RentConverter</td>
                  </tr>
                  <tr className="align-top">
                    <td className="px-4 py-3 font-semibold text-slate-950">Calculator state</td>
                    <td className="px-4 py-3">Restores supported calculator values and display choices in the same browser.</td>
                    <td className="px-4 py-3">localStorage entries using route-specific <code>rc_</code> keys.</td>
                    <td className="px-4 py-3">Functional and independent of analytics consent.</td>
                    <td className="px-4 py-3">No application-set expiry; until replaced or cleared.</td>
                    <td className="px-4 py-3">RentConverter</td>
                  </tr>
                  <tr className="align-top">
                    <td className="px-4 py-3 font-semibold text-slate-950">Optional analytics</td>
                    <td className="px-4 py-3">Stores an anonymous analytics identifier and session information after acceptance.</td>
                    <td className="px-4 py-3">PostHog localStorage plus sessionStorage; cookie persistence is disabled.</td>
                    <td className="px-4 py-3">Yes. It is not initialized before acceptance.</td>
                    <td className="px-4 py-3">Local storage until withdrawal or clearing; session storage for the browser session.</td>
                    <td className="px-4 py-3">PostHog</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <div className="mt-9 space-y-8">
            <section>
              <h2 className="text-2xl font-bold tracking-tight text-sky-900">
                Analytics choice
              </h2>
              <div className="mt-3 space-y-3 leading-7 text-slate-700">
                <p>
                  No saved choice and explicit rejection both keep PostHog disabled.
                  Rejecting analytics does not disable calculators. If you later accept,
                  the configured analytics client records pageviews but disables
                  autocapture, session recording, person profiles, exception capture,
                  page-leave capture, surveys, and feature flags.
                </p>
                <button
                  type="button"
                  onClick={openPreferences}
                  className="cursor-pointer rounded-xl bg-sky-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-sky-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 print:hidden"
                  data-nosnippet
                >
                  Manage analytics preferences
                </button>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-tight text-sky-900">
                Removing stored data
              </h2>
              <div className="mt-3 space-y-3 leading-7 text-slate-700">
                <p>
                  Browser settings can remove site data, including cookies,
                  localStorage, and sessionStorage. Clearing all RentConverter storage
                  may reset calculator values and the consent preference. Withdrawing
                  analytics through the site does not delete separate calculator values.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-tight text-sky-900">
                Advertising and other browser caching
              </h2>
              <div className="mt-3 space-y-3 leading-7 text-slate-700">
                <p>
                  RentConverter does not currently load advertising scripts or
                  advertising cookies. If advertising is introduced later, this page and
                  the consent behavior must be updated before describing it as active.
                </p>
                <p>
                  Browsers may also cache normal site assets and Google Fonts files for
                  performance. A browser cache is different from the localStorage and
                  sessionStorage entries described above.
                </p>
              </div>
            </section>
          </div>
        </article>
      </section>
    </main>
  );
}
