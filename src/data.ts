import { Product, Category, Guarantee } from './types';
import iphoneImg from './iphone-category.png';
import headphoneImg from './headphone-category.png';
import watchImg from './watch-category.png';
import androidImg from './6-Photoroom.png';
import s24UltraImg from './8.png';
import chargersImg from './chargers-category.png';
import casesImg from './cases-category.png';
import androidCategoryImg from './android-category.png';

export const CATEGORIES: Category[] = [
  {
    id: 'iphone',
    name: 'iPhone',
    arabicName: 'أجهزة الآيفون',
    subTitle: 'أحدث هواتف آيفون الأصلية',
    image: iphoneImg,
    useSlice: false
  },
  {
    id: 'accessories',
    name: 'Accessories',
    arabicName: 'سماعات',
    subTitle: 'ايربودز وسماعات معتمدة',
    image: headphoneImg,
    useSlice: false
  },
  {
    id: 'watch',
    name: 'Apple Watch',
    arabicName: 'ساعات',
    subTitle: 'ساعات أبل الذكية والأنيقة',
    image: watchImg,
    useSlice: false
  },
  {
    id: 'chargers',
    name: 'Chargers & Cables',
    arabicName: 'شواحن وكابلات',
    subTitle: 'سرعة وأمان فائقين',
    image: chargersImg,
    useSlice: false
  },
  {
    id: 'cases',
    name: 'Cases & Protection',
    arabicName: 'كفرات',
    subTitle: 'أناقة وحماية صلبة',
    image: casesImg,
    useSlice: false
  },
  {
    id: 'android',
    name: 'Android',
    arabicName: 'سيكشن الأندرويد',
    subTitle: 'هواتف أندرويد القوية والمميزة',
    image: androidCategoryImg,
    useSlice: false
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'iphone-15-pro-max',
    name: 'iPhone 15 Pro Max',
    arabicName: 'آيفون 15 برو ماكس',
    price: 54999,
    originalPrice: 59999,
    image: '/input_file_2.png', // index 0 (0% objectPosition)
    category: 'iphone',
    rating: 4.9,
    reviewsCount: 1420,
    colors: [
      { name: 'Natural Titanium', hex: '#8F8A80', bgClass: 'bg-[#8F8A80]' },
      { name: 'Blue Titanium', hex: '#2F4452', bgClass: 'bg-[#2F4452]' },
      { name: 'White Titanium', hex: '#F2F1ED', bgClass: 'bg-[#F2F1ED]' },
      { name: 'Black Titanium', hex: '#35393B', bgClass: 'bg-[#35393B]' }
    ],
    specs: {
      screen: 'OLED Super Retina XDR 6.7"',
      processor: 'A17 Pro Bionic',
      camera: '48MP + 12MP + 12MP (5x Zoom)',
      battery: '4441 mAh (29W Charging)'
    }
  },
  {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    arabicName: 'آيفون 15 برو',
    price: 47999,
    originalPrice: 51999,
    image: '/input_file_2.png', // index 1 (25% objectPosition)
    category: 'iphone',
    rating: 4.8,
    reviewsCount: 980,
    colors: [
      { name: 'Natural Titanium', hex: '#8F8A80', bgClass: 'bg-[#8F8A80]' },
      { name: 'Blue Titanium', hex: '#2F4452', bgClass: 'bg-[#2F4452]' },
      { name: 'White Titanium', hex: '#F2F1ED', bgClass: 'bg-[#F2F1ED]' },
      { name: 'Black Titanium', hex: '#35393B', bgClass: 'bg-[#35393B]' }
    ],
    specs: {
      screen: 'OLED Super Retina XDR 6.1"',
      processor: 'A17 Pro Bionic',
      camera: '48MP + 12MP + 12MP (3x Zoom)',
      battery: '3274 mAh (27W Charging)'
    }
  },
  {
    id: 'iphone-15',
    name: 'iPhone 15',
    arabicName: 'آيفون 15',
    price: 36999,
    originalPrice: 39999,
    image: '/input_file_2.png', // index 2 (50% objectPosition)
    category: 'iphone',
    isNew: true,
    rating: 4.7,
    reviewsCount: 650,
    colors: [
      { name: 'Blue', hex: '#A1C5D9', bgClass: 'bg-[#A1C5D9]' },
      { name: 'Green', hex: '#C1DFD1', bgClass: 'bg-[#C1DFD1]' },
      { name: 'Pink', hex: '#EFC9D6', bgClass: 'bg-[#EFC9D6]' },
      { name: 'Yellow', hex: '#F8EEBD', bgClass: 'bg-[#F8EEBD]' },
      { name: 'Black', hex: '#2D3134', bgClass: 'bg-[#2D3134]' }
    ],
    specs: {
      screen: 'OLED Super Retina XDR 6.1"',
      processor: 'A16 Bionic',
      camera: '48MP + 12MP',
      battery: '3349 mAh (20W Charging)'
    }
  },
  {
    id: 'iphone-14',
    name: 'iPhone 14',
    arabicName: 'آيفون 14',
    price: 29999,
    originalPrice: 33999,
    image: '/input_file_2.png', // index 3 (75% objectPosition)
    category: 'iphone',
    rating: 4.6,
    reviewsCount: 1120,
    colors: [
      { name: 'Midnight', hex: '#1D2327', bgClass: 'bg-[#1D2327]' },
      { name: 'Blue', hex: '#A1C5D9', bgClass: 'bg-[#A1C5D9]' },
      { name: 'Purple', hex: '#D2CDDF', bgClass: 'bg-[#D2CDDF]' },
      { name: 'Starlight', hex: '#FAF6F0', bgClass: 'bg-[#FAF6F0]' },
      { name: 'Red', hex: '#E11D48', bgClass: 'bg-[#E11D48]' }
    ],
    specs: {
      screen: 'OLED Super Retina XDR 6.1"',
      processor: 'A15 Bionic',
      camera: '12MP + 12MP',
      battery: '3279 mAh (20W Charging)'
    }
  },
  {
    id: 'airpods-pro-2',
    name: 'AirPods Pro 2',
    arabicName: 'ايربودز برو 2',
    price: 6999,
    originalPrice: 7999,
    image: '/input_file_2.png', // index 4 (100% objectPosition)
    category: 'accessories',
    rating: 4.9,
    reviewsCount: 2310,
    colors: [
      { name: 'White', hex: '#FFFFFF', bgClass: 'bg-white border border-gray-200' },
      { name: 'Black Case', hex: '#111827', bgClass: 'bg-gray-900' }
    ],
    specs: {
      screen: 'Active Noise Cancellation',
      processor: 'Apple H2 Chip',
      camera: 'Touch Controls on Stem',
      battery: 'Up to 6 hours listening time'
    }
  },
  {
    id: 'galaxy-s24-ultra',
    name: 'Samsung Galaxy S24 Ultra',
    arabicName: 'سامسونج جالكسي S24 ألترا',
    price: 52000,
    originalPrice: 56000,
    image: s24UltraImg,
    category: 'android',
    isNew: true,
    rating: 4.9,
    reviewsCount: 420,
    colors: [
      { name: 'Titanium Gray', hex: '#8E8B82', bgClass: 'bg-[#8E8B82]' },
      { name: 'Titanium Black', hex: '#2B2B2B', bgClass: 'bg-[#2B2B2B]' },
      { name: 'Titanium Yellow', hex: '#ECE3C9', bgClass: 'bg-[#ECE3C9]' }
    ],
    specs: {
      screen: 'Dynamic AMOLED 2X 6.8"',
      processor: 'Snapdragon 8 Gen 3',
      camera: '200MP + 50MP + 12MP + 10MP (S-Pen support)',
      battery: '5000 mAh (45W Fast Charging)'
    }
  }
];

