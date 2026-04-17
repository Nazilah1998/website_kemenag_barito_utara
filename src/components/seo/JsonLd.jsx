/**
 * Tanam JSON-LD structured data di dalam <script type="application/ld+json">.
 * Terima satu object atau array object. Object null/undefined akan di-skip.
 */
export default function JsonLd({ data }) {
  if (!data) return null;

  const items = Array.isArray(data) ? data.filter(Boolean) : [data];
  if (items.length === 0) return null;

  return (
    <>
      {items.map((item, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
