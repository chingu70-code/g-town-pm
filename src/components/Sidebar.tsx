"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calculator, CalendarDays, Users, Building2, ChevronRight, BarChart3, Download, Upload, Edit3 } from 'lucide-react';
import React, { useRef, useState, useEffect } from 'react';
import { saveToCloud } from '@/lib/syncService';

export default function Sidebar() {
  const pathname = usePathname();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 커스텀 텍스트 상태 관리
  const [projectName, setProjectName] = useState("G-TOWN PM");
  const [managerName, setManagerName] = useState("이정원 부장");
  const [siteName, setSiteName] = useState("과천 G타운 현장");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const p = localStorage.getItem('pm_projectName');
    if (p) setProjectName(p);
    const m = localStorage.getItem('pm_managerName');
    if (m) setManagerName(m);
    const s = localStorage.getItem('pm_siteName');
    if (s) setSiteName(s);
  }, []);

  const handleEdit = (type: 'project' | 'manager' | 'site', currentValue: string) => {
    const newValue = prompt("새로운 이름을 입력하세요:", currentValue);
    if (newValue !== null && newValue.trim() !== "") {
      let payload = { projectName, managerName, siteName };
      
      if (type === 'project') {
        setProjectName(newValue);
        localStorage.setItem('pm_projectName', newValue);
        payload.projectName = newValue;
      } else if (type === 'manager') {
        setManagerName(newValue);
        localStorage.setItem('pm_managerName', newValue);
        payload.managerName = newValue;
      } else if (type === 'site') {
        setSiteName(newValue);
        localStorage.setItem('pm_siteName', newValue);
        payload.siteName = newValue;
      }
      
      saveToCloud('project_info', 'gtown_main', payload);
    }
  };

  const navItems = [
    { name: '종합 대시보드', href: '/', icon: LayoutDashboard },
    { name: '직접공사비 내역', href: '/direct-cost', icon: Calculator },
    { name: '마스터 스케줄', href: '/schedule', icon: CalendarDays },
    { name: '투입 계획서', href: '/resources', icon: Users },
    { name: '통계 리포트', href: '/analytics', icon: BarChart3 },
  ];

  const handleExport = () => {
    const data = {
      costItems: localStorage.getItem('gTownCostItems'),
      resources: localStorage.getItem('gTownResources'),
      projectName: localStorage.getItem('pm_projectName'),
      managerName: localStorage.getItem('pm_managerName'),
      siteName: localStorage.getItem('pm_siteName')
    };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gtown_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.costItems) localStorage.setItem('gTownCostItems', data.costItems);
        if (data.resources) localStorage.setItem('gTownResources', data.resources);
        if (data.projectName) localStorage.setItem('pm_projectName', data.projectName);
        if (data.managerName) localStorage.setItem('pm_managerName', data.managerName);
        if (data.siteName) localStorage.setItem('pm_siteName', data.siteName);
        alert('데이터 복원이 완료되었습니다. 페이지를 새로고침합니다.');
        window.location.reload();
      } catch (err) {
        alert('잘못된 백업 파일입니다.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (!isMounted) return null;

  return (
    <aside className="fixed top-0 left-0 w-64 h-full bg-slate-900 text-slate-300 flex flex-col shadow-2xl z-50">
      {/* 로고 영역 (클릭하여 수정) */}
      <div className="h-16 flex items-center px-6 bg-slate-950 border-b border-slate-800 cursor-pointer group" onClick={() => handleEdit('project', projectName)} title="클릭하여 프로젝트 이름 변경">
        <Building2 className="w-6 h-6 text-indigo-500 mr-3 flex-shrink-0" />
        <span className="text-lg font-bold text-white tracking-tight truncate w-40 group-hover:text-indigo-300 transition-colors">{projectName}</span>
        <Edit3 className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 text-indigo-400 transition-opacity" />
      </div>

      {/* 네비게이션 메뉴 */}
      <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
          Management
        </div>
        
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center">
                <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-indigo-200' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                <span className="font-medium text-sm">{item.name}</span>
              </div>
              {isActive && (
                <ChevronRight className="w-4 h-4 opacity-50" />
              )}
            </Link>
          );
        })}
      </div>

      {/* 하단 데이터 백업/복원 영역 */}
      <div className="px-4 pb-4">
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 flex gap-2">
          <button 
            onClick={handleExport}
            className="flex-1 flex flex-col items-center justify-center py-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-indigo-300 transition-colors"
            title="현재 작성한 데이터 다운로드 (백업)"
          >
            <Download className="w-4 h-4 mb-1" />
            <span className="text-[10px] font-medium">데이터 내보내기</span>
          </button>
          
          <div className="w-px bg-slate-700 my-1"></div>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex flex-col items-center justify-center py-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-emerald-300 transition-colors"
            title="저장해둔 데이터 파일 불러오기"
          >
            <Upload className="w-4 h-4 mb-1" />
            <span className="text-[10px] font-medium">데이터 가져오기</span>
          </button>
          <input 
            type="file" 
            accept=".json" 
            ref={fileInputRef} 
            onChange={handleImport} 
            className="hidden" 
          />
        </div>
      </div>

      {/* 하단 유저 프로필 또는 정보 영역 (클릭하여 수정) */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center px-2 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-inner flex-shrink-0">
            {managerName.charAt(0)}
          </div>
          <div className="ml-3 overflow-hidden flex-1">
            <p 
              className="text-xs font-medium text-white truncate hover:text-indigo-300 transition-colors cursor-pointer group flex items-center justify-between"
              onClick={() => handleEdit('site', siteName)}
              title="현장명 변경"
            >
              {siteName} <Edit3 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100" />
            </p>
            <p 
              className="text-[10px] text-slate-400 truncate hover:text-indigo-300 transition-colors cursor-pointer group flex items-center justify-between mt-0.5"
              onClick={() => handleEdit('manager', managerName)}
              title="담당자 변경"
            >
              {managerName} <Edit3 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100" />
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
