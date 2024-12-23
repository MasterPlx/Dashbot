'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Pencil, Trash, User } from 'lucide-react';
import Modal from '@/components/modal';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  name: string;
  email: string; // Adicionando e-mail à interface
  profilePicture?: string;
}

export default function UsuarioPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users/getUsers');
        if (!response.ok) throw new Error('Erro ao buscar usuários');
        const usersData = await response.json();
        setUsers(usersData);
      } catch (error) {
        console.error(error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os usuários.',
          variant: 'destructive',
        });
      }
    };

    fetchUsers();
    setIsMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Erro',
        description: 'As senhas não coincidem!',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/users/createUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao registrar usuário');
      }

      const newUser = await response.json();
      setUsers((prevUsers) => [...prevUsers, newUser]);
      setIsModalOpen(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });

      toast({
        title: 'Sucesso',
        description: 'Usuário registrado com sucesso!',
        variant: 'success',
      });
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      toast({
        title: 'Erro',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      const response = await fetch('/api/users/deleteUser', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId }),
      });

      if (!response.ok) throw new Error('Erro ao excluir usuário');

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));

      toast({
        title: 'Sucesso',
        description: 'Usuário excluído com sucesso!',
        variant: 'success',
      });
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast({
        title: 'Erro',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  };

  if (!isMounted) return null;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Usuários</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-2 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium transition"
        >
          Adicionar Usuário
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-6">Adicionar Usuário</h2>
        <form onSubmit={handleAddUser} className="space-y-6">
          <input
            type="text"
            name="name"
            placeholder="Nome"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="border border-gray-300 p-4 rounded-lg w-full"
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="border border-gray-300 p-4 rounded-lg w-full"
          />
          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="border border-gray-300 p-4 rounded-lg w-full"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar Senha"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            className="border border-gray-300 p-4 rounded-lg w-full"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-7 py-2 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            Confirmar
          </button>
        </form>
      </Modal>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
          <thead>
            <tr>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">Foto</th>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">Nome Completo</th>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">E-mail</th>
              <th className="py-3 px-4 text-center text-gray-600 font-semibold">Editar</th>
              <th className="py-3 px-4 text-center text-gray-600 font-semibold">Excluir</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-gray-200">
                <td className="py-3 px-4">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 text-gray-600">
                      <User size={20} />
                    </div>
                  )}
                </td>
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4">{user.email}</td> {/* Adicionando e-mail */}
                <td className="py-3 px-4 text-center">
                  <Link href={`/editar/${user.id}`}>
                    <button className="text-blue-500 hover:text-blue-700">
                      <Pencil size={18} />
                    </button>
                  </Link>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
