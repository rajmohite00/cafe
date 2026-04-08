import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FAQ from '@/components/FAQ';

export default function FAQPage() {
  return (
    <>
      <Navbar light />
      <main className="padded-main">
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
