import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BrewGuide from '@/components/BrewGuide';

export default function BrewGuidePage() {
  return (
    <>
      <Navbar light />
      <main style={{ paddingTop: '160px', minHeight: '80vh' }}>
        <BrewGuide />
      </main>
      <Footer />
    </>
  );
}
