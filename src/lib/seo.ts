import type { Metadata } from "next";

/**
 * Target keywords (strategic reference + meta tag)
 *
 * PRIMARY — unique angle, in title + H1:
 *   "time cost calculator", "time price calculator"
 *
 * SECONDARY — higher volume, in meta description + headings:
 *   "salary to hourly calculator", "how much is my time worth calculator",
 *   "time vs money calculator", "convert salary to hourly"
 *
 * LONG-TAIL — natural language in body content:
 *   "how many hours of work to buy", "is it worth buying calculator",
 *   "purchase cost in work hours", "subscription true cost"
 */
export const TARGET_KEYWORDS = [
  "time cost calculator",
  "salary to hourly calculator",
  "how much is my time worth calculator",
  "time vs money calculator",
  "how many hours of work to buy",
  "convert salary to hourly",
  "worth it calculator",
  "is it worth buying calculator",
  "purchase cost in work hours",
  "time price calculator",
  "subscription true cost",
];

const SITE_URL = "https://www.timeprice.co";
const SITE_NAME = "Time Price";
const TITLE = "Time Price — See What Things Really Cost in Hours";
const DESCRIPTION =
  "Convert any purchase price into hours of your working life. A free calculator to make smarter spending decisions by seeing costs in time, not dollars.";
const OG_DESCRIPTION =
  "How many hours of your life does that purchase really cost? Find out with this free calculator.";

export const siteMetadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  keywords: TARGET_KEYWORDS,
  openGraph: {
    title: TITLE,
    description: OG_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: OG_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
};
