declare global {
  interface Window {
    __ZAPBOLT_CONFIG__?: {
      projectId: string;
    };
    Zapbolt?: {
      init: (config: {
        projectId: string;
        position?: 'bottom-right' | 'bottom-left';
        primaryColor?: string;
      }) => void;
    };
  }
}

export {};
