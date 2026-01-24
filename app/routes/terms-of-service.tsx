/* eslint-disable react/no-unescaped-entities */

import * as React from "react";
import { Link } from "react-router";
import type { Route } from "./+types/privacy-policy";

export const meta: Route.MetaFunction = () => [
  { title: "Privacy Policy | RentConverter.com" },
  {
    name: "description",
    content:
      "Read the RentConverter.com privacy policy. Learn what information we collect, how we use it, and what choices you have when using RentConverter.com tools.",
  },
  {
    name: "keywords",
    content:
      "RentConverter privacy policy, RentConverter.com privacy, rent calculator privacy, cookies, analytics, advertising, data processing",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:title", content: "Privacy Policy | RentConverter.com" },
  {
    property: "og:description",
    content:
      "Read the RentConverter.com privacy policy, including what we collect, how we use it, and your privacy choices.",
  },
  { property: "og:url", content: "https://rentconverter.com/privacy-policy" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },
  { property: "og:image:alt", content: "RentConverter.com privacy policy" },
  { property: "og:locale", content: "en_US" },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Privacy Policy | RentConverter.com" },
  {
    name: "twitter:description",
    content:
      "Read the RentConverter.com privacy policy, including what we collect, how we use it, and your privacy choices.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  { rel: "canonical", href: "https://rentconverter.com/privacy-policy" },
];

export default function PrivacyPolicy() {
  return (
    <main className="bg-white text-slate-700 scroll-smooth antialiased">
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-12">
        {/* Header */}
        <header className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <nav className="text-sm text-slate-600 mb-4" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-md text-slate-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden className="opacity-60">
                /
              </li>
              <li aria-current="page" className="text-slate-800 font-semibold">
                Privacy Policy
              </li>
            </ol>
          </nav>

          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-600">
            Last updated January 24, 2026
          </p>

          <div className="mt-5 space-y-4 text-slate-700 leading-relaxed">
            <p>
              This privacy notice for RentConverter.com
              (https://rentconverter.com) ("we", "us", or "our") describes how
              and why we might collect, store, use, and/or share ("process")
              your information when you use our services ("Services"), such as
              when you:
            </p>

            <ul className="list-inside list-disc flex flex-col gap-2 pl-5">
              <li>
                Visit our website at https://rentconverter.com, or any page of
                ours that links to this privacy notice
              </li>
              <li>
                Engage with us in other related ways, including any support,
                feedback, marketing, or events (for example, if we offer
                optional accounts, subscriptions, or purchases in the future)
              </li>
            </ul>

            <p>
              Questions or concerns? Reading this privacy notice will help you
              understand your privacy rights and choices. If you do not agree
              with our policies and practices, please do not use our Services.
            </p>

            <p className="space-y-1">
              <span className="block">
                Data controller: RentConverter.com is responsible for deciding
                how your personal information is processed for the purposes
                described in this privacy notice.
              </span>
              <span className="block">
                Contact: admin@rentconverter.com (Toronto, Ontario, Canada).
              </span>
            </p>
          </div>
        </header>

        {/* Content */}
        <article className="mt-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="prose prose-slate max-w-none">
            <Section title="SUMMARY OF KEY POINTS">
              <p>
                This summary provides key points from our privacy notice, but
                you can find out more details about any of these topics by
                reading the relevant sections below.
              </p>
              <p>
                What personal information do we process? When you visit, use, or
                navigate our Services, we may process personal information
                depending on how you interact with us and the Services, the
                choices you make, and the products and features you use.
              </p>
              <p>
                How do we process your information? We process your information
                to provide, improve, and administer our Services, communicate
                with you, for security and fraud prevention, and to comply with
                law. We may also process your information for other purposes
                with your consent where required.
              </p>
              <p>
                In what situations and with which parties do we share personal
                information? We may share information in specific situations and
                with specific categories of third parties described below.
              </p>
              <p>
                What are your rights? Depending on where you are located
                geographically, the applicable privacy law may mean you have
                certain rights regarding your personal information.
              </p>
            </Section>

            <Section title="1. WHAT INFORMATION DO WE COLLECT?">
              <h3 className="text-lg font-bold text-slate-900">
                Personal information you disclose to us
              </h3>
              <p>
                <strong>In Short:</strong> We collect personal information that
                you provide to us.
              </p>

              <p>
                We collect personal information that you voluntarily provide to
                us when you contact us, express an interest in obtaining
                information about us or our Services, or otherwise communicate
                with us.
              </p>

              <p>
                <span>
                  Personal Information Provided by You. The personal information
                  that we collect depends on the context of your interactions
                  with us and the Services, the choices you make, and the
                  products and features you use. The personal information we
                  collect may include the following:
                </span>
              </p>

              <ul>
                <li>email addresses</li>
                <li>names (if you choose to provide them)</li>
                <li>message content and contact preferences</li>
                <li>
                  usernames and passwords (if we offer accounts in the future)
                </li>
                <li>billing details (if we offer purchases in the future)</li>
              </ul>

              <p>
                Sensitive Information. We do not intentionally collect or
                process sensitive information.
              </p>

              <p>
                Payment Data. If we offer purchases, subscriptions, or paid
                content, payment processing may be handled by third-party
                payment processors. We do not store full payment card details on
                our servers.
              </p>

              <p>
                Social Media Login Data. If we offer social login in the future,
                and you choose to register using a social media account, we will
                receive certain profile information from the provider, as
                permitted by your settings and their policies.
              </p>

              <p>
                Affiliate Links and Referrals. We may include affiliate links on
                our Services. If you click an affiliate link and make a
                purchase, we may receive a commission. Affiliate partners may
                use cookies or similar technologies to track referrals according
                to their own privacy policies.
              </p>

              <p>
                Merch and Third-Party Stores. We may link to third-party stores
                or platforms where merchandise or digital products can be
                purchased. Any purchase you make through a third-party store is
                governed by that third party’s terms and privacy policy.
              </p>

              <p>
                All personal information that you provide to us must be true,
                complete, and accurate, and you must notify us of any changes to
                such personal information.
              </p>

              <h3 className="text-lg font-bold text-slate-900 mt-8">
                Information automatically collected
              </h3>
              <p>
                <strong>In Short:</strong> Some information, such as your IP
                address and/or browser and device characteristics, is collected
                automatically when you visit our Services.
              </p>

              <p>
                We automatically collect certain information when you visit,
                use, or navigate the Services. This information does not reveal
                your specific identity (like your name or contact information)
                but may include device and usage information, such as your IP
                address, browser and device characteristics, operating system,
                language preferences, referring URLs, country, approximate
                location (based on IP), information about how and when you use
                our Services, and other technical information. This information
                is primarily needed to maintain the security and operation of
                our Services, for analytics, and for advertising measurement and
                fraud prevention where applicable.
              </p>

              <p className="mt-4">
                <span>The information we collect may include:</span>
              </p>

              <ul>
                <li>
                  Log and Usage Data. Diagnostic, usage, and performance
                  information our servers automatically collect when you access
                  or use our Services and which we record in log files. This may
                  include your IP address, device information, browser type, and
                  settings and information about your activity in the Services
                  (such as date/time stamps, pages viewed, and feature usage),
                  device event information (such as system activity, error
                  reports, and hardware settings).
                </li>
                <li>
                  Device Data. Information about your computer, phone, tablet,
                  or other device you use to access the Services, such as your
                  IP address (or proxy server), device and application
                  identification numbers, browser type, hardware model, Internet
                  service provider and/or mobile carrier, operating system, and
                  system configuration information.
                </li>
                <li>
                  Location Data. Approximate location data (for example, based
                  on IP address). We do not require precise location to use core
                  site tools.
                </li>
                <li>
                  Advertising and Measurement Data. If we show ads, ad networks
                  and their partners may collect or receive information (such as
                  cookies, device identifiers, IP address, and ad interaction
                  events) to provide, measure, and improve advertising, limit ad
                  frequency, and help detect fraud.
                </li>
              </ul>
            </Section>

            <Section title="2. HOW DO WE PROCESS YOUR INFORMATION?">
              <p>
                <strong>In Short:</strong> We process your information to
                provide, improve, and administer our Services, communicate with
                you, for security and fraud prevention, and to comply with law.
                We may also process your information for other purposes with
                your consent where required.
              </p>

              <p>
                <span>
                  We process your personal information for a variety of reasons,
                  depending on how you interact with our Services, including:
                </span>
              </p>

              <ul>
                <li>
                  To provide and improve the Services (including core site
                  functionality, performance, debugging, and feature
                  improvements).
                </li>
                <li>
                  To facilitate account creation and authentication and
                  otherwise manage user accounts (if we offer optional accounts
                  in the future).
                </li>
                <li>
                  To respond to user inquiries and offer support to users.
                </li>
                <li>
                  To send administrative information to you, such as changes to
                  our terms and policies.
                </li>
                <li>
                  To fulfill and manage orders (if we offer purchases,
                  subscriptions, or merch), including payments, returns, and
                  exchanges.
                </li>
                <li>
                  To request feedback and understand how the Services are used.
                </li>
                <li>
                  To deliver and measure advertising, including contextual and
                  personalized ads where permitted by law and settings.
                </li>
                <li>
                  To provide analytics and identify usage trends so we can
                  improve the Services.
                </li>
                <li>
                  To protect our Services, including security monitoring, abuse
                  prevention, and fraud detection.
                </li>
                <li>
                  To comply with legal obligations and enforce our rights.
                </li>
              </ul>
            </Section>

            <Section title="3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION?">
              <p>
                <strong>In Short:</strong> We only process your personal
                information when we believe it is necessary and we have a valid
                legal reason (legal basis) to do so under applicable law, like
                with your consent, to comply with laws, to provide you with
                services, or to fulfill our legitimate business interests.
              </p>

              <h3 className="text-lg font-bold text-slate-900">
                If you are located in the EU or UK, this section applies to you.
              </h3>

              <p>
                The GDPR and UK GDPR require us to explain the valid legal bases
                we rely on in order to process your personal information. As
                such, we may rely on the following legal bases:
              </p>

              <ul>
                <li>
                  Consent. You can withdraw your consent at any time where
                  processing is based on consent.
                </li>
                <li>
                  Performance of a Contract. When processing is necessary to
                  provide the Services you request.
                </li>
                <li>
                  Legitimate Interests. When processing is reasonably necessary
                  to operate, secure, and improve the Services and those
                  interests do not override your rights and freedoms.
                </li>
                <li>
                  Legal Obligations. When processing is necessary to comply with
                  legal obligations.
                </li>
                <li>
                  Vital Interests. When processing is necessary to protect your
                  vital interests or those of another person.
                </li>
              </ul>

              <h3 className="text-lg font-bold text-slate-900 mt-6">
                If you are located in Canada, this section applies to you.
              </h3>

              <p>
                We may process your information with your express consent, or in
                situations where consent can be inferred (implied consent), as
                permitted by applicable law.
              </p>
            </Section>

            <Section title="4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?">
              <p>
                <strong>In Short:</strong> We may share information in specific
                situations described in this section and/or with the following
                categories of third parties.
              </p>

              <p>We may share your information with third parties such as:</p>

              <ul>
                <li>
                  Analytics providers to help us understand usage and improve
                  the Services.
                </li>
                <li>
                  Advertising networks and partners (for example, Google AdSense
                  or other ad networks) to display, measure, and improve ads.
                </li>
                <li>
                  Payment processors (for example, Stripe) if we offer
                  purchases, subscriptions, or paid content.
                </li>
                <li>
                  Affiliate partners when you click affiliate links or make a
                  purchase via a referral link.
                </li>
                <li>
                  Merch or fulfillment partners and third-party storefronts if
                  we offer merchandise.
                </li>
                <li>
                  Service providers who help us operate the site (hosting,
                  security, customer support tools, email providers, and similar
                  providers).
                </li>
              </ul>

              <p>
                We may also share your personal information in the following
                situations:
              </p>

              <ul>
                <li>
                  Business Transfers. We may share or transfer your information
                  in connection with, or during negotiations of, any merger,
                  sale of company assets, financing, or acquisition of all or a
                  portion of our business to another company.
                </li>
                <li>
                  Legal Requirements. We may disclose information where required
                  by law, court order, or governmental regulation, or when we
                  believe disclosure is necessary to protect rights, safety, and
                  prevent fraud or abuse.
                </li>
              </ul>
            </Section>

            <Section title="5. WHAT IS OUR STANCE ON THIRD-PARTY WEBSITES?">
              <p>
                <strong>In Short:</strong> We are not responsible for the safety
                of any information that you share with third parties that we may
                link to or who advertise on our Services, but are not affiliated
                with our Services.
              </p>

              <p>
                The Services may link to third-party websites, online services,
                or mobile applications and/or contain advertisements from third
                parties that are not affiliated with us. We do not control those
                third parties and are not responsible for their content,
                policies, or practices. We recommend you review the privacy
                policies of any third-party services you interact with.
              </p>

              <h3 className="text-lg font-bold text-slate-900">
                Advertising (Google AdSense and other ad networks)
              </h3>

              <ul>
                <li>
                  Third-party vendors, including Google, use cookies and/or
                  device identifiers to serve ads based on a user's prior visits
                  to this website or other websites.
                </li>
                <li>
                  Google’s use of advertising cookies enables it and its
                  partners to serve ads to users based on their visit to this
                  site and/or other sites on the Internet.
                </li>
                <li>
                  Users may opt out of personalized advertising by visiting
                  Google Ads Settings and/or by visiting{" "}
                  <a
                    href="https://optout.aboutads.info/?c=2&lang=EN"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.aboutads.info
                  </a>
                  .
                </li>
                <li>
                  Where required by law, we will request consent for certain
                  cookies (including advertising cookies) before they are set.
                </li>
              </ul>

              <h3 className="text-lg font-bold text-slate-900 mt-6">
                Affiliate links
              </h3>

              <p>
                If we include affiliate links, third parties may use cookies or
                similar technologies to track referrals and attribute purchases.
                The handling of that data is governed by the third party’s
                privacy policy.
              </p>

              <h3 className="text-lg font-bold text-slate-900 mt-6">
                Merch links
              </h3>

              <p>
                If we link to merchandise or third-party storefronts, any
                purchase you make is between you and the third party. Their
                privacy policy will apply.
              </p>
            </Section>

            <Section title="6. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?">
              <p>
                <strong>In Short:</strong> We may use cookies and other tracking
                technologies to collect and store your information.
              </p>

              <p>
                We may use cookies and similar tracking technologies (like web
                beacons and pixels) to access or store information. You can
                control cookies through your browser settings. If you choose to
                remove or reject cookies, this could affect certain features or
                services of our Services.
              </p>
            </Section>

            <Section title="7. HOW LONG DO WE KEEP YOUR INFORMATION?">
              <p>
                <strong>In Short:</strong> We keep your information for as long
                as necessary to fulfill the purposes outlined in this privacy
                notice unless otherwise required by law.
              </p>

              <p>
                We will only keep your personal information for as long as it is
                necessary for the purposes set out in this privacy notice,
                unless a longer retention period is required or permitted by
                law. We may retain certain information for security, fraud
                prevention, compliance, and legitimate business purposes.
              </p>
            </Section>

            <Section title="8. DO WE COLLECT INFORMATION FROM MINORS?">
              <p>
                <strong>In Short:</strong> We do not knowingly collect personal
                information from children under 13 years of age.
              </p>

              <p>
                The Services are intended for a general audience and are not
                directed to children under 13. We do not knowingly collect
                personal information from children under 13. If you believe a
                child has provided personal information to us, please contact us
                at admin@rentconverter.com and we will take appropriate steps to
                delete the information.
              </p>
            </Section>

            <Section title="9. WHAT ARE YOUR PRIVACY RIGHTS?">
              <p>
                <strong>In Short:</strong> Depending on where you are located,
                you may have certain rights regarding your personal information.
              </p>

              <p>
                You can request access to, correction of, or deletion of your
                personal information by contacting us at
                admin@rentconverter.com. We may need to verify your identity
                before responding. Where applicable, you may also have the right
                to object to certain processing or request portability of your
                information.
              </p>
            </Section>

            <Section title="10. DO WE MAKE UPDATES TO THIS NOTICE?">
              <p>
                <strong>In Short:</strong> Yes, we will update this notice as
                necessary to stay compliant with relevant laws and reflect
                changes to our practices.
              </p>

              <p>
                We may update this privacy notice from time to time. The updated
                version will be indicated by an updated "Last updated" date and
                will be effective as soon as it is accessible.
              </p>
            </Section>

            <Section title="11. CONTACT US">
              <p>
                If you have questions or comments about this notice, you may
                email us at admin@rentconverter.com or contact us by post at:
              </p>
              <p>https://rentconverter.com/</p>
              <p>Toronto, Ontario</p>
              <p>Canada</p>
            </Section>
          </div>
        </article>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="text-lg md:text-xl font-bold text-slate-900">{title}</h2>
      <div className="mt-3 text-sm md:text-base text-slate-700 leading-relaxed space-y-4">
        {children}
      </div>
    </section>
  );
}
