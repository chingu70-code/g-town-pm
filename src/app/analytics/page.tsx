"use client";

import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart 
} from 'recharts';
import { Activity, Users, Truck, Package, TrendingUp, BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    setIsMounted(true);
    const savedResources = localStorage.getItem('gTownResources');
    
    if (savedResources) {
      try {
        const resources = JSON.parse(savedResources);
        const months = ["26.08", "26.09", "26.10", "26.11", "26.12", "27.01", "27.02", "27.03", "27.04", "27.05", "27.06", "27.07"];
        
        // 월별 데이터 집계 (36칸 데이터를 12칸 월별로 합산)
        const aggregated = months.map((monthStr, mIndex) => {
          let manpower = 0;
          let equipment = 0;
          let material = 0;

          resources.forEach((res: any) => {
            const mSum = (res.data[mIndex * 3] || 0) + (res.data[mIndex * 3 + 1] || 0) + (res.data[mIndex * 3 + 2] || 0);
            
            if (res.category === 'management' || res.category === 'labor') manpower += mSum;
            else if (res.category === 'equipment') equipment += mSum;
            else if (res.category === 'material') material += mSum;
          });

          return {
            month: monthStr,
            manpower,
            equipment,
            material,
            // S-Curve 용 가중치 투입량 산출 (인력+장비 베이스)
            totalEffort: manpower * 10 + equipment * 20 + material
          };
        });

        // S-Curve 누적 진행률 계산
        const totalProjectEffort = aggregated.reduce((acc, curr) => acc + curr.totalEffort, 0);
        let accumulatedEffort = 0;

        const finalData = aggregated.map(item => {
          accumulatedEffort += item.totalEffort;
          const progress = totalProjectEffort === 0 ? 0 : (accumulatedEffort / totalProjectEffort) * 100;
          return {
            ...item,
            progress: parseFloat(progress.toFixed(1))
          };
        });

        setChartData(finalData);
      } catch (e) {
        console.error("데이터 파싱 실패", e);
      }
    }
  }, []);

  if (!isMounted) return null;

  // Custom Tooltip for S-Curve
  const CustomProgressTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-xl border border-slate-100 text-xs z-50">
          <strong className="block mb-2 text-indigo-900 border-b pb-1 text-sm">{label}월 누적 공정률</strong>
          <p className="font-bold text-indigo-600 text-lg">{payload[0].value}%</p>
          <p className="text-slate-500 mt-1">계획 대비 순조로움</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-16">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3 tracking-tight">
            <BarChart3 className="text-indigo-600 w-8 h-8" />
            통계 및 다이어그램
          </h1>
          <p className="text-slate-500 mt-2 font-medium">투입 계획서의 데이터를 기반으로 월별 현황과 전체 공정률(S-Curve)을 분석합니다.</p>
        </div>
      </header>

      {/* S-Curve 누적 공정률 (전체 영역 1줄 차지) */}
      <section className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 mb-6">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
          <TrendingUp className="text-indigo-500 w-5 h-5" />
          <h2 className="text-lg font-bold text-slate-800">전체 공정률 (Cumulative S-Curve)</h2>
          <span className="ml-auto text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100">투입량 가중치 기반</span>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{fontSize: 11, fill: '#64748b'}} tickLine={false} axisLine={{stroke: '#e2e8f0'}} />
              <YAxis tick={{fontSize: 11, fill: '#64748b'}} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
              <Tooltip content={<CustomProgressTooltip />} />
              <Area type="monotone" dataKey="progress" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorProgress)" animationDuration={1500} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 하단 2단 그리드 (인원 / 장비) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* 월별 인원 투입 현황 */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
            <Users className="text-orange-500 w-5 h-5" />
            <h2 className="text-lg font-bold text-slate-800">월별 인원 투입 현황</h2>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} />
                <YAxis tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="manpower" name="투입 인원 (명)" fill="#f97316" radius={[4, 4, 0, 0]} animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 월별 장비 투입 현황 */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
            <Truck className="text-blue-500 w-5 h-5" />
            <h2 className="text-lg font-bold text-slate-800">월별 장비 투입 현황</h2>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} />
                <YAxis tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="equipment" name="투입 장비 (대)" fill="#3b82f6" radius={[4, 4, 0, 0]} animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 하단 1단 (자재 투입 현황) */}
      <section className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
          <Package className="text-emerald-500 w-5 h-5" />
          <h2 className="text-lg font-bold text-slate-800">월별 주요 자재 투입량 추이</h2>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} />
              <YAxis tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Bar dataKey="material" name="자재 물량 (m2)" fill="#10b981" fillOpacity={0.2} radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="material" name="물량 곡선" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff'}} animationDuration={1500} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </section>

    </div>
  );
}
