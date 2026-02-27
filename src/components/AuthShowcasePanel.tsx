'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

export interface ShowcaseItem {
  id: string;
  userName: string;
  userAvatar: string | null;
  placeName: string;
  placeLocation: string;
  quote: string;
  imageUrl: string;
}

interface AuthShowcasePanelProps {
  items: ShowcaseItem[];
}

const CARD_HEIGHT = 200;
const CYCLE_INTERVAL = 4000;

function ShowcaseCard({ item, isActive }: { item: ShowcaseItem; isActive: boolean }) {
  return (
    <div
      className={cn(
        'bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl w-full',
        'transition-all duration-500',
        isActive ? 'opacity-100 scale-100' : 'opacity-40 scale-95'
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        {item.userAvatar ? (
          <Image
            src={item.userAvatar}
            alt={item.userName}
            width={40}
            height={40}
            className="rounded-full object-cover w-10 h-10"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
            {item.userName.charAt(0)}
          </div>
        )}
        <div>
          <p className="text-dark-grey font-semibold text-sm">{item.userName}</p>
          <div className="flex items-center gap-1 text-medium-grey text-xs">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{item.placeLocation}</span>
          </div>
        </div>
      </div>
      {item.quote && (
        <p className="text-dark-grey text-sm mb-2 leading-relaxed">
          &ldquo;{item.quote}&rdquo;
        </p>
      )}
      <p className="text-xs text-primary font-medium">{item.placeName}</p>
    </div>
  );
}

export default function AuthShowcasePanel({ items }: AuthShowcasePanelProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, CYCLE_INTERVAL);
    return () => clearInterval(timer);
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <div className="h-full w-full overflow-hidden relative bg-dark-grey">
      {/* Background images with crossfade */}
      {items.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            'absolute inset-0 transition-opacity duration-1000 ease-in-out',
            index === activeIndex ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Image
            src={item.imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="50vw"
            priority={index === 0}
          />
        </div>
      ))}

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />

      {/* Cards container */}
      <div className="absolute inset-0 flex items-center justify-center px-8">
        <div
          className="relative w-full max-w-sm overflow-hidden"
          style={{ height: `${CARD_HEIGHT}px` }}
        >
          <div
            className="transition-transform duration-700 ease-in-out"
            style={{ transform: `translateY(-${activeIndex * CARD_HEIGHT}px)` }}
          >
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-center"
                style={{ height: `${CARD_HEIGHT}px` }}
              >
                <ShowcaseCard item={item} isActive={index === activeIndex} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      {items.length > 1 && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
          {items.map((_, index) => (
            <div
              key={index}
              className={cn(
                'h-2 rounded-full transition-all duration-500',
                index === activeIndex ? 'w-6 bg-white' : 'w-2 bg-white/40'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
