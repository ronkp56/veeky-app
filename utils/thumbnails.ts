export const getThumbnailForCategory = (category: string): string => {
  const thumbnails: Record<string, string> = {
    'Trips': '🏖️',
    'Lodging': '🏨',
    'Entertainment': '🎢',
  };
  return thumbnails[category] || '🌍';
};

export const getThumbnailForLocation = (location: string): string => {
  if (location.includes('Greece') || location.includes('Santorini')) return '🏛️';
  if (location.includes('Dubai')) return '🏙️';
  if (location.includes('Barcelona') || location.includes('Spain')) return '🎨';
  if (location.includes('Alps') || location.includes('Swiss')) return '⛷️';
  return '🌍';
};
