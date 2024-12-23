import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
const PUSHINPAY_TOKEN = "1293|SQ1JxXagAvbOnpzmE2bJi6LNK3YIVMGddoreMACW1fd1e98c";
const PUSHINPAY_API_URL = "https://api.pushinpay.com.br/api/transactions";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Busca transações na API PushinPay
    const response = await axios.get(PUSHINPAY_API_URL, {
      headers: {
        Authorization: `Bearer ${PUSHINPAY_TOKEN}`,
      },
    });

    // Verifica e organiza os dados
    const transactions = Array.isArray(response.data)
      ? response.data
      : response.data.transactions || [];

    const payments = transactions.map((t: any, index: number) => ({
      id: index + 1, // Sequencial
      value: `R$ ${(t.value / 100).toFixed(2).replace('.', ',')}`, // Supondo centavos
      date: new Date(t.updated_at).toLocaleDateString('pt-BR'),
      status: t.status === 'paid' ? 'Pago' : 'Pendente',
    }));

    return res.status(200).json(payments);
  } catch (error) {
    console.error('Erro ao buscar pagamentos:', error);
    return res.status(500).json({ error: 'Erro ao buscar os pagamentos da PushinPay' });
  }
}
