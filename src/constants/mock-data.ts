export type Category = 'All' | 'Beaches' | 'Dining' | 'Stay' | 'Cultural';

export interface Location {
  id: string;
  name: string;
  description: string;
  category: Category;
  rating: number;
  reviewsCount: string;
  distance: string;
  lat: number;
  lng: number;
  imageUrl: string;
  address: string;
  bestTiming?: string;
  price?: string;
}

export const mockLocations: Location[] = [
  {
    id: '1',
    name: 'Bãi Rạng Beach',
    description: 'Bãi tắm đẹp nhất Phan Thiết với những rặng dừa xanh ngát và làn nước trong vắt.',
    category: 'Beaches',
    rating: 4.8,
    reviewsCount: '1.2k',
    distance: '15 min from center',
    lat: 10.957,
    lng: 108.232,
    imageUrl: 'https://images.unsplash.com/photo-1544415849-01b44ec6eb6e?q=80&w=1000&auto=format&fit=crop',
    address: '15 Huỳnh Thúc Kháng, Hàm Tiến, Phan Thiết',
    bestTiming: '6:00 AM - 8:00 AM',
    price: 'Free',
  },
  {
    id: '2',
    name: 'Đồi Cát Bay Mũi Né',
    description: 'Chiêm ngưỡng vẻ đẹp kỳ ảo của những đồi cát thay đổi hình dáng theo từng đợt gió.',
    category: 'Cultural',
    rating: 4.6,
    reviewsCount: '850',
    distance: '25 min from center',
    lat: 10.9556,
    lng: 108.281,
    imageUrl: 'https://plus.unsplash.com/premium_photo-1661962388062-84db53e3fa29?q=80&w=1000&auto=format&fit=crop',
    address: 'Khu phố 5, Mũi Né, Phan Thiết',
    bestTiming: '5:00 AM - 7:00 AM (Sunrise)',
    price: 'Free',
  },
  {
    id: '3',
    name: 'Nhà Hàng Cây Bàng',
    description: 'Địa điểm thưởng thức hải sản tươi sống nổi tiếng lâu đời với view biển lộng gió.',
    category: 'Dining',
    rating: 4.5,
    reviewsCount: '2k+',
    distance: '10 min from center',
    lat: 10.941,
    lng: 108.188,
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop',
    address: '2 - 4 Nguyễn Đình Chiểu, Hàm Tiến',
    bestTiming: '18:00 - 21:00',
    price: '$$$',
  },
  {
    id: '4',
    name: 'Anantara Mui Ne Resort',
    description: 'Khu nghỉ dưỡng sang trọng kết hợp giữa văn hóa Việt Nam và phong cách hiện đại.',
    category: 'Stay',
    rating: 4.9,
    reviewsCount: '500+',
    distance: '12 min from center',
    lat: 10.943,
    lng: 108.205,
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1000&auto=format&fit=crop',
    address: 'Mui Ne Beach, 12A Nguyen Dinh Chieu',
    bestTiming: 'All day',
    price: '$$$$',
  },
  {
    id: '5',
    name: 'Tháp Chàm Poshanư',
    description: 'Nhóm di tích đền tháp của vương quốc Chăm Pa cổ đại, mang đậm giá trị lịch sử.',
    category: 'Cultural',
    rating: 4.3,
    reviewsCount: '650',
    distance: '5 min from center',
    lat: 10.932,
    lng: 108.138,
    imageUrl: 'https://images.unsplash.com/photo-1616422894371-d6a066eb4b23?q=80&w=1000&auto=format&fit=crop',
    address: 'Đồi Bà Nài, Phú Hài, Phan Thiết',
    bestTiming: '15:00 - 17:00',
    price: '15,000 VND',
  }
];
