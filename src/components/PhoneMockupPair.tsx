import Image from 'next/image';

export default function PhoneMockupPair() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Left phone — detail screen, tilted left */}
      <div className="-rotate-3 -mr-6 z-10 relative">
        <div className="relative bg-gray-900 rounded-[2rem] p-1.5 shadow-2xl ring-1 ring-white/10 w-[160px] sm:w-[180px] lg:w-[200px]">
          {/* Side buttons */}
          <div className="absolute -left-0.5 top-14 w-0.5 h-6 bg-gray-700 rounded-l-sm" />
          <div className="absolute -right-0.5 top-16 w-0.5 h-8 bg-gray-700 rounded-r-sm" />
          {/* Screen */}
          <div className="relative bg-white rounded-[1.6rem] overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-5 flex items-end justify-center pb-0.5 z-10 pointer-events-none">
              <div className="w-14 h-3.5 bg-gray-900 rounded-full" />
            </div>
            <Image
              src="/assets/mobile-detail.png"
              alt="Experience detail view"
              width={400}
              height={800}
              className="w-full h-auto block"
            />
          </div>
        </div>
      </div>

      {/* Right phone — add screen, tilted right */}
      <div className="rotate-3 -ml-6 z-20 relative">
        <div className="relative bg-gray-900 rounded-[2rem] p-1.5 shadow-2xl ring-1 ring-white/10 w-[160px] sm:w-[180px] lg:w-[200px]">
          <div className="absolute -left-0.5 top-14 w-0.5 h-6 bg-gray-700 rounded-l-sm" />
          <div className="absolute -right-0.5 top-16 w-0.5 h-8 bg-gray-700 rounded-r-sm" />
          <div className="relative bg-white rounded-[1.6rem] overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-5 flex items-end justify-center pb-0.5 z-10 pointer-events-none">
              <div className="w-14 h-3.5 bg-gray-900 rounded-full" />
            </div>
            <Image
              src="/assets/mobile-add.png"
              alt="Add experience view"
              width={400}
              height={800}
              className="w-full h-auto block"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
