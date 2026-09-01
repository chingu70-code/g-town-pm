'use client';
import { useEffect, useState } from 'react';
import { syncAllFromCloud } from '../lib/syncService';
import { Cloud, CloudOff } from 'lucide-react';

export default function CloudSyncProvider({ children }: { children: React.ReactNode }) {
  const [syncing, setSyncing] = useState(true);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    syncAllFromCloud().then((success) => {
      setSynced(success);
      setSyncing(false);
    });
  }, []);

  return (
    <>
      {/* 화면 우측 하단 동기화 상태 인디케이터 */}
      <div className="fixed bottom-4 right-4 z-[9999] bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 text-[10px] font-medium border border-slate-700">
        {syncing ? (
          <><div className="w-2 h-2 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin"></div> 동기화 중...</>
        ) : synced ? (
          <><Cloud className="w-3 h-3 text-emerald-400" /> 클라우드 연동됨</>
        ) : (
          <><CloudOff className="w-3 h-3 text-slate-400" /> 오프라인 모드</>
        )}
      </div>
      {children}
    </>
  );
}
