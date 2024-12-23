'use client';
import React, { useEffect, useState } from 'react';

interface SaleData {
  id: number;
  value: string;
  date: string;
  status: 'Pago' | 'Pendente';
}

export default function SalesTable() {
  const [salesData, setSalesData] = useState<SaleData[]>([]);

  useEffect(() => {
    async function fetchPayments() {
      try {
        const response = await fetch('/api/pagamentos');
        const data = await response.json();
        setSalesData(data);
      } catch (error) {
        console.error('Erro ao buscar os pagamentos:', error);
      }
    }

    fetchPayments();
  }, []);

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Vendas</h2>
      </div>

      <div className="bg-white border-[1.2px] rounded-3xl shadow-sm">
        {/* Cabeçalho */}
        <div className="grid grid-cols-4 text-left p-4 font-semibold text-zinc-400 border-b-[1.2px]">
          <div>ID</div>
          <div>Valor</div>
          <div>Data</div>
          <div>Status</div>
        </div>

        {/* Linhas */}
        <div className="divide-y-[1.2px]">
          {salesData.map((sale) => (
            <div
              key={sale.id}
              className="grid grid-cols-4 text-left p-4 items-center text-gray-700"
            >
              <div>{sale.id}</div>
              <div>{sale.value}</div>
              <div>{sale.date}</div>
              <div>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    sale.status === 'Pago'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-yellow-100 text-yellow-600'
                  }`}
                >
                  {sale.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
