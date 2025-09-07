import PropertyCard from "./PropertyCard";
import apartment1 from "@/assets/apartment-1.jpg";
import villa1 from "@/assets/villa-1.jpg";
import cabin1 from "@/assets/cabin-1.jpg";

const mockProperties = [
  {
    id: "1",
    images: [apartment1, villa1, cabin1],
    title: "Modern Apartment in Downtown",
    location: "New York, United States",
    host: "Hosted by Sarah",
    dates: "Nov 12-17",
    price: 127,
    rating: 4.9,
    isNew: true,
  },
  {
    id: "2",
    images: [villa1, apartment1, cabin1],
    title: "Luxury Villa with Pool",
    location: "Los Angeles, United States",
    host: "Hosted by Michael",
    dates: "Dec 5-10",
    price: 245,
    rating: 4.8,
  },
  {
    id: "3",
    images: [cabin1, villa1, apartment1],
    title: "Cozy Mountain Cabin",
    location: "Aspen, United States",
    host: "Hosted by Emma",
    dates: "Jan 15-20",
    price: 89,
    rating: 4.7,
    isNew: true,
  },
  {
    id: "4",
    images: [apartment1, cabin1, villa1],
    title: "Beach House Retreat",
    location: "Miami, United States",
    host: "Hosted by David",
    dates: "Feb 8-13",
    price: 189,
    rating: 4.9,
  },
  {
    id: "5",
    images: [villa1, cabin1, apartment1],
    title: "Urban Loft Experience",
    location: "San Francisco, United States",
    host: "Hosted by Jessica",
    dates: "Mar 3-8",
    price: 156,
    rating: 4.8,
  },
  {
    id: "6",
    images: [cabin1, apartment1, villa1],
    title: "Rustic Farmhouse",
    location: "Austin, United States",
    host: "Hosted by Thomas",
    dates: "Apr 12-17",
    price: 98,
    rating: 4.6,
  },
  {
    id: "7",
    images: [apartment1, villa1, cabin1],
    title: "Designer Studio",
    location: "Seattle, United States",
    host: "Hosted by Lisa",
    dates: "May 20-25",
    price: 134,
    rating: 4.9,
    isNew: true,
  },
  {
    id: "8",
    images: [villa1, apartment1, cabin1],
    title: "Penthouse Suite",
    location: "Chicago, United States",
    host: "Hosted by Robert",
    dates: "Jun 7-12",
    price: 278,
    rating: 4.8,
  },
  {
    id: "9",
    images: [cabin1, villa1, apartment1],
    title: "Lake House Getaway",
    location: "Denver, United States",
    host: "Hosted by Amanda",
    dates: "Jul 14-19",
    price: 112,
    rating: 4.7,
  },
  {
    id: "10",
    images: [apartment1, cabin1, villa1],
    title: "Historic Townhouse",
    location: "Boston, United States",
    host: "Hosted by William",
    dates: "Aug 9-14",
    price: 167,
    rating: 4.8,
  },
  {
    id: "11",
    images: [villa1, cabin1, apartment1],
    title: "Modern Cottage",
    location: "Portland, United States",
    host: "Hosted by Nicole",
    dates: "Sep 16-21",
    price: 145,
    rating: 4.9,
  },
  {
    id: "12",
    images: [cabin1, apartment1, villa1],
    title: "Artistic Warehouse",
    location: "Nashville, United States",
    host: "Hosted by Chris",
    dates: "Oct 5-10",
    price: 123,
    rating: 4.6,
  },
];

const PropertyGrid = () => {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
        {mockProperties.map((property) => (
          <PropertyCard key={property.id} {...property} />
        ))}
      </div>
    </div>
  );
};

export default PropertyGrid;