import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="w-full max-w-md space-y-6">
        <div className="font-serif text-8xl sm:text-9xl font-bold tracking-tighter text-[#2C1B14]/20 select-none">
          404
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C140E]">
            Looks like this opportunity doesn&apos;t exist.
          </h1>
          <p className="text-sm text-[#72635A] max-w-sm mx-auto leading-relaxed">
            The page or internship listing you are looking for might have moved, expired, or been filled by an ambitious student.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="default" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              <span>Back to GRADDIn</span>
            </Button>
          </Link>

          <Link href="/internships" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full border-[#DFD5C6]">
              <Compass className="h-4 w-4 mr-1.5" />
              <span>Browse Opportunities</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
