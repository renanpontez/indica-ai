'use client';

// Feed screen - main social feed showing friend activity
function FeedScreen() {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <span className="text-[8px] font-semibold text-gray-900">9:41</span>
        <div className="flex items-center gap-1">
          <svg className="w-2.5 h-2.5 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
            <path d="M1.5 8.5a13 13 0 0121 0M5 12a10 10 0 0114 0M8.5 15.5a6 6 0 017 0M12 19h.01" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="flex gap-px items-end">
            <div className="w-0.5 h-1 bg-gray-900 rounded-sm"/>
            <div className="w-0.5 h-1.5 bg-gray-900 rounded-sm"/>
            <div className="w-0.5 h-2 bg-gray-900 rounded-sm"/>
            <div className="w-0.5 h-2.5 bg-gray-900 rounded-sm"/>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2">
        <div>
          <p className="text-[7px] text-gray-500 font-medium">Good afternoon,</p>
          <h2 className="text-[10px] font-bold text-gray-900">Your Feed</h2>
        </div>
        <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-[#FD512E]">
          <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500"/>
        </div>
      </div>

      {/* Stories row */}
      <div className="flex gap-2 px-4 pb-2 overflow-hidden">
        {[
          { color: 'from-pink-400 to-rose-500', label: 'Ana' },
          { color: 'from-cyan-400 to-blue-500', label: 'Carlos' },
          { color: 'from-violet-400 to-purple-500', label: 'Julia' },
          { color: 'from-amber-400 to-orange-500', label: 'Mei' },
        ].map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5 flex-shrink-0">
            <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${s.color} border-2 border-[#FD512E] p-0.5`}>
              <div className="w-full h-full rounded-full bg-white/20"/>
            </div>
            <span className="text-[5px] text-gray-500">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Feed card 1 */}
      <div className="mx-3 mb-2 rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100">
        <div className="relative h-20 bg-gradient-to-br from-orange-400 to-red-500">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
            </svg>
          </div>
          {/* Experience badge */}
          <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-[#FD512E] rounded-full">
            <span className="text-[5px] font-bold text-white uppercase tracking-wide">Restaurant</span>
          </div>
        </div>
        <div className="p-2">
          <div className="flex items-center gap-1 mb-1">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-pink-400 to-rose-500"/>
            <span className="text-[6px] font-semibold text-gray-900">Ana</span>
            <span className="text-[6px] text-gray-400">recommended</span>
          </div>
          <p className="text-[8px] font-bold text-gray-900 mb-0.5">Trattoria Roma</p>
          <div className="flex items-center gap-1">
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <svg key={i} className="w-2 h-2 text-[#FD512E]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
            </div>
            <span className="text-[6px] text-gray-400">Italian · Midtown</span>
          </div>
        </div>
      </div>

      {/* Feed card 2 */}
      <div className="mx-3 rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100">
        <div className="relative h-16 bg-gradient-to-br from-cyan-400 to-blue-500">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
            </svg>
          </div>
          <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-blue-600 rounded-full">
            <span className="text-[5px] font-bold text-white uppercase tracking-wide">Cafe</span>
          </div>
        </div>
        <div className="p-2">
          <p className="text-[8px] font-bold text-gray-900 mb-0.5">Blue Bottle Coffee</p>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500"/>
            <span className="text-[6px] text-gray-400">Carlos · Specialty Coffee</span>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="mt-auto flex items-center justify-around py-2 border-t border-gray-100 bg-white">
        {[
          { active: true, label: 'Feed', path: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25' },
          { active: false, label: 'Explore', path: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z' },
          { active: false, label: 'Add', path: 'M12 4.5v15m7.5-7.5h-15' },
          { active: false, label: 'Profile', path: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z' },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <svg
              className={`w-4 h-4 ${item.active ? 'text-[#FD512E]' : 'text-gray-400'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={item.active ? 2 : 1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={item.path}/>
            </svg>
            <span className={`text-[5px] ${item.active ? 'text-[#FD512E] font-semibold' : 'text-gray-400'}`}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Explore screen - search and discover places
function ExploreScreen() {
  return (
    <div className="flex flex-col h-full bg-[#F6F7F9]">
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1 bg-[#F6F7F9]">
        <span className="text-[8px] font-semibold text-gray-900">9:41</span>
        <div className="flex gap-px items-end">
          <div className="w-0.5 h-1 bg-gray-900 rounded-sm"/>
          <div className="w-0.5 h-1.5 bg-gray-900 rounded-sm"/>
          <div className="w-0.5 h-2 bg-gray-900 rounded-sm"/>
          <div className="w-0.5 h-2.5 bg-gray-900 rounded-sm"/>
        </div>
      </div>

      {/* Header */}
      <div className="px-4 pb-2 bg-[#F6F7F9]">
        <h2 className="text-[11px] font-bold text-gray-900 mb-2">Explore</h2>
        {/* Search bar */}
        <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm border border-gray-100">
          <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <span className="text-[7px] text-gray-400">Search places, cities...</span>
        </div>
      </div>

      {/* City chips */}
      <div className="flex gap-1.5 px-4 mb-3 overflow-hidden">
        {['New York', 'Paris', 'Tokyo', 'London'].map((city, i) => (
          <div
            key={city}
            className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[6px] font-medium ${i === 0 ? 'bg-[#FD512E] text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            {city}
          </div>
        ))}
      </div>

      {/* Grid of place cards */}
      <div className="px-3 grid grid-cols-2 gap-2">
        {[
          { color: 'from-orange-400 to-red-500', name: 'Le Comptoir', tag: 'Bistro · Paris', badge: '4.9' },
          { color: 'from-violet-400 to-purple-600', name: 'Noma', tag: 'Fine Dining · Copenhagen', badge: '5.0' },
          { color: 'from-cyan-400 to-teal-500', name: 'Cafe Reggio', tag: 'Cafe · NYC', badge: '4.7' },
          { color: 'from-amber-400 to-orange-500', name: 'Bar Basso', tag: 'Bar · Milan', badge: '4.8' },
        ].map((place, i) => (
          <div key={i} className="rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100">
            <div className={`h-14 bg-gradient-to-br ${place.color} relative`}>
              <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-black/30 backdrop-blur-sm rounded-full px-1.5 py-0.5">
                <svg className="w-2 h-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span className="text-[5px] text-white font-bold">{place.badge}</span>
              </div>
            </div>
            <div className="p-1.5">
              <p className="text-[7px] font-bold text-gray-900 leading-tight">{place.name}</p>
              <p className="text-[5px] text-gray-400 leading-tight">{place.tag}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom nav */}
      <div className="mt-auto flex items-center justify-around py-2 border-t border-gray-100 bg-white">
        {[
          { active: false, label: 'Feed', path: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25' },
          { active: true, label: 'Explore', path: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z' },
          { active: false, label: 'Add', path: 'M12 4.5v15m7.5-7.5h-15' },
          { active: false, label: 'Profile', path: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z' },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <svg
              className={`w-4 h-4 ${item.active ? 'text-[#FD512E]' : 'text-gray-400'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={item.active ? 2 : 1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={item.path}/>
            </svg>
            <span className={`text-[5px] ${item.active ? 'text-[#FD512E] font-semibold' : 'text-gray-400'}`}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Experience detail screen - viewing a specific place
function ExperienceScreen() {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Hero image area */}
      <div className="relative h-28 bg-gradient-to-br from-[#FD512E] to-orange-700 flex-shrink-0">
        {/* Status bar over image */}
        <div className="flex items-center justify-between px-4 pt-3">
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
            </svg>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"/>
              </svg>
            </div>
          </div>
        </div>
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-12 h-12 rounded-full border-4 border-white"/>
          <div className="absolute bottom-2 left-6 w-8 h-8 rounded-full border-4 border-white"/>
        </div>
        {/* Category badge */}
        <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-black/30 backdrop-blur-sm rounded-full">
          <span className="text-[6px] font-semibold text-white">Restaurant · Italian</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-3 py-3 overflow-hidden">
        <div className="flex items-start justify-between mb-1.5">
          <div>
            <h3 className="text-[10px] font-bold text-gray-900 leading-tight">Osteria Francescana</h3>
            <div className="flex items-center gap-1 mt-0.5">
              <svg className="w-2.5 h-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
              </svg>
              <span className="text-[6px] text-gray-400">Modena, Italy</span>
            </div>
          </div>
          {/* Rating */}
          <div className="flex flex-col items-center bg-[#FD512E]/10 rounded-lg px-2 py-1">
            <span className="text-[10px] font-bold text-[#FD512E]">4.9</span>
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <svg key={i} className="w-1.5 h-1.5 text-[#FD512E]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
            </div>
          </div>
        </div>

        {/* Who recommended it */}
        <div className="flex items-center gap-1.5 mb-3 p-2 bg-[#FD512E]/5 rounded-lg border border-[#FD512E]/10">
          <div className="flex -space-x-1">
            {['from-pink-400 to-rose-500', 'from-cyan-400 to-blue-500', 'from-violet-400 to-purple-500'].map((g, i) => (
              <div key={i} className={`w-4 h-4 rounded-full bg-gradient-to-br ${g} border border-white`}/>
            ))}
          </div>
          <span className="text-[6px] text-gray-600 font-medium">Ana, Carlos +1 friend recommend this</span>
        </div>

        {/* Tags */}
        <div className="flex gap-1 flex-wrap mb-3">
          {['Fine Dining', 'Michelin Star', 'Must Try', 'Date Night'].map(tag => (
            <span key={tag} className="px-1.5 py-0.5 bg-gray-100 text-[5px] font-medium text-gray-600 rounded-full">{tag}</span>
          ))}
        </div>

        {/* Add experience button */}
        <button className="w-full py-2 bg-[#FD512E] rounded-xl text-white text-[7px] font-semibold">
          Add to my picks
        </button>
      </div>
    </div>
  );
}

// Phone frame wrapper component
function PhoneFrame({
  children,
  className = '',
  screenClassName = '',
}: {
  children: React.ReactNode;
  className?: string;
  screenClassName?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {/* Phone body */}
      <div className="relative bg-gray-900 rounded-[2.5rem] p-1.5 shadow-2xl ring-1 ring-white/10">
        {/* Side buttons */}
        <div className="absolute -left-0.5 top-16 w-0.5 h-8 bg-gray-700 rounded-l-sm"/>
        <div className="absolute -left-0.5 top-28 w-0.5 h-6 bg-gray-700 rounded-l-sm"/>
        <div className="absolute -right-0.5 top-20 w-0.5 h-10 bg-gray-700 rounded-r-sm"/>

        {/* Screen */}
        <div className={`relative bg-white rounded-[2rem] overflow-hidden ${screenClassName}`}>
          {/* Dynamic Island / Notch */}
          <div className="absolute top-0 left-0 right-0 h-6 flex items-end justify-center pb-1 z-10 pointer-events-none">
            <div className="w-16 h-4 bg-gray-900 rounded-full"/>
          </div>
          {/* Screen content with top padding for notch */}
          <div className="pt-0 h-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroPhoneMockups() {
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* Left phone - Explore screen, rotated left, slightly smaller */}
      <div className="phone-left-float block absolute left-0 lg:-left-4 xl:left-4 z-10">
        <PhoneFrame
          className="w-36 sm:w-40 lg:w-44"
          screenClassName="h-[280px] sm:h-[300px] lg:h-[320px]"
        >
          <ExploreScreen />
        </PhoneFrame>
      </div>

      {/* Center phone - Feed screen, upright, largest */}
      <div className="phone-center-float relative z-20">
        <PhoneFrame
          className="w-44 sm:w-52 lg:w-56"
          screenClassName="h-[340px] sm:h-[380px] lg:h-[400px]"
        >
          <FeedScreen />
        </PhoneFrame>
      </div>

      {/* Right phone - Experience detail, rotated right, slightly smaller */}
      <div className="phone-right-float block absolute right-0 lg:-right-4 xl:right-4 z-10">
        <PhoneFrame
          className="w-36 sm:w-40 lg:w-44"
          screenClassName="h-[280px] sm:h-[300px] lg:h-[320px]"
        >
          <ExperienceScreen />
        </PhoneFrame>
      </div>
    </div>
  );
}
