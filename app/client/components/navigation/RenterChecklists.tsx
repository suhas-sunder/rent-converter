type ChecklistLink = {
  label: string;
  href: string;
  desc: string;
  badge?: string;
};

export default function RenterChecklists() {
  const checklistLinks: ChecklistLink[] = [
    {
      label: "Apartment viewing checklist",
      href: "/apartment-viewing-checklist",
      desc: "Use this during tours to spot issues, ask the right questions, and compare places clearly.",
      badge: "Before touring",
    },
    {
      label: "Lease signing checklist",
      href: "/lease-signing-checklist",
      desc: "Review fees, terms, and clauses so you know exactly what you’re agreeing to.",
      badge: "Before signing",
    },
    {
      label: "Move-in checklist",
      href: "/move-in-checklist",
      desc: "Record condition and existing damage to protect your deposit from day one.",
      badge: "Move-in day",
    },
    {
      label: "Move-out checklist",
      href: "/move-out-checklist",
      desc: "Cover cleaning, repairs, and final steps to avoid unnecessary deductions.",
      badge: "Before moving out",
    },
    {
      label: "First-time renter checklist",
      href: "/first-time-renter-checklist",
      desc: "A clear walkthrough of what matters if this is your first lease.",
      badge: "First lease",
    },
    {
      label: "Roommate rent checklist",
      href: "/roommate-rent-checklist",
      desc: "Set expectations for rent, utilities, deposits, and shared responsibilities.",
      badge: "Shared housing",
    },
  ];

  return null;
  // return (
  //   <section
  //     id="checklists"
  //     className="max-w-6xl mx-auto px-6 py-16 border-t border-b border-slate-200 mt-16"
  //   >
  //     <h2 className="text-3xl font-bold text-slate-900 text-center">
  //       Renter checklists (printable)
  //     </h2>
  //     <p className="mt-3 text-slate-700 text-center max-w-2xl mx-auto">
  //       Simple, practical checklists you can print or save as a PDF. Built for
  //       real renting moments, not legal jargon.
  //     </p>

  //     <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  //       {checklistLinks.map((x) => (
  //         <a
  //           key={x.href}
  //           href={x.href}
  //           className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
  //         >
  //           <div className="flex items-start justify-between gap-3">
  //             <h3 className="text-base font-semibold text-slate-900">
  //               {x.label}
  //             </h3>
  //             {x.badge ? (
  //               <span className="text-[11px] font-semibold rounded-full px-2 py-1 bg-slate-100 text-slate-700 border border-slate-200">
  //                 {x.badge}
  //               </span>
  //             ) : null}
  //           </div>

  //           <p className="mt-2 text-sm text-slate-700">{x.desc}</p>

  //           <div className="mt-4 flex items-center justify-between">
  //             <span className="text-sm font-semibold text-sky-700">
  //               Open checklist →
  //             </span>
  //             <span className="text-xs font-semibold text-slate-500">
  //               Print-friendly
  //             </span>
  //           </div>
  //         </a>
  //       ))}
  //     </div>
  //   </section>
  // );
}
