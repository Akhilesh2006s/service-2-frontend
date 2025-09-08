import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  MapPin, 
  Users, 
  Calendar,
  Heart,
  Star,
  Filter,
  ArrowRight,
  Clock,
  Building2,
  Camera,
  BookOpen,
  ShoppingBag,
  TreePine,
  Church,
  Utensils,
  Gamepad2,
  GraduationCap,
  Eye
} from 'lucide-react';
import { delhiPlaces } from '../data/delhiPlaces';
import { useToast } from '../hooks/use-toast';
import Header from '../components/Header';

const PlacesToVisit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [places, setPlaces] = useState(delhiPlaces);
  const [filteredPlaces, setFilteredPlaces] = useState(delhiPlaces);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [interestedPlaces, setInterestedPlaces] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState('all');

  const categories = ['all', 'Historical', 'Museum', 'Religious', 'Nature', 'Shopping', 'Entertainment', 'Cultural', 'Educational', 'Food'];
  const types = ['all', 'Monument', 'Fort', 'Garden', 'Park', 'Market', 'Mall', 'Temple', 'Gurudwara', 'Mosque', 'Church', 'Memorial', 'Center', 'University', 'Sanctuary'];

  useEffect(() => {
    filterPlaces();
  }, [searchTerm, selectedCategory, selectedType, activeTab]);

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

    // Tab filter
    if (activeTab === 'favorites') {
      filtered = filtered.filter(place => favorites.has(place.id));
    } else if (activeTab === 'interested') {
      filtered = filtered.filter(place => interestedPlaces.has(place.id));
    }

    setFilteredPlaces(filtered);
  };

  const handleInterest = (placeId: number) => {
    const place = places.find(p => p.id === placeId);
    if (!place) return;

    if (interestedPlaces.has(placeId)) {
      // Remove interest
      setInterestedPlaces(prev => {
        const newSet = new Set(prev);
        newSet.delete(placeId);
        return newSet;
      });
      
      // Update place data
      setPlaces(prev => prev.map(p => 
        p.id === placeId ? { ...p, interested: Math.max(0, p.interested - 1) } : p
      ));
      
      toast({
        title: "Interest Removed",
        description: `You're no longer interested in visiting ${place.name}`,
      });
    } else {
      // Check if place is full
      if (place.interested >= place.maxStudents) {
        toast({
          title: "Place Full",
          description: `${place.name} has reached maximum capacity (${place.maxStudents} students)`,
          variant: "destructive",
        });
        return;
      }

      // Add interest
      setInterestedPlaces(prev => new Set([...prev, placeId]));
      
      // Update place data
      setPlaces(prev => prev.map(p => 
        p.id === placeId ? { ...p, interested: p.interested + 1 } : p
      ));
      
      toast({
        title: "Interest Expressed!",
        description: `You've expressed interest in visiting ${place.name}. You're ${place.interested + 1} of ${place.maxStudents} students.`,
      });
    }
  };

  const toggleFavorite = (placeId: number) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(placeId)) {
        newSet.delete(placeId);
        toast({
          title: "Removed from Favorites",
          description: "Place removed from your favorites list",
        });
      } else {
        newSet.add(placeId);
        toast({
          title: "Added to Favorites",
          description: "Place added to your favorites list",
        });
      }
      return newSet;
    });
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

  const getAvailabilityColor = (interested: number, maxStudents: number) => {
    const percentage = (interested / maxStudents) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-orange-600';
    return 'text-green-600';
  };

  const getAvailabilityText = (interested: number, maxStudents: number) => {
    const remaining = maxStudents - interested;
    if (remaining <= 0) return 'Full';
    if (remaining <= 5) return `${remaining} spots left`;
    return `${remaining} spots available`;
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
            Discover 70+ amazing places and express your interest to visit them with fellow students
          </p>
          <div className="flex justify-center items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>First Come, First Serve</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Max 40-45 students per place</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Organized group visits</span>
            </div>
          </div>
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

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Places ({filteredPlaces.length})</TabsTrigger>
              <TabsTrigger value="favorites">Favorites ({favorites.size})</TabsTrigger>
              <TabsTrigger value="interested">Interested ({interestedPlaces.size})</TabsTrigger>
              <TabsTrigger value="available">Available Spots</TabsTrigger>
            </TabsList>
          </Tabs>
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(place.id)}
                    className={`p-1 h-8 w-8 ${
                      favorites.has(place.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${favorites.has(place.id) ? 'fill-current' : ''}`} />
                  </Button>
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
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className={getAvailabilityColor(place.interested, place.maxStudents)}>
                      {getAvailabilityText(place.interested, place.maxStudents)}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {place.type}
                  </Badge>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      place.interested >= place.maxStudents ? 'bg-red-500' :
                      (place.interested / place.maxStudents) >= 0.7 ? 'bg-orange-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min((place.interested / place.maxStudents) * 100, 100)}%` }}
                  />
                </div>

                <Button
                  onClick={() => handleInterest(place.id)}
                  disabled={place.interested >= place.maxStudents}
                  className={`w-full ${
                    interestedPlaces.has(place.id)
                      ? 'bg-green-600 hover:bg-green-700'
                      : place.interested >= place.maxStudents
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {interestedPlaces.has(place.id) ? (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Interested ({place.interested}/{place.maxStudents})
                    </>
                  ) : place.interested >= place.maxStudents ? (
                    'Full'
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Express Interest
                    </>
                  )}
                </Button>
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
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedType('all');
                setActiveTab('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlacesToVisit;
