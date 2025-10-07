import { Sparkles, Map, Users } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Map,
      title: "Vast World",
      description: "Explore the vast and interconnected Lands Between, from the Erdtree to the darkest depths.",
    },
    {
      icon: Sparkles,
      title: "Deep Lore",
      description: "Uncover a rich mythology crafted by Hidetaka Miyazaki and George R. R. Martin.",
    },
    {
      icon: Users,
      title: "Epic Encounters",
      description: "Face legendary demigods and creatures in challenging, rewarding combat.",
    },
  ];

  return (
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-foreground mb-4">
            The Lands Between Await
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          <p className="font-inter text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            The Golden Order has been broken. Rise, Tarnished, and be guided by grace to brandish the power 
            of the Elden Ring and become an Elden Lord in the Lands Between.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-card border border-border rounded-lg p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-[var(--shadow-elegant)] animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="mb-6 inline-block p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-cinzel text-2xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="font-inter text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
