import { getEmergencyServices } from "@/lib/emergency";
import EmergencyClient from "./EmergencyClient";

export const revalidate = 300;

export const metadata = {
  title: "Emergency Services — PRISM HK 緊急服務",
  description: "Emergency and crisis support services for the LGBTQ+ community in Hong Kong. 香港 LGBTQ+ 社區緊急及危機支援服務。",
};

export default async function EmergencyPage() {
  const services = await getEmergencyServices();
  return <EmergencyClient services={services} />;
}
