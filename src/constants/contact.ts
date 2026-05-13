/**
 * Dados de contato centralizados - ABENÇOA TUR
 * Atualize aqui para refletir em todo o site.
 */
export const CONTACT = {
  brandName: 'ABENÇOA TUR',
  whatsapp: '557998534408',
  whatsappFormatted: '(79) 9853-4408',
  instagram: 'https://www.instagram.com/abencoa.tur/',
  address: 'Barra dos Coqueiros – Aracaju – Sergipe',
  businessHours: 'Atendimento: 8h às 18h',
} as const;

export const whatsappUrl = (message?: string) => {
  const base = `https://wa.me/${CONTACT.whatsapp}`;
  if (message) return `${base}?text=${encodeURIComponent(message)}`;
  return base;
};