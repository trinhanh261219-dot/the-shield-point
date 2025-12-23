
import { Product } from './types.ts';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Durex Invisible Ultra Thin',
    brand: 'Durex',
    price: 155000,
    description: 'Sản phẩm mỏng nhất của Durex, cảm giác như không đeo gì.',
    category: 'Siêu mỏng',
    image: 'https://images.unsplash.com/photo-1612833609248-55b8e945898d?q=80&w=600&auto=format&fit=crop',
    features: ['Siêu mỏng 0.04mm', 'Truyền nhiệt nhanh', 'Bôi trơn cao cấp']
  },
  {
    id: '2',
    name: 'Sagami Original 0.01',
    brand: 'Sagami',
    price: 245000,
    description: 'Đỉnh cao công nghệ Nhật Bản, mỏng đến mức khó tin.',
    category: 'Siêu mỏng',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop',
    features: ['Polyurethane 0.01mm', 'Không mùi cao su', 'Chịu lực cực tốt']
  },
  {
    id: '3',
    name: 'Durex Performa Longer',
    brand: 'Durex',
    price: 185000,
    description: 'Chứa 5% Benzocain giúp kéo dài thời gian yêu, bền bỉ hơn.',
    category: 'Kéo dài',
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?q=80&w=600&auto=format&fit=crop',
    features: ['Chứa Benzocain', 'Kiểm soát tốt hơn', 'An toàn tuyệt đối']
  },
  {
    id: '4',
    name: 'Durex Pleasuremax Ribbed',
    brand: 'Durex',
    price: 170000,
    description: 'Thiết kế gân và hạt nổi kích thích tối đa cho cả hai.',
    category: 'Gân gai',
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?q=80&w=600&auto=format&fit=crop',
    features: ['Gân nổi', 'Hạt massage', 'Thiết kế ôm sát']
  }
];
