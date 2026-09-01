"use client";

import React, { useState } from 'react';
import { Calculator, DollarSign } from 'lucide-react';

export default function CostPage() {
  const [costItems, setCostItems] = useState([
    { id: 1, name: "1. 비정형/파라펫 구간 구조틀공사", quantity: 830, materialPrice: 535000, laborPrice: 238500, expensePrice: 129130 },
    { id: 2, name: "2. NOSING구간 구조틀 공사", quantity: 350, materialPrice: 209590, laborPrice: 145600, expensePrice: 55140 },
    { id: 3, name: "3. 3D패널 공사", quantity: 370, materialPrice: 814590, laborPrice: 96000, expensePrice: 58030 },
    { id: 4, name: "4. NOSING PANEL", quantity: 350, materialPrice: 1005000, laborPrice: 200500, expensePrice: 94570 },
    { id: 5, name: "5. 파라펫 두겁판넬공사", quantity: 200, materialPrice: 804250, laborPrice: 130850, expensePrice: 58710 },
    { id: 6, name: "6. 파라펫 내측벽체판넬 공사", quantity: 280, materialPrice: 306390, laborPrice: 65410, expensePrice: 46470 },
    { id: 7, name: "7. SOFFIT FASICA PANEL", quantity: 120, materialPrice: 412100, laborPrice: 113300, expensePrice: 58700 },
    { id: 8, name: "8. SOFFIT PANEL", quantity: 135, materialPrice: 326490, laborPrice: 167020, expensePrice: 58550 },
    { id: 9, name: "9. 채광창 내부 곡면판넬공사", quantity: 213, materialPrice: 259220, laborPrice: 101660, expensePrice: 58700 },
    { id: 10, name: "10.단열공사", quantity: 250, materialPrice: 66300, laborPrice: 39500, expensePrice: 27660 },
    { id: 11, name: "11. AL 복합패널(비선형)_천장", quantity: 610, materialPrice: 681000, laborPrice: 296000, expensePrice: 120710 },
    { id: 12, name: "11. AL 복합패널(비선형)_수벽", quantity: 150, materialPrice: 616230, laborPrice: 268000, expensePrice: 109700 }
  ]);

  const handleQuantityChange = (id: number, newQuantity: number) => {
    setCostItems(prev => 
      prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
    );
  };

  const totalMaterial = costItems.reduce((acc, item) => acc + (item.quantity * item.materialPrice), 0);
  const totalLabor = costItems.reduce((acc, item) => acc + (item.quantity * item.laborPrice), 0);
  const totalExpense = costItems.reduce((acc, item) => acc + (item.quantity * item.expensePrice), 0);
  const directTotal = totalMaterial + totalLabor + totalExpense;

  const employmentInsurance = Math.floor(totalLabor * 0.0157); // 고용보험 (원단위 절사)
  const healthInsurance = Math.floor(totalLabor * 0.035);      // 건강보험 (원단위 절사)
  const indirectTotal = employmentInsurance + healthInsurance;
  const grandTotal = directTotal + indirectTotal;

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <DollarSign className="text-emerald-500" />
          직접공사비 및 내역 상세
        </h1>
        <p className="text-gray-500 mt-1">수량을 변경하면 관련된 자재/노무비 및 보험료(간접비)가 즉각 연동 계산됩니다.</p>
      </header>
      
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-700">
                <th className="p-3 border-b font-medium">품명</th>
                <th className="p-3 border-b font-medium text-right">자재 단가</th>
                <th className="p-3 border-b font-medium text-right">노무 단가</th>
                <th className="p-3 border-b font-medium text-right">경비 단가</th>
                <th className="p-3 border-b font-medium text-center">수량 입력 (m2)</th>
                <th className="p-3 border-b font-medium text-right">항목 합계 (원)</th>
              </tr>
            </thead>
            <tbody>
              {costItems.map(item => {
                const itemTotal = item.quantity * (item.materialPrice + item.laborPrice + item.expensePrice);
                return (
                  <tr key={item.id} className="border-b hover:bg-gray-50/50">
                    <td className="p-3 font-medium">{item.name}</td>
                    <td className="p-3 text-right text-gray-500">{item.materialPrice.toLocaleString()}</td>
                    <td className="p-3 text-right text-gray-500">{item.laborPrice.toLocaleString()}</td>
                    <td className="p-3 text-right text-gray-500">{item.expensePrice.toLocaleString()}</td>
                    <td className="p-3 text-center">
                      <input 
                        type="number" 
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                        className="border rounded p-1 w-24 text-center focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </td>
                    <td className="p-3 text-right font-semibold text-gray-800">{itemTotal.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 요약 박스 */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-5 rounded-lg border">
            <p className="text-sm text-gray-600 font-semibold mb-2">순수 직접비 합계</p>
            <div className="space-y-1 text-sm text-gray-500 mb-3">
              <p className="flex justify-between"><span>자재비:</span> <span>{totalMaterial.toLocaleString()} 원</span></p>
              <p className="flex justify-between"><span>노무비:</span> <span>{totalLabor.toLocaleString()} 원</span></p>
              <p className="flex justify-between"><span>경비:</span> <span>{totalExpense.toLocaleString()} 원</span></p>
            </div>
            <p className="text-xl font-bold text-gray-900 border-t pt-2 mt-2">{directTotal.toLocaleString()} 원</p>
          </div>
          
          <div className="bg-amber-50 p-5 rounded-lg border border-amber-100">
            <p className="text-sm text-amber-800 font-semibold mb-2 flex items-center gap-1">
              <Calculator className="w-4 h-4"/> 간접비 자동 산출 (노무비 연동)
            </p>
            <div className="space-y-1 text-sm text-amber-700/80 mb-3">
              <p className="flex justify-between"><span>고용보험 (1.57%):</span> <span>{employmentInsurance.toLocaleString()} 원</span></p>
              <p className="flex justify-between"><span>건강보험 (3.5%):</span> <span>{healthInsurance.toLocaleString()} 원</span></p>
            </div>
            <p className="text-xl font-bold text-amber-900 border-t border-amber-200 pt-2 mt-2">{indirectTotal.toLocaleString()} 원</p>
          </div>

          <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 flex flex-col justify-center">
            <p className="text-sm text-blue-800 font-semibold mb-1">총 공사 금액 (직접비 + 간접비)</p>
            <p className="text-4xl font-black text-blue-700 mt-2">{grandTotal.toLocaleString()} 원</p>
          </div>
        </div>
      </section>
    </div>
  );
}
