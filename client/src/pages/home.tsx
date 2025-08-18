import { useState, useEffect } from "react";
import { ChevronDown, Stethoscope, User, Microscope, Heart, Smile, Settings, Users, Baby, Cog, Star } from "lucide-react";
import BookingModal from "@/components/booking-modal";
import LightboxModal from "@/components/lightbox-modal";

const services = [
  {
    icon: Stethoscope,
    title: "Tratamente Generale",
    description: "Consultații, igienizări profesionale, obturații și tratamente de rutină pentru menținerea sănătății orale.",
    price: "de la 150 RON",
    color: "text-neon-blue"
  },
  {
    icon: Smile,
    title: "Estetica Dentară",
    description: "Albiri profesionale, fațete ceramice și alte proceduri pentru un zâmbet perfect și strălucitor.",
    price: "de la 300 RON",
    color: "text-electric-purple"
  },
  {
    icon: Settings,
    title: "Implantologie",
    description: "Implanturi dentare de înaltă calitate pentru înlocuirea dinților lipsă cu soluții permanente.",
    price: "de la 1200 RON",
    color: "text-accent-cyan"
  },
  {
    icon: Users,
    title: "Ortodonție",
    description: "Aparate dentare clasice și Invisalign pentru corectarea malocluziilor și alinierea dinților.",
    price: "de la 2500 RON",
    color: "text-neon-blue"
  },
  {
    icon: Cog,
    title: "Chirurgie Orală",
    description: "Extracții complexe, chirurgie parodontală și alte intervenții chirurgicale cu tehnici moderne.",
    price: "de la 200 RON",
    color: "text-electric-purple"
  },
  {
    icon: Baby,
    title: "Pedodonție",
    description: "Tratamente stomatologice specializate pentru copii într-un mediu prietenos și relaxant.",
    price: "de la 100 RON",
    color: "text-accent-cyan"
  }
];

const testimonials = [
  {
    name: "Maria Popescu",
    role: "Manager Marketing",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60&q=80",
    text: "Experiența mea la DentalCare Pro a fost extraordinară. Echipa este foarte profesionistă și m-au pus complet la ease. Recomand cu încredere!"
  },
  {
    name: "Alexandru Ionescu",
    role: "Antreprenor",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60&q=80",
    text: "Tehnologia folosită este impresionantă și tratamentul a fost complet fără durere. Clinica arată fantastic și personalul este foarte amabil."
  },
  {
    name: "Elena Radu",
    role: "Profesor",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60&q=80",
    text: "Am făcut un implant dentar aici și rezultatul este perfect. Doctorul a explicat totul foarte clar și m-a îndrumat excelent în tot procesul."
  }
];

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    alt: "Reception modernă"
  },
  {
    src: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    alt: "Tratament profesional"
  },
  {
    src: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    alt: "Echipamente avansate"
  },
  {
    src: "https://pixabay.com/get/g12790f58ce0d211afe8226ed108a7ffbee3a8883b188f7fc5b19cc96d649af71b96aba31c3008a2282d4f7c42c409262067aedc9c6c65fda49d3b9b28b4d1fca_1280.jpg",
    alt: "Sala de tratament"
  },
  {
    src: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    alt: "Zâmbet perfect"
  },
  {
    src: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    alt: "Radiologii dentare"
  },
  {
    src: "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    alt: "Sterilizare profesională"
  },
  {
    src: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    alt: "Echipa medicală"
  }
];

