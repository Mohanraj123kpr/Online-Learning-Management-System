import { useState } from 'react';
import { mockCourses } from '../data/mockData';
import { CourseCard } from '../components/CourseCard';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Search } from 'lucide-react';

export function CourseCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(mockCourses.map(c => c.category)))];
  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
    const matchesLevel = levelFilter === 'all' || course.level === levelFilter;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl">Browse Courses</h1>
        <p className="text-gray-600">Explore our wide range of courses</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 lg:max-w-md">
          <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-4">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              {levels.map(level => (
                <SelectItem key={level} value={level}>
                  {level === 'all' ? 'All Levels' : level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-gray-600">
        {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} found
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-lg text-gray-600">No courses found</p>
          <p className="text-sm text-gray-500">Try adjusting your filters</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all');
              setLevelFilter('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
