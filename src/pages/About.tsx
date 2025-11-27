import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  Trophy, 
  Target, 
  Globe, 
  Recycle, 
  Award,
  ChevronRight,
  Play,
  Star
} from "lucide-react";
import founderPortrait from "@/assets/founder-portrait.jpg";
import sustainabilityFacility from "@/assets/sustainability-facility.jpg";
import teamCollaboration from "@/assets/team-collaboration.jpg";
import athletePartnership from "@/assets/athlete-partnership.jpg";

const About = () => {
  const [activeStorySection, setActiveStorySection] = useState(0);

  const values = [
    {
      icon: Target,
      title: "AI-Powered Pricing",
      description: "This isn't just a simple algorithm. You need a machine learning model trained on a massive dataset of"
    },
    {
      icon: Users,
      title: "Product Data",
      description: "Original MSRP, brand, category, and model."
    },
    {
      icon: Star,
      title: "Condition Analysis",
      description: "Use image recognition to assess wear and tear from user-uploaded photos. Integrate a simple, guided questionnaire for users (Any scratches? Does it turn on?).."
    },
    {
      icon: Play,
      title: "Market Dynamics",
      description: "Real-time supply and demand within the app. If 100 people are listing the same Harry Potter book, its Karma value should be low. If one person lists a rare graphics card, its value should be high and adjust dynamically.."
    }
  ];

  const milestones = [
    {
      year: "2018",
      title: "The Beginning",
      description: "Founded by former Olympic athlete Ododo Joshua after struggling to find gear that met professional standards."
    },
    {
      year: "2019",
      title: "First Collection",
      description: "Launched our debut line with recycled materials, partnering with 5 professional products for testing."
    },
    {
      year: "2021",
      title: "Global Expansion",
      description: "Expanded to 15 countries, established sustainable manufacturing partnerships across 3 continents."
    },
    {
      year: "2023",
      title: "Innovation Lab",
      description: "Opened our R&D facility focusing on bio-based materials and closed-loop production systems."
    },
    {
      year: "2024",
      title: "Community Impact",
      description: "Launched athlete scholarship program and carbon-neutral shipping across all markets."
    }
  ];

  const teamMembers = [
    {
      name: "Ododo Joshua",
      role: "Founder & CEO",
      bio: "Joshua vision of performance-first sustainable activewear drives everything we do.",
      image: founderPortrait,
      achievements: ["Sustainable Business Leader 2023"]
    }
  ];

  const products = [
    {
      name: "Marcus Rodriguez",
      sport: "Marathon Running",
      achievement: "Boston Marathon Winner 2023",
      quote: "FitForge gear doesn't just perform, it elevates every aspect of my training."
    },
    {
      name: "Aisha Patel", 
      sport: "Rock Climbing",
      achievement: "World Championship Gold 2024",
      quote: "The freedom of movement and durability gives me confidence on every climb."
    },
    {
      name: "James Wilson",
      sport: "CrossFit",
      achievement: "Games Competitor",
      quote: "Finally found gear that can handle the intensity of my workouts."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Breadcrumb 
          items={[
            { label: "Home", href: "/" },
            { label: "About Us" }
          ]} 
        />

        {/* Hero Section */}
        <section className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={teamCollaboration} 
              alt="Team collaboration"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <div className="relative text-center text-white z-10 max-w-4xl mx-auto px-4 sm:px-6">
            <Badge variant="secondary" className="mb-4">Our Story</Badge>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
              Built with Love,<br />
              <span className="text-primary">For All</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed">
            Clear Community Guidelines & Active Moderation: Define what can and cannot be listed. Use a mix of AI and human moderators to remove prohibited items (e.g., weapons, expired goods, counterfeit items).

            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          {/* Brand Story */}
          <section className="mb-20">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  The Karma Story
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Born from frustration, built with purpose, driven by performance.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-foreground">
                    It Started with a Problem
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    After years of competing at the highest levels, our founder Ododo Joshua 
                    was frustrated by activewear that looked great in photos but failed when 
                    it mattered most - during intense training and competition.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    "I needed gear that could keep up with my ambition, not hold it back," 
                    Sarah recalls. "Everything on the market was either high-performance but 
                    unsustainable, or eco-friendly but compromised on functionality."
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    That's when the idea for Karma was born - to create athletic wear that 
                    refuses to compromise on performance, sustainability, or style.
                  </p>
                </div>
                <div className="relative group">
                  <img 
                    src={founderPortrait} 
                    alt="Ododo Joshua, Founder"
                    className="w-full rounded-xl shadow-elegant hover:shadow-electric-glow transition-all duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute bottom-4 left-4 bg-black/80 text-white p-3 rounded-xl backdrop-blur-sm transition-all duration-300 group-hover:bg-black/90">
                    <p className="font-semibold">Ododo Joshua</p>
                    <p className="text-sm opacity-90">Founder & CEO</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-8">
                <h3 className="text-2xl font-semibold text-foreground text-center mb-8">
                  Our Journey
                </h3>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary/20"></div>
                  {milestones.map((milestone, index) => (
                    <div key={index} className="relative flex items-start gap-6 pb-8">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold relative z-10">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline">{milestone.year}</Badge>
                          <h4 className="font-semibold text-foreground">{milestone.title}</h4>
                        </div>
                        <p className="text-muted-foreground">{milestone.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Mission & Values */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Mission & Values
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Every decision we make is guided by our commitment to the planet.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {values.map((value, index) => (
                <Card key={index} className="text-center p-6 rounded-xl shadow-elegant hover:shadow-electric-glow transition-all duration-500 hover:scale-105 group">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                      <value.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-primary/5 rounded-xl p-8 text-center shadow-elegant hover:shadow-electric-glow transition-all duration-500 hover:scale-[1.02] group">
              <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">Our Mission</h3>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                To empower products of all levels with performance gear that elevates their potential 
                while protecting the planet they train on. We believe that the pursuit of excellence 
                and environmental responsibility are not just compatible - they're inseparable.
              </p>
            </div>
          </section>

          {/* Sustainability Section */}
          <section className="mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="default" className="mb-4">Sustainability</Badge>
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  Performance Meets Purpose
                </h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Recycle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Circular Design</h3>
                      <p className="text-muted-foreground">
                        Every product is designed for longevity and recyclability, 
                        with take-back programs for end-of-life garments.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Leaf className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Sustainable Materials</h3>
                      <p className="text-muted-foreground">
                        78% of our fabrics come from recycled or bio-based sources, 
                        without compromising on performance characteristics.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Globe className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Carbon Neutral</h3>
                      <p className="text-muted-foreground">
                        All shipping is carbon neutral, and we're on track to achieve 
                        net-zero emissions across our entire supply chain by 2030.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 p-6 bg-muted/30 rounded-xl shadow-elegant hover:shadow-electric-glow transition-all duration-500 hover:scale-[1.02] group">
                  <h4 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">Impact by Numbers</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="group-hover:scale-105 transition-transform duration-300">
                      <p className="font-bold text-2xl text-primary">2.3M</p>
                      <p className="text-muted-foreground">Product Traded by People</p>
                    </div>
                    <div className="group-hover:scale-105 transition-transform duration-300">
                      <p className="font-bold text-2xl text-primary">45%</p>
                      <p className="text-muted-foreground">Emissions reduction since 2020</p>
                    </div>
                    <div className="group-hover:scale-105 transition-transform duration-300">
                      <p className="font-bold text-2xl text-primary">100%</p>
                      <p className="text-muted-foreground">Renewable energy in facilities</p>
                    </div>
                    <div className="group-hover:scale-105 transition-transform duration-300">
                      <p className="font-bold text-2xl text-primary">Zero</p>
                      <p className="text-muted-foreground">Waste to landfill</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative group">
                <img 
                  src={sustainabilityFacility} 
                  alt="Sustainable facility"
                  className="w-full rounded-xl shadow-elegant hover:shadow-electric-glow transition-all duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl transition-all duration-300 group-hover:from-black/70" />
                <div className="absolute bottom-6 left-6 text-white transition-all duration-300 group-hover:scale-105">
                  <p className="font-semibold mb-1">Our Carbon-Neutral Facility</p>
                  <p className="text-sm opacity-90">Powered by 100% renewable energy</p>
                </div>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Meet Our Founder
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Led by people who understand what it takes to perform at the highest level.
              </p>
            </div>

            {teamMembers.map((member, index) => (
              <Card key={index} className="max-w-4xl mx-auto overflow-hidden rounded-xl shadow-elegant hover:shadow-electric-glow transition-all duration-500 hover:scale-[1.02] group">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="relative aspect-square lg:aspect-auto overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-8 flex flex-col justify-center">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">{member.name}</h3>
                      <p className="text-primary font-semibold mb-4 group-hover:scale-105 transition-transform duration-300 inline-block">{member.role}</p>
                      <p className="text-muted-foreground leading-relaxed">{member.bio}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">Achievements</h4>
                      {member.achievements.map((achievement, idx) => (
                        <div key={idx} className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                          <Award className="w-4 h-4 text-yellow-500 group-hover:rotate-12 transition-transform duration-300" />
                          <span className="text-sm text-muted-foreground">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </section>

          {/* Athlete Partnerships */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Trusted by All
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Trusted by people across every discipline.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {products.map((athlete, index) => (
                <Card key={index} className="text-center p-6 rounded-xl shadow-elegant hover:shadow-electric-glow transition-all duration-500 hover:scale-105 group">
                  <CardContent className="p-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Trophy className="w-10 h-10 text-white group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                    <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">{athlete.name}</h3>
                    <p className="text-primary font-semibold mb-2 group-hover:scale-105 transition-transform duration-300 inline-block">{athlete.sport}</p>
                    <p className="text-sm text-muted-foreground mb-4">{athlete.achievement}</p>
                    <blockquote className="text-sm italic text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      "{athlete.quote}"
                    </blockquote>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="relative rounded-xl overflow-hidden shadow-elegant hover:shadow-electric-glow transition-all duration-500 hover:scale-[1.02] group">
              <img 
                src={athletePartnership} 
                alt="Athlete partnership"
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center transition-all duration-300 group-hover:bg-black/70">
                <div className="text-center text-white">
                  <h3 className="text-2xl font-bold mb-4 group-hover:scale-105 transition-transform duration-300">Partner with FitForge</h3>
                  <p className="mb-6 max-w-lg group-hover:scale-105 transition-transform duration-300">
                    Join our community of elite products and help us develop 
                    the next generation of performance.
                  </p>
                  <Button asChild variant="secondary" className="rounded-xl btn-electric hover:scale-110 transition-all duration-300">
                    <Link to="/partnerships">
                      Apply for Partnership
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
