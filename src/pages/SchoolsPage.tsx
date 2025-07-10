import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { 
  Search, 
  Building, 
  Users, 
  MapPin, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Globe,
  Phone,
  Mail
} from 'lucide-react';

import { School } from '../types';

export const SchoolsPage: React.FC = () => {
  const { t } = useTranslation();
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchools = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use axios directly to fetch from IOMAD API
        const response = await axios.get('https://iomad.bylinelms.com/webservice/rest/server.php', {
          params: {
            wstoken: '4a2ba2d6742afc7d13ce4cf486ba7633',
            wsfunction: 'block_iomad_company_admin_get_companies',
            moodlewsrestformat: 'json',
          },
        });
        
        // Parse the response data
        let companies = [];
        if (response.data && Array.isArray(response.data)) {
          companies = response.data;
        } else if (response.data && response.data.companies && Array.isArray(response.data.companies)) {
          companies = response.data.companies;
        } else if (response.data && typeof response.data === 'object') {
          companies = [response.data];
        }
        
        // Map to our School interface
        const mappedSchools = companies.map((company: any) => ({
          id: company.id?.toString() || Math.random().toString(),
          name: company.name || 'Unnamed School',
          shortname: company.shortname || company.name || 'N/A',
          description: company.summary || company.description || '',
          city: company.city,
          country: company.country,
          logo: company.companylogo || company.logo_url || company.logourl,
          address: company.address,
          phone: company.phone1,
          email: company.email,
          website: company.url,
          userCount: company.usercount || 0,
          courseCount: company.coursecount || 0,
          status: company.suspended ? 'inactive' : 'active'
        }));
        
        setSchools(mappedSchools);
        setFilteredSchools(mappedSchools);
      } catch (error) {
        console.error('Error fetching schools:', error);
        setError('Failed to fetch schools from IOMAD API. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  useEffect(() => {
    const filtered = schools.filter(school =>
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.shortname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSchools(filtered);
  }, [schools, searchTerm]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-96">
          <LoadingSpinner size="lg" />
          <span className="ml-4 text-gray-600 dark:text-gray-300">Loading schools...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <Building className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Error Loading Schools
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {error}
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Schools Management
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Manage and monitor all partnered schools ({filteredSchools.length} total)
            </p>
          </div>
          
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
            <Plus className="w-4 h-4" />
            Add School
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search schools by name, code, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
              />
            </div>
          </div>
        </div>

        {/* Schools Grid */}
        {filteredSchools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchools.map((school, index) => (
              <motion.div
                key={school.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* School Header */}
                <div className="relative h-32 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {school.logo ? (
                      <img
                        src={school.logo}
                        alt={school.name}
                        className="h-20 w-auto mx-auto object-contain bg-white rounded-lg p-2"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.parentElement?.querySelector('.fallback-text');
                          if (fallback) fallback.classList.remove('hidden');
                        }}
                      />
                    ) : (
                      <div className="text-center text-white">
                        <Building className="w-16 h-16 mx-auto opacity-80 mb-2" />
                        <span className="text-xs">No Logo</span>
                      </div>
                    )}
                    {school.logo && (
                      <div className="fallback-text hidden text-center text-white">
                        <Building className="w-16 h-16 mx-auto opacity-80 mb-2" />
                        <span className="text-xs">No Logo</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      school.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {school.status}
                    </span>
                  </div>
                </div>

                {/* School Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {school.name}
                  </h3>
                  
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3">
                    {school.shortname}
                  </p>
                  
                  {school.description && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                      {school.description}
                    </p>
                  )}

                  {/* Contact Information */}
                  <div className="space-y-2 mb-4">
                    {school.city && school.country && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{school.city}, {school.country}</span>
                      </div>
                    )}
                    
                    {school.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{school.email}</span>
                      </div>
                    )}
                    
                    {school.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{school.phone}</span>
                      </div>
                    )}
                    
                    {school.website && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Globe className="w-4 h-4 flex-shrink-0" />
                        <a 
                          href={school.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {school.website}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  {(school.userCount !== undefined || school.courseCount !== undefined) && (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {school.userCount !== undefined && (
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {school.userCount}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-300">Users</div>
                        </div>
                      )}
                      {school.courseCount !== undefined && (
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {school.courseCount}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-300">Courses</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm ? 'No schools found' : 'No schools available'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {searchTerm 
                ? 'Try adjusting your search criteria' 
                : 'No schools have been configured for your account'
              }
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};