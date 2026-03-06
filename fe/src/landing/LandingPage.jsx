import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Overview from './components/Overview';
import Workflow from './components/Workflow';
import Stats from './components/Stats';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';

export default function LandingPage() {
  return (
    <div className="font-sans antialiased">
      <Navbar />
      <Hero />
      <Features />
      <Overview />
      <Workflow />
      <Stats />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
