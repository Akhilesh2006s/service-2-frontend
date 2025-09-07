import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import Header from '../components/Header';
import CreateOpportunityModal from '../components/CreateOpportunityModal';
import ApplicationsManagement from '../components/ApplicationsManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Briefcase, 
  Users, 
  TrendingUp, 
  Plus,
  Eye,
  UserCheck,
  UserX,
  Clock,
  CheckCircle
} from 'lucide-react';

const OrganizationDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getOrganizationDashboard();
      if (response.status === 'success') {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // If organization profile not found, show a message to complete profile setup
      if (error.message.includes('Organization profile not found')) {
        setDashboardData({
          organization: null,
          stats: { totalOpportunities: 0, activeOpportunities: 0, totalApplications: 0, pendingApplications: 0 },
          recentApplications: [],
          opportunitiesWithStats: []
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpportunityCreated = () => {
    // Refresh dashboard data when a new opportunity is created
    fetchDashboardData();
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
  const opportunities = dashboardData?.opportunitiesWithStats || [];
  const organization = dashboardData?.organization;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Dashboard Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {profile?.name || 'Organization'}!
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your opportunities and track applications
              </p>
            </div>
            <CreateOpportunityModal onOpportunityCreated={handleOpportunityCreated} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {!organization && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <p className="text-yellow-800">
                  <strong>Profile Setup Required:</strong> Your organization profile needs to be completed. 
                  Please contact support or try registering again to set up your organization profile.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Opportunities</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalOpportunities || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.activeOpportunities || 0} active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalApplications || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.pendingApplications || 0} pending review
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    Candidates ready for interview
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Hired</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    Successful placements
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>
                  Latest applications that need your attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentApplications.length > 0 ? (
                  <div className="space-y-4">
                    {recentApplications.map((application) => (
                      <div key={application._id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                            <UserCheck className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {application.employee?.personalInfo?.firstName} {application.employee?.personalInfo?.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Applied for {application.opportunity?.title}
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
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setActiveTab('applications')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {application.status === 'submitted' && (
                            <div className="flex space-x-1">
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={async () => {
                                  try {
                                    await apiService.updateApplicationStatus(application._id, 'shortlisted');
                                    fetchDashboardData(); // Refresh data
                                  } catch (error) {
                                    console.error('Failed to update status:', error);
                                  }
                                }}
                              >
                                <UserCheck className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                                onClick={async () => {
                                  try {
                                    await apiService.updateApplicationStatus(application._id, 'rejected');
                                    fetchDashboardData(); // Refresh data
                                  } catch (error) {
                                    console.error('Failed to update status:', error);
                                  }
                                }}
                              >
                                <UserX className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No applications yet</p>
                    <p className="text-sm text-muted-foreground">Start posting opportunities to receive applications</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Opportunities Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Your Opportunities</CardTitle>
                <CardDescription>
                  Overview of your posted opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                {opportunities.length > 0 ? (
                  <div className="space-y-4">
                    {opportunities.map((opportunity) => (
                      <div key={opportunity._id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{opportunity.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {opportunity.type} • {opportunity.metrics?.views || 0} views
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={
                            opportunity.status === 'active' ? 'default' : 'outline'
                          }>
                            {opportunity.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {opportunity.metrics?.applications || 0} applications
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No opportunities posted yet</p>
                    <CreateOpportunityModal onOpportunityCreated={handleOpportunityCreated} />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="opportunities">
            <Card>
              <CardHeader>
                <CardTitle>Manage Opportunities</CardTitle>
                <CardDescription>
                  Create, edit, and manage your job postings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Opportunity management coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <ApplicationsManagement organizationId={organization?._id} />
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Insights</CardTitle>
                <CardDescription>
                  Track your hiring performance and metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Analytics dashboard coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OrganizationDashboard;

