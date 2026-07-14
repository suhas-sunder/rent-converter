export const adSlots = {
  home_top_banner: {
    placement: "Below the site header and above the homepage utility",
    desktop: { width: 970, height: 90 },
    mobile: { width: 320, height: 100 },
    visibility: "all viewports",
    print: "hidden",
  },
  home_left_sidebar: {
    placement: "Left of the homepage utility on wide screens",
    desktop: { width: 160, height: 600 },
    mobile: null,
    visibility: "wide screens only",
    print: "hidden",
  },
  home_right_sidebar: {
    placement: "Right of the homepage utility on wide screens",
    desktop: { width: 160, height: 600 },
    mobile: null,
    visibility: "wide screens only",
    print: "hidden",
  },
  home_below_utility_banner: {
    placement: "Below the complete homepage utility",
    desktop: { width: 970, height: 90 },
    mobile: { width: 320, height: 100 },
    visibility: "all viewports",
    print: "hidden",
  },
  home_seo_square: {
    placement: "Within the homepage informational content",
    desktop: { width: 300, height: 250 },
    mobile: { width: 300, height: 250 },
    visibility: "all viewports",
    print: "hidden",
  },
  home_all_tools_banner: {
    placement: "After homepage tool groups and before the footer",
    desktop: { width: 970, height: 90 },
    mobile: { width: 320, height: 100 },
    visibility: "all viewports",
    print: "hidden",
  },
} as const;

export type AdSlotName = keyof typeof adSlots;
