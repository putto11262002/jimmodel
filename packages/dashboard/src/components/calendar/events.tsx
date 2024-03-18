import { Calendar, CalendarEvent, EventType } from "@jimmodel/shared";
import { cn } from "../../lib/utils";
import { JobStatus } from "@prisma/client";

export function Events({
  calendarDate,
}: {
  calendarDate: Calendar["dates"][0];

}) {
  const targetEvents = calendarDate.events

  return (
    <div className="space-y-0.25">
      {targetEvents.map((event) => {
        if (event.type === EventType.Booking) {
          return <BookingEvent key={event.id} event={event} />;
        }

        if (event.type === EventType.Block) {
          return <BlockEvent key={event.id} event={event} />;
        }
      })}
    </div>
  );
}

function BlockEvent({
  event,
}: {
  event: Extract<CalendarEvent, { type: EventType.Block }>;
}) {
  const text = event.details.models
    .map((model) => `${model.firstName} ${model.lastName}`)
    .join(", ");
  return <Event bg="bg-danger" text={text} />;
}

function BookingEvent({
  event,
}: {
  event: Extract<CalendarEvent, { type: EventType.Booking }>;
}) {
  const text =
    event.details?.job?.models && event.details.job?.models.length > 0
      ? event.details?.job?.models
          .map((model) => `${model.firstName} ${model.lastName}`)
          .join(", ")
      : event.details?.job?.title;

  const bg =
    event.details?.job?.status === JobStatus.CONFIRMED
      ? "bg-black/80"
      : event.details?.job?.createdBy.color;
  const textColor =
    event.details?.job?.status === JobStatus.CONFIRMED
      ? "text-white"
      : "text-black";

  return <Event bg={bg} text={text} textColor={textColor} />;
}

function Event({
  text,
  bg,
  textColor,
}: {
  text: string;
  bg?: string;
  textColor?: string;
}) {
  return (
    <div
      style={{ backgroundColor: bg }}
      className={cn("border rounded-sm px-1.5 py-0.5", bg)}
    >
      <p
        style={{ color: textColor }}
        className={cn(
          "text-xs text-nowrap truncate ... font-medium",
          textColor
        )}
      >
        {text}
      </p>
    </div>
  );
}
