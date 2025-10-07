import Hero from "@/components/Hero";
import About from "@/components/About";
import Demigods from "@/components/Demigods";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-inter">
      <Hero />
      <About />
      <Demigods />
      <Footer />
    </div>
  );
};

export default Index;
