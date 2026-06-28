import Navbar             from '@/components/Navbar';
import Hero               from '@/components/Hero';
import About              from '@/components/About';
import Menu               from '@/components/Menu';
import LoyaltyNewsletter  from '@/components/LoyaltyNewsletter';
import Reservation        from '@/components/Reservation';
import Contact            from '@/components/Contact';
import Location           from '@/components/Location';
import Footer             from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Menu />
        <LoyaltyNewsletter />
        <Reservation />
        <Contact />
        <Location />
      </main>
      <Footer />
    </>
  );
}
