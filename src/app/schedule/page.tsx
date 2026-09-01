"use client";

import React, { useState, useEffect } from 'react';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import { Calendar, LayoutDashboard, Save } from 'lucide-react';
import Link from 'next/link';
import { saveToCloud } from '@/lib/syncService';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setIsMounted(true);
    
    // 비용 페이지(내역 편집기)에서 저장한 데이터를 불러와 간트 차트에 동기화
    const savedCost = localStorage.getItem('gTownCostItems');
    if (savedCost) {
      const items = JSON.parse(savedCost);
      
      const headerTask: Task = {
        start: new Date(2026, 8, 1), end: new Date(2026, 8, 30),
        name: '📁 [1단계] 가설 및 사전 준비', id: 'Project_1', type: 'task', progress: 100, isDisabled: false, styles: { progressColor: '#94a3b8', progressSelectedColor: '#64748b' }
      };
      
      const projectTask: Task = {
        start: new Date(2026, 9, 1), end: new Date(2027, 4, 31),
        name: '🛠️ [2단계] 직접비 공사 내역 (자동 연동)', id: 'Project_2', type: 'project', progress: 45, hideChildren: false, isDisabled: false, styles: { progressColor: '#3b82f6', progressSelectedColor: '#2563eb' }
      };

      const dynamicTasks: Task[] = items.map((item: any, i: number) => {
        // 임시 날짜 배분 로직 (월 2개씩 순차 배분)
        const monthOffset = Math.floor(i / 2);
        const dayOffset = (i % 2) * 15; // 1일 or 16일
        
        let year = 2026;
        let month = 9 + monthOffset;
        if (month > 11) {
          year = 2027;
          month = month - 12;
        }

        const sDate = new Date(year, month, dayOffset + 1);
        const eDate = new Date(year, month, dayOffset + 14);
        
        return {
          start: sDate, end: eDate,
          name: ` └ 2-${i + 1}. ${item.name}`, id: `T_${item.id}`, project: 'Project_2', type: 'task', progress: 0, isDisabled: false,
          styles: { progressColor: '#f59e0b', progressSelectedColor: '#d97706' }
        };
      });

      const footerTask: Task = {
        start: new Date(2027, 5, 1), end: new Date(2027, 5, 30),
        name: '🧹 [3단계] 최종 마감 및 준공 청소', id: 'Project_3', type: 'task', progress: 0, isDisabled: false,
        styles: { progressColor: '#10b981', progressSelectedColor: '#059669' }
      };

      const defaultTasks = [headerTask, projectTask, ...dynamicTasks, footerTask];

      // 저장된 스케줄이 있다면 병합(Merge)
      const savedSchedule = localStorage.getItem('gTownSchedule');
      if (savedSchedule) {
        try {
          const parsedSchedule = JSON.parse(savedSchedule).map((t: any) => ({
            ...t,
            start: new Date(t.start),
            end: new Date(t.end)
          }));
          const mergedTasks = defaultTasks.map(dt => {
            const found = parsedSchedule.find((pt: Task) => pt.id === dt.id);
            return found ? found : dt;
          });
          setTasks(mergedTasks);
        } catch (e) {
          setTasks(defaultTasks);
        }
      } else {
        setTasks(defaultTasks);
      }
    }
  }, []);

  const [showArrows, setShowArrows] = useState(true);

  // 화살표 끄기/켜기에 따라 태스크 배열 동적 변환
  const displayTasks = showArrows 
    ? tasks 
    : tasks.map(t => ({ ...t, dependencies: [] }));

  const handleTaskChange = (task: Task) => {
    const newTasks = tasks.map(t => (t.id === task.id ? task : t));
    setTasks(newTasks);
    localStorage.setItem('gTownSchedule', JSON.stringify(newTasks));
  };

  const handleProgressChange = (task: Task) => {
    const newTasks = tasks.map(t => (t.id === task.id ? task : t));
    setTasks(newTasks);
    localStorage.setItem('gTownSchedule', JSON.stringify(newTasks));
  };

  const handleSaveToCloud = async () => {
    await saveToCloud('project_info', 'gtown_schedule', tasks);
    alert('마스터 스케줄 일정이 클라우드에 안전하게 저장되었습니다!');
  };

  // 커스텀 툴팁
  const CustomTooltip = ({ task }: { task: Task }) => {
    return (
      <div className="bg-white p-3 shadow-lg rounded border border-gray-200 text-xs z-50">
        <strong className="block mb-1 text-blue-700">{task.name}</strong>
        <p>시작: {task.start.toLocaleDateString()}</p>
        <p>종료: {task.end.toLocaleDateString()}</p>
        <p>진행률: {task.progress}%</p>
      </div>
    );
  };

  // 좌측 리스트 헤더 커스텀
  const CustomTaskListHeader = ({ headerHeight, fontFamily, fontSize }: any) => {
    return (
      <div style={{ height: headerHeight, fontFamily, fontSize }} className="flex items-center border-b border-gray-200 px-2 bg-gray-100 font-bold text-gray-700 text-[11px]">
        공정(작업)명
      </div>
    );
  };

  // 좌측 리스트 테이블 커스텀
  const CustomTaskListTable = ({ rowHeight, rowWidth, tasks, fontFamily, fontSize }: any) => {
    return (
      <div style={{ fontFamily, fontSize }} className="bg-white text-[11px]">
        {tasks.map((task: Task, i: number) => (
          <div 
            key={i} 
            style={{ height: rowHeight }} 
            className={`flex items-center px-2 border-b border-gray-100 overflow-hidden text-ellipsis whitespace-nowrap ${task.type === 'project' ? 'font-bold text-blue-800 bg-blue-50/30' : 'text-gray-600'}`}
          >
            {task.name}
          </div>
        ))}
      </div>
    );
  };

  if (!isMounted) return null;

  return (
    <div className="animate-in fade-in duration-500 h-full flex flex-col">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutDashboard className="text-blue-600 w-6 h-6" />
            과천 G타운 종합 공정표
          </h1>
          <p className="text-xs text-gray-500 mt-2">전체 공사 기간(12개월)의 흐름을 한눈에 파악하는 대시보드입니다.</p>
        </div>
        
        {/* 빠른 네비게이션 버튼들 */}
        <div className="flex gap-2 text-sm">
          <button 
            onClick={handleSaveToCloud}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 font-bold rounded border border-blue-200 hover:bg-blue-100 transition"
          >
            <Save className="w-4 h-4" />
            클라우드 저장 (동기화)
          </button>
          <Link href="/" className="px-3 py-1.5 bg-emerald-50 text-emerald-700 font-medium rounded border border-emerald-200 hover:bg-emerald-100 transition">
            비용/직접공사 상세
          </Link>
          <Link href="/resources" className="px-3 py-1.5 bg-indigo-50 text-indigo-700 font-medium rounded border border-indigo-200 hover:bg-indigo-100 transition">
            투입 계획 보기
          </Link>
        </div>
      </header>

      {/* 간트 차트 영역 (인쇄 최적화) */}
      <section className="bg-gray-50/50 p-2 sm:p-4 rounded-xl border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="text-blue-500 w-5 h-5" />
            <h2 className="text-lg font-semibold text-gray-800">마스터 스케줄</h2>
            
            {/* 화살표 토글 스위치 (UI에서 직접 끌 수 있게 제공) */}
            <label className="ml-4 flex items-center gap-2 cursor-pointer bg-white px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 transition shadow-sm">
              <input 
                type="checkbox" 
                checked={showArrows} 
                onChange={() => setShowArrows(!showArrows)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-xs font-medium text-gray-700">🔗 연결선(화살표) 보기</span>
            </label>
          </div>
          <p className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded font-medium border border-indigo-100">🖨️ A3 가로 인쇄 최적화 완료</p>
        </div>
        
        {/* 노트북 등에서도 가로 스크롤이 생기지 않고 12개월이 한 눈에 들어오는 최적의 너비(1150px) 설정 */}
        {/* 노트북 등에서도 가로 스크롤이 생기지 않고 12개월이 한 눈에 들어오는 최적의 너비(1150px) 설정 */}
        <div className="overflow-x-auto w-full pb-4">
          <div className="mx-auto bg-white border border-gray-300 shadow-md relative w-full min-w-[1510px] overflow-hidden print:[zoom:0.85] print:shadow-none print:border-gray-200 rounded-lg">
            {/* 커스텀 연도 헤더 */}
            <div className="absolute top-0 left-[190px] w-[550px] h-[25px] bg-indigo-50 border-b border-r border-gray-300 flex items-center justify-center text-[11px] font-bold text-indigo-900 z-10">
              2026년
            </div>
            <div className="absolute top-0 left-[740px] w-[770px] h-[25px] bg-emerald-50 border-b border-gray-300 flex items-center justify-center text-[11px] font-bold text-emerald-900 z-10">
              2027년
            </div>
            <Gantt 
              tasks={displayTasks} 
              viewMode={ViewMode.Month}
              locale="ko"
              TooltipContent={CustomTooltip}
              TaskListHeader={CustomTaskListHeader}
              TaskListTable={CustomTaskListTable}
              onDateChange={handleTaskChange}
              onProgressChange={handleTaskChange}
              listCellWidth="190px" 
              columnWidth={110}      
              fontSize="12"         
              rowHeight={40}        
            />
          </div>
        </div>
      </section>
    </div>
  );
}
