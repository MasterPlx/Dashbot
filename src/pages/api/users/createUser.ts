import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json(newUser);
  } catch (error: any) { // Utiliza "any" para o error, alternativa rápida
    console.error('Erro ao criar usuário:', error);

    if (error instanceof Error && (error as any)?.code === 'P2002') { // Garantindo segurança no tipo
      return res.status(400).json({ message: 'E-mail já cadastrado.' });
    }

    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}
