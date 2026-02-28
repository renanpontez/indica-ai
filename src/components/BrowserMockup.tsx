'use client';

function FeedMockup() {
  return (
    <div className="flex flex-col h-full bg-[#F8F8FA]">
      {/* App navbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-gray-100">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-[#FD512E] flex items-center justify-center">
            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <span className="text-[10px] font-bold text-[#FD512E]">Circle Picks</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2.5 py-1.5 border border-gray-100">
            <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <span className="text-[8px] text-gray-400">Search places...</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500"/>
        </div>
      </div>

      {/* Feed content */}
      <div className="flex-1 overflow-hidden px-3 py-3">
        {/* Section title */}
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-[10px] font-bold text-gray-900">Friends&apos; Picks</h3>
          <span className="text-[8px] text-[#FD512E] font-medium">See all</span>
        </div>

        {/* Card 1 */}
        <div className="mb-2.5 rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100">
          <div className="flex gap-2 p-2">
            <div className="relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-orange-400 to-red-500">
              <div className="absolute top-1 left-1 px-1 py-0.5 bg-white/90 rounded text-[5px] font-bold text-gray-700">$$</div>
              <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-black/30 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"/>
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 mb-0.5">
                <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-pink-400 to-rose-500"/>
                <span className="text-[7px] font-medium text-gray-500">Ana recommended</span>
              </div>
              <p className="text-[9px] font-bold text-gray-900 leading-tight">Trattoria Roma</p>
              <p className="text-[7px] text-gray-400 mt-0.5">Italian &middot; Modena, Italy</p>
              <div className="flex gap-1 mt-1">
                <span className="px-1 py-0.5 bg-gray-100 rounded text-[5px] text-gray-500 font-medium">Italian</span>
                <span className="px-1 py-0.5 bg-gray-100 rounded text-[5px] text-gray-500 font-medium">Fine Dining</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="mb-2.5 rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100">
          <div className="flex gap-2 p-2">
            <div className="relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-cyan-400 to-blue-500">
              <div className="absolute top-1 left-1 px-1 py-0.5 bg-white/90 rounded text-[5px] font-bold text-gray-700">$</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 mb-0.5">
                <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500"/>
                <span className="text-[7px] font-medium text-gray-500">Carlos recommended</span>
              </div>
              <p className="text-[9px] font-bold text-gray-900 leading-tight">Blue Bottle Coffee</p>
              <p className="text-[7px] text-gray-400 mt-0.5">Cafe &middot; San Francisco</p>
              <div className="flex gap-1 mt-1">
                <span className="px-1 py-0.5 bg-gray-100 rounded text-[5px] text-gray-500 font-medium">Coffee</span>
                <span className="px-1 py-0.5 bg-gray-100 rounded text-[5px] text-gray-500 font-medium">Specialty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100">
          <div className="flex gap-2 p-2">
            <div className="relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-violet-400 to-purple-600">
              <div className="absolute top-1 left-1 px-1 py-0.5 bg-white/90 rounded text-[5px] font-bold text-gray-700">$$$</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 mb-0.5">
                <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-violet-400 to-purple-500"/>
                <span className="text-[7px] font-medium text-gray-500">Julia recommended</span>
              </div>
              <p className="text-[9px] font-bold text-gray-900 leading-tight">Noma Copenhagen</p>
              <p className="text-[7px] text-gray-400 mt-0.5">Restaurant &middot; Copenhagen</p>
              <div className="flex gap-1 mt-1">
                <span className="px-1 py-0.5 bg-gray-100 rounded text-[5px] text-gray-500 font-medium">Nordic</span>
                <span className="px-1 py-0.5 bg-gray-100 rounded text-[5px] text-gray-500 font-medium">Michelin</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BrowserMockup() {
  return (
    <div className="relative">
      {/* Shadow / glow */}
      <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl blur-2xl"/>

      {/* Browser frame */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400"/>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"/>
            <div className="w-2.5 h-2.5 rounded-full bg-green-400"/>
          </div>
          <div className="flex-1 flex items-center gap-1.5 bg-white rounded-md px-3 py-1 border border-gray-200 mx-4">
            <svg className="w-2.5 h-2.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            <span className="text-[9px] text-gray-400">circlepicks.app</span>
          </div>
        </div>

        {/* Screen content */}
        <div className="h-[320px] sm:h-[360px] lg:h-[400px]">
          <FeedMockup />
        </div>
      </div>
    </div>
  );
}
