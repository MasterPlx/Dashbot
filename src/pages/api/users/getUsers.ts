import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    // Busca todos os usuários do banco de dados
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}
