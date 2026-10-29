type Props = {
  index: string;
  label: string;
  before: string;
  accent: string;
  after?: string;
  className?: string;
  id?: string;
};

export default function SectionHeading({ index, label, before, accent, after = "", className = "", id }: Props) {
  return (
    <div className={className}>
      <p className="section-tag rv"><span>{index} — {label}</span></p>
      <h2 id={id} className="section-title rv-mask"><span>{before}<em>{accent}</em>{after}</span></h2>
    </div>
  );
}
