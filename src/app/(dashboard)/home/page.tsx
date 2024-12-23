'use client'
import { useEffect, useState } from "react";
import { TrendingUp, DollarSign, BarChart2 } from "lucide-react";
import CardsDash from "@/components/cards-dash";
import SalesTable from "@/components/sales-table";

export default function DashboardPage() {
  const [data, setData] = useState({
    conversao: "0%",
    faturamento: "R$ 0.00",
    ticketMedio: "R$ 0.00",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/pushinpay/dashboard");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Erro ao buscar os dados do dashboard:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <CardsDash
          icon={<TrendingUp size={22} className="text-green-600" />}
          title="Conversão"
          value={data.conversao}
          change="+5%"
          changeDescription="desde o último mês"
          changeColor="text-green-500"
        />

        <CardsDash
          icon={<DollarSign size={22} className="text-green-600" />}
          title="Faturamento"
          value={data.faturamento}
          change="+10%"
          changeDescription="desde o último mês"
          changeColor="text-green-500"
        />

        <CardsDash
          icon={<BarChart2 size={22} className="text-green-600" />}
          title="Ticket Médio"
          value={data.ticketMedio}
          change="+3%"
          changeDescription="desde o último mês"
          changeColor="text-green-500"
        />
      </div>

      <SalesTable />
    </div>
  );
}
