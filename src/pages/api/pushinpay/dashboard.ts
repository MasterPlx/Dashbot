// Importar dependências
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const PUSHINPAY_TOKEN = "1293|SQ1JxXagAvbOnpzmE2bJi6LNK3YIVMGddoreMACW1fd1e98c";
const PUSHINPAY_API_URL = "https://api.pushinpay.com.br/api/transactions";

// Função auxiliar para calcular conversão e ticket médio
const calculateMetrics = (transactions: any[]) => {
  const totalPaid = transactions.filter(t => t.status === 'paid');
  const totalValue = totalPaid.reduce((sum, t) => sum + Number(t.value), 0);
  const totalTransactions = transactions.length;

  const conversionRate = totalTransactions > 0 ? ((totalPaid.length / totalTransactions) * 100).toFixed(2) : "0.00";
  const averageTicket = totalPaid.length > 0 ? (totalValue / totalPaid.length).toFixed(2) : "0.00";

  return {
    faturamento: totalValue,
    conversao: conversionRate,
    ticketMedio: averageTicket,
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
      const response = await axios.get(PUSHINPAY_API_URL, {
        headers: {
          Authorization: `Bearer ${PUSHINPAY_TOKEN}`,
        },
      });
  
      const transactions = Array.isArray(response.data)
        ? response.data
        : response.data.transactions || []; // Garantir que seja um array
  
      const { faturamento, conversao, ticketMedio } = calculateMetrics(transactions);
  
      return res.status(200).json({
        conversao: `${conversao}%`,
        faturamento: `R$ ${faturamento.toFixed(2)}`,
        ticketMedio: `R$ ${ticketMedio}`,
      });
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
      return res.status(500).json({ error: "Erro ao buscar os dados do PushinPay" });
    }
  }
  