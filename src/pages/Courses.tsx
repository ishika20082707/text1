import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useBeacon } from '../context/BeaconContext';
import { Search, GraduationCap, CheckCircle, Clock, BookOpen, UserCheck, ArrowRight } from 'lucide-react';

export const Courses: React.FC = () => {
  const { courses } = useBeacon();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDuration, setFilterDuration] = useState('all');

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            course.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDuration = filterDuration === 'all' || 
        (filterDuration === '3' && course.duration.includes('3 Years')) ||
        (filterDuration === '4' && course.duration.includes('4 Years'));

      return matchesSearch && matchesDuration;
    });
  }, [courses, searchTerm, filterDuration]);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Our Academic Offerings</h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Discover undergraduate degrees engineered for scientific advancement, creative problem solving, and global business strategies.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses by keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          {/* Segmented filter style */}
          <div className="flex gap-1 p-1 bg-slate-100 rounded-lg self-stretch sm:self-auto shrink-0">
            <button
              onClick={() => setFilterDuration('all')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                filterDuration === 'all'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Durations
            </button>
            <button
              onClick={() => setFilterDuration('3')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                filterDuration === '3'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3-Year Programs
            </button>
            <button
              onClick={() => setFilterDuration('4')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                filterDuration === '4'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              4-Year Programs
            </button>
          </div>
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center max-w-lg mx-auto space-y-4">
            <GraduationCap className="h-12 w-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-semibold text-slate-800">No courses matched your query</h3>
            <p className="text-sm text-slate-500">Try adjusting your search filters or clearing keywords to see all institutional offerings.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterDuration('all');
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h2 className="font-serif text-lg font-bold text-slate-900 leading-snug">
                    {course.name}
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {course.description}
                </p>

                {/* Course Metadata (using clean unboxed design with vertical layouts) */}
                <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex gap-2 text-slate-600">
                    <Clock className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-700 font-medium">Duration:</strong> {course.duration}</span>
                  </div>
                  
                  <div className="flex gap-2 text-slate-600">
                    <BookOpen className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-700 font-medium">Seats:</strong> <span className="font-mono tabular-nums">{course.seats} Intake Seats</span></span>
                  </div>

                  <div className="flex gap-2 text-slate-600">
                    <UserCheck className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-700 font-medium">Eligibility:</strong> {course.eligibility}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-slate-400 text-[10px] uppercase font-semibold tracking-wider">Annual Fee</span>
                  <span className="text-lg font-bold text-blue-600 font-mono tabular-nums">
                    {course.fees}
                  </span>
                </div>

                <Link
                  to={`/login?mode=register&course=${course.id}`}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 hover:shadow-xs transition-all flex items-center gap-1.5"
                >
                  Apply Online
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
