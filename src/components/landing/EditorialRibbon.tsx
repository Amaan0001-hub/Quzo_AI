const ITEMS = [
  "Research",
  "Marketing",
  "Development",
  "Finance",
  "Creative",
  "Sales",
  "Operations",
] as const;

type RowProps = {
  hidden?: boolean;
};

const Row = ({ hidden }: RowProps) => (
  <div
    className="flex shrink-0 items-center"
    aria-hidden={hidden ? "true" : undefined}
  >
    {ITEMS.map((item) => (
      <span key={item} className="flex items-center gap-[46px] pl-[46px]">
        <span className="whitespace-nowrap text-[11px] font-medium uppercase leading-none tracking-[0.22em] text-[#6b7889]">
          {item}
        </span>
        {/* Yahan fix kiya hai: inline-block aur bg color add kiya */}
        <i className="inline-block h-1 w-1 rotate-45 bg-[#65e7ff]" />
      </span>
    ))}
  </div>
);

export default function EditorialRibbon() {
  return (
    <div
      className="overflow-hidden border-y border-white/[0.08] bg-[#0a0e16]"
      aria-label="Specialized intelligence disciplines"
      data-testid="editorial-ribbon"
    >
      <div className="q-marquee flex w-max items-center py-[22px]">
        <Row />
        <Row hidden />
      </div>
    </div>
  );
}