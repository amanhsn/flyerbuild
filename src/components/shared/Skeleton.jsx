import { cn } from "../../lib/utils";

export const Skeleton = ({ width = "100%", height = 16, radius, style, className }) => (
  <div
    className={cn(
      "bg-gradient-to-r from-bg-elevated via-bg-overlay to-bg-elevated bg-[length:800px_100%] animate-shimmer rounded-md",
      className
    )}
    style={{ width, height, borderRadius: radius, ...style }}
  />
);

export const SkeletonKpiCard = () => (
  <div className="bg-bg-raised border border-border rounded-lg p-4 flex flex-col gap-2.5 flex-1 min-w-0">
    <Skeleton width={80} height={10} />
    <Skeleton width={48} height={28} />
    <Skeleton height={3} radius={2} />
  </div>
);

export const SkeletonSurveyCard = ({ delay = 0 }) => (
  <div
    className="survey-card pointer-events-none"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-start justify-between gap-2.5">
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex gap-[7px]">
          <Skeleton width={60} height={18} radius="var(--radius-sm)" />
          <Skeleton width={80} height={18} radius="var(--radius-sm)" />
        </div>
        <Skeleton width="70%" height={18} />
        <Skeleton width="50%" height={14} />
      </div>
    </div>
    <div className="flex gap-3.5 mt-[13px] pt-[11px] border-t border-border">
      <Skeleton width={60} height={14} />
      <Skeleton width={50} height={14} />
      <Skeleton width={40} height={14} className="ml-auto" />
    </div>
  </div>
);
