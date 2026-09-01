"use client";

import React, { useState, useEffect } from 'react';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import { Calendar, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 전체 공사기간 10개월 기준 (26.09.01 ~ 27.06.30)
  const [tasks, setTasks] = useState<Task[]>([
    {
      start: new Date(2026, 8, 1),
      end: new Date(2026, 8, 30),
      name: '1. 가설 및 사전 준비',
      id: 'Project_1',
      type: 'task',
      progress: 100,
      isDisabled: false,
      styles: { progressColor: '#94a3b8', progressSelectedColor: '#64748b' }
    },
    {
      start: new Date(2026, 9, 1),
      end: new Date(2027, 4, 31), // 5월(27.05)까지
      name: '2. [직접비] 비정형 외장판넬공사',
      id: 'Project_2',
      type: 'project',
      progress: 45,
      hideChildren: false,
      isDisabled: false,
      styles: { progressColor: '#3b82f6', progressSelectedColor: '#2563eb' }
    },
    { start: new Date(2026, 9, 1), end: new Date(2026, 9, 15), name: '1. 비정형/파라펫 구간 구조틀공사', id: 'T2_1', project: 'Project_2', type: 'task', progress: 100, isDisabled: false, styles: { progressColor: '#f59e0b', progressSelectedColor: '#d97706' }},
    { start: new Date(2026, 9, 16), end: new Date(2026, 9, 30), name: '2. NOSING구간 구조틀 공사', id: 'T2_2', project: 'Project_2', type: 'task', progress: 80, dependencies: ['T2_1'], isDisabled: false, styles: { progressColor: '#f59e0b', progressSelectedColor: '#d97706' }},
    { start: new Date(2026, 10, 1), end: new Date(2026, 10, 15), name: '3. 3D패널 공사', id: 'T2_3', project: 'Project_2', type: 'task', progress: 50, dependencies: ['T2_2'], isDisabled: false, styles: { progressColor: '#f59e0b', progressSelectedColor: '#d97706' }},
    { start: new Date(2026, 10, 16), end: new Date(2026, 10, 30), name: '4. NOSING PANEL', id: 'T2_4', project: 'Project_2', type: 'task', progress: 20, dependencies: ['T2_3'], isDisabled: false, styles: { progressColor: '#f59e0b', progressSelectedColor: '#d97706' }},
    { start: new Date(2026, 11, 1), end: new Date(2026, 11, 15), name: '5. 파라펫 두겁판넬공사', id: 'T2_5', project: 'Project_2', type: 'task', progress: 0, dependencies: ['T2_4'], isDisabled: false, styles: { progressColor: '#f59e0b', progressSelectedColor: '#d97706' }},
    { start: new Date(2026, 11, 16), end: new Date(2026, 11, 31), name: '6. 파라펫 내측벽체판넬 공사', id: 'T2_6', project: 'Project_2', type: 'task', progress: 0, dependencies: ['T2_5'], isDisabled: false, styles: { progressColor: '#f59e0b', progressSelectedColor: '#d97706' }},
    { start: new Date(2027, 0, 1), end: new Date(2027, 0, 15), name: '7. SOFFIT FASICA PANEL', id: 'T2_7', project: 'Project_2', type: 'task', progress: 0, dependencies: ['T2_6'], isDisabled: false, styles: { progressColor: '#f59e0b', progressSelectedColor: '#d97706' }},
    { start: new Date(2027, 0, 16), end: new Date(2027, 0, 31), name: '8. SOFFIT PANEL', id: 'T2_8', project: 'Project_2', type: 'task', progress: 0, dependencies: ['T2_7'], isDisabled: false, styles: { progressColor: '#f59e0b', progressSelectedColor: '#d97706' }},
    { start: new Date(2027, 1, 1), end: new Date(2027, 1, 15), name: '9. 채광창 내부 곡면판넬공사', id: 'T2_9', project: 'Project_2', type: 'task', progress: 0, dependencies: ['T2_8'], isDisabled: false, styles: { progressColor: '#f59e0b', progressSelectedColor: '#d97706' }},
    { start: new Date(2027, 1, 16), end: new Date(2027, 2, 31), name: '10. 단열공사', id: 'T2_10', project: 'Project_2', type: 'task', progress: 0, dependencies: ['T2_9'], isDisabled: false, styles: { progressColor: '#f59e0b', progressSelectedColor: '#d97706' }},
    { start: new Date(2027, 3, 1), end: new Date(2027, 3, 30), name: '11. AL 복합패널(비선형)_천장', id: 'T2_11', project: 'Project_2', type: 'task', progress: 0, dependencies: ['T2_10'], isDisabled: false, styles: { progressColor: '#f59e0b', progressSelectedColor: '#d97706' }},
    { start: new Date(2027, 4, 1), end: new Date(2027, 4, 15), name: '11. AL 복합패널(비선형)_수벽', id: 'T2_12', project: 'Project_2', type: 'task', progress: 0, dependencies: ['T2_11'], isDisabled: false, styles: { progressColor: '#f59e0b', progressSelectedColor: '#d97706' }},
    {
      start: new Date(2027, 5, 1), 
      end: new Date(2027, 5, 30),  // 6월 말(기존 원복)
      name: '3. 최종 마감 및 준공 청소',
      id: 'Project_3',
      type: 'task',
      progress: 0,
      dependencies: ['T2_12'],
      isDisabled: false,
      styles: { progressColor: '#10b981', progressSelectedColor: '#059669' }
    }
  ]);

  const handleTaskChange = (task: Task) => {
    setTasks(tasks.map(t => (t.id === task.id ? task : t)));
  };

  const CustomTooltip = ({ task }: { task: Task }) => {
    return (
      <div className="bg-white p-2 shadow-lg border rounded text-xs z-50">
        <b className="block mb-1 text-gray-800">{task.name}</b>
        <span className="text-gray-600">
          {task.start.getMonth() + 1}월 {task.start.getDate()}일 ~ {task.end.getMonth() + 1}월 {task.end.getDate()}일
        </span>
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
    <div className="animate-in fade-in duration-500">
      <header className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutDashboard className="text-blue-600 w-6 h-6" />
            과천 G타운 종합 공정표
          </h1>
          <p className="text-xs text-gray-500 mt-2">전체 공사 기간(10개월)의 흐름을 한눈에 파악하는 대시보드입니다.</p>
        </div>
        
        {/* 빠른 네비게이션 버튼들 */}
        <div className="flex gap-2 text-sm">
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
          </div>
          <p className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded font-medium border border-indigo-100">🖨️ A3 가로 인쇄 최적화 완료</p>
        </div>
        
        {/* 노트북 등에서도 가로 스크롤이 생기지 않고 12개월이 한 눈에 들어오는 최적의 너비(1150px) 설정 */}
        <div className="overflow-x-auto w-full pb-4">
          <div className="mx-auto bg-white border border-gray-300 shadow-md relative w-[1150px] min-w-[1150px] overflow-hidden print:[zoom:0.85] print:shadow-none print:border-gray-200">
            {/* 커스텀 연도 헤더 */}
            <div className="absolute top-0 left-[190px] w-[400px] h-[25px] bg-indigo-50 border-b border-r border-gray-300 flex items-center justify-center text-[11px] font-bold text-indigo-900 z-10">
              2026년
            </div>
            <div className="absolute top-0 left-[590px] w-[560px] h-[25px] bg-emerald-50 border-b border-gray-300 flex items-center justify-center text-[11px] font-bold text-emerald-900 z-10">
              2027년
            </div>
            <Gantt 
              tasks={tasks} 
              viewMode={ViewMode.Month}
              locale="ko"
              TooltipContent={CustomTooltip}
              TaskListHeader={CustomTaskListHeader}
              TaskListTable={CustomTaskListTable}
              onDateChange={handleTaskChange}
              onProgressChange={handleTaskChange}
              listCellWidth="190px" 
              columnWidth={80}      
              fontSize="11"         
              rowHeight={34}        
            />
          </div>
        </div>
      </section>
    </div>
  );
}
