import Hero from "@/components/Hero";
import FeaturedEvents from "@/components/FeaturedEvents";
import Statistics from "@/components/Statistics";
import TopOrganizers from "@/components/TopOrganizers";
import WhyChoose from "@/components/WhyChoose";
import Testimonials from "@/components/Testimonials";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12 sm:gap-20">
      <Hero />
      <Statistics />
      <FeaturedEvents />
      <WhyChoose />
      <TopOrganizers />
      <Testimonials />
    </div>
  );
}
