import { Link } from "react-router";
import type { Route } from "./+types/privacy-policy";
import { buildMeta, JsonLd, makePageSchemas } from "~/client/utils/seo";

const seo = {
  title: "Privacy Policy | RentConverter.com",
  description:
    "Learn how RentConverter handles calculator values, browser storage, optional PostHog analytics, email contact, and privacy choices.",
  path: "/privacy-policy",
  breadcrumbName: "Privacy Policy",
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

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-sky-50 text-slate-700">
      <JsonLd schemas={makePageSchemas(seo)} />

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <article className="rounded-[1.75rem] bg-white px-5 py-7 sm:px-8 sm:py-9">
          <p className="rc-page-eyebrow">RentConverter privacy</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-sky-900 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Last updated <time dateTime="2026-07-13">July 13, 2026</time>
          </p>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-700">
            This policy describes the data flows implemented on RentConverter.com.
            The site provides browser-based rental calculators and informational
            pages without user accounts, purchases, subscriptions, or cloud-saved
            calculator history.
          </p>

          <div className="mt-9 space-y-9">
            <Section title="Calculator values">
              <p>
                Calculator inputs and results are processed in your browser. The
                application does not submit those values to a RentConverter server,
                associate them with an account, or synchronize them between devices.
              </p>
              <p>
                Some calculators save values or preferences in your browser&apos;s
                localStorage so the same browser can restore them later. Those saved
                values remain on that device unless you or the browser clears them.
                Printing or saving a result uses your browser&apos;s print features.
              </p>
            </Section>

            <Section title="Browser storage">
              <p>
                Browser storage is not an account and is not cloud synchronization.
                Calculator storage is separate from the analytics-consent preference.
                Changing analytics consent does not delete calculator values.
              </p>
              <p>
                You can remove localStorage and sessionStorage through browser
                settings. Clearing site data may reset calculator values and cause the
                analytics preference prompt to appear again. The{" "}
                <Link
                  to="/cookies"
                  className="cursor-pointer rounded font-semibold text-sky-800 underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  cookie and storage page
                </Link>{" "}
                gives more detail.
              </p>
            </Section>

            <Section title="Optional analytics">
              <p>
                PostHog analytics is optional. Its client is not initialized until you
                choose <strong>Accept analytics</strong>. With no saved choice or after
                rejection, analytics remains off and every calculator remains usable.
                You can reopen analytics preferences from the footer.
              </p>
              <p>
                After acceptance, RentConverter records anonymous pageviews for basic
                traffic measurement. The configured client disables autocaptured clicks
                and form interactions, session recording, exception capture, person
                profiles, page-leave events, surveys, and feature flags. It uses
                localStorage and sessionStorage rather than PostHog cookie persistence.
              </p>
              <p>
                A pageview can include the page URL and title, referrer, timestamp, and
                standard browser, device, and operating-system information added by the
                analytics library. Analytics requests use the configured PostHog host at
                <span className="font-medium"> us.i.posthog.com</span>. We do not make
                claims here about IP anonymization, data residency, or PostHog retention
                periods that are not established by this application&apos;s code.
              </p>
              <p>
                If you withdraw consent, the site asks the initialized client to stop
                recording, reset its analytics state, and opt out of future capture.
                Your rejection is then stored separately so the client is not loaded on
                the next visit.
              </p>
            </Section>

            <Section title="Contact by email">
              <p>
                The contact page does not contain a web form. It provides a mail link
                that opens your email application. If you send a message, the email
                address, subject, message, attachments, and any other information you
                include are processed by the email providers used to deliver and receive
                the message. RentConverter uses the message to respond to the inquiry or
                investigate feedback and corrections.
              </p>
              <p>
                The site does not directly store a separate form submission because no
                site form or server-side form handler exists. Email providers may retain
                messages under their own systems and policies. Do not send sensitive
                personal or financial information that is not needed for the request.
              </p>
            </Section>

            <Section title="Infrastructure and third parties">
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  Hosting and server infrastructure receives ordinary page requests and
                  may log request metadata such as time, requested path, response status,
                  browser information, and network address for delivery, reliability,
                  and security.
                </li>
                <li>
                  Google Fonts supplies the site&apos;s font stylesheet and font files, so
                  the browser may make asset requests to Google when loading a page.
                </li>
                <li>
                  PostHog receives analytics requests only after affirmative analytics
                  consent, as described above.
                </li>
                <li>
                  External sites linked from RentConverter apply their own privacy terms
                  after you choose to visit them.
                </li>
              </ul>
              <p>
                RentConverter does not currently load advertising scripts. A public
                advertising declaration or future plan does not mean advertising is
                active on the site.
              </p>
            </Section>

            <Section title="Retention and security">
              <p>
                Browser-stored calculator values and consent preferences remain until
                they are replaced or cleared; the site does not impose a separate fixed
                expiry on them. SessionStorage normally lasts for the browser tab or
                session. We do not state fixed retention periods for infrastructure,
                email, or analytics providers when those periods are not controlled or
                verified in this repository.
              </p>
              <p>
                Reasonable technical measures are used to operate the site, but no
                website, browser storage mechanism, email system, or network transmission
                can be promised to be absolutely secure.
              </p>
            </Section>

            <Section title="Choices and privacy requests">
              <p>
                You can reject or withdraw optional analytics, clear browser storage,
                avoid sending an email, or stop using the site. Privacy rights may also
                apply depending on where you live and the facts of the request. To ask a
                privacy question or make a request, use the email address on the{" "}
                <Link
                  to="/contact"
                  className="cursor-pointer rounded font-semibold text-sky-800 underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  contact page
                </Link>
                . We may need enough information to understand and respond to the request.
              </p>
            </Section>

            <Section title="Policy changes">
              <p>
                This policy may change when the implemented service or its data flows
                change. The date above is updated only when the policy receives a
                meaningful review or revision.
              </p>
            </Section>
          </div>
        </article>
      </section>
    </main>
  );
}
