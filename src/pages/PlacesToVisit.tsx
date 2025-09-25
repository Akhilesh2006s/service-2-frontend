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
  GraduationCap,
  ExternalLink,
  Globe
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

  // Utility functions for generating search URLs
  const getWikipediaUrl = (placeName: string) => {
    // Comprehensive mappings for direct Wikipedia page links
    const wikipediaMappings: { [key: string]: string } = {
      "Red Fort Delhi": "Red_Fort",
      "Qutub Minar Delhi": "Qutub_Minar",
      "Humayun's Tomb Delhi": "Humayun%27s_Tomb",
      "India Gate Delhi": "India_Gate_(New_Delhi)",
      "Lotus Temple Delhi": "Lotus_Temple,_Delhi",
      "Akshardham Temple Delhi": "Akshardham_(Delhi)",
      "Jama Masjid Delhi": "Jama_Masjid,_Delhi",
      "National War Memorial Delhi": "National_War_Memorial_(India)",
      "Rashtrapati Bhavan Delhi": "Rashtrapati_Bhavan",
      "Jantar Mantar Delhi": "Jantar_Mantar,_New_Delhi",
      "Purana Qila Delhi": "Purana_Qila",
      "Safdarjung Tomb Delhi": "Safdarjung%27s_Tomb",
      "Tughlaqabad Fort Delhi": "Tughlaqabad_Fort",
      "Hauz Khas Fort Delhi": "Hauz_Khas",
      "Lodhi Gardens Delhi": "Lodhi_Gardens",
      "Raj Ghat Delhi": "Raj_Ghat",
      "National Museum Delhi": "National_Museum,_New_Delhi",
      "National Gallery of Modern Art Delhi": "National_Gallery_of_Modern_Art,_New_Delhi",
      "Gandhi Smriti Delhi": "Gandhi_Smriti",
      "Rail Museum Delhi": "National_Rail_Museum",
      "Madame Tussauds Delhi": "Madame_Tussauds",
      "National Science Centre Delhi": "National_Science_Centre,_Delhi",
      "Bangla Sahib Gurudwara Delhi": "Gurudwara_Bangla_Sahib",
      "Kalkaji Mandir Delhi": "Kalkaji_Mandir",
      "Chhatarpur Temple Delhi": "Chhatarpur_Temple",
      "Nizamuddin Dargah Delhi": "Nizamuddin_Dargah",
      "Sacred Heart Cathedral Delhi": "Sacred_Heart_Cathedral,_New_Delhi",
      "Shishganj Gurudwara Delhi": "Gurudwara_Sis_Ganj_Sahib",
      "Garden of Five Senses Delhi": "Garden_of_Five_Senses",
      "Buddha Jayanti Park Delhi": "Buddha_Jayanti_Park",
      "Deer Park Delhi": "Deer_Park,_Delhi",
      "Nehru Park Delhi": "Nehru_Park,_New_Delhi",
      "Sanjay Van Delhi": "Sanjay_Van",
      "Aravalli Biodiversity Park Delhi": "Aravalli_Biodiversity_Park",
      "Connaught Place Delhi": "Connaught_Place,_New_Delhi",
      "Dilli Haat INA Delhi": "Dilli_Haat",
      "Chandni Chowk Delhi": "Chandni_Chowk",
      "Paranthe Wali Gali Delhi": "Paranthe_Wali_Gali",
      "Karol Bagh Market Delhi": "Karol_Bagh",
      "Sarojini Nagar Market Delhi": "Sarojini_Nagar",
      "Janpath Market Delhi": "Janpath",
      "Khan Market Delhi": "Khan_Market",
      "Majnu ka Tila Delhi": "Majnu-ka-tilla",
      "Hudson Lane GTB Nagar Delhi": "Hudson_Lane",
      "Adventure Island Rohini Delhi": "Adventure_Island,_Delhi",
      "Waste to Wonder Park Delhi": "Waste_to_Wonder_Park",
      "Pragati Maidan Delhi": "Pragati_Maidan",
      "Indian Habitat Centre Delhi": "India_Habitat_Centre",
      "India International Centre Delhi": "India_International_Centre",
      "Jawaharlal Nehru University Campus Delhi": "Jawaharlal_Nehru_University",
      "Delhi University North Campus": "University_of_Delhi",
      "Jamia Millia Islamia Delhi": "Jamia_Millia_Islamia",
      "Okhla Bird Sanctuary Delhi": "Okhla_Bird_Sanctuary",
      "Yamuna Ghat Delhi": "Yamuna_Ghat",
      "Dara Shikoh Library Delhi": "Dara_Shikoh_Library",
      "CP Food Walk Delhi": "Connaught_Place,_New_Delhi"
    };

    // Check if we have a specific mapping and return direct Wikipedia link
    if (wikipediaMappings[placeName]) {
      return `https://en.wikipedia.org/wiki/${wikipediaMappings[placeName]}`;
    }
    
    // For unmapped places, use a more targeted search approach
    const searchQuery = encodeURIComponent(placeName.replace(' Delhi', ''));
    return `https://en.wikipedia.org/wiki/Special:Search?search=${searchQuery}&ns0=1&fulltext=1&go=Go`;
  };

  const getGoogleSearchUrl = (placeName: string) => {
    const searchQuery = encodeURIComponent(placeName);
    return `https://www.google.com/search?q=${searchQuery}`;
  };

  // Handle place card click to open Wikipedia and Google search
  const handlePlaceClick = (placeName: string) => {
    const wikipediaUrl = getWikipediaUrl(placeName);
    const googleUrl = getGoogleSearchUrl(placeName);
    
    // Open Wikipedia in new tab
    window.open(wikipediaUrl, '_blank');
    
    // Open Google search in new tab after a short delay
    setTimeout(() => {
      window.open(googleUrl, '_blank');
    }, 500);
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
          
          {/* Instructions */}
          <div className="text-center text-sm text-gray-500 mb-6 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-center gap-2">
              <Globe className="h-4 w-4 text-blue-500" />
              <span>Click on any place to open Wikipedia and Google search in new tabs</span>
              <ExternalLink className="h-4 w-4 text-green-500" />
            </div>
          </div>
        </div>

        {/* Places Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => (
            <Card 
              key={place.id} 
              className="hover:shadow-lg transition-all duration-300 group cursor-pointer hover:scale-105"
              onClick={() => handlePlaceClick(place.name)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(place.category)}
                    <Badge variant="secondary" className="text-xs">
                      {place.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Globe className="h-4 w-4 text-blue-500" />
                    <ExternalLink className="h-4 w-4 text-green-500" />
                  </div>
                </div>
                <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                  {place.name}
                </CardTitle>
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
                  <div className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Click to search
                  </div>
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
