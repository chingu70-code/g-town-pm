"use client";

import React, { useState, useEffect } from 'react';
import { Users, Truck, Package, Save, Plus, Trash2, RotateCcw, UserCircle, HardHat } from 'lucide-react';
import { saveToCloud } from '@/lib/syncService';

const baseMonths = ["26.08", "26.09", "26.10", "26.11", "26.12", "27.01", "27.02", "27.03", "27.04", "27.05", "27.06", "27.07"];

const INITIAL_RESOURCES = [
  // 관리 항목 (36칸 모두 1)
  { id: 101, category: 'management', name: '현장소장', data: Array(36).fill(1) },
  { id: 102, category: 'management', name: '안전관리', data: Array(36).fill(1) },
  { id: 103, category: 'management', name: '공무', data: Array(36).fill(1) },
  { id: 104, category: 'management', name: '현장기사', data: Array(36).fill(1) },
  
  // 직공 항목 (임의로 36칸 배분)
  { id: 201, category: 'labor', name: '하지틀', data: Array(36).fill(0).map((_,i) => i > 2 && i < 20 ? 5 : 0) },
  { id: 202, category: 'labor', name: '판넬공', data: Array(36).fill(0).map((_,i) => i > 5 && i < 25 ? 4 : 0) },
  
  // 장비 항목
  { id: 301, category: 'equipment', name: '크레인 (25T)', data: Array(36).fill(0).map((_,i) => i > 5 && i < 20 ? 1 : 0) },
  { id: 302, category: 'equipment', name: '고소작업차 (스카이)', data: Array(36).fill(0).map((_,i) => i > 5 && i < 25 ? 2 : 0) },
  
  // 자재 항목 (견적서 기준)
  { id: 401, category: 'material', name: '비주얼 목업 (Visual Mock-up)', data: [1, ...Array(35).fill(0)] },
  { id: 402, category: 'material', name: '비정형/파라펫 구간 구조틀공사 (m2)', data: [0,0,0, 50,50,0, 100,100,0, ...Array(27).fill(0)] },
  { id: 403, category: 'material', name: 'NOSING구간 구조틀 공사 (m2)', data: [0,0,0, 30,20,0, 50,50,0, ...Array(27).fill(0)] },
  { id: 404, category: 'material', name: '3D패널 공사 (m2)', data: [0,0,0, 0,0,0, 50,0,0, ...Array(27).fill(0)] },
  { id: 405, category: 'material', name: 'NOSING PANEL (m2)', data: Array(36).fill(0) },
  { id: 406, category: 'material', name: '파라펫 두겁판넬공사 (m2)', data: Array(36).fill(0) },
  { id: 407, category: 'material', name: '파라펫 내측벽체판넬 공사 (m2)', data: Array(36).fill(0) },
  { id: 408, category: 'material', name: 'SOFFIT FASICA PANEL (m)', data: Array(36).fill(0) },
  { id: 409, category: 'material', name: 'SOFFIT PANEL (m2)', data: Array(36).fill(0) },
  { id: 410, category: 'material', name: '채광창 내부 곡면판넬공사 (m2)', data: Array(36).fill(0) },
  { id: 411, category: 'material', name: '단열공사 (m2)', data: Array(36).fill(0) },
  { id: 412, category: 'material', name: 'AL 복합패널(비선형)_천장 (m2)', data: Array(36).fill(0) },
  { id: 413, category: 'material', name: 'AL 복합패널(비선형)_수벽 (m2)', data: Array(36).fill(0) },
];

