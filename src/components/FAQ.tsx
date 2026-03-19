import type { ReactNode } from "react";

const LINK_CLASS = "text-indigo-600 underline hover:text-indigo-800";

interface FaqItem {
  question: string;
  /** Plain text for JSON-LD schema */
  answer: string;
  /** JSX with links for display (falls back to answer if not set) */
  richAnswer?: ReactNode;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How do I calculate the time cost of a purchase?",
    answer:
      "Enter your hourly wage or salary, then enter the price of whatever you're considering buying. The calculator divides the purchase price by your hourly rate to show how many hours of work it takes to earn that amount.",
  },
  {
    question: "Should I use my gross salary or take-home pay?",
    answer:
      "Using your take-home (after-tax) pay gives a more accurate picture of how long you truly need to work. Your gross salary overstates your earning power because you never see the taxed portion. We recommend using net pay for the most honest result.",
    richAnswer: (
      <>
        Using your{" "}
        <a
          href="https://www.adp.com/resources/tools/calculators/salary-paycheck-calculator.aspx"
          target="_blank"
          rel="noopener noreferrer"
          className={LINK_CLASS}
        >
          take-home (after-tax) pay
        </a>{" "}
        gives a more accurate picture of how long you truly need to work. Your
        gross salary overstates your earning power because you never see the
        taxed portion. We recommend using net pay for the most honest result.
      </>
    ),
  },
  {
    question: "How does the recurring purchase calculation work?",
    answer:
      "For subscriptions and recurring expenses, the calculator shows both the per-payment time cost and the annual total. A $15/month streaming subscription might only cost 1 hour of work per month, but that adds up to 12 hours per year — a full workday and a half.",
  },
  {
    question: "How many hours of work is a $1,000 purchase?",
    answer:
      "It depends on your hourly rate. At $20/hour, $1,000 costs 50 hours — over a full work week. At $50/hour, it's 20 hours. At $100/hour, it's 10 hours. The point is to make the cost feel real by connecting it to your time.",
  },
  {
    question: "Why think about purchases in terms of time?",
    answer:
      "Money is abstract, but time is something you feel. Thinking in hours of work makes costs tangible and helps you make more intentional spending decisions. It's the core idea behind the book 'Your Money or Your Life' by Vicki Robin.",
    richAnswer: (
      <>
        Money is abstract, but time is something you feel. Thinking in hours of
        work makes costs tangible and helps you make more intentional spending
        decisions. It&apos;s the core idea behind the book{" "}
        <a
          href="https://yourmoneyoryourlife.com/"
          target="_blank"
          rel="noopener noreferrer"
          className={LINK_CLASS}
        >
          <em>Your Money or Your Life</em>
        </a>{" "}
        by Vicki Robin.
      </>
    ),
  },
];

export default function FAQ() {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Frequently Asked Questions
      </h2>
      <dl className="space-y-4">
        {FAQ_ITEMS.map((item, i) => (
          <div key={i}>
            <dt className="text-sm font-medium text-gray-900">
              {item.question}
            </dt>
            <dd className="mt-1 text-sm text-gray-600 leading-relaxed">
              {item.richAnswer ?? item.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** FAQ structured data for JSON-LD */
export function getFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
