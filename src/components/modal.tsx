import { ReactNode, useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const [visible, setVisible] = useState(isOpen);

  // Controla a visibilidade do modal
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      // Aguarda a duração da transição para esconder o modal
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } bg-gray-800 bg-opacity-50`}
    >
      <div
        className="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl 
                   sm:h-[80vh] h-[90vh] overflow-y-auto transition-transform duration-300 transform"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}