export default function Home() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt((entry.target as HTMLElement).dataset.delay || '0');
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
        }
      });
    }, observerOptions);
    
    document.querySelectorAll('.fade-in').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const openLightbox = (image: { src: string; alt: string }) => {
    setLightboxImage(image);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-dark-primary font-inter text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-morphism">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-neon-blue">
              <Stethoscope className="inline mr-2" size={28} />
              DentalCare Pro
            </div>
            <div className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('home')} className="hover:text-neon-blue transition-colors duration-300" data-testid="nav-home">Acasă</button>
              <button onClick={() => scrollToSection('about')} className="hover:text-neon-blue transition-colors duration-300" data-testid="nav-about">Despre Noi</button>
              <button onClick={() => scrollToSection('services')} className="hover:text-neon-blue transition-colors duration-300" data-testid="nav-services">Servicii</button>
              <button onClick={() => scrollToSection('gallery')} className="hover:text-neon-blue transition-colors duration-300" data-testid="nav-gallery">Galerie</button>
              <button onClick={() => scrollToSection('testimonials')} className="hover:text-neon-blue transition-colors duration-300" data-testid="nav-testimonials">Testimoniale</button>
              <a href="/admin" className="hover:text-electric-purple transition-colors duration-300" data-testid="nav-admin">Admin</a>
            </div>
            <button 
              onClick={() => setIsBookingOpen(true)}
              className="bg-gradient-to-r from-neon-blue to-electric-purple px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 neon-glow"
              data-testid="button-booking-nav"
            >
              Programează-te
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen relative flex items-center justify-center parallax-bg" style={{
        backgroundImage: `linear-gradient(rgba(15, 15, 35, 0.7), rgba(15, 15, 35, 0.7)), url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')`
      }}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-primary/50 to-dark-primary"></div>
        <div className="container mx-auto px-6 text-center relative z-10 fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-neon-blue to-electric-purple bg-clip-text text-transparent" data-testid="text-hero-title">
            Zâmbetul Tău Perfect
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto" data-testid="text-hero-subtitle">
            Tehnologie avansată și expertiză medicală pentru o experiență stomatologică de neuitat
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => setIsBookingOpen(true)}
              className="bg-gradient-to-r from-neon-blue to-electric-purple px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 neon-glow"
              data-testid="button-booking-hero"
            >
              <span className="mr-2">📅</span>Fă o Programare!
            </button>
            <button className="glass-morphism px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300" data-testid="button-video-hero">
              <span className="mr-2">▶️</span>Vizionează Clinica
            </button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="text-neon-blue text-2xl" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-b from-dark-primary to-dark-secondary">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-neon-blue to-electric-purple bg-clip-text text-transparent" data-testid="text-about-title">
              Despre Clinica Noastră
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto" data-testid="text-about-subtitle">
              Cu peste 15 ani de experiență, oferim servicii stomatologice complete într-un mediu modern și confortabil
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-morphism rounded-2xl p-8 hover-lift fade-in" data-delay="100">
              <div className="text-neon-blue text-4xl mb-4">
                <User size={48} />
              </div>
              <h3 className="text-2xl font-bold mb-4" data-testid="text-expertise-title">Expertiză Medicală</h3>
              <p className="text-gray-300 leading-relaxed" data-testid="text-expertise-desc">
                Echipa noastră de medici stomatologi certificați utilizează cele mai avansate tehnici și tehnologii moderne pentru tratamente de calitate superioară.
              </p>
            </div>
            
            <div className="glass-morphism rounded-2xl p-8 hover-lift fade-in" data-delay="200">
              <div className="text-electric-purple text-4xl mb-4">
                <Microscope size={48} />
              </div>
              <h3 className="text-2xl font-bold mb-4" data-testid="text-technology-title">Tehnologie Avansată</h3>
              <p className="text-gray-300 leading-relaxed" data-testid="text-technology-desc">
                Investim constant în echipamente de ultimă generație pentru a oferi diagnostice precise și tratamente eficiente cu disconfort minim.
              </p>
            </div>
            
            <div className="glass-morphism rounded-2xl p-8 hover-lift fade-in" data-delay="300">
              <div className="text-accent-cyan text-4xl mb-4">
                <Heart size={48} />
              </div>
              <h3 className="text-2xl font-bold mb-4" data-testid="text-approach-title">Abordare Personalizată</h3>
              <p className="text-gray-300 leading-relaxed" data-testid="text-approach-desc">
                Fiecare pacient beneficiază de un plan de tratament personalizat, adaptat nevoilor și obiectivelor sale specifice de sănătate orală.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-electric-purple to-neon-blue bg-clip-text text-transparent" data-testid="text-services-title">
              Serviciile Noastre
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto" data-testid="text-services-subtitle">
              Oferim o gamă completă de servicii stomatologice pentru toate vârstele
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="service-card glass-morphism rounded-2xl p-6 hover-lift fade-in group" data-delay={`${(index + 1) * 100}`}>
                <div className={`${service.color} text-3xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon size={36} />
                </div>
                <h3 className="text-xl font-bold mb-3" data-testid={`text-service-${index}-title`}>{service.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-4" data-testid={`text-service-${index}-desc`}>
                  {service.description}
                </p>
                <div className={`${service.color} font-semibold`} data-testid={`text-service-${index}-price`}>{service.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-gradient-to-b from-dark-secondary to-dark-primary">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-neon-blue to-electric-purple bg-clip-text text-transparent" data-testid="text-gallery-title">
              Galeria Noastră
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto" data-testid="text-gallery-subtitle">
              Descoperiți mediul nostru modern și rezultatele excepționale
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <div 
                key={index}
                className="glass-morphism rounded-lg overflow-hidden hover-lift fade-in cursor-pointer" 
                data-delay={`${(index + 1) * 100}`}
                onClick={() => openLightbox(image)}
                data-testid={`image-gallery-${index}`}
              >
                <img src={image.src} alt={image.alt} className="w-full h-48 object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-electric-purple/20 to-neon-blue/20"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-electric-purple to-neon-blue bg-clip-text text-transparent" data-testid="text-testimonials-title">
              Ce Spun Pacienții Noștri
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto" data-testid="text-testimonials-subtitle">
              Testimoniale reale de la pacienți mulțumiți
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="glass-morphism rounded-2xl p-8 hover-lift fade-in" data-delay={`${(index + 1) * 100}`}>
                <div className="flex items-center mb-4">
                  <div className="text-yellow-400 text-lg flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-300 mb-6 italic" data-testid={`text-testimonial-${index}-content`}>
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" data-testid={`img-testimonial-${index}-avatar`} />
                  <div>
                    <div className="font-semibold" data-testid={`text-testimonial-${index}-name`}>{testimonial.name}</div>
                    <div className="text-sm text-gray-400" data-testid={`text-testimonial-${index}-role`}>{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-secondary py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold text-neon-blue mb-4">
                <Stethoscope className="inline mr-2" size={24} />
                DentalCare Pro
              </div>
              <p className="text-gray-400 leading-relaxed" data-testid="text-footer-description">
                Clinica stomatologică modernă cu cele mai avansate tehnologii pentru sănătatea ta orală.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4 text-neon-blue" data-testid="text-footer-contact-title">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <p data-testid="text-footer-address">📍 Str. Modernă nr. 123, București</p>
                <p data-testid="text-footer-phone">📞 0721 123 456</p>
                <p data-testid="text-footer-email">✉️ contact@dentalcarepro.ro</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4 text-neon-blue" data-testid="text-footer-schedule-title">Program</h4>
              <div className="space-y-2 text-gray-400">
                <p data-testid="text-footer-weekdays">Luni - Vineri: 08:00 - 20:00</p>
                <p data-testid="text-footer-saturday">Sâmbătă: 09:00 - 16:00</p>
                <p data-testid="text-footer-sunday">Duminică: Închis</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4 text-neon-blue" data-testid="text-footer-social-title">Urmărește-ne</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-neon-blue transition-colors text-xl" data-testid="link-facebook">📘</a>
                <a href="#" className="text-gray-400 hover:text-neon-blue transition-colors text-xl" data-testid="link-instagram">📷</a>
                <a href="#" className="text-gray-400 hover:text-neon-blue transition-colors text-xl" data-testid="link-youtube">📺</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
            <p data-testid="text-footer-copyright">&copy; 2024 DentalCare Pro. Toate drepturile rezervate.</p>
          </div>
        </div>
      </footer>

      <BookingModal 
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      <LightboxModal 
        image={lightboxImage}
        onClose={() => setLightboxImage(null)}
      />
    </div>
  );
}
