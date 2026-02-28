import Image from 'next/image';

export default function BrowserMockup() {
  return (
    <div className="relative">
      {/* Shadow / glow */}
      <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl blur-2xl" />

      {/* Browser frame */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 flex items-center gap-1.5 bg-white rounded-md px-3 py-1 border border-gray-200 mx-4">
            <svg className="w-2.5 h-2.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-[9px] text-gray-400">circlepicks.app</span>
          </div>
        </div>

        {/* Screenshot */}
        <Image
          src="/assets/app-screenshot.png"
          alt="Circle Picks web app"
          width={1200}
          height={800}
          className="w-full h-auto block"
          priority
        />
      </div>
    </div>
  );
}
