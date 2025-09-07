import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Building2,
  DollarSign,
  Calendar,
  Clock,
  Heart,
  Bookmark
} from 'lucide-react';

// Fake data
const fakeOpportunities = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "TechCorp Solutions",
    location: "San Francisco, CA",
    type: "Full-time",
    category: "Technology",
    industry: "Software",
    salary: "$120,000 - $150,000",
    description: "We are looking for a senior software engineer to join our dynamic team. You will work on cutting-edge web applications using React, Node.js, and cloud technologies.",
    startDate: "2024-02-01",
    posted: "2 days ago",
    companySize: "201-500 employees"
  },
  {
    id: 2,
    title: "UX/UI Designer",
    company: "Creative Design Studio",
    location: "New York, NY",
    type: "Full-time",
    category: "Design",
    industry: "Creative",
    salary: "$80,000 - $100,000",
    description: "Join our creative team as a UX/UI Designer. You'll design intuitive user experiences for our mobile and web applications.",
    startDate: "2024-01-15",
    posted: "1 week ago",
    companySize: "11-50 employees"
  },
  {
    id: 3,
    title: "Marketing Manager",
    company: "Growth Marketing Inc",
    location: "Austin, TX",
    type: "Full-time",
    category: "Marketing",
    industry: "Digital Marketing",
    salary: "$70,000 - $90,000",
    description: "Lead our marketing initiatives and drive growth for our digital products. Experience with social media and content marketing required.",
    startDate: "2024-01-20",
    posted: "3 days ago",
    companySize: "51-200 employees"
  },
  {
    id: 4,
    title: "Data Scientist",
    company: "AI Analytics Corp",
    location: "Seattle, WA",
    type: "Full-time",
    category: "Data Science",
    industry: "Technology",
    salary: "$110,000 - $140,000",
    description: "Work with large datasets to extract insights and build machine learning models. Python, R, and SQL experience required.",
    startDate: "2024-02-15",
    posted: "5 days ago",
    companySize: "500+ employees"
  },
  {
    id: 5,
    title: "Product Manager",
    company: "Innovation Labs",
    location: "Boston, MA",
    type: "Full-time",
    category: "Product",
    industry: "Technology",
    salary: "$100,000 - $130,000",
    description: "Lead product development from conception to launch. Work with cross-functional teams to deliver exceptional user experiences.",
    startDate: "2024-01-30",
    posted: "1 day ago",
    companySize: "101-200 employees"
  },
  {
    id: 6,
    title: "Sales Representative",
    company: "Enterprise Solutions",
    location: "Chicago, IL",
    type: "Full-time",
    category: "Sales",
    industry: "Enterprise Software",
    salary: "$60,000 - $80,000 + Commission",
    description: "Drive sales growth by building relationships with enterprise clients. Experience in B2B sales and CRM systems preferred.",
    startDate: "2024-02-10",
    posted: "4 days ago",
    companySize: "201-500 employees"
  }
];

const FakeDataHome = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [likedJobs, setLikedJobs] = useState<number[]>([]);
  const [savedJobs, setSavedJobs] = useState<number[]>([]);

  const filteredOpportunities = fakeOpportunities.filter(opportunity =>
    opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opportunity.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opportunity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opportunity.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleLike = (jobId: number) => {
    setLikedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const toggleSave = (jobId: number) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={() => navigate('/')}>Inkaranya</h1>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/login')}>Sign In</Button>
              <Button onClick={() => navigate('/login')}>Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Your Next Opportunity
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Connect with top organizations and find opportunities that match your skills
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" onClick={() => navigate('/login')}>Get Started</Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/login')}>Sign In</Button>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white py-8 border-b">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search opportunities, companies, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Opportunities Section */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Available Opportunities</h3>
            <p className="text-gray-600">
              {filteredOpportunities.length} opportunities found
            </p>
          </div>

          <div className="grid gap-6">
            {filteredOpportunities.map((opportunity) => (
              <Card key={opportunity.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">
                            {opportunity.title}
                          </h4>
                          <p className="text-gray-600">{opportunity.company}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{opportunity.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Briefcase className="h-4 w-4" />
                          <span>{opportunity.type}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Starts {opportunity.startDate}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{opportunity.posted}</span>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4">
                        {opportunity.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Badge variant="secondary">{opportunity.category}</Badge>
                          <Badge variant="outline">{opportunity.industry}</Badge>
                          <div className="flex items-center space-x-1 text-green-600">
                            <DollarSign className="h-4 w-4" />
                            <span className="font-medium">{opportunity.salary}</span>
                          </div>
                          <span className="text-sm text-gray-500">{opportunity.companySize}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleLike(opportunity.id)}
                            className={`h-8 w-8 p-0 ${
                              likedJobs.includes(opportunity.id) ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                            }`}
                          >
                            <Heart className={`h-4 w-4 ${likedJobs.includes(opportunity.id) ? 'fill-current' : ''}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSave(opportunity.id)}
                            className={`h-8 w-8 p-0 ${
                              savedJobs.includes(opportunity.id) ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                            }`}
                          >
                            <Bookmark className={`h-4 w-4 ${savedJobs.includes(opportunity.id) ? 'fill-current' : ''}`} />
                          </Button>
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-4">Inkaranya</h3>
          <p className="text-gray-400">
            Connecting talent with opportunities
          </p>
        </div>
      </footer>
    </div>
  );
};

export default FakeDataHome;
