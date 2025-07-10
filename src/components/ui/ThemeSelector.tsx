import React from 'react';
import { motion } from 'framer-motion';
import { Check, Eye } from 'lucide-react';

export interface Theme {
  id: string;
  name: string;
  description: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  features: string[];
}

interface ThemeSelectorProps {
  themes: Theme[];
  selectedTheme: Theme;
  onThemeSelect: (theme: Theme) => void;
  className?: string;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  themes,
  selectedTheme,
  onThemeSelect,
  className = ""
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {themes.map((theme) => (
        <motion.div
          key={theme.id}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onThemeSelect(theme)}
          className={`cursor-pointer border-2 rounded-xl overflow-hidden transition-all duration-200 ${
            selectedTheme.id === theme.id
              ? 'border-blue-500 shadow-lg'
              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-md'
          }`}
        >
          {/* Preview Image */}
          <div className="relative h-32 overflow-hidden">
            <img
              src={theme.preview}
              alt={theme.name}
              className="w-full h-full object-cover"
            />
            
            {/* Color Palette Overlay */}
            <div className="absolute bottom-2 left-2 flex gap-1">
              <div 
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: theme.colors.primary }}
              />
              <div 
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: theme.colors.secondary }}
              />
              <div 
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: theme.colors.accent }}
              />
            </div>

            {/* Selection Indicator */}
            {selectedTheme.id === theme.id && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-2 right-2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg"
              >
                <Check className="w-4 h-4" />
              </motion.div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                className="w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center"
              >
                <Eye className="w-5 h-5 text-gray-700" />
              </motion.div>
            </div>
          </div>

          {/* Theme Info */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              {theme.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {theme.description}
            </p>
            
            {/* Features */}
            <div className="flex flex-wrap gap-1">
              {theme.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-600 dark:text-gray-300"
                >
                  {feature}
                </span>
              ))}
              {theme.features.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-600 dark:text-gray-300">
                  +{theme.features.length - 3} more
                </span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};