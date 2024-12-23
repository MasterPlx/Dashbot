'use client'
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type Props = {
  placeholder: string;
  icon?: string;
  type: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function InputWithIcon({
  placeholder,
  type,
  value,
  onChange,
}: Props) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="relative">
      <input
        type={isPasswordVisible && type === "password" ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="appearance-none font-medium rounded-lg block w-full px-4 py-3 pr-12 border border-gray-400 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-700 sm:text-sm"
      />
      {type === "password" && (
        <div
          className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
          onClick={togglePasswordVisibility}
        >
          {isPasswordVisible ? (
            <EyeOff className="text-gray-600 w-5 h-5" />
          ) : (
            <Eye className="text-gray-600 w-5 h-5" />
          )}
        </div>
      )}
    </div>
  );
}
