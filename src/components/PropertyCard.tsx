import { Heart, Star } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface PropertyCardProps {
  id: string;
  images: string[];
  title: string;
  location: string;
  host: string;
  dates: string;
  price: number;
  rating: number;
  isNew?: boolean;
}

const PropertyCard = ({
  id,
  images,
  title,
  location,
  host,
  dates,
  price,
  rating,
  isNew = false,
}: PropertyCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="group cursor-pointer">
      <div className="relative mb-3">
        {/* Image carousel */}
        <div className="relative aspect-square rounded-xl overflow-hidden">
          <img
            src={images[currentImageIndex]}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Navigation dots */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Favorite button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorited(!isFavorited);
            }}
            className="absolute top-3 right-3 p-2 hover:scale-110 transition-transform"
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorited
                  ? "fill-primary text-primary"
                  : "fill-black/20 text-white stroke-2"
              }`}
            />
          </button>

          {/* New badge */}
          {isNew && (
            <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-lg text-xs font-medium">
              Guest favorite
            </div>
          )}
        </div>
      </div>

      {/* Property details */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-foreground truncate">{location}</h3>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm">{host}</p>
        <p className="text-muted-foreground text-sm">{dates}</p>
        
        <div className="flex items-baseline space-x-1">
          <span className="font-medium">${price}</span>
          <span className="text-muted-foreground text-sm">night</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;