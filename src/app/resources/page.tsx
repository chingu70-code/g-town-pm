"use client";

import React, { useState } from 'react';
import { Users, Truck, Package } from 'lucide-react';

export default function ResourcesPage() {
  // 전체 공사기간 12개월 기준 (2026.08 ~ 2027.07) 월별 타임라인
  const months = ["26.08", "26.09", "26.10", "26.11", "26.12", "27.01", "27.02", "27.03", "27.04", "27.05", "27.06", "27.07"];

  // 투입 자원 상태 관리 (직접 수정 가능)
  const [resources, setResources] = useState([
    { type: 'manpower', name: '현장 소장 (관리)', icon: <Users className="w-4 h-4 mr-2"/>, data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
    { type: 'manpower', name: '외장판넬 전공', icon: <Users className="w-4 h-4 mr-2"/>, data: [0, 2, 5, 8, 10, 10, 8, 4, 4, 2, 2, 0] },
    { type: 'equipment', name: '크레인 (25T)', icon: <Truck className="w-4 h-4 mr-2"/>, data: [0, 0, 1, 2, 2, 2, 1, 1, 0, 0, 0, 0] },
    { type: 'equipment', name: '고소작업차 (스카이)', icon: <Truck className="w-4 h-4 mr-2"/>, data: [0, 0, 2, 4, 4, 4, 2, 2, 1, 1, 0, 0] },
    { type: 'material', name: '3D 외장판넬 (m2)', icon: <Package className="w-4 h-4 mr-2"/>, data: [0, 100, 200, 200, 150, 100, 80, 50, 0, 0, 0, 0] },
    { type: 'material', name: '단열재 (m2)', icon: <Package className="w-4 h-4 mr-2"/>, data: [0, 50, 100, 100, 50, 50, 0, 0, 0, 0, 0, 0] },
  ]);

  // 사용자가 값을 변경했을 때 상태를 업데이트하는 함수
  const handleInputChange = (resourceName: string, monthIndex: number, newValue: string) => {
    const parsedValue = newValue === '' ? 0 : parseInt(newValue, 10);
    setResources(prev => prev.map(res => {
      if (res.name === resourceName) {
        const newData = [...res.data];
        newData[monthIndex] = isNaN(parsedValue) ? 0 : parsedValue;
        return { ...res, data: newData };
      }
      return res;
    }));
  };

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="text-indigo-500" />
          장비 / 자재 / 인원 투입 계획서
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          공정표(간트 차트)의 12개월 일정에 맞춰 월별 필요 투입량을 관리합니다.<br/>
          <span className="text-indigo-600 font-medium">💡 표의 숫자를 클릭하여 직접 기입(수정)하시면 우측 총 합계가 자동 계산됩니다.</span>
        </p>
      </header>
      
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              {/* 년도 구분 상단 헤더 */}
              <tr className="bg-indigo-100/50 text-indigo-900 text-sm">
                <th className="p-2 border-b border-r"></th>
                <th colSpan={5} className="p-2 border-b border-r text-center font-bold">2026년</th>
                <th colSpan={7} className="p-2 border-b border-r text-center font-bold">2027년</th>
                <th className="p-2 border-b"></th>
              </tr>
              <tr className="bg-indigo-50 text-indigo-900 text-xs">
                <th className="p-3 border-b border-r font-semibold w-[180px]">구분 / 리소스명</th>
                {months.map(m => (
                  <th key={m} className="p-3 border-b font-medium text-center">{m.split('.')[1]}월</th>
                ))}
                <th className="p-3 border-b font-semibold text-center bg-indigo-100 rounded-tr-lg">총 합계</th>
              </tr>
            </thead>
            <tbody>
              {/* 인력 섹션 */}
              <tr><td colSpan={14} className="p-2 bg-gray-50 font-bold text-gray-700 text-sm">👷 인원 투입 (명/월)</td></tr>
              {resources.filter(r => r.type === 'manpower').map((res, i) => (
                <tr key={i} className="border-b hover:bg-gray-50/50">
                  <td className="p-3 flex items-center text-gray-700 font-medium border-r bg-white">{res.icon} {res.name}</td>
                  {res.data.map((val, idx) => (
                    <td key={idx} className="p-0 border-r">
                      <input 
                        type="number" 
                        value={val || ''} 
                        onChange={(e) => handleInputChange(res.name, idx, e.target.value)}
                        className="w-full h-full p-3 bg-transparent text-center text-gray-700 outline-none hover:bg-indigo-50 focus:bg-white focus:ring-inset focus:ring-2 focus:ring-indigo-500 transition-colors"
                        min="0"
                      />
                    </td>
                  ))}
                  <td className="p-3 text-center font-bold text-indigo-700 bg-indigo-50/30">{res.data.reduce((a,b)=>a+b,0)}</td>
                </tr>
              ))}

              {/* 장비 섹션 */}
              <tr><td colSpan={14} className="p-2 bg-gray-50 font-bold text-gray-700 text-sm mt-4 border-t">🚜 장비 투입 (대/월)</td></tr>
              {resources.filter(r => r.type === 'equipment').map((res, i) => (
                <tr key={i} className="border-b hover:bg-gray-50/50">
                  <td className="p-3 flex items-center text-gray-700 font-medium border-r bg-white">{res.icon} {res.name}</td>
                  {res.data.map((val, idx) => (
                    <td key={idx} className="p-0 border-r">
                      <input 
                        type="number" 
                        value={val || ''} 
                        onChange={(e) => handleInputChange(res.name, idx, e.target.value)}
                        className="w-full h-full p-3 bg-transparent text-center text-gray-700 outline-none hover:bg-indigo-50 focus:bg-white focus:ring-inset focus:ring-2 focus:ring-indigo-500 transition-colors"
                        min="0"
                      />
                    </td>
                  ))}
                  <td className="p-3 text-center font-bold text-indigo-700 bg-indigo-50/30">{res.data.reduce((a,b)=>a+b,0)}</td>
                </tr>
              ))}

              {/* 자재 섹션 */}
              <tr><td colSpan={14} className="p-2 bg-gray-50 font-bold text-gray-700 text-sm mt-4 border-t">📦 자재 투입 (물량/월)</td></tr>
              {resources.filter(r => r.type === 'material').map((res, i) => (
                <tr key={i} className="border-b hover:bg-gray-50/50">
                  <td className="p-3 flex items-center text-gray-700 font-medium border-r bg-white">{res.icon} {res.name}</td>
                  {res.data.map((val, idx) => (
                    <td key={idx} className="p-0 border-r">
                      <input 
                        type="number" 
                        value={val || ''} 
                        onChange={(e) => handleInputChange(res.name, idx, e.target.value)}
                        className="w-full h-full p-3 bg-transparent text-center text-gray-700 outline-none hover:bg-indigo-50 focus:bg-white focus:ring-inset focus:ring-2 focus:ring-indigo-500 transition-colors"
                        min="0"
                      />
                    </td>
                  ))}
                  <td className="p-3 text-center font-bold text-indigo-700 bg-indigo-50/30">{res.data.reduce((a,b)=>a+b,0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
