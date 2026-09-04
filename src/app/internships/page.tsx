"use client";

import React, { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { InternshipCard } from '@/components/InternshipCard';
import { ApplyModal } from '@/components/ApplyModal';
import { EmptyState } from '@/components/EmptyState';
import { Internship } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  Briefcase, 
  X, 
  RotateCcw,
  Sparkles,
  Check
} from 'lucide-react';

export default function BrowseOpportunitiesPage() {
  const { internships, savedInternshipIds } = useAuth();
  
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleType, setSelectedRoleType] = useState<string>("All");
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>("All");
  const [selectedLocation, setSelectedLocation] = useState<string>("All");
  const [selectedDuration, setSelectedDuration] = useState<string>("All");
  const [selectedSkill, setSelectedSkill] = useState<string>("All");
  const [onlySaved, setOnlySaved] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [activeApplyingInternship, setActiveApplyingInternship] = useState<Internship | null>(null);

  // Available skills extracted from mock data
  const availableSkills = ["React", "Figma", "TypeScript", "Python", "Rust", "Next.js", "ROS2", "UI/UX Design"];
  const workModes = ["All", "Remote", "Hybrid", "On-site"];
  const durations = ["All", "3 Months", "4 Months", "6 Months"];

  const filteredInternships = useMemo(() => {
    return internships.filter((item) => {
      // Search term
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesCompany = item.company?.company_name.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        const matchesSkills = item.skills?.some(s => s.toLowerCase().includes(query));
        if (!matchesTitle && !matchesCompany && !matchesDesc && !matchesSkills) {
          return false;
        }
      }

      // Saved only
      if (onlySaved && !savedInternshipIds.includes(item.id)) {
        return false;
      }

      // Work mode
      if (selectedWorkMode !== "All" && item.work_mode !== selectedWorkMode && !item.location?.includes(selectedWorkMode)) {
        return false;
      }

      // Duration
      if (selectedDuration !== "All" && !item.duration?.includes(selectedDuration)) {
        return false;
      }

      // Skill
      if (selectedSkill !== "All" && !item.skills?.includes(selectedSkill)) {
        return false;
      }

      return true;
    });
  }, [internships, searchQuery, onlySaved, savedInternshipIds, selectedWorkMode, selectedDuration, selectedSkill]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedRoleType("All");
    setSelectedWorkMode("All");
    setSelectedLocation("All");
    setSelectedDuration("All");
    setSelectedSkill("All");
    setOnlySaved(false);
  };

  const hasActiveFilters = searchQuery || selectedWorkMode !== "All" || selectedDuration !== "All" || selectedSkill !== "All" || onlySaved;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Editorial Section */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C99A6B]">
          OPPORTUNITY DISCOVERY
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1C140E] mt-1 mb-2">
          Find your next opportunity.
        </h1>
        <p className="text-sm sm:text-base text-[#72635A] max-w-2xl leading-relaxed">
          Explore internships at upcoming startups building what comes next. Connect directly with founders and build features that matter.
        </p>
      </div>

      {/* Search & Action Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C7A70]" />
          <Input
            type="text"
            placeholder="Search roles, skills, startups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-12 bg-white text-sm rounded-2xl shadow-xs border-[#DFD5C6] focus-visible:ring-[#2C1B14]/10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#8C7A70] hover:text-[#1C140E]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="md:hidden flex items-center justify-center gap-2 w-full sm:w-auto h-12 px-5 rounded-2xl border border-[#DFD5C6] bg-white text-xs font-semibold text-[#1C140E]"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="h-2 w-2 rounded-full bg-[#2C1B14]" />
          )}
        </button>

        {/* Quick Filter: Saved roles */}
        <Button
          variant={onlySaved ? "default" : "outline"}
          onClick={() => setOnlySaved(!onlySaved)}
          className="hidden md:flex h-12 px-5 border-[#DFD5C6] rounded-2xl text-xs"
        >
          <span>Saved ({savedInternshipIds.length})</span>
        </Button>
      </div>

      {/* Content Layout: Sidebar Filters + Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Desktop Filter Sidebar */}
        <div className={`md:col-span-3 space-y-6 ${mobileFiltersOpen ? "block" : "hidden md:block"}`}>
          <div className="rounded-3xl border border-[#E8DFD3] bg-white p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0E8DD]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2C1B14] flex items-center gap-1.5">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Filters</span>
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[#C99A6B] hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Work Mode */}
            <div>
              <label className="block text-xs font-bold text-[#1C140E] mb-2.5">
                Work Mode
              </label>
              <div className="space-y-1.5">
                {workModes.map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSelectedWorkMode(mode)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors text-left ${
                      selectedWorkMode === mode
                        ? "bg-[#2C1B14] text-[#FAF7F2] font-semibold"
                        : "text-[#72635A] hover:bg-[#FAF7F2]"
                    }`}
                  >
                    <span>{mode}</span>
                    {selectedWorkMode === mode && <Check className="h-3.5 w-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-bold text-[#1C140E] mb-2.5">
                Duration
              </label>
              <div className="space-y-1.5">
                {durations.map((dur) => (
                  <button
                    key={dur}
                    onClick={() => setSelectedDuration(dur)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors text-left ${
                      selectedDuration === dur
                        ? "bg-[#2C1B14] text-[#FAF7F2] font-semibold"
                        : "text-[#72635A] hover:bg-[#FAF7F2]"
                    }`}
                  >
                    <span>{dur}</span>
                    {selectedDuration === dur && <Check className="h-3.5 w-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-xs font-bold text-[#1C140E] mb-2.5">
                Skills &amp; Technologies
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedSkill("All")}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedSkill === "All"
                      ? "bg-[#2C1B14] text-white"
                      : "bg-[#F5EFEB] text-[#72635A] border border-[#E8DFD3] hover:border-[#2C1B14]"
                  }`}
                >
                  All Skills
                </button>
                {availableSkills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => setSelectedSkill(selectedSkill === skill ? "All" : skill)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      selectedSkill === skill
                        ? "bg-[#2C1B14] text-white"
                        : "bg-[#F5EFEB] text-[#72635A] border border-[#E8DFD3] hover:border-[#2C1B14]"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Opportunities Feed Column */}
        <div className="md:col-span-9">
          {/* Active Filter Chips Bar */}
          <div className="flex items-center justify-between text-xs text-[#72635A] mb-4">
            <div>
              Showing <span className="font-semibold text-[#1C140E]">{filteredInternships.length}</span> opportunities
            </div>
            {hasActiveFilters && (
              <button onClick={clearAllFilters} className="text-[#C99A6B] hover:underline">
                Clear all filters
              </button>
            )}
          </div>

          {/* Cards Grid */}
          {filteredInternships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredInternships.map((internship) => (
                <InternshipCard
                  key={internship.id}
                  internship={internship}
                  onApply={(i) => setActiveApplyingInternship(i)}
                  featuredHighlight={internship.featured}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              type="search"
              onAction={clearAllFilters}
            />
          )}
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        internship={activeApplyingInternship}
        open={!!activeApplyingInternship}
        onOpenChange={(open) => !open && setActiveApplyingInternship(null)}
      />
    </div>
  );
}
