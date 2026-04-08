import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Testimonials from '@/components/Testimonials';

export default function TestimonialsPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '100px', minHeight: '80vh' }}>
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
