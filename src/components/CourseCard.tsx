import React from 'react';
import { Course } from '../types';
import { BookOpen, Clock, User } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const getRandomGradient = () => {
    const gradients = [
      'bg-gradient-to-br from-blue-500 to-purple-600',
      'bg-gradient-to-br from-green-500 to-teal-600',
      'bg-gradient-to-br from-orange-500 to-red-600',
      'bg-gradient-to-br from-purple-500 to-pink-600',
      'bg-gradient-to-br from-teal-500 to-cyan-600',
      'bg-gradient-to-br from-indigo-500 to-blue-600',
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      <div className={`h-32 ${getRandomGradient()} flex items-center justify-center relative`}>
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <BookOpen className="w-12 h-12 text-white z-10" />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
          {course.fullname}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 font-medium">
          {course.shortname}
        </p>
        
        {course.summary && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {course.summary.replace(/<[^>]*>/g, '').substring(0, 120)}...
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>ID: {course.id}</span>
            </div>
            {course.categoryname && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{course.categoryname}</span>
              </div>
            )}
          </div>
          
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium">
            View Course
          </button>
        </div>
        
        {course.progress !== undefined && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-gray-700">{course.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};