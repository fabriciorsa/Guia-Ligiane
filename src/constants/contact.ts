/**
 * Dados de contato centralizados - Trilhas de Sergipe
 * Atualize aqui para refletir em todo o site.
 */
export const CONTACT = {
  brandName: 'Trilhas de Sergipe',
  whatsapp: '5598992265003',
  whatsappFormatted: '(98) 99226-5003',
  email: 'contato@trilhasdesergipe.com.br',
  address: 'Aracaju, Sergipe - Brasil',
  businessHours: 'Atendimento: 8h às 18h',
} as const;

export const whatsappUrl = (message?: string) => {
  const base = `https://wa.me/${CONTACT.whatsapp}`;
  if (message) return `${base}?text=${encodeURIComponent(message)}`;
  return base;
};
