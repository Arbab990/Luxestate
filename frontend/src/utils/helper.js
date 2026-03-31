export const formatPrice = (price) => {
  if (price >= 10000000) {
    const crore = price / 10000000;
    return `₹${Number(crore.toFixed(1))} Cr`;
  }

  if (price >= 100000) {
    const lakh = price / 100000;
    return `₹${Number(lakh.toFixed(1))} Lakh`;
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};


export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const categoryIcons = {
  house:      '🏠',
  apartment:  '🏢',
  condo:      '🏙️',
  villa:      '🏛️',
  studio:     '🛋️',
  commercial: '🏪',
};

export const getCategoryColor = (category) => {
  const colors = {
    house:      'bg-emerald-500/20 text-emerald-700 border border-emerald-500/30',
    apartment:  'bg-blue-500/20 text-blue-700 border border-blue-500/30',
    condo:      'bg-purple-500/20 text-purple-700 border border-purple-500/30',
    villa:      'bg-amber-500/20 text-amber-700 border border-amber-500/30',
    studio:     'bg-pink-500/20 text-pink-700 border border-pink-500/30',
    commercial: 'bg-orange-500/20 text-orange-700 border border-orange-500/30',
  };
  return colors[category] || 'bg-gray-500/20 text-gray-700';
};

export const getPlaceholderImage = (index = 0) => {
  const images = [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop',
  ];
  return images[index % images.length];
};