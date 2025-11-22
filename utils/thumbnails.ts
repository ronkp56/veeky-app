export const getThumbnailForLocation = (location: string): string => {
  if (location.includes('Greece') || location.includes('Santorini')) 
    return 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&h=600&fit=crop';
  if (location.includes('Dubai')) 
    return 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=600&fit=crop';
  if (location.includes('Barcelona') || location.includes('Spain')) 
    return 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&h=600&fit=crop';
  if (location.includes('Alps') || location.includes('Swiss')) 
    return 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=400&h=600&fit=crop';
  return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=600&fit=crop';
};
