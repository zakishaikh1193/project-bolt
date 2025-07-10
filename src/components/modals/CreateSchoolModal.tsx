import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  X, 
  Building, 
  MapPin, 
  Globe, 
  Users, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Upload,
  Image,
  Palette,
  Eye,
  Trash2
} from 'lucide-react';
import { LoadingSpinner } from '../LoadingSpinner';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { companyService, availableThemes, ThemeOption } from '../../services/companyService';

interface CreateSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (school: any) => void;
}

export const CreateSchoolModal: React.FC<CreateSchoolModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [headerLogoPreview, setHeaderLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>(availableThemes[0]);

  const [formData, setFormData] = useState<CreateCompanyData>({
    name: '',
    shortname: '',
    city: '',
    country: '',
    theme: '',
    parentid: 0,
    ecommerce: false,
    maxusers: 1000,
    expiry: 0,
    code: '',
    region: '',
    suspended: false,
    validto: 0,
    companydomains: [],
    companycourses: [],
    companymanagers: []
  });

  const handleFileUpload = (file: File, type: 'logo' | 'headerlogo' | 'favicon') => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        switch (type) {
          case 'logo':
            setLogoPreview(result);
            handleInputChange('logofile', file);
            break;
          case 'headerlogo':
            setHeaderLogoPreview(result);
            handleInputChange('headerlogofile', file);
            break;
          case 'favicon':
            setFaviconPreview(result);
            handleInputChange('faviconfile', file);
            break;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (type: 'logo' | 'headerlogo' | 'favicon') => {
    switch (type) {
      case 'logo':
        setLogoPreview(null);
        handleInputChange('logofile', undefined);
        break;
      case 'headerlogo':
        setHeaderLogoPreview(null);
        handleInputChange('headerlogofile', undefined);
        break;
      case 'favicon':
        setFaviconPreview(null);
        handleInputChange('faviconfile', undefined);
        break;
    }
  };

  const handleThemeSelect = (theme: ThemeOption) => {
    setSelectedTheme(theme);
    handleInputChange('theme', theme.value);
  };

  const handleInputChange = (field: keyof CreateCompanyData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      setError('School name is required');
      return false;
    }
    if (!formData.shortname.trim()) {
      setError('Short name is required');
      return false;
    }
    if (!formData.city.trim()) {
      setError('City is required');
      return false;
    }
    if (!formData.country.trim()) {
      setError('Country is required');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep1()) {
      setStep(1);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Generate a unique code if not provided
      if (!formData.code) {
        formData.code = formData.shortname.toLowerCase().replace(/\s+/g, '');
      }

      const newSchool = await companyService.createCompany(formData);
      
      setSuccess('School created successfully!');
      
      // Convert to our School interface format
      const schoolData = {
        id: newSchool.id.toString(),
        name: newSchool.name,
        shortname: newSchool.shortname,
        description: '',
        city: newSchool.city,
        country: newSchool.country,
        status: newSchool.suspended ? 'inactive' : 'active',
        userCount: 0,
        courseCount: 0
      };

      setTimeout(() => {
        onSuccess(schoolData);
        onClose();
        resetForm();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to create school');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      shortname: '',
      city: '',
      country: '',
      theme: '',
      parentid: 0,
      ecommerce: false,
      maxusers: 1000,
      expiry: 0,
      code: '',
      region: '',
      suspended: false,
      validto: 0,
      companydomains: [],
      companycourses: [],
      companymanagers: []
    });
    setStep(1);
    setLogoPreview(null);
    setHeaderLogoPreview(null);
    setFaviconPreview(null);
    setSelectedTheme(availableThemes[0]);
    setError('');
    setSuccess('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const FileUploadArea: React.FC<{
    type: 'logo' | 'headerlogo' | 'favicon';
    preview: string | null;
    title: string;
    description: string;
    accept?: string;
  }> = ({ type, preview, title, description, accept = "image/*" }) => (
    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
      <input
        type="file"
        accept={accept}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file, type);
        }}
        className="hidden"
        id={`${type}-upload`}
      />
      
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt={`${title} preview`}
            className="w-20 h-20 object-contain mx-auto rounded-lg"
          />
          <button
            type="button"
            onClick={() => removeFile(type)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <label htmlFor={`${type}-upload`} className="cursor-pointer">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
        </label>
      )}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              School Name *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter school name"
              icon={Building}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Short Name *
            </label>
            <Input
              type="text"
              value={formData.shortname}
              onChange={(e) => handleInputChange('shortname', e.target.value)}
              placeholder="Enter short name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              City *
            </label>
            <Input
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="Enter city"
              icon={MapPin}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Country *
            </label>
            <Input
              type="text"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              placeholder="Enter country"
              icon={Globe}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Region
            </label>
            <Input
              type="text"
              value={formData.region}
              onChange={(e) => handleInputChange('region', e.target.value)}
              placeholder="Enter region"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              School Code
            </label>
            <Input
              type="text"
              value={formData.code}
              onChange={(e) => handleInputChange('code', e.target.value)}
              placeholder="Auto-generated if empty"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Branding & Assets
        </h3>
        
        {/* Logo Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <FileUploadArea
            type="logo"
            preview={logoPreview}
            title="School Logo"
            description="Main logo (PNG, JPG)"
          />
          <FileUploadArea
            type="headerlogo"
            preview={headerLogoPreview}
            title="Header Logo"
            description="Header logo (PNG, JPG)"
          />
          <FileUploadArea
            type="favicon"
            preview={faviconPreview}
            title="Favicon"
            description="Browser icon (ICO, PNG)"
            accept="image/x-icon,image/png"
          />
        </div>

        {/* Theme Selection */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Choose Theme
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableThemes.map((theme) => (
              <div
                key={theme.value}
                onClick={() => handleThemeSelect(theme)}
                className={`cursor-pointer border-2 rounded-lg p-4 transition-all duration-200 ${
                  selectedTheme.value === theme.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="relative mb-3">
                  <img
                    src={theme.preview}
                    alt={theme.name}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  {selectedTheme.value === theme.value && (
                    <div className="absolute inset-0 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
                        <Eye className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                </div>
                <h5 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {theme.name}
                </h5>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {theme.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {theme.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-600 dark:text-gray-300"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Configuration & Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Maximum Users
            </label>
            <Input
              type="number"
              value={formData.maxusers}
              onChange={(e) => handleInputChange('maxusers', parseInt(e.target.value) || 1000)}
              placeholder="1000"
              icon={Users}
              min="1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Valid Until
            </label>
            <Input
              type="date"
              value={formData.validto ? new Date(formData.validto * 1000).toISOString().split('T')[0] : ''}
              onChange={(e) => handleInputChange('validto', e.target.value ? Math.floor(new Date(e.target.value).getTime() / 1000) : 0)}
              icon={Calendar}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="ecommerce"
              checked={formData.ecommerce}
              onChange={(e) => handleInputChange('ecommerce', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="ecommerce" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Enable E-commerce
            </label>
          </div>
          
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="suspended"
              checked={formData.suspended}
              onChange={(e) => handleInputChange('suspended', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="suspended" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Start Suspended
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Create New School</h2>
                    <p className="text-blue-100">Step {step} of 3</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(step / 3) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <form onSubmit={handleSubmit}>
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center gap-2"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">{error}</span>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm">{success}</span>
                  </motion.div>
                )}

                {/* Actions */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    {step > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleBack}
                        disabled={loading}
                      >
                        Back
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleClose}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    
                    {step < 3 ? (
                      <Button
                        type="button"
                        onClick={handleNext}
                        disabled={loading}
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-blue-600 to-purple-600"
                      >
                        {loading ? (
                          <>
                            <LoadingSpinner size="sm" />
                            <span>Creating...</span>
                          </>
                        ) : (
                          'Create School'
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};