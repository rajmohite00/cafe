import Navbar             from '@/components/Navbar';
import Hero               from '@/components/Hero';
import About              from '@/components/About';
import Menu               from '@/components/Menu';
import BrewGuide          from '@/components/BrewGuide';
import LoyaltyNewsletter  from '@/components/LoyaltyNewsletter';
import Reservation        from '@/components/Reservation';
import Testimonials       from '@/components/Testimonials';
import Location           from '@/components/Location';
import FAQ                from '@/components/FAQ';
import Footer             from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Menu />
        <BrewGuide />
        <LoyaltyNewsletter />
        <Reservation />
        <Testimonials />
        <Location />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
