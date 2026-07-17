import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Product, Category } from '../types';

// Maps a row from the `products` table (snake_case / jsonb) to the app's Product type.
function mapProductRow(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    arabicName: row.arabic_name,
    price: Number(row.price),
    originalPrice: row.original_price != null ? Number(row.original_price) : undefined,
    image: row.image,
    images: row.images ?? undefined,
    imagesByColor: row.images_by_color ?? undefined,
    colors: row.colors ?? [],
    category: row.category,
    rating: row.rating != null ? Number(row.rating) : 5,
    reviewsCount: row.reviews_count ?? 0,
    isNew: row.is_new ?? false,
    condition: row.condition === 'used' ? 'used' : 'new',
    specs: row.specs ?? { screen: '', processor: '', camera: '', battery: '' },
  };
}

function mapCategoryRow(row: any): Category {
  return {
    id: row.id,
    name: row.name,
    arabicName: row.arabic_name,
    subTitle: row.sub_title,
    image: row.image,
  };
}

interface StoreData {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useStoreData(): StoreData {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick(t => t + 1), []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const [catRes, prodRes] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order', { ascending: true }),
        supabase.from('products').select('*').order('created_at', { ascending: false }),
      ]);

      if (cancelled) return;

      if (catRes.error || prodRes.error) {
        setError(catRes.error?.message || prodRes.error?.message || 'حدث خطأ أثناء تحميل البيانات');
        setLoading(false);
        return;
      }

      setCategories((catRes.data || []).map(mapCategoryRow));
      setProducts((prodRes.data || []).map(mapProductRow));
      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [tick]);

  // Keep the storefront live: refresh automatically when the admin app
  // inserts/updates/deletes a product or category (Supabase Realtime).
  useEffect(() => {
    const channel = supabase
      .channel('public-store-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => refetch())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => refetch())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  return { products, categories, loading, error, refetch };
}
