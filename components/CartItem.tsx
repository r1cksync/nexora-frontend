'use client';

import { CartItem } from '@/types';
import { formatPrice } from '@/lib/utils';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import Image from 'next/image';

interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export default function CartItemComponent({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
      <Image
        src={item.image}
        alt={item.name}
        width={100}
        height={100}
        className="w-24 h-24 object-cover rounded"
      />

      <div className="flex-1">
        <h3 className="font-semibold text-lg">{item.name}</h3>
        <p className="text-gray-600">{formatPrice(item.price)}</p>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
          className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition"
          disabled={item.quantity <= 1}
        >
          <FaMinus />
        </button>
        <span className="px-4 py-2 bg-gray-100 rounded font-semibold">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
          className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          <FaPlus />
        </button>
      </div>

      <div className="text-right">
        <p className="font-bold text-lg">{formatPrice(item.price * item.quantity)}</p>
        <button
          onClick={() => onRemove(item.productId)}
          className="text-red-500 hover:text-red-700 transition mt-2"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
}