export default function ResourcesPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [resources, setResources] = useState(INITIAL_RESOURCES);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('gTownResources');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // 마이그레이션 방어코드: 구버전(data 길이가 36이 아니거나 category 속성이 없는 경우)이면 초기화
        if (parsed.length > 0 && (parsed[0].data.length !== 36 || !parsed[0].category)) {
          console.warn("구버전 데이터 포맷 감지. 초기 템플릿으로 리셋합니다.");
          setResources(INITIAL_RESOURCES);
        } else {
          setResources(parsed);
        }
      } catch (e) {
        setResources(INITIAL_RESOURCES);
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('gTownResources', JSON.stringify(resources));
    }
  }, [resources, isMounted]);

  const handleReset = () => {
    if (window.confirm("지금까지 수정한 내역이 모두 삭제되고 초기 계획표로 복구됩니다. 진행하시겠습니까?")) {
      localStorage.removeItem('gTownResources');
      setResources(INITIAL_RESOURCES);
    }
  };

  const handleInputChange = (id: number, monthIndex: number, newValue: string) => {
    const parsedValue = newValue === '' ? 0 : parseInt(newValue, 10);
    setResources(prev => prev.map(res => {
      if (res.id === id) {
        const newData = [...res.data];
        newData[monthIndex] = isNaN(parsedValue) ? 0 : parsedValue;
        return { ...res, data: newData };
      }
      return res;
    }));
  };

  const handleNameChange = (id: number, newName: string) => {
    setResources(prev => prev.map(res => res.id === id ? { ...res, name: newName } : res));
  };

  const handleAddRow = (category: string) => {
    setResources(prev => [
      ...prev,
      { id: Date.now(), category, name: '새 항목', data: Array(36).fill(0) }
    ]);
  };

  const handleDeleteRow = (id: number) => {
    setResources(prev => prev.filter(res => res.id !== id));
  };

  // 섹션 렌더링용 헬퍼 함수
  const renderSection = (title: string, category: string, icon: React.ReactNode, bgColor: string, txtColor: string) => {
    const filtered = resources.filter(r => r.category === category);
    
    return (
      <>
        <tr>
          <td colSpan={39} className={`p-1.5 font-bold border-t border-b text-xs ${bgColor} ${txtColor} flex items-center gap-1 sticky left-0 z-10`}>
            {icon} {title}
          </td>
        </tr>
        {filtered.map((res) => (
          <tr key={res.id} className="border-b hover:bg-gray-50/50 group transition-colors">
            <td className="p-1 border-r bg-white w-[180px] sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] truncate text-xs">
              <input 
                type="text" 
                value={res.name}
                onChange={(e) => handleNameChange(res.id, e.target.value)}
                className="w-full font-medium p-1 border border-transparent hover:border-gray-300 focus:border-indigo-500 rounded outline-none text-xs bg-transparent focus:bg-white"
                placeholder="항목명"
              />
            </td>
            {res.data.map((val, idx) => (
              <td key={idx} className="p-0 border-r relative min-w-[24px] w-[26px]">
                <input 
                  type="number" 
                  value={val === 0 ? '' : val} 
                  onChange={(e) => handleInputChange(res.id, idx, e.target.value)}
                  className="w-full h-full p-0.5 absolute inset-0 text-center text-gray-700 outline-none hover:bg-indigo-50 focus:bg-white focus:ring-inset focus:ring-1 focus:ring-indigo-500 transition-colors text-[10px]"
                  min="0"
                />
              </td>
            ))}
            <td className="p-1 text-center font-bold text-indigo-700 bg-indigo-50/30 w-12 text-xs">
              {res.data.reduce((a,b)=>a+b,0).toLocaleString()}
            </td>
            <td className="p-1 text-center w-8 bg-white">
              <button 
                onClick={() => handleDeleteRow(res.id)}
                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition opacity-0 group-hover:opacity-100"
                title="항목 삭제"
              >
                <Trash2 className="w-3.5 h-3.5 mx-auto" />
              </button>
            </td>
          </tr>
        ))}
        {/* 그룹별 추가 버튼 행 */}
        <tr>
          <td colSpan={39} className="p-1 bg-white border-b border-gray-100 sticky left-0 z-10">
            <button 
              onClick={() => handleAddRow(category)}
              className="flex items-center gap-1 text-[10px] font-medium text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded transition"
            >
              <Plus className="w-3 h-3" /> 항목 추가
            </button>
          </td>
        </tr>
      </>
    );
  };

  if (!isMounted) return null;

  return (
    <div className="animate-in fade-in duration-500 pb-16">
      <header className="mb-4 flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="text-indigo-500" />
            장비 / 자재 / 인원 투입 계획서
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            공정표 일정에 맞춰 10일(초/중/하순) 단위로 투입량을 편집하세요.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset} className="flex items-center gap-1 text-xs text-gray-600 bg-white px-2 py-1.5 rounded border border-gray-200 hover:bg-gray-50 transition shadow-sm">
            <RotateCcw className="w-3.5 h-3.5" /> 초기화
          </button>
          <button 
            onClick={() => {
              saveToCloud('resources', 'gtown_main', resources);
              alert("클라우드 서버에 안전하게 저장되었습니다!");
            }}
            className="flex items-center gap-1 text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-1.5 rounded border border-indigo-200 shadow-sm transition-colors"
          >
            <Save className="w-3.5 h-3.5" /> 클라우드 저장
          </button>
        </div>
      </header>
      
      <section className="bg-white p-2 md:p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto relative">
          <table className="w-full text-left border-collapse min-w-[950px] text-xs">
            <thead>
              {/* 1단: 년도 */}
              <tr className="bg-indigo-100/50 text-indigo-900 text-[11px]">
                <th className="p-1 border-b border-r sticky left-0 z-20 bg-indigo-100/90 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"></th>
                <th colSpan={15} className="p-1 border-b border-r text-center font-bold tracking-wider">2026년</th>
                <th colSpan={21} className="p-1 border-b border-r text-center font-bold tracking-wider">2027년</th>
                <th className="p-1 border-b"></th>
                <th className="p-1 border-b"></th>
              </tr>
              {/* 2단: 월별 */}
              <tr className="bg-indigo-50/80 text-indigo-900 text-[10px]">
                <th className="p-1 border-b border-r sticky left-0 z-20 bg-indigo-50/90 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"></th>
                {baseMonths.map(m => (
                  <th key={m} colSpan={3} className="p-1 border-b border-r text-center font-medium border-l-2 border-indigo-200">
                    {parseInt(m.split('.')[1], 10)}월
                  </th>
                ))}
                <th className="p-1 border-b"></th>
                <th className="p-1 border-b"></th>
              </tr>
              {/* 3단: 10,20,30 */}
              <tr className="bg-indigo-50 text-indigo-900 text-[9px]">
                <th className="p-1.5 border-b border-r font-semibold sticky left-0 z-20 bg-indigo-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] text-center">리소스명</th>
                {Array(36).fill(0).map((_, idx) => {
                  const label = idx % 3 === 0 ? '10' : idx % 3 === 1 ? '20' : '30';
                  const isMonthStart = idx % 3 === 0;
                  return (
                    <th key={idx} className={`p-1 border-b font-medium text-center ${isMonthStart ? 'border-l-2 border-indigo-200' : 'border-r border-indigo-100'}`}>
                      {label}
                    </th>
                  );
                })}
                <th className="p-1.5 border-b font-semibold text-center bg-indigo-100 rounded-tr-lg">합계</th>
                <th className="p-1.5 border-b text-center">삭제</th>
              </tr>
            </thead>
            <tbody>
              {renderSection('관리 항목 (명/월)', 'management', <UserCircle className="w-4 h-4"/>, 'bg-gray-100', 'text-gray-800')}
              {renderSection('직공 항목 (명/월)', 'labor', <HardHat className="w-4 h-4"/>, 'bg-orange-50', 'text-orange-800')}
              {renderSection('장비 항목 (대/월)', 'equipment', <Truck className="w-4 h-4"/>, 'bg-blue-50', 'text-blue-800')}
              {renderSection('자재 항목 (물량/월)', 'material', <Package className="w-4 h-4"/>, 'bg-emerald-50', 'text-emerald-800')}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

