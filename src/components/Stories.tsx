import { Avatar } from './Avatar';

interface Story {
  id: string;
  userName: string;
  avatarUrl: string;
}

const mockStories: Story[] = [
  {
    id: '1',
    userName: 'janathoon',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
  },
  {
    id: '2',
    userName: 'traveling',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
  },
  {
    id: '3',
    userName: 'oraoraoras',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
  },
  {
    id: '4',
    userName: 'carlos_m',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
  },
  {
    id: '5',
    userName: 'yngsalmi',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
  },
  {
    id: '6',
    userName: 'isabelbon',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
  },
];

export function Stories() {
  return (
    <div className="bg-white border border-divider rounded-lg px-4 py-4 overflow-hidden">
      <div className="flex gap-4 overflow-x-auto no-scrollbar">
        {mockStories.map((story) => (
          <button
            key={story.id}
            className="flex flex-col items-center gap-1 flex-shrink-0"
          >
            <div className="p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500 rounded-full">
              <div className="p-[2px] bg-white rounded-full">
                <Avatar
                  src={story.avatarUrl}
                  alt={story.userName}
                  size="md"
                />
              </div>
            </div>
            <span className="text-xs text-dark-grey truncate max-w-[64px]">
              {story.userName}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
