import {
  CalendarDays,
  CircleUser,
  Clock,
  Images,
  Link2,
  MapPin,
  NotebookPen,
  Plus,
  Signal,
  Target,
  Wifi,
  BatteryFull,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AvatarStack, LogoMark, hueTint, type Hue } from "./brand";

export function PhoneFrame({
  children,
  className,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <figure
      className={cn(
        "relative rounded-[48px] bg-ink p-[9px] shadow-float",
        "w-[300px] sm:w-[340px]",
        className,
      )}
      aria-label={label}
      role="img"
    >
      <div className="relative flex h-[620px] flex-col overflow-hidden rounded-[40px] bg-paper sm:h-[700px]">
        <div className="absolute left-1/2 top-2.5 z-10 h-[26px] w-[92px] -translate-x-1/2 rounded-full bg-ink" />
        <div className="flex h-11 shrink-0 items-center justify-between px-7 pt-1 text-[13px] font-semibold text-ink">
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <Signal className="h-3.5 w-3.5" strokeWidth={2.5} />
            <Wifi className="h-3.5 w-3.5" strokeWidth={2.5} />
            <BatteryFull className="h-4 w-4" strokeWidth={2} />
          </span>
        </div>
        {children}
      </div>
    </figure>
  );
}

export type TicketProps = {
  day: string;
  date: string;
  month: string;
  title: string;
  time: string;
  gym: string;
  hue: Hue;
  people: { initials: string; hue: Hue }[];
  goingLabel: string;
  visibility?: string;
  focus?: { name: string; details?: string[] }[];
  notchClassName?: string;
  compact?: boolean;
};

/** Session ticket: tinted date stub, dashed tear line and punched notches. */
export function SessionTicket({
  day,
  date,
  month,
  title,
  time,
  gym,
  hue,
  people,
  goingLabel,
  visibility,
  focus,
  notchClassName = "bg-paper",
  compact = false,
}: TicketProps) {
  return (
    <div className="relative flex rounded-[22px] bg-card text-left shadow-card">
      <div
        className={cn(
          "flex w-[62px] shrink-0 flex-col items-center justify-center rounded-l-[22px] py-3",
          hueTint[hue],
        )}
      >
        <span className="text-[10px] font-bold tracking-[0.1em] text-ink-secondary">{day}</span>
        <span className="font-display text-[28px] font-extrabold leading-none tracking-[-0.03em] text-ink">
          {date}
        </span>
        <span className="mt-0.5 text-[11px] font-semibold text-ink-secondary">{month}</span>
      </div>
      <div className="relative w-0">
        <span className="absolute inset-y-3 left-0 border-l-2 border-dashed border-ink/15" />
        <span className={cn("absolute -left-[7px] -top-[7px] h-[14px] w-[14px] rounded-full", notchClassName)} />
        <span className={cn("absolute -bottom-[7px] -left-[7px] h-[14px] w-[14px] rounded-full", notchClassName)} />
      </div>
      <div className="min-w-0 flex-1 px-3.5 py-3">
        <p className="font-display text-[16px] font-extrabold leading-tight tracking-[-0.015em] text-ink">
          {title}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-ink-secondary">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden /> {time}
          </span>
          <span className="inline-flex min-w-0 items-center gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span className="truncate">{gym}</span>
          </span>
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <AvatarStack people={people} size={compact ? 22 : 24} />
          <span className="truncate text-[12px] font-semibold text-ink">{goingLabel}</span>
        </div>
        {visibility && (
          <span className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-paper-2 px-2 py-0.5 text-[11px] font-semibold text-ink-secondary">
            <Link2 className="h-3 w-3" aria-hidden /> {visibility}
          </span>
        )}
        {focus && focus.length > 0 && (
          <div className="mt-3 border-t border-ink/10 pt-2.5">
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-ink-secondary">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-paper-2">
                <NotebookPen className="h-3 w-3" aria-hidden />
              </span>
              What we're working on
            </p>
            <ul className="mt-1.5 space-y-1.5">
              {focus.map((f) => (
                <li key={f.name}>
                  <p className="text-[13px] font-semibold text-ink">{f.name}</p>
                  {f.details && (
                    <ul className="mt-0.5 space-y-0.5 pl-3">
                      {f.details.map((d) => (
                        <li
                          key={d}
                          className="relative text-[12px] text-ink-secondary before:absolute before:-left-2.5 before:top-[7px] before:h-1 before:w-1 before:rounded-full before:bg-ink-tertiary"
                        >
                          {d}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export function TabBar({ active }: { active: "Activity" | "Training" | "Goals" | "Profile" }) {
  const left = [
    { name: "Activity", Icon: Images },
    { name: "Training", Icon: CalendarDays },
  ] as const;
  const right = [
    { name: "Goals", Icon: Target },
    { name: "Profile", Icon: CircleUser },
  ] as const;
  const item = ({ name, Icon }: { name: string; Icon: typeof Images }) => (
    <span
      key={name}
      className={cn(
        "flex w-12 flex-col items-center gap-0.5 text-[10px] font-semibold",
        active === name ? "text-ink" : "text-ink-tertiary",
      )}
    >
      <Icon className="h-[22px] w-[22px]" strokeWidth={active === name ? 2.5 : 2} aria-hidden />
      {name}
    </span>
  );
  return (
    <div className="mt-auto flex h-[78px] shrink-0 items-start justify-around border-t border-ink/5 bg-card/90 px-2 pt-2.5 backdrop-blur-xl">
      {left.map(item)}
      <span className="flex flex-col items-center">
        <span className="grid h-[42px] w-[54px] place-items-center rounded-full bg-primary text-primary-foreground shadow-press">
          <Plus className="h-6 w-6" strokeWidth={2.75} aria-hidden />
        </span>
        <span className="sr-only">Plan a training</span>
      </span>
      {right.map(item)}
    </div>
  );
}

export function TrainingScreen() {
  return (
    <>
      <div className="flex items-center gap-2.5 px-4 pt-2">
        <LogoMark size={30} />
        <span className="font-display text-[30px] font-extrabold tracking-[-0.03em] text-ink">
          Training
        </span>
      </div>
      <div className="mx-4 mt-3 grid grid-cols-2 rounded-full bg-paper-2 p-1 text-[13px] font-bold">
        <span className="rounded-full bg-card py-1.5 text-center text-ink shadow-card">Upcoming</span>
        <span className="py-1.5 text-center text-ink-tertiary">Past</span>
      </div>
      <div className="flex-1 space-y-3 overflow-hidden px-4 pt-4">
        <p className="font-display text-[15px] font-extrabold tracking-[-0.015em] text-ink">This week</p>
        <SessionTicket
          day="SAT"
          date="14"
          month="Nov"
          title="Saturday open mat"
          time="10:00 – 11:30"
          gym="Ironside BJJ"
          hue="sun"
          people={[
            { initials: "LK", hue: "sun" },
            { initials: "SO", hue: "mint" },
            { initials: "PR", hue: "sky" },
          ]}
          goingLabel="Lena, Sam & Priya"
          visibility="Anyone with the link"
          focus={[
            { name: "Knee cut passing", details: ["Win the underhook first", "Pin the far hip"] },
            { name: "Mount escapes" },
          ]}
        />
        <SessionTicket
          compact
          day="TUE"
          date="17"
          month="Nov"
          title="No-gi rounds"
          time="18:30"
          gym="Northside Academy"
          hue="mint"
          people={[
            { initials: "SO", hue: "mint" },
            { initials: "MD", hue: "plum" },
          ]}
          goingLabel="Sam & Marco"
        />
      </div>
      <TabBar active="Training" />
    </>
  );
}
