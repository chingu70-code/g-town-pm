"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calculator, DollarSign, Save, Trash2, Plus, RotateCcw, RefreshCcw, Lock, FileText } from 'lucide-react';
import { saveToCloud } from '@/lib/syncService';

const INITIAL_COST_ITEMS = [
  { id: 0, name: "비주얼 목업 (Visual Mock-up)", quantity: 1, materialPrice: 15000000, laborPrice: 5000000, expensePrice: 0 },
  { 
    id: 1, name: "비정형/파라펫 구간 구조틀공사", quantity: 830, materialPrice: 535000, laborPrice: 238500, expensePrice: 129130,
    subItems: [
      { id: "sub_1", name: "1) SPACE FRAME", spec: "비정형구간 MAIN", unit: "식", quantity: 1, materialPrice: 348000, laborPrice: 145000, expensePrice: 57500 },
      { id: "sub_2", name: "S/F member", spec: "STK400 일반구조용 탄소강관", unit: "개소", quantity: 4, materialPrice: 25000, laborPrice: 15000, expensePrice: 5000 },
      { id: "sub_3", name: "T-형강 및 기타 부자재", spec: "T-100x100x8/12T 밴딩포함", unit: "식", quantity: 1, materialPrice: 87000, laborPrice: 33500, expensePrice: 51630 }
    ]
  },
  { 
    id: 2, name: "NOSING구간 구조틀 공사", quantity: 350, materialPrice: 209590, laborPrice: 145600, expensePrice: 55140,
    subItems: [
      { id: "sub_4", name: "T-형강(비정형)", spec: "밴딩포함", unit: "m2", quantity: 1, materialPrice: 105000, laborPrice: 65000, expensePrice: 25000 },
      { id: "sub_5", name: "ㅁ-PIPE(곡면)외", spec: "부자재 일체", unit: "식", quantity: 1, materialPrice: 104590, laborPrice: 80600, expensePrice: 30140 }
    ]
  },
  { id: 3, name: "3D패널 공사", quantity: 370, materialPrice: 814590, laborPrice: 96000, expensePrice: 58030 },
  { id: 4, name: "NOSING PANEL", quantity: 350, materialPrice: 1005000, laborPrice: 200500, expensePrice: 94570 },
  { id: 5, name: "파라펫 두겁판넬공사", quantity: 200, materialPrice: 804250, laborPrice: 130850, expensePrice: 58710 },
  { id: 6, name: "파라펫 내측벽체판넬 공사", quantity: 280, materialPrice: 306390, laborPrice: 65410, expensePrice: 46470 },
  { id: 7, name: "SOFFIT FASICA PANEL", quantity: 120, materialPrice: 412100, laborPrice: 113300, expensePrice: 58700 },
  { id: 8, name: "SOFFIT PANEL", quantity: 135, materialPrice: 326490, laborPrice: 167020, expensePrice: 58550 },
  { id: 9, name: "채광창 내부 곡면판넬공사", quantity: 213, materialPrice: 259220, laborPrice: 101660, expensePrice: 58700 },
  { id: 10, name: "단열공사", quantity: 250, materialPrice: 66300, laborPrice: 39500, expensePrice: 27660 },
  { id: 11, name: "AL 복합패널(비선형)_천장", quantity: 610, materialPrice: 681000, laborPrice: 296000, expensePrice: 120710 },
  { id: 12, name: "AL 복합패널(비선형)_수벽", quantity: 150, materialPrice: 616230, laborPrice: 268000, expensePrice: 109700 }
];

