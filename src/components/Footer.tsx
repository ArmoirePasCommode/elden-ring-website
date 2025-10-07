const Footer = () => {
  return (
    <footer className="py-12 px-4 bg-background border-t border-border">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4">
          <h3 className="font-cinzel text-2xl font-bold text-primary">
            ELDEN RING
          </h3>
          <p className="font-inter text-sm text-muted-foreground">
            Developed by FromSoftware Inc. | Published by Bandai Namco Entertainment
          </p>
          <p className="font-inter text-sm text-muted-foreground">
            Story by Hidetaka Miyazaki & George R. R. Martin
          </p>
          <div className="pt-4 border-t border-border/50">
            <p className="font-inter text-xs text-muted-foreground">
              This is a fan-made tribute website. All rights reserved to their respective owners.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
