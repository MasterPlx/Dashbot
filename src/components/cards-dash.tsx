'use client';
import { ReactNode } from 'react';

interface CardDashProps {
  icon: ReactNode;
  title: string;
  value: string;
  change?: string;
  changeDescription?: string;
  changeColor: string;
}

export default function CardsDash({
  icon,
  title,
  value,
  change,
  changeDescription,
  changeColor
}: CardDashProps) {
  return (
    <div className="flex items-center space-x-4 p-4 bg-white border-[1.2px] rounded-3xl">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-zinc-100">
        {icon}
      </div>
      <div>
        <p className="text-zinc-400 font-medium">{title}</p>
        <p className="text-xl font-semibold">{value}</p>
        <p className={`text-sm ${changeColor}`}>
          {change} <span className="text-zinc-400">{changeDescription}</span>
        </p>
      </div>
    </div>
  );
}
