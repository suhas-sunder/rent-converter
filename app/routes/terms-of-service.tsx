import { Link } from "react-router";
import type { Route } from "./+types/terms-of-service";
import { buildMeta, JsonLd, makePageSchemas } from "~/client/utils/seo";

const seo = {
  title: "Terms of Service | RentConverter.com",
  description:
    "Read the terms for using RentConverter's free browser-based rental calculators, informational pages, and reference results.",
  path: "/terms-of-service",
  breadcrumbName: "Terms of Service",
};

export const meta: Route.MetaFunction = () => buildMeta(seo);

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-2xl font-bold tracking-tight text-sky-900">{title}</h2>
      <div className="mt-3 space-y-3 leading-7 text-slate-700">{children}</div>
    </section>
  );
}

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-sky-50 text-slate-700">
      <JsonLd schemas={makePageSchemas(seo)} />

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <article className="rounded-[1.75rem] bg-white px-5 py-7 sm:px-8 sm:py-9">
          <p className="rc-page-eyebrow">Using RentConverter</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-sky-900 sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Last updated <time dateTime="2026-07-13">July 13, 2026</time>
          </p>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-700">
            These terms apply when you use RentConverter.com. The site currently
            provides free browser-based rental calculators and informational pages.
            It does not provide accounts, subscriptions, product purchases, paid
            services, user posts, or financial transactions.
          </p>

          <div className="mt-9 space-y-9">
            <Section title="Calculator and information use">
              <p>
                RentConverter provides arithmetic estimates and reference results. You
                are responsible for entering accurate values, choosing the correct time
                periods and assumptions, and checking the result before relying on it.
              </p>
              <p>
                Calculators may round displayed values and may use stated conventions,
                such as a 365-day year or average calendar month. A result may not match
                a lease, payment schedule, jurisdictional rule, landlord or property
                manager requirement, or an individual budget.
              </p>
            </Section>

            <Section title="No professional advice or approval decision">
              <p>
                The site does not provide legal, tax, accounting, investment, tenancy,
                or personalized financial advice. It does not decide whether rent is
                lawful or affordable, whether an applicant qualifies, or what a contract
                requires. Verify important decisions with the written agreement,
                applicable official sources, and a qualified professional when needed.
              </p>
            </Section>

            <Section title="Availability and errors">
              <p>
                We work to keep the calculators useful and accurate, but calculation,
                content, availability, compatibility, and technical errors can occur.
                Features or pages may be corrected, changed, suspended, or removed. The
                service is provided without a promise that it will always be available,
                error-free, or suitable for every purpose.
              </p>
            </Section>

            <Section title="Browser storage and optional analytics">
              <p>
                Some calculators use localStorage to restore values in the same browser.
                That storage is not an account or cloud synchronization. Optional
                PostHog analytics remains off until affirmative consent; rejecting it
                does not limit the calculators. Preferences can be changed through the
                footer control. Details are in the{" "}
                <Link
                  to="/privacy-policy"
                  className="cursor-pointer rounded font-semibold text-sky-800 underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  privacy policy
                </Link>{" "}
                and{" "}
                <Link
                  to="/cookies"
                  className="cursor-pointer rounded font-semibold text-sky-800 underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  cookie and storage page
                </Link>
                . RentConverter does not currently load advertising scripts.
              </p>
            </Section>

            <Section title="Acceptable use">
              <p>You may use the site for lawful personal or business reference. Do not:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>attempt to compromise, bypass, probe, or disrupt the site;</li>
                <li>introduce malware, abusive traffic, or automated requests that impair availability;</li>
                <li>scrape or reproduce the site in a way that harms service availability or misrepresents its content;</li>
                <li>use the site to violate another person&apos;s rights or applicable law; or</li>
                <li>present calculator output as an official, guaranteed, or professionally reviewed determination.</li>
              </ul>
            </Section>

            <Section title="Original code and content">
              <p>
                The site&apos;s original code, visual design, written explanations, and
                other original material are protected by applicable intellectual-property
                rules. These terms do not transfer ownership or grant permission to copy,
                republish, sell, or create a misleading duplicate of the service beyond
                rights that applicable law independently provides.
              </p>
              <p>
                Names, logos, code, or content belonging to third parties remain subject
                to their own rights and licenses.
              </p>
            </Section>

            <Section title="Third-party links and services">
              <p>
                Pages may link to external sources or services. Those sites are operated
                under their own terms and policies. A link does not guarantee that the
                external information is complete, current, available, or endorsed.
              </p>
            </Section>

            <Section title="Responsibility and limitation of liability">
              <p>
                You remain responsible for decisions made from your inputs, agreements,
                local rules, and circumstances. To the extent permitted by applicable law,
                RentConverter is not responsible for indirect, consequential, or special
                losses arising from use of or inability to use the site, or from reliance
                on an estimate. Nothing in these terms excludes responsibility that cannot
                legally be excluded.
              </p>
            </Section>

            <Section title="Changes to the service or terms">
              <p>
                The service and these terms may change as calculators, data flows, or
                site operations change. A meaningful terms revision will be reflected in
                the date above. Continuing to use the site after an update means the
                updated terms apply from that point forward, subject to applicable law.
              </p>
            </Section>

            <Section title="Contact">
              <p>
                Questions, corrections, or concerns can be sent using the email address
                on the{" "}
                <Link
                  to="/contact"
                  className="cursor-pointer rounded font-semibold text-sky-800 underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  contact page
                </Link>
                . These terms are written to describe the implemented service and are not
                presented as attorney-reviewed legal advice.
              </p>
            </Section>
          </div>
        </article>
      </section>
    </main>
  );
}
