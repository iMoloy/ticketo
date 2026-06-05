"use client";

import { Card, Button } from "@heroui/react";
import Image from "next/image";

const MOCK_ORGS = [
  {
    _id: "1",
    organizationName: "TechEvents Corp",
    logo: "https://images.unsplash.com/photo-1549880181-56a44cf8a4a1",
    description: "Hosting global developer conferences and software hacking marathons.",
    website: "techevents.corp"
  },
  {
    _id: "2",
    organizationName: "Nightlife Productions",
    logo: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
    description: "Premium concerts, electronic dance music festivals and outdoor events.",
    website: "nightlifeprod.com"
  },
  {
    _id: "3",
    organizationName: "Culinary Group",
    logo: "https://images.unsplash.com/photo-1556910103-1c02745aae4d",
    description: "Bringing world-class chefs together for exclusive food festivals.",
    website: "culinarygroup.org"
  },
  {
    _id: "4",
    organizationName: "Creative Labs",
    logo: "https://images.unsplash.com/photo-1513364776144-60967b0f800f",
    description: "Art galleries, film screenings and theatrical performances.",
    website: "creativelabs.io"
  }
];

export default function TopOrganizers({ featuredOrgs = MOCK_ORGS }) {
  const orgs = featuredOrgs && featuredOrgs.length > 0 ? featuredOrgs : MOCK_ORGS;
  return (
    <section className="py-24 bg-slate-950/40 border-y border-white/5 w-full">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white md:text-4xl">Top Organizers</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm mt-3">
            Powering the community. Meet the featured organizations behind the best local and national events.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {orgs.map((org) => (
            <div key={org._id}>
              <Card className="bg-slate-900/50 border border-white/5 backdrop-blur-xl hover:border-pink-500/30 transition-all duration-300 p-6 flex flex-col items-center text-center h-full gap-4" radius="lg">
                <Image
                  width={80}
                  height={80}
                  src={org?.logo || "https://images.unsplash.com/photo-1549880181-56a44cf8a4a1"}
                  className="w-20 h-20 rounded-full border-2 border-indigo-500 shadow-lg shadow-indigo-500/20 object-cover shrink-0"
                  alt="organizer logo"
                />
                <div className="space-y-1">
                  <h3 className="text-md font-bold text-white line-clamp-1">{org.organizationName}</h3>
                  <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed mt-2">
                    {org.description || "Leading organizer hosting curated community meetups and large music experiences."}
                  </p>
                </div>
                {org.website && (
                  <Button
                    as="a"
                    href={org.website.startsWith("http") ? org.website : `https://${org.website}`}
                    target="_blank"
                    variant="light"
                    className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold underline mt-auto h-8 px-3"
                  >
                    Visit Website
                  </Button>
                )}
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