export const GUARANTEES: Guarantee[] = [
  {
    title: 'ضمان رسمي',
    description: 'ضمان معتمد من أبل',
    iconName: 'ShieldCheck',
    color: 'from-blue-400 to-blue-600'
  },
  {
    title: 'توصيل سريع',
    description: 'خلال 24 ساعة',
    iconName: 'Truck',
    color: 'from-teal-400 to-teal-600'
  },
  {
    title: 'دفع آمن',
    description: 'طرق دفع متعددة',
    iconName: 'Lock',
    color: 'from-purple-400 to-purple-600'
  },
  {
    title: 'دعم فني',
    description: '24/7 لخدمتك',
    iconName: 'Headphones',
    color: 'from-orange-400 to-orange-600'
  }
];

export const BOTTOM_FEATURES = [
  {
    title: 'عروض حصرية',
    desc: 'خصومات مستمرة',
    icon: 'Gift'
  },
  {
    title: 'أسعار تنافسية',
    desc: 'أفضل الأسعار',
    icon: 'Tag'
  },
  {
    title: 'منتجات أصلية 100%',
    desc: 'من Apple المعتمدة',
    icon: 'Apple'
  },
  {
    title: 'استبدال خلال 14 يوم',
    desc: 'سهولة الاستبدال',
    icon: 'RefreshCw'
  }
];
