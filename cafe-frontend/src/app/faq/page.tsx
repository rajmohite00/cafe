import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FAQ from '@/components/FAQ';

export default function FAQPage() {
  return (
    <>
      <Navbar light />
      <main style={{ paddingTop: '160px', minHeight: '80vh' }}>
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
