'use client';

import dynamic from 'next/dynamic';

// 挑戦の種はブラウザで決める。サーバーで描くと種が食い違うので、ブラウザでだけ描く
export const GameLoader = dynamic(() => import('./game').then((m) => m.Game), { ssr: false });
