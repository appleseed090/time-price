import { getFaqSchema } from "@/components/FAQ";

function getWebAppSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Time Price",
    url: "https://www.timeprice.co",
    description:
      "Convert any purchase price into hours of your working life. A free calculator to make smarter spending decisions by seeing costs in time, not dollars.",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    browserRequirements: "Requires JavaScript",
  };
}

export default function JsonLd() {
  const schemas = [getWebAppSchema(), getFaqSchema()];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
