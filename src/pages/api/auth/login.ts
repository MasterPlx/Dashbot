import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRATION = '7d';

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'E-mail e senha são obrigatórios' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: 'E-mail e/ou senha inválidos' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'E-mail e/ou senha inválidos' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRATION }
    );

    res.setHeader(
      'Set-Cookie',
      `token=${token}; HttpOnly; Secure; Path=/; Max-Age=604800; SameSite=Strict`
    );

    return res.status(200).json({ message: 'Login realizado com sucesso!' });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}
