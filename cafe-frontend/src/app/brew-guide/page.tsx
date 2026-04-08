import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BrewGuide from '@/components/BrewGuide';

export default function BrewGuidePage() {
  return (
    <>
      <Navbar light />
      <main className="padded-main">
        <BrewGuide />
      </main>
      <Footer />
    </>
  );
}
