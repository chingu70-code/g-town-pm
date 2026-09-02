"use client";

import React, { useState, useEffect } from 'react';
import { FileText, Save, Plus, Trash2, ArrowRight } from 'lucide-react';
import { saveToCloud } from '@/lib/syncService';
import Link from 'next/link';

interface SubItem {
  id: string;
  name: string;
  spec: string;
  unit: string;
  quantity: number;
  materialPrice: number;
  laborPrice: number;
  expensePrice: number;
}

interface CostItem {
  id: string;
  name: string;
  spec: string;
  unit: string;
  quantity: number;
  materialPrice: number;
  laborPrice: number;
  expensePrice: number;
  subItems?: SubItem[];
}

export default function UnitPricePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [costItems, setCostItems] = useState<CostItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('gTownCostItems');
    if (saved) {
      setCostItems(JSON.parse(saved));
    }
  }, []);

  const selectedItem = costItems.find(item => item.id === selectedId);

  // 상위 아이템 클릭 시
  const handleSelectItem = (id: string) => {
    setSelectedId(id);
  };

  // 하위 아이템(일위대가) 추가
  const handleAddSubItem = () => {
    if (!selectedId) return;
    
    setCostItems(prev => prev.map(item => {
      if (item.id === selectedId) {
        const newSubItem: SubItem = {
          id: Date.now().toString(),
          name: '새 세부 항목',
          spec: '',
          unit: '식',
          quantity: 1,
          materialPrice: 0,
          laborPrice: 0,
          expensePrice: 0
        };
        const currentSubItems = item.subItems || [];
        const updatedSubItems = [...currentSubItems, newSubItem];
        
        // 부모 가격 재계산
        const { mat, lab, exp } = recalcParentPrice(updatedSubItems);
        return { ...item, subItems: updatedSubItems, materialPrice: mat, laborPrice: lab, expensePrice: exp };
      }
      return item;
    }));
  };

  // 하위 아이템 삭제
  const handleDeleteSubItem = (subId: string) => {
    if (!selectedId) return;
    
    setCostItems(prev => prev.map(item => {
      if (item.id === selectedId && item.subItems) {
        const updatedSubItems = item.subItems.filter(sub => sub.id !== subId);
        // 부모 가격 재계산
        const { mat, lab, exp } = recalcParentPrice(updatedSubItems);
        return { ...item, subItems: updatedSubItems, materialPrice: mat, laborPrice: lab, expensePrice: exp };
      }
      return item;
    }));
  };

  // 하위 아이템 내용 수정
  const handleSubItemChange = (subId: string, field: keyof SubItem, value: any) => {
    if (!selectedId) return;
    
    setCostItems(prev => prev.map(item => {
      if (item.id === selectedId && item.subItems) {
        const updatedSubItems = item.subItems.map(sub => {
          if (sub.id === subId) {
            return { ...sub, [field]: value };
          }
          return sub;
        });
        
        // 부모 가격 재계산
        const { mat, lab, exp } = recalcParentPrice(updatedSubItems);
        return { ...item, subItems: updatedSubItems, materialPrice: mat, laborPrice: lab, expensePrice: exp };
      }
      return item;
    }));
  };

  // 일위대가(subItems)의 합계로 부모 단가 계산
  const recalcParentPrice = (subs: SubItem[]) => {
    let mat = 0;
    let lab = 0;
    let exp = 0;
    subs.forEach(sub => {
      mat += (sub.quantity * sub.materialPrice);
      lab += (sub.quantity * sub.laborPrice);
      exp += (sub.quantity * sub.expensePrice);
    });
    return { mat, lab, exp };
  };

  // 클라우드 저장
  const handleSaveToCloud = async () => {
    setIsSaving(true);
    localStorage.setItem('gTownCostItems', JSON.stringify(costItems));
    await saveToCloud('cost_items', 'gtown_main', costItems);
    setIsSaving(false);
    alert('일위대가 및 직접공사비가 성공적으로 클라우드에 연동 저장되었습니다.');
  };

  if (!isMounted) return null;

  return (
    <div className="animate-in fade-in duration-500 h-full flex flex-col">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="text-emerald-600 w-6 h-6" />
            일위대가 (단가 산출서)
          </h1>
          <p className="text-xs text-gray-500 mt-2">공종별 세부 자재/인건비 구성 항목을 입력하면 직접공사비로 자동 합산됩니다.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleSaveToCloud}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white font-bold rounded shadow hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? '저장 중...' : '클라우드 저장 (동기화)'}
          </button>
          <Link href="/direct-cost" className="flex items-center gap-1.5 px-4 py-2 bg-white text-slate-700 font-bold rounded border border-slate-200 shadow-sm hover:bg-slate-50 transition">
            직접비 내역 확인 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
        {/* 왼쪽: 부모 공종 리스트 */}
        <div className="w-full lg:w-1/3 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden h-full">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h2 className="font-bold text-slate-700 text-sm">대공종 목록 (직접공사비)</h2>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {costItems.length === 0 ? (
              <p className="p-4 text-xs text-slate-400 text-center">직접공사비 내역이 없습니다.</p>
            ) : (
              costItems.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectItem(item.id)}
                  className={`w-full text-left px-3 py-3 rounded-lg text-sm transition-all border ${
                    selectedId === item.id 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold shadow-sm' 
                      : 'bg-white border-transparent text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="truncate pr-2">{idx + 1}. {item.name}</span>
                    {item.subItems && item.subItems.length > 0 && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded flex-shrink-0">
                        {item.subItems.length}항목
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 font-normal">
                    단가: {(item.materialPrice + item.laborPrice + item.expensePrice).toLocaleString()}원
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* 오른쪽: 선택된 공종의 일위대가 편집기 */}
        <div className="w-full lg:w-2/3 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden h-full">
          {!selectedItem ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <FileText className="w-12 h-12 mb-2 opacity-20" />
              <p>왼쪽에서 공종을 선택하여 세부 단가를 구성하세요.</p>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <div>
                  <h2 className="font-bold text-slate-800">{selectedItem.name} <span className="text-slate-500 font-normal text-sm">일위대가</span></h2>
                  <p className="text-xs text-slate-500 mt-1">이 항목들의 단가 합산이 부모 공종의 단가로 락(Lock) 걸립니다.</p>
                </div>
                <button
                  onClick={handleAddSubItem}
                  className="flex items-center gap-1 bg-emerald-500 text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-emerald-600 transition"
                >
                  <Plus className="w-3.5 h-3.5" /> 세부 항목 추가
                </button>
              </div>

              <div className="flex-1 overflow-x-auto p-4">
                <table className="w-full min-w-[800px] border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 border-b-2 border-slate-200">
                      <th className="p-2 font-bold w-48">세부 품명</th>
                      <th className="p-2 font-bold w-32">규격</th>
                      <th className="p-2 font-bold w-16">단위</th>
                      <th className="p-2 font-bold w-20 text-right">소요량</th>
                      <th className="p-2 font-bold text-right">재료비</th>
                      <th className="p-2 font-bold text-right">노무비</th>
                      <th className="p-2 font-bold text-right">경비</th>
                      <th className="p-2 font-bold text-center w-12">삭제</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(!selectedItem.subItems || selectedItem.subItems.length === 0) ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-400 bg-slate-50 border-b border-slate-100">
                          아직 세부 항목이 없습니다. 우측 상단의 추가 버튼을 눌러주세요.
                        </td>
                      </tr>
                    ) : (
                      selectedItem.subItems.map((sub) => (
                        <tr key={sub.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="p-2">
                            <input type="text" value={sub.name} onChange={e => handleSubItemChange(sub.id, 'name', e.target.value)} className="w-full p-1.5 border border-slate-200 rounded focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none" />
                          </td>
                          <td className="p-2">
                            <input type="text" value={sub.spec} onChange={e => handleSubItemChange(sub.id, 'spec', e.target.value)} className="w-full p-1.5 border border-slate-200 rounded focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none" />
                          </td>
                          <td className="p-2">
                            <input type="text" value={sub.unit} onChange={e => handleSubItemChange(sub.id, 'unit', e.target.value)} className="w-full p-1.5 border border-slate-200 rounded focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none" />
                          </td>
                          <td className="p-2 text-right">
                            <input type="number" step="0.01" value={sub.quantity} onChange={e => handleSubItemChange(sub.id, 'quantity', parseFloat(e.target.value) || 0)} className="w-full p-1.5 border border-slate-200 rounded text-right focus:border-emerald-500 outline-none" />
                          </td>
                          <td className="p-2 text-right">
                            <input type="number" value={sub.materialPrice} onChange={e => handleSubItemChange(sub.id, 'materialPrice', parseInt(e.target.value) || 0)} className="w-full p-1.5 border border-slate-200 rounded text-right focus:border-emerald-500 outline-none" />
                          </td>
                          <td className="p-2 text-right">
                            <input type="number" value={sub.laborPrice} onChange={e => handleSubItemChange(sub.id, 'laborPrice', parseInt(e.target.value) || 0)} className="w-full p-1.5 border border-slate-200 rounded text-right focus:border-emerald-500 outline-none" />
                          </td>
                          <td className="p-2 text-right">
                            <input type="number" value={sub.expensePrice} onChange={e => handleSubItemChange(sub.id, 'expensePrice', parseInt(e.target.value) || 0)} className="w-full p-1.5 border border-slate-200 rounded text-right focus:border-emerald-500 outline-none" />
                          </td>
                          <td className="p-2 text-center">
                            <button onClick={() => handleDeleteSubItem(sub.id)} className="text-red-400 hover:text-red-600 transition p-1 bg-red-50 hover:bg-red-100 rounded">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                    
                    {/* 합계행 (부모 단가) */}
                    {selectedItem.subItems && selectedItem.subItems.length > 0 && (
                      <tr className="bg-emerald-50 border-t-2 border-emerald-200 font-bold text-emerald-800">
                        <td colSpan={4} className="p-3 text-right">위 항목들의 총 합계 (자동 승급 단가) :</td>
                        <td className="p-3 text-right">{selectedItem.materialPrice.toLocaleString()}</td>
                        <td className="p-3 text-right">{selectedItem.laborPrice.toLocaleString()}</td>
                        <td className="p-3 text-right">{selectedItem.expensePrice.toLocaleString()}</td>
                        <td></td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
