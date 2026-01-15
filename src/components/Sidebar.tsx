'use client';

import { Avatar } from './Avatar';

interface Suggestion {
  id: string;
  userName: string;
  displayName: string;
  avatarUrl: string;
  followedBy: string;
}

const mockSuggestions: Suggestion[] = [
  {
    id: '1',
    userName: 'mayara.sampaio',
    displayName: 'Mayara Sampaio',
    avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop',
    followedBy: 'yngsampaio',
  },
  {
    id: '2',
    userName: 'vitor.henrique',
    displayName: 'Vitor Henrique',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
    followedBy: 'handzlx + 1m',
  },
  {
    id: '3',
    userName: 'mel',
    displayName: 'Mel',
    avatarUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop',
    followedBy: 'sassa.frl + 4 m',
  },
  {
    id: '4',
    userName: 'iael.leite',
    displayName: 'Iael Leite',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop',
    followedBy: 'lucasvianaiag',
  },
  {
    id: '5',
    userName: 'barbara.o',
    displayName: 'BÁRBARA O',
    avatarUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop',
    followedBy: 'marianavadasz',
  },
];

export function Sidebar() {
  return (
    <div className="hidden lg:block w-[320px] fixed right-0 top-20 pr-8">
      <div className="space-y-4">
        {/* Current User */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
              alt="martinzrenan"
              size="md"
            />
            <div>
              <p className="text-sm font-semibold text-text-primary">
                martinzrenan
              </p>
              <p className="text-xs text-text-secondary">Renan Martins</p>
            </div>
          </div>
          <button className="text-xs font-semibold text-accent hover:text-text-primary">
            Switch
          </button>
        </div>

        {/* Suggestions */}
        <div className="pt-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-text-secondary">
              Suggested for you
            </p>
            <button className="text-xs font-semibold text-text-primary hover:text-text-secondary">
              See All
            </button>
          </div>

          <div className="space-y-3">
            {mockSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={suggestion.avatarUrl}
                    alt={suggestion.userName}
                    size="sm"
                  />
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      {suggestion.userName}
                    </p>
                    <p className="text-xs text-text-secondary">
                      Followed by {suggestion.followedBy}
                    </p>
                  </div>
                </div>
                <button className="text-xs font-semibold text-accent hover:text-text-primary">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8">
          <div className="text-xs text-text-secondary space-y-2">
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              <a href="#" className="hover:underline">About</a>
              <span>·</span>
              <a href="#" className="hover:underline">Help</a>
              <span>·</span>
              <a href="#" className="hover:underline">Press</a>
              <span>·</span>
              <a href="#" className="hover:underline">API</a>
              <span>·</span>
              <a href="#" className="hover:underline">Jobs</a>
              <span>·</span>
              <a href="#" className="hover:underline">Privacy</a>
              <span>·</span>
              <a href="#" className="hover:underline">Terms</a>
            </div>
            <p className="text-text-secondary">
              © 2026 FRIENDS PLACES FROM META
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
