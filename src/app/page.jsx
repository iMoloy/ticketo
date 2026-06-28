import Hero from "@/components/Hero";
import FeaturedEvents from "@/components/FeaturedEvents";
import Statistics from "@/components/Statistics";
import TopOrganizers from "@/components/TopOrganizers";
import WhyChoose from "@/components/WhyChoose";
import Testimonials from "@/components/Testimonials";
import { getDb } from "@/lib/db";

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  let featuredEvents = [];
  let featuredOrgs = [];

  try {
    const db = await getDb();
    
    // Fetch 3 upcoming approved events
    const rawEvents = await db
      .collection("events")
      .find({ status: "approved" })
      .sort({ date: 1 })
      .limit(3)
      .toArray();

    featuredEvents = rawEvents.map((doc) => ({
      ...doc,
      _id: doc._id.toString(),
      date: doc.date instanceof Date 
        ? doc.date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
        : new Date(doc.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    }));

    // Fetch 4 top organizations
    const rawOrgs = await db
      .collection("organizations")
      .find({})
      .limit(4)
      .toArray();

    featuredOrgs = rawOrgs.map((doc) => ({
      ...doc,
      _id: doc._id.toString(),
    }));
  } catch (error) {
    console.error("Home page data fetch error:", error);
  }

  return (
    <div className="flex flex-col gap-12 sm:gap-20">
      <Hero />
      <Statistics />
      <FeaturedEvents featuredEvents={featuredEvents} />
      <WhyChoose />
      <TopOrganizers featuredOrgs={featuredOrgs} />
      <Testimonials />
    </div>
  );
}

