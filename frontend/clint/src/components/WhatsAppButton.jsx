import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const phoneNumber = '919876543210'; // Replace with real operator contact
  const message = 'Hello! I am planning a trip to Bir Billing and would like to get some information regarding paragliding and stays.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-400 text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
      title="Chat with us on WhatsApp"
    >
      {/* Icon */}
      <MessageCircle className="h-6 w-6" />
      
      {/* Floating text tag */}
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-500 ease-in-out font-medium text-sm whitespace-nowrap">
        Chat with us
      </span>
    </a>
  );
};

export default WhatsAppButton;
