-- ============================================================
-- iStore — Supabase schema
-- شغّل هذا الملف كامل في: Supabase Dashboard > SQL Editor > New query
-- ============================================================

-- 1) جدول الأقسام (Categories) ------------------------------------------------
create table if not exists public.categories (
  id          text primary key,
  name        text not null,
  arabic_name text not null,
  sub_title   text default '',
  image       text not null,
  sort_order  int default 0,
  created_at  timestamptz default now()
);

-- 2) جدول المنتجات (Products) -------------------------------------------------
create table if not exists public.products (
  id              text primary key,
  name            text not null,
  arabic_name     text not null,
  price           numeric not null,
  original_price  numeric,
  image           text not null,
  images          text[],
  images_by_color jsonb,
  colors          jsonb not null default '[]',
  category        text references public.categories(id) on delete set null,
  rating          numeric default 5,
  reviews_count   int default 0,
  is_new          boolean default false,
  specs           jsonb not null default '{}',
  created_at      timestamptz default now()
);

create index if not exists products_category_idx on public.products(category);

-- 3) تفعيل الحماية على مستوى الصفوف (RLS) ------------------------------------
alter table public.categories enable row level security;
alter table public.products   enable row level security;

-- القراءة مفتوحة للجميع (يحتاجها متجر العرض بدون تسجيل دخول)
drop policy if exists "Public read categories" on public.categories;
create policy "Public read categories" on public.categories
  for select using (true);

drop policy if exists "Public read products" on public.products;
create policy "Public read products" on public.products
  for select using (true);

-- الإضافة / التعديل / الحذف مسموح فقط للمستخدمين المسجلين (الأدمن)
drop policy if exists "Authenticated manage categories" on public.categories;
create policy "Authenticated manage categories" on public.categories
  for all to authenticated using (true) with check (true);

drop policy if exists "Authenticated manage products" on public.products;
create policy "Authenticated manage products" on public.products
  for all to authenticated using (true) with check (true);

-- 4) تفعيل التحديث الفوري (Realtime) حتى يظهر أي تعديل من لوحة التحكم فورًا في المتجر
alter publication supabase_realtime add table public.products;
alter publication supabase_realtime add table public.categories;

-- 5) تخزين الصور (Storage) ----------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read product images" on storage.objects;
create policy "Public read product images" on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists "Authenticated upload product images" on storage.objects;
create policy "Authenticated upload product images" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images');

drop policy if exists "Authenticated update product images" on storage.objects;
create policy "Authenticated update product images" on storage.objects
  for update to authenticated using (bucket_id = 'product-images');

drop policy if exists "Authenticated delete product images" on storage.objects;
create policy "Authenticated delete product images" on storage.objects
  for delete to authenticated using (bucket_id = 'product-images');

-- ============================================================
-- انتهى. الخطوة التالية: أنشئ حساب أدمن من
-- Authentication > Users > Add user (بريد إلكتروني + كلمة مرور)
-- ثم سجّل دخولك بنفس البيانات في مشروع istore-admin.
-- ============================================================
