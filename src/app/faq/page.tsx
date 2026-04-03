import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FAQ from '@/components/FAQ';

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '100px', minHeight: '80vh' }}>
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
