import { Plane, Hotel, FileCheck, Stamp, Globe2, Users, Briefcase, Shield, BookOpen, Compass } from "lucide-react";
export const SERVICES = [
  { key: "umrah", title: "Umrah Packages", desc: "All-inclusive sacred journeys with VIP arrangements.", icon: BookOpen },
  { key: "haj", title: "Haj Packages", desc: "Premium Haj packages with hotel near Haram.", icon: Compass },
  { key: "tourist_visa", title: "Tourist Visa", desc: "Fast tourist visas to 90+ countries.", icon: Stamp },
  { key: "work_visa", title: "Work Visa", desc: "End-to-end work visa documentation.", icon: Briefcase },
  { key: "family_visit_visa", title: "Family Visit Visa", desc: "Reunite with loved ones abroad.", icon: Users },
  { key: "international_tours", title: "International Tours", desc: "Curated luxury tours across the globe.", icon: Globe2 },
  { key: "hotel_booking", title: "Hotel Booking", desc: "5-star hotels at the best rates worldwide.", icon: Hotel },
  { key: "flight_booking", title: "Flight Booking", desc: "Best fares on premium airlines.", icon: Plane },
  { key: "passport", title: "Passport Assistance", desc: "Hassle-free passport application & renewal.", icon: FileCheck },
  { key: "insurance", title: "Travel Insurance", desc: "Worldwide coverage for peace of mind.", icon: Shield },
] as const;

export const COUNTRIES = [
  "Saudi Arabia","United Arab Emirates","Turkey","United States","Malaysia",
  "United Kingdom","Singapore","Thailand","Indonesia","Qatar","Oman","Egypt",
  "France","Germany","Italy","Spain","Switzerland","Canada","Australia","Japan","Other",
];
