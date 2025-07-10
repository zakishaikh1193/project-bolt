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
  customcss?: string;
  hostname?: string;
  emailprofileid?: number;
  suspended?: boolean;
  validto?: number;
  companydomains?: string[];
  companycourses?: number[];
  companymanagers?: number[];
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

export const companyService = {
  async createCompany(companyData: CreateCompanyData): Promise<CompanyResponse> {
    try {
      const response = await axios.post(API_BASE_URL, null, {
        params: {
          wstoken: API_TOKEN,
          wsfunction: 'block_iomad_company_admin_create_companies',
          moodlewsrestformat: 'json',
          companies: JSON.stringify([companyData])
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