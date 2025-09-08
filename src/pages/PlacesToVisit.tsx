import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  MapPin, 
  Building2,
  Camera,
  BookOpen,
  ShoppingBag,
  TreePine,
  Church,
  Utensils,
  Gamepad2,
  GraduationCap
} from 'lucide-react';
import { delhiPlaces } from '../data/delhiPlaces';
import Header from '../components/Header';

const PlacesToVisit = () => {
  const navigate = useNavigate();
  const [places] = useState(delhiPlaces);
  const [filteredPlaces, setFilteredPlaces] = useState(delhiPlaces);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const categories = ['all', 'Historical', 'Museum', 'Religious', 'Nature', 'Shopping', 'Entertainment', 'Cultural', 'Educational', 'Food'];
  const types = ['all', 'Monument', 'Fort', 'Garden', 'Park', 'Market', 'Mall', 'Temple', 'Gurudwara', 'Mosque', 'Church', 'Memorial', 'Center', 'University', 'Sanctuary'];

  useEffect(() => {
    filterPlaces();
  }, [searchTerm, selectedCategory, selectedType]);

  const filterPlaces = () => {
    let filtered = places;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(place => 
        place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(place => place.category === selectedCategory);
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(place => place.type === selectedType);
    }

    setFilteredPlaces(filtered);
  };


  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Historical': return <Building2 className="h-4 w-4" />;
      case 'Museum': return <BookOpen className="h-4 w-4" />;
      case 'Religious': return <Church className="h-4 w-4" />;
      case 'Nature': return <TreePine className="h-4 w-4" />;
      case 'Shopping': return <ShoppingBag className="h-4 w-4" />;
      case 'Entertainment': return <Gamepad2 className="h-4 w-4" />;
      case 'Cultural': return <Camera className="h-4 w-4" />;
      case 'Educational': return <GraduationCap className="h-4 w-4" />;
      case 'Food': return <Utensils className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Must-Visit Places in Delhi NCR
          </h1>
          <p className="text-xl mb-6 opacity-90">
            Discover 70+ amazing places in Delhi NCR for first-year students
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search places, locations, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {types.map(type => (
                  <SelectItem key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results Count */}
          <div className="text-center text-gray-600 mb-4">
            Showing {filteredPlaces.length} places
          </div>
        </div>

        {/* Places Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => (
            <Card key={place.id} className="hover:shadow-lg transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(place.category)}
                    <Badge variant="secondary" className="text-xs">
                      {place.category}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg line-clamp-2">{place.name}</CardTitle>
                <CardDescription className="flex items-center gap-1 text-sm">
                  <MapPin className="h-3 w-3" />
                  {place.location}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {place.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <Badge variant="outline" className="text-xs">
                    {place.type}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPlaces.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No places found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlacesToVisit;
