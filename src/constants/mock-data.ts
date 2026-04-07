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

export interface Collection {
  id: string;
  title: string;
  tag: string;
  locationIds: string[]; // references Location ids
  placeArea: string;
  rating: number;
  imageUrl: string;
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
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOecRDATfbSpYcPYqelHAdgnVNy566fblgo3F2p7SmKVHDHTNyNToUhEgNviIy8kcAUTfrgMCZBTakm8uKgPJlExL_FN4pMoU-Bo_8x06LZ87iGO3MnKC8F3yJaWtJBej8rw0HfhQXw8lSxjYvzXAH5BTNX4zIDxizz_7aAGIrKWFYwiEwE0lIoYxiW0JWMmzU2XM7ML-g3wDubAyDG0XNlNjMikZxQ0GiSlLmvmANl7vZeDFLV0K-lsjd0rJ6AW3yjkeTXnwlizE',
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
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCI2ZClGrPSt5pzNvrpw-d8yJIhcGTfvR8vDSoJftVNB6piYG5bcGSHUF5rdG3pRdiScPtj-NbhzlBKtRLMQJ8Y8unxffvA7aemSJHvBk-gcLMvl_U2rGyjBIK0bF5XDljtT2PKN0uQ8h1rnVaqL9SMez6Fl-pZUNg-143YdfHRoSQSiIbzQzIo1-qfg-IkdRRxuQF5cqpEhk_dSmC554_LOxCnsNPPYGel_aWe5c4yrDoydJFMvWsgLp7Es4O7yUvtpn9iY2zunco',
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
    imageUrl: 'https://kegalighthouseresort.com/vnt_upload/news/01_2020/thap_cham_poshanu.jpg',
    address: 'Đồi Bà Nài, Phú Hài, Phan Thiết',
    bestTiming: '15:00 - 17:00',
    price: '15,000 VND',
  },
  {
    id: '6',
    name: 'Suối Tiên (Fairy Stream)',
    description: 'Dòng suối nhỏ chảy qua những khe núi cát vôi đỏ rực, tạo nên khung cảnh như chốn bồng lai tiên cảnh.',
    category: 'Cultural',
    rating: 4.7,
    reviewsCount: '1.5k',
    distance: '18 min from center',
    lat: 10.951,
    lng: 108.215,
    imageUrl: 'https://i0.wp.com/travelmoments.net/wp-content/uploads/2013/09/mui-ne-6.jpg?resize=1170%2C878&ssl=1',
    address: 'Huỳnh Thúc Kháng, Hàm Tiến, Phan Thiết',
    bestTiming: '7:00 AM - 10:00 AM',
    price: '10,000 VND',
  },
  {
    id: '7',
    name: 'Làng Chài Mũi Né',
    description: 'Trải nghiệm nhịp sống hối hả của ngư dân địa phương và thưởng thức hải sản tươi sống ngay tại bến.',
    category: 'Cultural',
    rating: 4.4,
    reviewsCount: '3.2k',
    distance: '20 min from center',
    lat: 10.962,
    lng: 108.256,
    imageUrl: 'https://cdnsgtt.thesaigontimes.vn/wp-content/uploads/2025/04/lang-chai-mui-ne-4-1392x783.jpg',
    address: 'Đường Huỳnh Thúc Kháng, Mũi Né',
    bestTiming: '5:30 AM - 7:30 AM',
    price: 'Free',
  },
  {
    id: '8',
    name: 'Đồi Cát Trắng (Bàu Trắng)',
    description: 'Tiểu sa mạc Sahara của Việt Nam với những triền cát trắng xóa bát ngát ôm trọn hồ sen tĩnh lặng.',
    category: 'Beaches',
    rating: 4.8,
    reviewsCount: '2.5k',
    distance: '45 min from center',
    lat: 11.061,
    lng: 108.423,
    imageUrl: 'https://dulichvietnam.pro.vn/wp-content/uploads/2021/09/1-4.jpg',
    address: 'Hòa Thắng, Bắc Bình, Phan Thiết',
    bestTiming: '5:00 AM - 8:00 AM',
    price: 'Free (Jeep tour extra)',
  },
  {
    id: '9',
    name: 'Hải Đăng Kê Gà',
    description: 'Ngọn hải đăng cổ nhất Việt Nam đứng sừng sững trên hòn đảo đá nhấp nhô giữa biển khơi.',
    category: 'Cultural',
    rating: 4.6,
    reviewsCount: '900',
    distance: '50 min from center',
    lat: 10.697,
    lng: 107.989,
    imageUrl: 'https://cdn3.ivivu.com/2025/07/hai-dang-Ke-Ga-ivivu.jpg',
    address: 'Tân Thành, Hàm Thuận Nam',
    bestTiming: '15:00 - 18:00',
    price: 'Boat fee: 50k VND',
  },
  {
    id: '10',
    name: 'Chùa Núi Tà Cú',
    description: 'Tọa lạc trên đỉnh núi cao với tượng Phật Thích Ca nằm dài 49m lớn nhất Đông Nam Á.',
    category: 'Cultural',
    rating: 4.5,
    reviewsCount: '1.1k',
    distance: '40 min from center',
    lat: 10.825,
    lng: 107.887,
    imageUrl: 'https://media2.gody.vn/public/mytravelmap/images/2020/10/31/vithuoctinhyeu7353/7f3a47c78da2deab6c375137aa2f4081.jpg',
    address: 'Thị trấn Thuận Nam, Hàm Thuận Nam',
    bestTiming: '8:00 AM - 11:00 AM',
    price: 'Cable car extra',
  },
  {
    id: '11',
    name: 'Bãi Đá Ông Địa',
    description: 'Bãi tắm sạch đẹp với bờ kè chắn sóng vươn dài ra biển, nơi lý tưởng để ngắm hoàng hôn.',
    category: 'Beaches',
    rating: 4.5,
    reviewsCount: '1.8k',
    distance: '10 min from center',
    lat: 10.945,
    lng: 108.192,
    imageUrl: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1000&auto=format&fit=crop',
    address: 'Nguyễn Đình Chiểu, Hàm Tiến',
    bestTiming: '16:30 - 18:00',
    price: 'Free',
  },
  {
    id: '12',
    name: 'Dinh Vạn Thủy Tú',
    description: 'Nơi lưu giữ hàng trăm bộ xương cá voi, trong đó có bộ xương cá voi lớn nhất Việt Nam.',
    category: 'Cultural',
    rating: 4.2,
    reviewsCount: '400',
    distance: '5 min from center',
    lat: 10.925,
    lng: 108.098,
    imageUrl: 'https://ik.imagekit.io/tvlk/blog/2023/12/dinh-van-thuy-tu-cover.jpg?tr=dpr-1.5,h-480,q-40,w-1024',
    address: '54 Ngư Ông, Đức Thắng, Phan Thiết',
    bestTiming: '8:00 AM - 5:00 PM',
    price: '15,000 VND',
  },
  {
    id: '13',
    name: 'The Cliff Resort & Residences',
    description: 'Khu nghỉ dưỡng phong cách hiện đại với view biển Paronama tuyệt đẹp từ đồi cao.',
    category: 'Stay',
    rating: 4.7,
    reviewsCount: '1.2k',
    distance: '8 min from center',
    lat: 10.941,
    lng: 108.179,
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop',
    address: 'Khu phố 5, Phú Hài, Phan Thiết',
    bestTiming: 'Check-in 2:00 PM',
    price: '$$$$',
  },
  {
    id: '14',
    name: 'Làng Chài Quán',
    description: 'Thưởng thức hải sản phong cách bản địa trong không gian mở, đón gió biển Mũi Né.',
    category: 'Dining',
    rating: 4.4,
    reviewsCount: '700',
    distance: '15 min from center',
    lat: 10.957,
    lng: 108.241,
    imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1000&auto=format&fit=crop',
    address: '159 Huỳnh Thúc Kháng, Mũi Né',
    bestTiming: '17:00 - 22:00',
    price: '$$',
  },
  {
    id: '15',
    name: 'Dragon Beach Bar',
    description: 'Chill cùng âm nhạc điện tử và đồ uống sáng tạo ngay sát bờ cát trắng.',
    category: 'Dining',
    rating: 4.6,
    reviewsCount: '500',
    distance: '10 min from center',
    lat: 10.942,
    lng: 108.197,
    imageUrl: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=1000&auto=format&fit=crop',
    address: '120/1 Nguyễn Đình Chiểu, Hàm Tiến',
    bestTiming: '20:00 - Late',
    price: '$$$',
  },
];

export const mockCollections: Collection[] = [
  {
    id: "c1",
    title: "Top 5 Golden Hour Spots",
    tag: "Desert Vibes",
    locationIds: ["1", "5"], // IDs of White Sand Dunes & Poshanu Tower
    placeArea: "Mui Ne",
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1544415849-01b44ec6eb6e?q=80&w=1000&auto=format&fit=crop" // Sample dune image
  },
  {
    id: "c2",
    title: "Hidden Fishing Villages",
    tag: "Local Life",
    locationIds: ["3", "4"], // Fishing village etc
    placeArea: "Coastal Route",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1629809819614-72a3928a3070?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "c3",
    title: "Secret Beach Retreats",
    tag: "Relaxation",
    locationIds: ["2"], 
    placeArea: "Tien Thanh",
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1616422894371-d6a066eb4b23?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "c4",
    title: "Historical Wonders",
    tag: "Heritage",
    locationIds: ["5", "9", "10", "12"], // Poshanu, Ke Ga, Ta Cu, Van Thuy Tu
    placeArea: "Multi-district",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "c5",
    title: "Luxury Beach Escapes",
    tag: "Premium",
    locationIds: ["4", "13"], // Anantara, The Cliff
    placeArea: "Phu Hai",
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop"
  }
];
