"use client";

import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, ArrowRight, PieChart, TrendingUp, ShieldCheck, StickyNote, Save } from 'lucide-react';
import Link from 'next/link';
import { saveToCloud } from '@/lib/syncService';

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [directTotal, setDirectTotal] = useState(0);
  const [totalLabor, setTotalLabor] = useState(0);
  const [indirectOverrides, setIndirectOverrides] = useState<Record<string, number>>({});
  const [memoContent, setMemoContent] = useState("");
  const [isSavingMemo, setIsSavingMemo] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('gTownCostItems');
    if (saved) {
      const items = JSON.parse(saved);
      let labor = 0;
      let total = 0;
      items.forEach((item: any) => {
        labor += (item.quantity * item.laborPrice);
        total += (item.quantity * (item.materialPrice + item.laborPrice + item.expensePrice));
      });
      setTotalLabor(labor);
      setDirectTotal(total);
    }
    
    const overrides = localStorage.getItem('gTownIndirectOverrides');
    if (overrides) {
      try {
        setIndirectOverrides(JSON.parse(overrides));
      } catch(e) {}
    }
    
    const savedMemo = localStorage.getItem('gTownMemo');
    if (savedMemo) {
      try {
        const parsed = JSON.parse(savedMemo);
        if (parsed.content) setMemoContent(parsed.content);
      } catch(e) {}
    }
  }, []);

  const handleIndirectChange = (key: string, value: string) => {
    const numValue = parseInt(value.replace(/,/g, ''), 10);
    const newOverrides = { ...indirectOverrides };
    
    if (isNaN(numValue)) {
      delete newOverrides[key];
    } else {
      newOverrides[key] = numValue;
    }
    
    setIndirectOverrides(newOverrides);
    localStorage.setItem('gTownIndirectOverrides', JSON.stringify(newOverrides));
    saveToCloud('project_info', 'gtown_indirects', newOverrides);
  };

  const handleSaveMemo = async () => {
    setIsSavingMemo(true);
    const payload = { content: memoContent, updatedAt: new Date().toISOString() };
    localStorage.setItem('gTownMemo', JSON.stringify(payload));
    await saveToCloud('project_info', 'gtown_memo', payload);
    setIsSavingMemo(false);
    alert('메모가 클라우드에 저장되었습니다.');
  };

  // 간접비 계산 로직 (천원 단위 이하 절사 적용)
  const calcFloor = (val: number) => Math.floor(val / 1000) * 1000;

  const safetyCost = indirectOverrides['safety'] !== undefined ? indirectOverrides['safety'] : 7500000; // 안전관리비/외주분 (고정)
  const employmentInsurance = indirectOverrides['employment'] !== undefined ? indirectOverrides['employment'] : calcFloor(totalLabor * 0.0157); // 고용보험
  const pensionInsurance = indirectOverrides['pension'] !== undefined ? indirectOverrides['pension'] : calcFloor(directTotal * 0.29 * 0.0475); // 연금보험
  const healthInsurance = indirectOverrides['health'] !== undefined ? indirectOverrides['health'] : calcFloor(directTotal * 0.29 * 0.03595); // 건강보험
  const seniorCareInsurance = indirectOverrides['senior'] !== undefined ? indirectOverrides['senior'] : calcFloor(directTotal * 0.29 * 0.04724); // 노인장기요양보험
  const retirementDeduction = indirectOverrides['retirement'] !== undefined ? indirectOverrides['retirement'] : calcFloor(totalLabor * 0.023); // 퇴직공제부금비
  const machineryGuarantee = indirectOverrides['machinery'] !== undefined ? indirectOverrides['machinery'] : calcFloor(directTotal * 0.0007); // 건설기계대여금지급보증 (0.07%)

  const indirectTotal = safetyCost + employmentInsurance + pensionInsurance + healthInsurance + seniorCareInsurance + retirementDeduction + machineryGuarantee;
  const grandTotal = directTotal + indirectTotal;

  if (!isMounted) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3 tracking-tight">
            <PieChart className="text-indigo-600 w-8 h-8" />
            종합 공사비 대시보드
          </h1>
          <p className="text-slate-500 mt-2 font-medium">직접공사비 입력에 따라 간접공사비(보험료 등)가 자동으로 연동 계산됩니다.</p>
        </div>
      </header>

      {/* 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-7 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Calculator className="w-24 h-24 text-slate-900" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">직접공사비 (Direct Cost)</p>
            <p className="text-3xl font-black text-slate-900">{directTotal.toLocaleString()} <span className="text-lg font-bold text-slate-400">원</span></p>
          </div>
          <Link href="/direct-cost" className="mt-6 text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 w-fit bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
            상세 내역 편집하기 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="bg-white p-7 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShieldCheck className="w-24 h-24 text-amber-900" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">간접공사비 (Indirect Cost)</p>
            <p className="text-3xl font-black text-amber-600">{indirectTotal.toLocaleString()} <span className="text-lg font-bold text-amber-400">원</span></p>
          </div>
          <p className="mt-6 text-xs font-medium text-slate-400">아래 간접비 테이블 산출식 참조</p>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 p-7 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-indigo-700 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <DollarSign className="w-24 h-24" />
          </div>
          <div>
            <p className="text-sm font-semibold text-indigo-200 mb-2 uppercase tracking-wide">총 공사비 합계 (Grand Total)</p>
            <p className="text-4xl font-black tracking-tight">{grandTotal.toLocaleString()} <span className="text-xl font-bold text-indigo-300">원</span></p>
          </div>
          <p className="mt-6 text-xs font-medium text-indigo-200 flex items-center gap-1.5 bg-indigo-900/30 w-fit px-3 py-1.5 rounded-lg border border-indigo-500/30 backdrop-blur-sm">
            <TrendingUp className="w-4 h-4" /> 실시간 동기화 계산됨
          </p>
        </div>
      </div>

      {/* 간접공사비 상세 테이블 */}
      <section className="bg-white rounded-2xl shadow-lg border border-slate-100 mb-8 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="text-emerald-500 w-6 h-6" />
            간접공사비 산출 내역
          </h2>
        </div>
        
        <div className="overflow-x-auto p-4 sm:p-6">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 rounded-xl">
                <th className="p-4 font-bold rounded-l-lg">비용 항목</th>
                <th className="p-4 font-semibold text-slate-500 text-sm">산출식(기준)</th>
                <th className="p-4 font-semibold text-right text-slate-500 text-sm">요율/금액</th>
                <th className="p-4 font-bold text-right rounded-r-lg">계산 금액 (원)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                <td className="p-4 font-semibold text-slate-700">안전관리비/외주분</td>
                <td className="p-4 text-sm font-medium text-slate-500">별도테이블</td>
                <td className="p-4 text-sm font-medium text-slate-500 text-right">-</td>
                <td className="p-2 text-right">
                  <input type="text" value={safetyCost.toLocaleString()} onChange={(e) => handleIndirectChange('safety', e.target.value)} className="w-full max-w-[140px] text-right p-2 border border-slate-200 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-semibold text-slate-800 bg-white shadow-sm transition-all" />
                </td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                <td className="p-4 font-semibold text-slate-700">고용보험</td>
                <td className="p-4 text-sm font-medium text-slate-500">노무비 × 1.57%</td>
                <td className="p-4 text-sm font-medium text-slate-500 text-right">1.57%</td>
                <td className="p-2 text-right">
                  <input type="text" value={employmentInsurance.toLocaleString()} onChange={(e) => handleIndirectChange('employment', e.target.value)} className="w-full max-w-[140px] text-right p-2 border border-slate-200 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-semibold text-slate-800 bg-white shadow-sm transition-all" />
                </td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                <td className="p-4 font-semibold text-slate-700">연금보험</td>
                <td className="p-4 text-sm font-medium text-slate-500">직접비 × 29% × 4.75%</td>
                <td className="p-4 text-sm font-medium text-slate-500 text-right">4.75%</td>
                <td className="p-2 text-right">
                  <input type="text" value={pensionInsurance.toLocaleString()} onChange={(e) => handleIndirectChange('pension', e.target.value)} className="w-full max-w-[140px] text-right p-2 border border-slate-200 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-semibold text-slate-800 bg-white shadow-sm transition-all" />
                </td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                <td className="p-4 font-semibold text-slate-700">건강보험</td>
                <td className="p-4 text-sm font-medium text-slate-500">직접비 × 29% × 3.595%</td>
                <td className="p-4 text-sm font-medium text-slate-500 text-right">3.595%</td>
                <td className="p-2 text-right">
                  <input type="text" value={healthInsurance.toLocaleString()} onChange={(e) => handleIndirectChange('health', e.target.value)} className="w-full max-w-[140px] text-right p-2 border border-slate-200 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-semibold text-slate-800 bg-white shadow-sm transition-all" />
                </td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                <td className="p-4 font-semibold text-slate-700">노인장기요양보험</td>
                <td className="p-4 text-sm font-medium text-slate-500">직접비 × 29% × 4.724%</td>
                <td className="p-4 text-sm font-medium text-slate-500 text-right">4.724%</td>
                <td className="p-2 text-right">
                  <input type="text" value={seniorCareInsurance.toLocaleString()} onChange={(e) => handleIndirectChange('senior', e.target.value)} className="w-full max-w-[140px] text-right p-2 border border-slate-200 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-semibold text-slate-800 bg-white shadow-sm transition-all" />
                </td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                <td className="p-4 font-semibold text-slate-700">퇴직공제부금비</td>
                <td className="p-4 text-sm font-medium text-slate-500">노무비 × 2.3%</td>
                <td className="p-4 text-sm font-medium text-slate-500 text-right">2.3%</td>
                <td className="p-2 text-right">
                  <input type="text" value={retirementDeduction.toLocaleString()} onChange={(e) => handleIndirectChange('retirement', e.target.value)} className="w-full max-w-[140px] text-right p-2 border border-slate-200 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-semibold text-slate-800 bg-white shadow-sm transition-all" />
                </td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                <td className="p-4 font-semibold text-slate-700">건설기계대여금지급보증</td>
                <td className="p-4 text-sm font-medium text-slate-500">직접공사비 × 0.07%</td>
                <td className="p-4 text-sm font-medium text-slate-500 text-right">0.07%</td>
                <td className="p-2 text-right">
                  <input type="text" value={machineryGuarantee.toLocaleString()} onChange={(e) => handleIndirectChange('machinery', e.target.value)} className="w-full max-w-[140px] text-right p-2 border border-slate-200 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-semibold text-slate-800 bg-white shadow-sm transition-all" />
                </td>
              </tr>
              <tr className="bg-amber-50 rounded-lg">
                <td colSpan={3} className="p-5 font-bold text-amber-900 text-right rounded-l-lg border-t border-amber-200">간접공사비 합계</td>
                <td className="p-5 font-black text-amber-700 text-right text-xl rounded-r-lg border-t border-amber-200">{indirectTotal.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 특이사항 및 메모장 섹션 */}
      <section className="bg-amber-50/80 rounded-2xl shadow-lg border border-amber-200/60 mb-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
          <StickyNote className="w-32 h-32 text-amber-900" />
        </div>
        <div className="p-6 border-b border-amber-200/50 flex justify-between items-center relative z-10">
          <h2 className="text-xl font-bold text-amber-800 flex items-center gap-2">
            <StickyNote className="text-amber-500 w-6 h-6" />
            특이사항 및 메모
          </h2>
          <button
            onClick={handleSaveMemo}
            disabled={isSavingMemo}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSavingMemo ? "저장 중..." : "메모 클라우드 저장"}
          </button>
        </div>
        <div className="p-6 relative z-10">
          <textarea
            value={memoContent}
            onChange={(e) => setMemoContent(e.target.value)}
            placeholder="수정 날짜, 금액 조율 사유, 공지사항 등을 자유롭게 메모하세요. (여기에 작성한 내용은 클라우드 저장 시 실시간으로 팀원들과 공유됩니다.)"
            className="w-full h-48 p-4 rounded-xl border border-amber-200 bg-white/70 focus:bg-white text-slate-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 resize-none shadow-inner leading-relaxed transition-all"
          />
        </div>
      </section>
    </div>
  );
}
