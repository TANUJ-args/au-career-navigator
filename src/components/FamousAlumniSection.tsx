import { useState } from "react";
import { famousAlumni } from "@/data/famousAlumni";

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const FamousAlumniSection = () => {
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <p className="text-gold font-semibold uppercase tracking-[0.2em] text-xs md:text-sm">AU Legacy</p>
        <h2 className="text-2xl font-semibold text-gold mt-3">
          Famous Alumni of Andhra University
        </h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          A century of excellence shaped leaders in public service, finance, law, and global industry.
        </p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {famousAlumni.map((alumnus, index) => (
          <article
            key={alumnus.id}
            className="group glass rounded-2xl shadow-card hover-gold-glow overflow-hidden"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <div className="h-56 bg-[#1a0a0a]">
              {imageError[alumnus.id] ? (
                <div className="h-full w-full bg-hero flex items-center justify-center">
                  <span className="text-gold text-4xl font-serif">{getInitials(alumnus.name)}</span>
                </div>
              ) : (
                <img
                  src={alumnus.imageUrl}
                  alt={alumnus.name}
                  loading="lazy"
                  onError={() => setImageError((prev) => ({ ...prev, [alumnus.id]: true }))}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
            </div>
            <div className="p-6">
              <h3 className="text-2xl text-gold">{alumnus.name}</h3>
              <p className="text-gold text-sm font-semibold mt-1">{alumnus.title}</p>
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{alumnus.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default FamousAlumniSection;
