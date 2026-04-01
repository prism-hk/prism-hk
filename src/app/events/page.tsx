import type { Metadata } from "next";
import { getEvents } from "@/lib/events";
import EventsClient from "./EventsClient";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Events — PRISM HK 活動",
  description: "LGBTQ+ community events in Hong Kong. 香港 LGBTQ+ 社區活動。",
};

export default async function EventsPage() {
  const events = await getEvents();
  return <EventsClient events={events} />;
}
