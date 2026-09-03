export const CATEGORIES = [
    { id: 'jewelry', label: 'Jewelry', icon: '💍', color: '#e6007a' },
    { id: 'decor', label: 'Home Decor', icon: '🪔', color: '#ff8a00' },
    { id: 'textiles', label: 'Sarees & Textiles', icon: '🥻', color: '#7b2ff7' },
    { id: 'spices', label: 'Spices & Food', icon: '🌶️', color: '#ff3d68' },
    { id: 'apparel', label: 'Apparel', icon: '🧵', color: '#00a99d' },
    { id: 'pottery', label: 'Pottery', icon: '🏺', color: '#d98e04' },
    { id: 'gifts', label: 'Gifts', icon: '🎁', color: '#c2185b' },
    { id: 'footwear', label: 'Footwear', icon: '👡', color: '#5e35b1' }
];

export function getCategory(id) {
    return CATEGORIES.find((c) => c.id === id) || { id, label: id, icon: '🛍️', color: '#7b2ff7' };
}
