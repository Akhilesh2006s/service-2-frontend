import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import Header from '../components/Header';
import SkillsAndInterestsForm from '../components/SkillsAndInterestsForm';
import EmployeeInterviews from '../components/EmployeeInterviews';
import ApplicationModal from '../components/ApplicationModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Briefcase, 
  Heart, 
  TrendingUp, 
  Search,
  Clock,
  CheckCircle,
  Star,
  MapPin,
  Settings,
  Calendar,
  Building2,
  ArrowRight
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const EmployeeDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [opportunities, setOpportunities] = useState([]);
  const [opportunitiesLoading, setOpportunitiesLoading] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getEmployeeDashboard();
      if (response.status === 'success') {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOpportunities = async () => {
    try {
      setOpportunitiesLoading(true);
      const response = await apiService.getOpportunities();
      setOpportunities(response.data.opportunities || []);
    } catch (error) {
      console.error('Failed to fetch opportunities:', error);
      toast({
        title: "Error",
        description: "Failed to fetch opportunities",
        variant: "destructive",
      });
    } finally {
      setOpportunitiesLoading(false);
    }
  };

  const handleApply = (opportunity) => {
    console.log('Apply button clicked for opportunity:', opportunity);
    setSelectedOpportunity(opportunity);
    setShowApplicationModal(true);
    console.log('Modal state set to true');
  };

  const handleCardClick = (opportunity) => {
    navigate(`/opportunity/${opportunity._id}`);
  };

  const formatSalary = (compensation) => {
    if (!compensation?.amount) return 'Competitive';
    return `$${compensation.amount.toLocaleString()}/${compensation.type === 'salary' ? 'year' : 'hour'}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const recentApplications = dashboardData?.recentApplications || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Dashboard Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {profile?.personalInfo?.firstName || 'Employee'}!
              </h1>
              <p className="text-muted-foreground mt-1">
                Discover opportunities and track your applications
              </p>
            </div>
            <Button 
              className="flex items-center gap-2"
              onClick={() => setActiveTab('opportunities')}
            >
              <Search className="h-4 w-4" />
              Find Opportunities
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="interviews">Interviews</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="profile">Profile & Skills</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalApplications || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.pendingApplications || 0} pending
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.shortlistedApplications || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Under consideration
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Accepted</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.acceptedApplications || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Successful applications
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Saved</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    Saved opportunities
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>
                  Track the status of your recent applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentApplications.length > 0 ? (
                  <div className="space-y-4">
                    {recentApplications.map((application) => (
                      <div key={application._id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                            <Briefcase className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{application.opportunity?.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {application.organization?.name} • {application.opportunity?.type}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={
                            application.status === 'submitted' ? 'default' :
                            application.status === 'shortlisted' ? 'secondary' :
                            application.status === 'accepted' ? 'default' : 'outline'
                          }>
                            {application.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(application.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No applications yet</p>
                    <p className="text-sm text-muted-foreground">Start applying to opportunities to track your progress</p>
                  </div>
                )}
              </CardContent>
            </Card>

          </TabsContent>

          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Application History</CardTitle>
                <CardDescription>
                  View and manage all your applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Application history coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interviews">
            <EmployeeInterviews />
          </TabsContent>

          <TabsContent value="opportunities">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Browse Opportunities</CardTitle>
                    <CardDescription>
                      Discover new opportunities and apply
                    </CardDescription>
                  </div>
                  <Button onClick={fetchOpportunities} disabled={opportunitiesLoading}>
                    <Search className="h-4 w-4 mr-2" />
                    {opportunitiesLoading ? 'Loading...' : 'Refresh'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {opportunitiesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading opportunities...</p>
                  </div>
                ) : opportunities.length === 0 ? (
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No opportunities found</p>
                    <Button onClick={fetchOpportunities} className="mt-4">
                      Load Opportunities
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {opportunities.slice(0, 6).map((opportunity) => (
                      <div
                        key={opportunity._id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 cursor-pointer group hover:shadow-xl hover:scale-105 hover:border-blue-200"
                        onClick={() => handleCardClick(opportunity)}
                      >
                        {/* Placeholder for image */}
                        <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center relative overflow-hidden">
                          <Building2 className="h-16 w-16 text-blue-600 transition-transform duration-300 group-hover:scale-110" />
                          <div className="absolute top-3 right-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 h-8 w-8 rounded-full bg-white/80 hover:bg-white transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                console.log('Button clicked, calling handleApply');
                                handleApply(opportunity);
                              }}
                            >
                              <ArrowRight className="h-4 w-4 text-blue-600" />
                            </Button>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">
                                {opportunity.title}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {opportunity.description}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2 mb-3">
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                              <span className="capitalize">{opportunity.location?.type || 'Not specified'}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Building2 className="h-4 w-4 mr-1 flex-shrink-0" />
                              <span className="truncate">{opportunity.organization?.name || 'Unknown Company'}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                              <span>{opportunity.type || 'Not specified'}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center text-sm">
                              <Star className="h-4 w-4 text-yellow-400 mr-1" />
                              <span className="text-gray-600">4.6</span>
                            </div>
                            <div className="text-sm font-semibold text-green-600">
                              {formatSalary(opportunity.compensation)}
                            </div>
                          </div>
                          
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              console.log('Apply button clicked');
                              handleApply(opportunity);
                            }}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            size="sm"
                          >
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>


          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Profile & Skills
                </CardTitle>
                <CardDescription>
                  Manage your skills, interests, and profile information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SkillsAndInterestsForm 
                  initialSkills={profile?.skills || []}
                  initialInterests={profile?.interests || []}
                  onSave={(skills, interests) => {
                    // Skills and interests updated
                    console.log('Skills and interests updated:', skills, interests);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Application Modal */}
      {showApplicationModal && selectedOpportunity && (
        <ApplicationModal
          isOpen={showApplicationModal}
          opportunity={selectedOpportunity}
          onClose={() => {
            setShowApplicationModal(false);
            setSelectedOpportunity(null);
          }}
        />
      )}
    </div>
  );
};

export default EmployeeDashboard;

