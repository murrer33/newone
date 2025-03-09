import React from 'react';
import { Building2, Globe, Users, Calendar, MapPin, Phone, Mail, Link } from 'lucide-react';

interface CompanyProfileProps {
  profile: {
    description: string;
    sector: string;
    industry: string;
    employees: number;
    founded: number;
    headquarters: string;
    website: string;
    phone: string;
    email: string;
    executives: Array<{
      name: string;
      title: string;
      age: number;
      since: number;
    }>;
  };
}

const CompanyProfile: React.FC<CompanyProfileProps> = ({ profile }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">About</h2>
      
      <div className="space-y-6">
        {/* Company Description */}
        <div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {profile.description}
          </p>
        </div>
        
        {/* Quick Facts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <Building2 className="h-5 w-5 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Sector</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{profile.sector}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Globe className="h-5 w-5 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Industry</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{profile.industry}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Users className="h-5 w-5 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Employees</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {profile.employees.toLocaleString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Founded</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{profile.founded}</p>
            </div>
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="space-y-3">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-blue-500 mr-3" />
            <p className="text-sm text-gray-600 dark:text-gray-300">{profile.headquarters}</p>
          </div>
          
          <div className="flex items-center">
            <Phone className="h-5 w-5 text-blue-500 mr-3" />
            <p className="text-sm text-gray-600 dark:text-gray-300">{profile.phone}</p>
          </div>
          
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-blue-500 mr-3" />
            <a href={`mailto:${profile.email}`} className="text-sm text-blue-500 hover:text-blue-600">
              {profile.email}
            </a>
          </div>
          
          <div className="flex items-center">
            <Link className="h-5 w-5 text-blue-500 mr-3" />
            <a 
              href={profile.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              {profile.website.replace(/^https?:\/\//, '')}
            </a>
          </div>
        </div>
        
        {/* Key Executives */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Key Executives
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.executives.map((executive, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="font-medium text-gray-900 dark:text-white">{executive.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{executive.title}</p>
                <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>Age: {executive.age}</span>
                  <span className="mx-2">•</span>
                  <span>Since {executive.since}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;