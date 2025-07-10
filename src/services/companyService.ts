import axios from 'axios';

const API_BASE_URL = 'https://iomad.bylinelms.com/webservice/rest/server.php';
const API_TOKEN = '4a2ba2d6742afc7d13ce4cf486ba7633';

export interface CreateCompanyData {
  name: string;
  shortname: string;
  city: string;
  country: string;
  theme?: string;
  parentid?: number;
  ecommerce?: boolean;
  maxusers?: number;
  expiry?: number;
  code?: string;
  region?: string;
  customcss?: string;
  customlogo?: string;
  customheaderlogo?: string;
  customfavicon?: string;
  customfooterhtml?: string;
  customheaderhtml?: string;
  hostname?: string;
  emailprofileid?: number;
  suspended?: boolean;
  validto?: number;
  companydomains?: string[];
  companycourses?: number[];
  companymanagers?: number[];
  logofile?: File;
  headerlogofile?: File;
  faviconfile?: File;
}

export interface CompanyResponse {
  id: number;
  name: string;
  shortname: string;
  city: string;
  country: string;
  theme: string;
  parentid: number;
  ecommerce: boolean;
  maxusers: number;
  expiry: number;
  code: string;
  region: string;
  suspended: boolean;
  validto: number;
  timecreated: number;
  timemodified: number;
}

export interface ThemeOption {
  value: string;
  name: string;
  description: string;
  preview: string;
  features: string[];
}

export const availableThemes: ThemeOption[] = [
  {
    value: '',
    name: 'Default Theme',
    description: 'Standard IOMAD theme with clean design',
    preview: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
    features: ['Responsive Design', 'Standard Colors', 'Basic Customization']
  },
  {
    value: 'boost',
    name: 'Boost Theme',
    description: 'Modern and dynamic theme with enhanced features',
    preview: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400',
    features: ['Modern Design', 'Enhanced Navigation', 'Mobile Optimized']
  },
  {
    value: 'classic',
    name: 'Classic Theme',
    description: 'Traditional academic theme with professional look',
    preview: 'https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=400',
    features: ['Professional Look', 'Academic Style', 'Traditional Layout']
  },
  {
    value: 'more',
    name: 'More Theme',
    description: 'Feature-rich theme with advanced customization',
    preview: 'https://images.pexels.com/photos/3184294/pexels-photo-3184294.jpeg?auto=compress&cs=tinysrgb&w=400',
    features: ['Advanced Features', 'Rich Customization', 'Interactive Elements']
  }
];
export const companyService = {
  async uploadFile(file: File, context: string = 'company'): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('contextid', '1');
      formData.append('component', 'block_iomad_company_admin');
      formData.append('filearea', context);
      formData.append('itemid', '0');
      formData.append('filepath', '/');
      formData.append('filename', file.name);

      const response = await axios.post(API_BASE_URL, formData, {
        params: {
          wstoken: API_TOKEN,
          wsfunction: 'core_files_upload',
          moodlewsrestformat: 'json'
        },
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data && response.data.length > 0) {
        return response.data[0].url;
      } else {
        throw new Error('Failed to upload file');
      }
    } catch (error: any) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file. Please try again.');
    }
  },

  async createCompany(companyData: CreateCompanyData): Promise<CompanyResponse> {
    try {
      // Upload files if provided
      const processedData = { ...companyData };
      
      if (companyData.logofile) {
        try {
          processedData.customlogo = await this.uploadFile(companyData.logofile, 'logo');
        } catch (error) {
          console.warn('Logo upload failed, continuing without logo');
        }
        delete processedData.logofile;
      }
      
      if (companyData.headerlogofile) {
        try {
          processedData.customheaderlogo = await this.uploadFile(companyData.headerlogofile, 'headerlogo');
        } catch (error) {
          console.warn('Header logo upload failed, continuing without header logo');
        }
        delete processedData.headerlogofile;
      }
      
      if (companyData.faviconfile) {
        try {
          processedData.customfavicon = await this.uploadFile(companyData.faviconfile, 'favicon');
        } catch (error) {
          console.warn('Favicon upload failed, continuing without favicon');
        }
        delete processedData.faviconfile;
      }

      const response = await axios.post(API_BASE_URL, null, {
        params: {
          wstoken: API_TOKEN,
          wsfunction: 'block_iomad_company_admin_create_companies',
          moodlewsrestformat: 'json',
          companies: JSON.stringify([processedData])
        }
      });

      if (response.data && response.data.length > 0) {
        return response.data[0];
      } else if (response.data && response.data.exception) {
        throw new Error(response.data.message || 'Failed to create company');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Error creating company:', error);
      if (error.response?.data?.exception) {
        throw new Error(error.response.data.message || 'API Error');
      }
      throw new Error('Failed to create company. Please check your permissions and try again.');
    }
  },

  async updateCompany(companyId: number, companyData: Partial<CreateCompanyData>): Promise<CompanyResponse> {
    try {
      const updateData = {
        id: companyId,
        ...companyData
      };

      const response = await axios.post(API_BASE_URL, null, {
        params: {
          wstoken: API_TOKEN,
          wsfunction: 'block_iomad_company_admin_update_companies',
          moodlewsrestformat: 'json',
          companies: JSON.stringify([updateData])
        }
      });

      if (response.data && response.data.length > 0) {
        return response.data[0];
      } else if (response.data && response.data.exception) {
        throw new Error(response.data.message || 'Failed to update company');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Error updating company:', error);
      if (error.response?.data?.exception) {
        throw new Error(error.response.data.message || 'API Error');
      }
      throw new Error('Failed to update company. Please check your permissions and try again.');
    }
  },

  async deleteCompany(companyId: number): Promise<boolean> {
    try {
      const response = await axios.post(API_BASE_URL, null, {
        params: {
          wstoken: API_TOKEN,
          wsfunction: 'block_iomad_company_admin_delete_companies',
          moodlewsrestformat: 'json',
          companyids: JSON.stringify([companyId])
        }
      });

      return response.data === null || response.data === true;
    } catch (error: any) {
      console.error('Error deleting company:', error);
      if (error.response?.data?.exception) {
        throw new Error(error.response.data.message || 'API Error');
      }
      throw new Error('Failed to delete company. Please check your permissions and try again.');
    }
  },

  async getCompanyDetails(companyId: number): Promise<CompanyResponse> {
    try {
      const response = await axios.get(API_BASE_URL, {
        params: {
          wstoken: API_TOKEN,
          wsfunction: 'block_iomad_company_admin_get_companies',
          moodlewsrestformat: 'json',
          companyid: companyId
        }
      });

      if (response.data && (Array.isArray(response.data) ? response.data.length > 0 : response.data.id)) {
        return Array.isArray(response.data) ? response.data[0] : response.data;
      } else {
        throw new Error('Company not found');
      }
    } catch (error: any) {
      console.error('Error fetching company details:', error);
      throw new Error('Failed to fetch company details');
    }
  }
};