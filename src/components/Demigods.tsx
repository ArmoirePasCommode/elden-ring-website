import maleniaImage from "@/assets/malenia.jpg";
import radahnImage from "@/assets/radahn.jpg";
import godrickImage from "@/assets/godrick.jpg";

const Demigods = () => {
  const demigods = [
    {
      name: "Malenia, Blade of Miquella",
      title: "The Undefeated Swordmaster",
      image: maleniaImage,
      description: "I am Malenia. Blade of Miquella. And I have never known defeat.",
    },
    {
      name: "Starscourge Radahn",
      title: "Conqueror of the Stars",
      image: radahnImage,
      description: "A demigod who mastered gravity magic and now wanders the dunes of Caelid.",
    },
    {
      name: "Godrick the Grafted",
      title: "Lord of Stormveil",
      image: godrickImage,
      description: "A Shardbearer who grafted the limbs of countless warriors to his own body.",
    },
  ];

  return (
    <section className="py-24 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-foreground mb-4">
            The Demigods
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          <p className="font-inter text-lg text-muted-foreground max-w-3xl mx-auto">
            Children of Queen Marika, bearers of the Great Runes, now corrupted and fallen from grace.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {demigods.map((demigod, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-500 animate-fade-in hover:scale-105"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={demigod.image}
                  alt={demigod.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                <p className="font-inter text-sm text-primary uppercase tracking-wider">
                  {demigod.title}
                </p>
                <h3 className="font-cinzel text-2xl font-bold text-foreground">
                  {demigod.name}
                </h3>
                <p className="font-inter text-sm text-muted-foreground leading-relaxed">
                  {demigod.description}
                </p>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Demigods;