export default function CostPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [costItems, setCostItems] = useState(INITIAL_COST_ITEMS);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('gTownCostItems');
    if (saved) {
      setCostItems(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('gTownCostItems', JSON.stringify(costItems));
    }
  }, [costItems, isMounted]);

  const handleReset = () => {
    if (window.confirm("지금까지 수정한 내역이 모두 삭제되고 초기 원본 견적서로 복구됩니다. 진행하시겠습니까?")) {
      localStorage.removeItem('gTownCostItems');
      setCostItems(INITIAL_COST_ITEMS);
    }
  };

  const handleChange = (id: number, field: string, value: string | number) => {
    setCostItems(prev => 
      prev.map(item => item.id === id ? { ...item, [field]: value } : item)
    );
  };

  const handleAddRow = () => {
    setCostItems(prev => [
      ...prev, 
      { id: Date.now(), name: "새 항목 입력", quantity: 0, materialPrice: 0, laborPrice: 0, expensePrice: 0 }
    ]);
  };

  const handleDeleteRow = (id: number) => {
    setCostItems(prev => prev.filter(item => item.id !== id));
  };

  const totalMaterial = costItems.reduce((acc, item) => acc + (item.quantity * item.materialPrice), 0);
  const totalLabor = costItems.reduce((acc, item) => acc + (item.quantity * item.laborPrice), 0);
  const totalExpense = costItems.reduce((acc, item) => acc + (item.quantity * item.expensePrice), 0);
  const directTotal = totalMaterial + totalLabor + totalExpense;

  if (!isMounted) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3 tracking-tight">
            <DollarSign className="text-emerald-500 w-8 h-8" />
            직접공사비 내역 편집기
          </h1>
          <p className="text-slate-500 mt-2 font-medium">이곳에서 직접공사비 품목을 자유롭게 수정, 추가, 삭제할 수 있습니다. 작성된 내역은 대시보드와 공정표에 실시간 자동 연동됩니다.</p>
        </div>
        <div className="flex gap-2">
            <button 
              onClick={handleReset}
              className="text-slate-500 hover:text-rose-500 flex items-center px-4 py-2 border border-slate-200 rounded-lg bg-white hover:bg-rose-50 font-medium transition-colors text-sm shadow-sm"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              원본 초기화
            </button>
            <button 
              onClick={() => {
                saveToCloud('cost_items', 'gtown_main', costItems);
                alert("클라우드 서버에 안전하게 저장되었습니다!");
              }}
              className="text-indigo-600 flex items-center px-4 py-2 border border-indigo-200 rounded-lg bg-indigo-50 hover:bg-indigo-100 font-medium transition-colors text-sm shadow-sm"
            >
              <Save className="w-4 h-4 mr-2" />
              클라우드 저장 (동기화)
            </button>
          </div>
      </header>
      
      <section className="bg-white p-2 sm:p-6 rounded-2xl shadow-lg border border-slate-100 mb-8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 rounded-xl">
                <th className="p-4 font-bold rounded-l-lg w-1/3">품명 (클릭하여 수정)</th>
                <th className="p-4 font-semibold text-right text-slate-500">자재 단가</th>
                <th className="p-4 font-semibold text-right text-slate-500">노무 단가</th>
                <th className="p-4 font-semibold text-right text-slate-500">경비 단가</th>
                <th className="p-4 font-semibold text-center text-slate-500">수량 (m2)</th>
                <th className="p-4 font-bold text-right">항목 합계 (원)</th>
                <th className="p-4 font-semibold text-center w-12 rounded-r-lg">삭제</th>
              </tr>
            </thead>
            <tbody>
              {costItems.map((item, index) => {
                const hasSubItems = (item as any).subItems && (item as any).subItems.length > 0;
                const itemTotal = item.quantity * (item.materialPrice + item.laborPrice + item.expensePrice);
                return (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors group">
                    <td className="p-3 flex items-center gap-2">
                      <span className="text-slate-400 font-bold w-6 text-right text-sm">{index + 1}.</span>
                      <input 
                        type="text" 
                        value={item.name}
                        onChange={(e) => handleChange(item.id, 'name', e.target.value)}
                        className="w-full font-semibold p-1.5 border border-transparent hover:border-slate-300 focus:border-indigo-500 rounded-lg outline-none bg-transparent focus:bg-white text-slate-800 transition-colors"
                      />
                      <Link href="/unit-price" className={`transition shrink-0 ${hasSubItems ? 'text-emerald-500 hover:text-emerald-600' : 'text-slate-300 hover:text-slate-500'}`} title={hasSubItems ? "세부 일위대가 연동 중" : "일위대가 작성하기"}>
                        <FileText className="w-4 h-4" />
                      </Link>
                    </td>
                    <td className="p-3 text-right">
                      <div className="relative flex items-center justify-end">
                        {hasSubItems && <Lock className="w-3 h-3 text-emerald-500 absolute left-2 opacity-50" />}
                        <input 
                          type="text" 
                          readOnly={hasSubItems}
                          value={item.materialPrice === 0 ? '' : item.materialPrice.toLocaleString()}
                          onChange={(e) => handleChange(item.id, 'materialPrice', Number(e.target.value.replace(/,/g, '')))}
                          className={`w-28 text-right p-1.5 border border-transparent rounded-lg outline-none font-medium transition-colors ${hasSubItems ? 'bg-slate-50 text-emerald-700 cursor-not-allowed' : 'hover:border-slate-300 focus:border-indigo-500 text-slate-600 bg-transparent focus:bg-white'}`}
                          placeholder="0"
                        />
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="relative flex items-center justify-end">
                        {hasSubItems && <Lock className="w-3 h-3 text-emerald-500 absolute left-2 opacity-50" />}
                        <input 
                          type="text" 
                          readOnly={hasSubItems}
                          value={item.laborPrice === 0 ? '' : item.laborPrice.toLocaleString()}
                          onChange={(e) => handleChange(item.id, 'laborPrice', Number(e.target.value.replace(/,/g, '')))}
                          className={`w-28 text-right p-1.5 border border-transparent rounded-lg outline-none font-medium transition-colors ${hasSubItems ? 'bg-slate-50 text-emerald-700 cursor-not-allowed' : 'hover:border-slate-300 focus:border-indigo-500 text-slate-600 bg-transparent focus:bg-white'}`}
                          placeholder="0"
                        />
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="relative flex items-center justify-end">
                        {hasSubItems && <Lock className="w-3 h-3 text-emerald-500 absolute left-2 opacity-50" />}
                        <input 
                          type="text" 
                          readOnly={hasSubItems}
                          value={item.expensePrice === 0 ? '' : item.expensePrice.toLocaleString()}
                          onChange={(e) => handleChange(item.id, 'expensePrice', Number(e.target.value.replace(/,/g, '')))}
                          className={`w-28 text-right p-1.5 border border-transparent rounded-lg outline-none font-medium transition-colors ${hasSubItems ? 'bg-slate-50 text-emerald-700 cursor-not-allowed' : 'hover:border-slate-300 focus:border-indigo-500 text-slate-600 bg-transparent focus:bg-white'}`}
                          placeholder="0"
                        />
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <input 
                        type="text" 
                        value={item.quantity === 0 ? '' : item.quantity.toLocaleString()}
                        onChange={(e) => handleChange(item.id, 'quantity', Number(e.target.value.replace(/,/g, '')))}
                        className="w-20 text-center p-1.5 border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-lg outline-none bg-white font-bold text-indigo-700 shadow-sm transition-all"
                        placeholder="0"
                      />
                    </td>
                    <td className="p-3 text-right font-bold text-slate-800 text-base">{itemTotal.toLocaleString()}</td>
                    <td className="p-3 text-center">
                      <button 
                        onClick={() => handleDeleteRow(item.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="항목 삭제"
                      >
                        <Trash2 className="w-4 h-4 mx-auto" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="mt-6 flex justify-center pb-2">
            <button 
              onClick={handleAddRow}
              className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-5 py-2.5 rounded-xl transition border border-transparent hover:border-indigo-200 shadow-sm hover:shadow"
            >
              <Plus className="w-4 h-4" /> 새로운 내역 추가
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
