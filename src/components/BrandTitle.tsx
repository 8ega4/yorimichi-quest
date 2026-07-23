export function BrandTitle({ compact = false }: { compact?: boolean }) {
  return (
    <h1 className={compact ? "brand-title brand-title--compact" : "brand-title"} aria-label="寄り道クエスト">
      <span className="brand-title__orange">寄り</span>
      <span className="brand-title__green">道</span>
      <span className="brand-title__teal">クエスト</span>
    </h1>
  );
}
