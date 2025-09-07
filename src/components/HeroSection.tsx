import SearchBar from "./SearchBar";

const HeroSection = () => {
  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Find your opportunities
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover experiential learning opportunities with organizations worldwide...
          </p>
        </div>
        
        <SearchBar />
      </div>
    </section>
  );
};

export default HeroSection;