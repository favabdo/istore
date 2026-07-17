import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, 
  Search, 
  ShieldCheck, 
  Truck, 
  Lock, 
  Headphones, 
  ArrowLeft, 
  ArrowRight, 
  Play, 
  Gift, 
  Tag, 
  RefreshCw, 
  X, 
  Plus, 
  Minus, 
  MessageCircle, 
  Check, 
  ExternalLink,
  Trash2,
  Settings,
  Edit3
} from 'lucide-react';
import { CATEGORIES as DEFAULT_CATEGORIES, GUARANTEES, BOTTOM_FEATURES } from './data';
import { Product, Category, CartItem } from './types';
import { useStoreData } from './hooks/useStoreData';

// Premium high-end brand asset imports (including logo & 3D background elements)
import logoImg from './571121285_799579552713444_3083899457598797698_n-Photoroom.png';
import img5 from './5-Photoroom.png';
import img6 from './6-Photoroom.png';
import img8 from './8.png';
import chatgptBg from './chatgpt_bg.png';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'iphone' | 'accessories' | 'watch' | 'ipad'>('home');
  const [isIslandOpen, setIsIslandOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const islandRef = useRef<HTMLDivElement>(null);
  const mobileIslandRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const isClickInsideDesktop = islandRef.current?.contains(target);
      const isClickInsideMobile = mobileIslandRef.current?.contains(target);
      if (!isClickInsideDesktop && !isClickInsideMobile) {
        setIsIslandOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMouseEnter = () => {
    if (window.innerWidth >= 1024) {
      setIsIslandOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 1024) {
      setIsIslandOpen(false);
    }
  };

  const toggleIsland = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsIslandOpen(prev => !prev);
  };


  // Custom Toast Notification State
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: 'success' | 'info' | 'error';
  }>({
    isOpen: false,
    message: '',
    type: 'success'
  });

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ isOpen: true, message, type });
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, isOpen: false }));
  };

  // Auto-hide toast after 3.5 seconds
  React.useEffect(() => {
    if (toast.isOpen) {
      const timer = setTimeout(() => {
        closeToast();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast.isOpen]);

  // Custom Confirmation Modal State
  const [customConfirm, setCustomConfirm] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const triggerConfirm = (title: string, message: string, onConfirm: () => void) => {
    setCustomConfirm({
      isOpen: true,
      title,
      message,
      onConfirm
    });
  };

  // Interactive Filter States
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categorySort, setCategorySort] = useState('default');

  // Live product & category data coming from Supabase (shared with the admin app)
  const { products: PRODUCTS, categories: fetchedCategories, loading: storeLoading, error: storeError } = useStoreData();
  // Until the admin adds categories in Supabase, keep showing the original category images/section
  const CATEGORIES = fetchedCategories.length > 0 ? fetchedCategories : DEFAULT_CATEGORIES;

  // Admin Security States
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('sharkawy_admin_logged_in') === 'true';
  });
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Deleted Product IDs State (allows deleting default products)
  const [deletedProductIds, setDeletedProductIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('sharkawy_deleted_product_ids');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse deleted product ids:', e);
      }
    }
    return [];
  });

  // Custom Products management (Stored in LocalStorage for persistence as requested)
  const [customProducts, setCustomProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('sharkawy_custom_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse custom products:', e);
      }
    }
    return [];
  });

  // Editing a product
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editedProducts, setEditedProducts] = useState<Record<string, Product>>(() => {
    const saved = localStorage.getItem('sharkawy_edited_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse edited products:', e);
      }
    }
    return {};
  });

  const saveEditedProducts = (updated: Record<string, Product>) => {
    setEditedProducts(updated);
    localStorage.setItem('sharkawy_edited_products', JSON.stringify(updated));
  };

  const allProducts = useMemo(() => {
    const base = [...PRODUCTS, ...customProducts];
    const filtered = base.filter(p => !deletedProductIds.includes(p.id));
    return filtered.map(p => editedProducts[p.id] ? { ...p, ...editedProducts[p.id] } : p);
  }, [PRODUCTS, customProducts, deletedProductIds, editedProducts]);

  // Navigation items definition
  const navItems = [
    { id: 'home', label: 'الرئيسية', action: () => { setActiveTab('home'); setSelectedCategory(null); } },
    { id: 'iphone', label: 'ايفون', action: () => { setActiveTab('home'); setSelectedCategory('iphone'); } },
    { id: 'accessories', label: 'سماعات', action: () => { setActiveTab('home'); setSelectedCategory('accessories'); } },
    { id: 'watch', label: 'ساعات', action: () => { setActiveTab('home'); setSelectedCategory('watch'); } },
  ];

  const isTabActive = (id: string) => {
    if (id === 'home') return activeTab === 'home' && !selectedCategory;
    if (id === 'iphone') return selectedCategory === 'iphone';
    if (id === 'accessories') return selectedCategory === 'accessories';
    if (id === 'watch') return selectedCategory === 'watch';
    if (id === 'admin') return activeTab === 'admin';
    return false;
  };

  // Admin Panel Form States
  const [adminName, setAdminName] = useState('');
  const [adminArabicName, setAdminArabicName] = useState('');
  const [adminPrice, setAdminPrice] = useState('');
  const [adminOriginalPrice, setAdminOriginalPrice] = useState('');
  const [adminCategory, setAdminCategory] = useState('iphone');
  const [adminCondition, setAdminCondition] = useState<'new' | 'used'>('new');
  const [adminPresetImg, setAdminPresetImg] = useState('upload');
  const [adminCustomImg, setAdminCustomImg] = useState('');
  const [adminScreen, setAdminScreen] = useState('');
  const [adminProcessor, setAdminProcessor] = useState('');
  const [adminCamera, setAdminCamera] = useState('');
  const [adminBattery, setAdminBattery] = useState('');
  const [adminSelectedColors, setAdminSelectedColors] = useState<string[]>(['Natural Titanium']);
  
  // Extra product images for admin and active image indices
  const [adminExtraImages, setAdminExtraImages] = useState<string[]>([]);
  const extraFileInputRef = useRef<HTMLInputElement>(null);
  const [adminExtraUrlInput, setAdminExtraUrlInput] = useState('');
  const [productImageIndices, setProductImageIndices] = useState<Record<string, number>>({});

  const getProductActiveImage = (prod: Product) => {
    const images = prod.images && prod.images.length > 0 ? prod.images : [prod.image];
    const idx = productImageIndices[prod.id] || 0;
    return images[idx % images.length] || prod.image;
  };

  const nextProductImage = (prod: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const images = prod.images && prod.images.length > 0 ? prod.images : [prod.image];
    if (images.length <= 1) return;
    const currentIdx = productImageIndices[prod.id] || 0;
    setProductImageIndices(prev => ({
      ...prev,
      [prod.id]: (currentIdx + 1) % images.length
    }));
  };

  const prevProductImage = (prod: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const images = prod.images && prod.images.length > 0 ? prod.images : [prod.image];
    if (images.length <= 1) return;
    const currentIdx = productImageIndices[prod.id] || 0;
    setProductImageIndices(prev => ({
      ...prev,
      [prod.id]: (currentIdx - 1 + images.length) % images.length
    }));
  };

  // Local device image upload references
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        showToast('حجم الصورة كبير جداً، الرجاء اختيار صورة أقل من 2 ميجابايت لضمان سرعة التحميل والتحفيظ.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAdminCustomImg(base64String);
        setAdminPresetImg('custom'); // set image source to custom
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('حجم الصورة كبير جداً، الرجاء اختيار صورة أقل من 2 ميجابايت.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdminCustomImg(reader.result as string);
        setAdminPresetImg('custom');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExtraImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('حجم الصورة كبير جداً، الرجاء اختيار صورة أقل من 2 ميجابايت.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAdminExtraImages(prev => [...prev, base64String]);
        showToast('تم إضافة الصورة الإضافية بنجاح!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddExtraUrlImage = () => {
    if (!adminExtraUrlInput.trim()) return;
    setAdminExtraImages(prev => [...prev, adminExtraUrlInput.trim()]);
    setAdminExtraUrlInput('');
    showToast('تم إضافة رابط الصورة الإضافية بنجاح!', 'success');
  };

  const handleRemoveExtraImage = (index: number) => {
    setAdminExtraImages(prev => prev.filter((_, idx) => idx !== index));
    showToast('تم إزالة الصورة الإضافية.', 'info');
  };

  const COLOR_PRESETS = [
    { name: 'Natural Titanium', hex: '#8F8A80', bgClass: 'bg-[#8F8A80]' },
    { name: 'Blue Titanium', hex: '#2F4452', bgClass: 'bg-[#2F4452]' },
    { name: 'White Titanium', hex: '#F2F1ED', bgClass: 'bg-[#F2F1ED]' },
    { name: 'Black Titanium', hex: '#35393B', bgClass: 'bg-[#35393B]' },
    { name: 'Midnight', hex: '#1D2327', bgClass: 'bg-[#1D2327]' },
    { name: 'Starlight', hex: '#FAF6F0', bgClass: 'bg-[#FAF6F0]' },
    { name: 'Blue', hex: '#A1C5D9', bgClass: 'bg-[#A1C5D9]' },
    { name: 'Green', hex: '#C1DFD1', bgClass: 'bg-[#C1DFD1]' },
    { name: 'Pink', hex: '#EFC9D6', bgClass: 'bg-[#EFC9D6]' },
    { name: 'Yellow', hex: '#F8EEBD', bgClass: 'bg-[#F8EEBD]' },
    { name: 'Purple', hex: '#D2CDDF', bgClass: 'bg-[#D2CDDF]' },
    { name: 'Titanium Gray', hex: '#8E8B82', bgClass: 'bg-[#8E8B82]' },
    { name: 'Titanium Black', hex: '#2B2B2B', bgClass: 'bg-[#2B2B2B]' },
    { name: 'White', hex: '#FFFFFF', bgClass: 'bg-white border border-gray-200' },
  ];

  // Handler to add or edit product
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminName.trim() || !adminArabicName.trim() || !adminPrice) {
      showToast('الرجاء ملء جميع الحقول الإلزامية (الاسم، الاسم بالعربي، السعر)', 'error');
      return;
    }

    const priceNum = parseFloat(adminPrice);
    const origPriceNum = adminOriginalPrice ? parseFloat(adminOriginalPrice) : undefined;

    if (isNaN(priceNum)) {
      showToast('الرجاء إدخال سعر صحيح', 'error');
      return;
    }

    // Colors mapping
    const productColors = COLOR_PRESETS.filter(col => adminSelectedColors.includes(col.name));
    if (productColors.length === 0) {
      productColors.push({ name: 'Default', hex: '#6B7280', bgClass: 'bg-gray-500' });
    }

    let finalImage = '';
    if (adminCustomImg.trim()) {
      finalImage = adminCustomImg.trim();
    } else if (adminPresetImg !== 'upload' && adminPresetImg !== 'custom') {
      finalImage = adminPresetImg;
    }

    if (!finalImage) {
      showToast('الرجاء رفع صورة للمنتج أولاً أو اختيار صورة جاهزة من القائمة!', 'error');
      return;
    }

    const finalImages = [finalImage, ...adminExtraImages].filter(Boolean);

    if (editingProductId) {
      const existing = allProducts.find(p => p.id === editingProductId);
      if (!existing) {
        showToast('المنتج المراد تعديله غير موجود', 'error');
        return;
      }

      const updatedProduct: Product = {
        ...existing,
        name: adminName.trim(),
        arabicName: adminArabicName.trim(),
        price: priceNum,
        originalPrice: origPriceNum,
        image: finalImage,
        images: finalImages,
        category: adminCategory,
        condition: adminCondition,
        colors: productColors,
        specs: {
          screen: adminScreen.trim() || existing.specs?.screen || 'شاشة عالية الدقة',
          processor: adminProcessor.trim() || existing.specs?.processor || 'معالج ذكي سريع',
          camera: adminCamera.trim() || existing.specs?.camera || 'كاميرا احترافية فائقة الوضوح',
          battery: adminBattery.trim() || existing.specs?.battery || 'بطارية قوية تدعم الشحن السريع'
        }
      };

      const newEdited = { ...editedProducts, [editingProductId]: updatedProduct };
      saveEditedProducts(newEdited);

      // Also update in customProducts if it is a custom product!
      if (editingProductId.startsWith('custom-prod-')) {
        const updatedCustom = customProducts.map(p => p.id === editingProductId ? updatedProduct : p);
        setCustomProducts(updatedCustom);
        localStorage.setItem('sharkawy_custom_products', JSON.stringify(updatedCustom));
      }

      setEditingProductId(null);
      showToast('تم حفظ تعديلات المنتج بنجاح وتحديث كافة الأقسام!', 'success');
    } else {
      const newProduct: Product = {
        id: `custom-prod-${Date.now()}`,
        name: adminName.trim(),
        arabicName: adminArabicName.trim(),
        price: priceNum,
        originalPrice: origPriceNum,
        image: finalImage,
        images: finalImages,
        category: adminCategory,
        condition: adminCondition,
        rating: 5.0,
        reviewsCount: 1,
        colors: productColors,
        isNew: true,
        specs: {
          screen: adminScreen.trim() || 'شاشة عالية الدقة',
          processor: adminProcessor.trim() || 'معالج ذكي سريع',
          camera: adminCamera.trim() || 'كاميرا احترافية فائقة الوضوح',
          battery: adminBattery.trim() || 'بطارية قوية تدعم الشحن السريع'
        }
      };

      const updated = [...customProducts, newProduct];
      setCustomProducts(updated);
      localStorage.setItem('sharkawy_custom_products', JSON.stringify(updated));
      showToast('تم إضافة المنتج بنجاح وتحديث كافة الأقسام!', 'success');
    }

    // Reset Form
    setAdminName('');
    setAdminArabicName('');
    setAdminPrice('');
    setAdminOriginalPrice('');
    setAdminScreen('');
    setAdminProcessor('');
    setAdminCamera('');
    setAdminBattery('');
    setAdminCustomImg('');
    setAdminPresetImg('upload');
    setAdminSelectedColors(['Natural Titanium']);
    setAdminExtraImages([]);
    setAdminExtraUrlInput('');
    setAdminCondition('new');
  };

  const handleStartEdit = (prod: Product) => {
    setEditingProductId(prod.id);
    setAdminName(prod.name);
    setAdminArabicName(prod.arabicName);
    setAdminPrice(prod.price.toString());
    setAdminOriginalPrice(prod.originalPrice ? prod.originalPrice.toString() : '');
    setAdminCategory(prod.category);
    setAdminCondition(prod.condition === 'used' ? 'used' : 'new');

    if (prod.image.startsWith('data:') || prod.image.startsWith('http')) {
      setAdminCustomImg(prod.image);
      setAdminPresetImg('custom');
    } else {
      setAdminPresetImg(prod.image);
      setAdminCustomImg('');
    }

    const mainImg = prod.image;
    const extras = prod.images ? prod.images.filter(img => img !== mainImg) : [];
    setAdminExtraImages(extras);

    setAdminScreen(prod.specs?.screen || '');
    setAdminProcessor(prod.specs?.processor || '');
    setAdminCamera(prod.specs?.camera || '');
    setAdminBattery(prod.specs?.battery || '');
    setAdminSelectedColors(prod.colors.map(c => c.name));

    const formEl = document.getElementById('admin-product-form');
    formEl?.scrollIntoView({ behavior: 'smooth' });
    showToast(`جاري تعديل المنتج: ${prod.arabicName}`, 'info');
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setAdminName('');
    setAdminArabicName('');
    setAdminPrice('');
    setAdminOriginalPrice('');
    setAdminCategory('iphone');
    setAdminCondition('new');
    setAdminPresetImg('upload');
    setAdminCustomImg('');
    setAdminExtraImages([]);
    setAdminScreen('');
    setAdminProcessor('');
    setAdminCamera('');
    setAdminBattery('');
    setAdminSelectedColors(['Natural Titanium']);
    showToast('تم إلغاء التعديل.', 'info');
  };

  // Handler to delete any product (custom or default)
  const handleDeleteProduct = (id: string) => {
    triggerConfirm(
      'حذف المنتج',
      'هل أنت متأكد من حذف هذا المنتج نهائياً من المتجر؟',
      () => {
        if (id.startsWith('custom-prod-')) {
          const updated = customProducts.filter(p => p.id !== id);
          setCustomProducts(updated);
          localStorage.setItem('sharkawy_custom_products', JSON.stringify(updated));
        } else {
          const updatedDeleted = [...deletedProductIds, id];
          setDeletedProductIds(updatedDeleted);
          localStorage.setItem('sharkawy_deleted_product_ids', JSON.stringify(updatedDeleted));
        }

        // Clean from edits if deleted
        if (editedProducts[id]) {
          const updatedEdits = { ...editedProducts };
          delete updatedEdits[id];
          saveEditedProducts(updatedEdits);
        }

        if (editingProductId === id) {
          handleCancelEdit();
        }

        showToast('تم حذف المنتج بنجاح من كافة أقسام المتجر!', 'success');
      }
    );
  };

  // Handler to delete all products
  const handleDeleteAllProducts = () => {
    triggerConfirm(
      'حذف كافة المنتجات',
      'تحذير! هل أنت متأكد من حذف جميع المنتجات المعروضة بالمتجر بالكامل؟',
      () => {
        setCustomProducts([]);
        localStorage.removeItem('sharkawy_custom_products');
        const allDefaultIds = PRODUCTS.map(p => p.id);
        setDeletedProductIds(allDefaultIds);
        localStorage.setItem('sharkawy_deleted_product_ids', JSON.stringify(allDefaultIds));
        setEditedProducts({});
        localStorage.removeItem('sharkawy_edited_products');
        setEditingProductId(null);
        showToast('تم حذف جميع منتجات المتجر بالكامل!', 'success');
      }
    );
  };

  // Handler to restore all default products & clear deletions
  const handleRestoreAllDefaults = () => {
    triggerConfirm(
      'استعادة المنتجات الافتراضية',
      'هل تريد استعادة جميع المنتجات والبيانات الافتراضية للمتجر بالكامل؟',
      () => {
        setCustomProducts([]);
        localStorage.removeItem('sharkawy_custom_products');
        setDeletedProductIds([]);
        localStorage.removeItem('sharkawy_deleted_product_ids');
        setEditedProducts({});
        localStorage.removeItem('sharkawy_edited_products');
        setEditingProductId(null);
        showToast('تم استعادة الإعدادات والمنتجات الافتراضية للمتجر بنجاح!', 'success');
      }
    );
  };

  // Dedicated Category Page filtered products
  const categorySortedAndFilteredProducts = useMemo(() => {
    if (!selectedCategory) return [];
    
    // Filter by selected category first
    let result = allProducts.filter(p => p.category === selectedCategory);
    
    // Apply header search query if there is any
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.arabicName.includes(searchQuery)
      );
    }
    
    // Apply sorting
    if (categorySort === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (categorySort === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (categorySort === 'rating-desc') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }
    
    return result;
  }, [selectedCategory, allProducts, searchQuery, categorySort]);
  
  // Cart States
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Product Detail Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalColor, setModalColor] = useState<string>('');
  
  // Selected Colors for each product card
  const [productCardColors, setProductCardColors] = useState<Record<string, string>>({
    'iphone-15-pro-max': 'Natural Titanium',
    'iphone-15-pro': 'Blue Titanium',
    'iphone-15': 'Blue',
    'iphone-14': 'Purple',
    'airpods-pro-2': 'White'
  });

  // active sidebar dot state
  const [activeGuaranteeDot, setActiveGuaranteeDot] = useState(1); // Second dot active in screenshot

  // Chat Panel State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{sender: 'user' | 'support', text: string}[]>([
    { sender: 'support', text: 'مرحباً بك في Sharkawy Group! كيف يمكننا مساعدتك اليوم؟' }
  ]);
  const [newMsg, setNewMsg] = useState('');

  // Video Playing Overlay state
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Lock background scroll whenever any overlay/modal/drawer is open.
  // Without this, the page behind a fixed overlay stays scrollable too, and on
  // mobile browsers (especially iOS Safari) that fight over which layer "owns"
  // the touch/scroll gesture is exactly what makes scrolling feel like it freezes.
  const isAnyOverlayOpen = isCartOpen || !!selectedProduct || isVideoOpen;
  React.useEffect(() => {
    if (isAnyOverlayOpen) {
      const scrollY = window.scrollY;
      const { style } = document.body;
      style.position = 'fixed';
      style.top = `-${scrollY}px`;
      style.left = '0';
      style.right = '0';
      style.width = '100%';
      return () => {
        style.position = '';
        style.top = '';
        style.left = '';
        style.right = '';
        style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isAnyOverlayOpen]);

  // Search Filtered Products
  const filteredProducts = useMemo(() => {
    return allProducts.filter(p => {
      const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
      const matchesSearch = searchQuery 
        ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          p.arabicName.includes(searchQuery)
        : true;
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, allProducts]);

  // Calculations
  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + ((item.product?.price ?? 0) * item.quantity), 0);
  }, [cartItems]);

  // Add to Cart Handler
  const addToCart = (product: Product, colorName?: string) => {
    const finalColor = colorName || productCardColors[product.id] || product.colors[0].name;
    const existing = cartItems.find(
      item => item.product.id === product.id && item.selectedColor === finalColor
    );

    if (existing) {
      setCartItems(cartItems.map(item => 
        item.product.id === product.id && item.selectedColor === finalColor
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { product, quantity: 1, selectedColor: finalColor }]);
    }
    
    // Auto open cart drawer to show action
    setIsCartOpen(true);
  };

  // Modify Quantity
  const updateQuantity = (productId: string, color: string, change: number) => {
    setCartItems(cartItems.map(item => {
      if (item.product.id === productId && item.selectedColor === color) {
        const newQty = item.quantity + change;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter((item): item is CartItem => item !== null));
  };

  // Send Message in Chat Box
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;

    const userMessage = newMsg.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setNewMsg('');

    // Simulate smart support response
    setTimeout(() => {
      let reply = 'شكراً لتواصلك معنا. سيقوم أحد ممثلي خدمة العملاء بالرد عليك فوراً.';
      if (userMessage.includes('سعر') || userMessage.includes('بكم') || userMessage.includes('برو')) {
        reply = 'أسعار هواتف آيفون 15 تبدأ من 36,999 EGP للنسخة العادية و 54,999 EGP لنسخة برو ماكس. يتوفر لدينا تقسيط حتى 24 شهراً!';
      } else if (userMessage.includes('توصيل') || userMessage.includes('شحن')) {
        reply = 'الشحن لدينا سريع جداً ويوصلك في غضون 24 ساعة فقط لجميع المحافظات مع شحن آمن بالكامل.';
      } else if (userMessage.includes('ضمان') || userMessage.includes('اصلي')) {
        reply = 'جميع منتجاتنا في Sharkawy Group أصلية 100٪ بضمان معتمد ورسمي من شركة Apple لمدة عام كامل.';
      }
      setChatMessages(prev => [...prev, { sender: 'support', text: reply }]);
    }, 1000);
  };

  // Reusable product card (used inside each category section on the homepage).
  // Shows name, price, discount, and condition (new/used) BEFORE the shopper opens it.
  const renderProductGridCard = (prod: Product) => {
    const activeColorName = productCardColors[prod.id] || prod.colors[0]?.name || '';
    const prodIndex = PRODUCTS.findIndex(p => p.id === prod.id);
    const images = prod.images && prod.images.length > 0 ? prod.images : [prod.image];
    const activeImg = getProductActiveImage(prod);

    return (
      <div 
        key={prod.id}
        className="glass-card glass-shine rounded-3xl overflow-hidden cursor-pointer flex flex-col justify-between h-[230px] md:h-[250px] border border-white/30 hover:border-white/60 shadow-md group relative"
      >
        {/* Condition badge (new/used) - Absolute Top Left, visible before opening */}
        <span className={`absolute top-3 left-3 text-white font-extrabold text-[9px] px-2.5 py-1 rounded-full shadow-md z-10 ${
          prod.condition === 'used' ? 'bg-amber-500' : 'bg-emerald-500'
        }`}>
          {prod.condition === 'used' ? 'مستعمل' : 'جديد'}
        </span>

        {/* Slice Image of Product cards from input_file_2.png or custom images */}
        <div 
          className="w-full flex-1 min-h-0 relative group/img overflow-hidden rounded-t-3xl"
          onClick={() => {
            setSelectedProduct(prod);
            setModalColor(activeColorName);
          }}
        >
          <img 
            src={activeImg} 
            alt={prod.arabicName}
            className={`w-full h-full rounded-t-3xl transition-transform duration-500 group-hover:scale-105 ${
              activeImg === "/input_file_2.png" ? 'object-cover' : 'object-contain bg-white/40'
            }`}
            style={activeImg === "/input_file_2.png" ? { 
              objectPosition: `${prodIndex >= 0 ? prodIndex * 25 : 0}% center` 
            } : {}}
            referrerPolicy="no-referrer"
          />

          {images.length > 1 && (
            <>
              {/* Left Navigation Arrow */}
              <button 
                onClick={(e) => prevProductImage(prod, e)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center text-slate-800 hover:scale-110 transition-all z-20 opacity-0 group-hover/img:opacity-100"
              >
                <ArrowLeft className="w-3.5 h-3.5 font-bold" />
              </button>
              {/* Right Navigation Arrow */}
              <button 
                onClick={(e) => nextProductImage(prod, e)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center text-slate-800 hover:scale-110 transition-all z-20 opacity-0 group-hover/img:opacity-100"
              >
                <ArrowRight className="w-3.5 h-3.5 font-bold" />
              </button>

              {/* Dot Indicators */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/25 backdrop-blur-xs px-1.5 py-0.5 rounded-full z-20">
                {images.map((_, i) => (
                  <span 
                    key={i} 
                    className={`w-1 h-1 rounded-full transition-all ${
                      (productImageIndices[prod.id] || 0) === i ? 'bg-white scale-125 w-1.5' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Interactive Overlay on hover for detailed specifications modal */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 pointer-events-none">
            <span className="bg-white/95 backdrop-blur-md text-slate-800 text-[10px] font-bold px-3 py-1 rounded-full shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              عرض المواصفات والسعر
            </span>
          </div>

          {/* Interactive color circles overlay floating on the image */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1 z-10 bg-white/60 backdrop-blur-md px-2 py-1 rounded-full shadow-sm border border-white/30">
            {prod.colors.slice(0, 4).map((col) => {
              const isColorSelected = activeColorName === col.name;
              return (
                <button
                  key={col.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    setProductCardColors({
                      ...productCardColors,
                      [prod.id]: col.name
                    });
                  }}
                  className={`w-3 h-3 rounded-full ${col.bgClass} transition-all duration-300 ${
                    isColorSelected 
                      ? 'ring-2 ring-blue-600 scale-125 shadow-sm' 
                      : 'hover:scale-110 opacity-70'
                  }`}
                  title={col.name}
                />
              );
            })}
          </div>

          {/* Instant Add-to-cart small button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              addToCart(prod, activeColorName);
            }}
            className="absolute bottom-2 left-2 w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 hover:scale-110 transition-all z-10 shadow-md"
            title="أضف للسلة فوراً"
          >
            <Plus className="w-4 h-4 font-bold" />
          </button>
        </div>

        {/* Name & price footer, visible on the closed card so shoppers know what they're about to open */}
        <div 
          className="px-3 py-2 flex flex-col gap-0.5 shrink-0"
          dir="rtl"
          onClick={() => {
            setSelectedProduct(prod);
            setModalColor(activeColorName);
          }}
        >
          <h4 className="font-extrabold text-[11px] sm:text-xs text-slate-900 truncate text-right">{prod.arabicName}</h4>
          <div className="flex items-center gap-1.5">
            <span className="text-blue-600 text-xs sm:text-sm font-black">{prod.price.toLocaleString()} ج.م</span>
            {prod.originalPrice && (
              <span className="text-slate-400 text-[9px] font-semibold line-through">{prod.originalPrice.toLocaleString()} ج.م</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (storeLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 gradient-bg text-slate-700 font-sans" dir="rtl">
        <div className="w-12 h-12 border-4 border-[#c09d53]/30 border-t-[#c09d53] rounded-full animate-spin"></div>
        <p className="font-bold">جاري تحميل المنتجات...</p>
      </div>
    );
  }

  if (storeError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 gradient-bg text-slate-700 font-sans px-6 text-center" dir="rtl">
        <p className="font-black text-lg text-red-600">تعذّر الاتصال بقاعدة البيانات</p>
        <p className="font-bold text-sm text-slate-500 max-w-md">{storeError}</p>
        <p className="font-bold text-xs text-slate-400 max-w-md">
          تأكد من ضبط متغيرات VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY بشكل صحيح.
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden gradient-bg text-slate-800 font-sans pb-16 selection:bg-blue-200">
      
      {/* -------------------- FLOATING 3D GLASS BUBBLES BACKGROUND (Using User-Uploaded Assets) -------------------- */}
      {/* Upper Left 3D Glass Accent */}
      <div className="absolute top-[8%] left-[2%] w-48 h-48 md:w-72 md:h-72 pointer-events-none z-10 animate-float opacity-80 filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.08)]">
        <img 
          src={img5} 
          alt="3D Brand Asset Left" 
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Bottom Right 3D Glass Accent */}
      <div className="absolute top-[55%] right-[1%] w-56 h-56 md:w-80 md:h-80 pointer-events-none z-10 animate-float-delayed opacity-75 filter drop-shadow-[0_15px_32px_rgba(0,0,0,0.12)] rotate-45">
        <img 
          src={img5} 
          alt="3D Brand Asset Right" 
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Top Right 3D Glass Accent */}
      <div className="absolute top-[25%] right-[10%] w-40 h-40 md:w-60 md:h-60 pointer-events-none z-10 animate-float opacity-60 filter drop-shadow-[0_10px_24px_rgba(0,0,0,0.05)]">
        <img 
          src={img5} 
          alt="3D Brand Asset Mid Right" 
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Bottom Left 3D Glass Accent */}
      <div className="absolute top-[75%] left-[2%] w-44 h-44 md:w-64 md:h-64 pointer-events-none z-10 animate-float-delayed opacity-65 filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.08)]">
        <img 
          src={img5} 
          alt="3D Brand Asset Bottom Left" 
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Little Water Drops scattered around */}
      <div className="absolute top-[35%] right-[22%] w-8 h-8 rounded-full bg-white/40 backdrop-blur-md border border-white/50 shadow-inner opacity-70 animate-pulse pointer-events-none"></div>
      <div className="absolute top-[52%] right-[45%] w-5 h-5 rounded-full bg-white/30 backdrop-blur-md border border-white/40 shadow-inner opacity-60 pointer-events-none"></div>
      <div className="absolute top-[18%] left-[45%] w-6 h-6 rounded-full bg-white/40 backdrop-blur-md border border-white/50 shadow-inner opacity-85 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 relative z-20">
        
        {/* =========================================================================================
            HEADER NAVIGATION BAR (Matches input_file_3.png Top Bar Exactly) - SLEEK AND COMPACT
            ========================================================================================= */}
        <header className="w-full mb-8 relative z-50">
          <div className="relative rounded-2xl px-3 sm:px-4 py-2 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 lg:gap-4 border border-white/55 min-h-[48px] sm:min-h-[56px] md:min-h-[62px]">
            
            {/* Isolated Gloss Glass Background Layer */}
            <div className="absolute inset-0 rounded-2xl bg-white/25 backdrop-blur-2xl shadow-[0_15px_35px_-10px_rgba(0,0,0,0.06),inset_0_1px_1.5px_rgba(255,255,255,0.95),inset_0_8px_16px_rgba(255,255,255,0.15),inset_0_-8px_16px_rgba(0,0,0,0.005)] overflow-hidden pointer-events-none z-0">
              {/* Real Apple Glass Gloss/Shine Highlight Line */}
              <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/95 to-transparent z-10"></div>
              {/* Diagonal Reflection Glow mimicking high-end 3D physical glass sheet */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -skew-x-12 scale-150 pointer-events-none z-0"></div>
            </div>
            
            {/* Desktop Left / Mobile Top Row: Logo (Right) and Mobile Actions (Left) */}
            <div className="flex flex-row items-center justify-between w-full lg:w-auto lg:flex-shrink-0 z-10">
              
              {/* Right: Custom Sharkawy Group Brand Logo */}
              <div className="flex items-center gap-1.5 sm:gap-2 cursor-pointer select-none flex-shrink-0" onClick={() => { setSelectedCategory(null); setSearchQuery(''); }}>
                {/* Custom Logo Image with high-end premium branding */}
                <img 
                  src={logoImg} 
                  alt="Sharkawy Group Brand Logo" 
                  className="h-8 xs:h-9 sm:h-10 md:h-11 w-auto object-contain transition-transform hover:scale-105 drop-shadow-[0_2px_6px_rgba(0,0,0,0.04)]"
                  referrerPolicy="no-referrer"
                />
                <div className="flex items-center">
                  <span className="font-extrabold text-xs xs:text-sm sm:text-base md:text-lg tracking-tight text-slate-900 font-sans">Sharkawy Group</span>
                </div>
              </div>

              {/* Mobile Actions: Only rendered on mobile screens to avoid squeezing the center */}
              <div className="flex lg:hidden items-center gap-1 sm:gap-1.5 flex-shrink-0 z-10">
                
                {/* Search Box */}
                <div className="relative flex items-center">
                  <input 
                    type="text" 
                    placeholder="ابحث..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-[#faf8f4]/60 border border-[#e8dfc5]/60 pl-2 pr-6 py-1 rounded-full text-[10px] sm:text-xs font-medium w-14 xs:w-20 sm:w-24 placeholder-slate-500 shadow-inner focus:outline-none focus:border-[#c09d53] focus:ring-1 focus:ring-[#c09d53]/15 text-slate-900 transition-all duration-300"
                  />
                  <Search className="absolute right-1.5 top-1.5 w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-600 pointer-events-none" />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute left-1 top-1.5 w-3 h-3 flex items-center justify-center rounded-full hover:bg-black/10 text-slate-600"
                    >
                      <X className="w-2 h-2" />
                    </button>
                  )}
                </div>

                {/* Shopping Cart Button */}
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center hover:bg-white/30 text-slate-800 transition-colors relative"
                  title="سلة المشتريات"
                >
                  <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="absolute -top-0.5 -left-0.5 w-4 h-4 bg-blue-600 text-[8px] text-white font-extrabold flex items-center justify-center rounded-full shadow-md active-dot-glow animate-bounce">
                    {cartCount}
                  </span>
                </button>

              </div>

            </div>

            {/* Desktop Center Column: Dedicated space for Dynamic Island (No overlay, perfect alignment) */}
            <div className="hidden lg:flex flex-grow justify-center items-center relative z-40 min-h-[36px]">
              <div 
                className="flex items-center justify-center w-full"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <motion.div
                  ref={islandRef}
                  onClick={toggleIsland}
                  animate={{
                    width: isIslandOpen ? "100%" : "135px",
                    height: isIslandOpen ? "40px" : "30px",
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 450, 
                    damping: 30 
                  }}
                  className={`flex items-center justify-center border select-none overflow-hidden cursor-pointer ${
                    isIslandOpen 
                      ? "bg-slate-950/98 border-white/15 shadow-[0_15px_40px_rgba(0,0,0,0.45)] p-1" 
                      : "bg-slate-950 border-white/10 shadow-[0_6px_16px_rgba(0,0,0,0.3)] px-3 py-1"
                  }`}
                  style={{
                    borderRadius: isIslandOpen ? "22px" : "9999px",
                    maxWidth: isIslandOpen ? "720px" : "135px",
                  }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {!isIslandOpen ? (
                      <motion.div
                        key="desktop-closed"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center justify-between w-full gap-2 text-right px-1"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c09d53] animate-pulse shadow-[0_0_8px_rgba(192,157,83,0.85)] flex-shrink-0"></span>
                        <span className="text-white text-[11px] font-extrabold font-sans tracking-wide leading-none flex-grow text-center whitespace-nowrap">
                          {navItems.find(item => isTabActive(item.id))?.label || 'الرئيسية'}
                        </span>
                        <div className="flex items-end gap-0.5 h-2.5 flex-shrink-0">
                          <span className="w-0.5 h-1 bg-[#c09d53] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                          <span className="w-0.5 h-2.5 bg-[#c09d53] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                          <span className="w-0.5 h-1.5 bg-[#c09d53] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="desktop-open"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center justify-between w-full gap-1 xl:gap-2 px-2 py-0.5"
                        dir="rtl"
                      >
                        {navItems.map((item) => {
                          const isActive = isTabActive(item.id);
                          return (
                            <button 
                              key={item.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                item.action();
                              }}
                              className="flex-1 text-center py-1.5 text-xs font-semibold rounded-full relative transition-colors duration-300 cursor-pointer whitespace-nowrap"
                            >
                              {isActive && (
                                <>
                                  {/* Sliding pill behind active item */}
                                  <motion.div 
                                    layoutId="islandActiveGlow" 
                                    className="absolute inset-0 bg-white/10 rounded-full border border-white/10 z-0"
                                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                                  />
                                </>
                              )}
                              <span className={`relative z-10 ${isActive ? 'text-[#c09d53] font-extrabold' : 'text-slate-300 hover:text-white'}`}>
                                {item.label}
                              </span>
                            </button>
                          );
                        })}

                        <button 
                          className="flex-1 text-center py-1.5 text-xs font-semibold rounded-full text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300 cursor-pointer relative whitespace-nowrap"
                          onClick={(e) => {
                            e.stopPropagation();
                            showToast('تم تفعيل أقوى الخصومات والعروض الحصرية حالياً بالموقع!', 'info');
                            setIsIslandOpen(false);
                          }}
                        >
                          عروض
                        </button>

                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsChatOpen(true);
                            setIsIslandOpen(false);
                          }}
                          className="flex-1 text-center py-1.5 text-xs font-bold rounded-full bg-[#c09d53] text-slate-950 hover:bg-[#d6b265] transition-all duration-300 cursor-pointer relative shadow-md whitespace-nowrap"
                        >
                          تواصل معنا
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>

            {/* Desktop Left Actions: Search Box, Cart Trigger (Hidden on Mobile) */}
            <div className="hidden lg:flex items-center gap-1 sm:gap-1.5 flex-shrink-0 z-10">
              
              {/* Search Box */}
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  placeholder="ابحث..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#faf8f4]/60 border border-[#e8dfc5]/60 pl-2 pr-6 py-1 rounded-full text-[10px] sm:text-xs font-medium w-14 xs:w-20 sm:w-28 md:w-36 placeholder-slate-500 shadow-inner focus:outline-none focus:border-[#c09d53] focus:ring-1 focus:ring-[#c09d53]/15 text-slate-900 transition-all duration-300"
                />
                <Search className="absolute right-1.5 top-1.5 w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-600 pointer-events-none" />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute left-1 top-1.5 w-3 h-3 flex items-center justify-center rounded-full hover:bg-black/10 text-slate-600"
                  >
                    <X className="w-2 h-2" />
                  </button>
                )}
              </div>

              {/* Shopping Cart Button */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center hover:bg-white/30 text-slate-800 transition-colors relative"
                title="سلة المشتريات"
              >
                <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="absolute -top-0.5 -left-0.5 w-4 h-4 bg-blue-600 text-[8px] text-white font-extrabold flex items-center justify-center rounded-full shadow-md active-dot-glow animate-bounce">
                  {cartCount}
                </span>
              </button>

            </div>

            {/* Mobile/Tablet Row 2: Centered Dedicated Row for Dynamic Island (Eliminates all overlapping) */}
            <div className="flex lg:hidden justify-center items-center w-full mt-2 sm:mt-2.5 relative z-40 min-h-[36px]">
              <motion.div
                ref={mobileIslandRef}
                onClick={toggleIsland}
                animate={{
                  width: isIslandOpen ? "calc(100vw - 32px)" : "145px",
                  height: isIslandOpen ? 142 : 30,
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 420, 
                  damping: 32 
                }}
                className={`flex items-center justify-center border select-none overflow-hidden cursor-pointer ${
                  isIslandOpen 
                    ? "bg-slate-950/98 border-white/15 shadow-[0_15px_40px_rgba(0,0,0,0.45)]" 
                    : "bg-slate-950 border-white/10 shadow-[0_6px_16px_rgba(0,0,0,0.3)] px-3 py-1"
                }`}
                style={{
                  borderRadius: isIslandOpen ? "22px" : "9999px",
                  maxWidth: "94vw",
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {!isIslandOpen ? (
                    <motion.div
                      key="mobile-closed"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center justify-between w-full gap-2 text-right px-1"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c09d53] animate-pulse shadow-[0_0_8px_rgba(192,157,83,0.85)] flex-shrink-0"></span>
                      <span className="text-white text-[11px] font-extrabold font-sans tracking-wide leading-none flex-grow text-center whitespace-nowrap">
                        {navItems.find(item => isTabActive(item.id))?.label || 'الرئيسية'}
                      </span>
                      <div className="flex items-end gap-0.5 h-2.5 flex-shrink-0">
                        <span className="w-0.5 h-1 bg-[#c09d53] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                        <span className="w-0.5 h-2.5 bg-[#c09d53] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                        <span className="w-0.5 h-1.5 bg-[#c09d53] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="mobile-open"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="w-full text-white"
                      dir="rtl"
                    >
                      <div className="flex flex-wrap items-center justify-center w-full gap-x-1.5 gap-y-2 p-2">
                        {navItems.map((item) => {
                          const isActive = isTabActive(item.id);
                          return (
                            <button
                              key={item.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                item.action();
                              }}
                              className="flex-1 min-w-[28%] max-w-[31%] text-center py-1.5 text-xs font-semibold rounded-full relative transition-colors duration-300 cursor-pointer whitespace-nowrap"
                            >
                              {isActive && (
                                <>
                                  <motion.div 
                                    layoutId="mobileIslandActiveGlow"
                                    className="absolute inset-0 bg-white/10 rounded-full border border-white/10 shadow-[0_1px_6px_rgba(255,255,255,0.05)]"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                  />
                                </>
                              )}
                              <span className={isActive ? "text-[#c09d53] font-bold relative z-10" : "text-slate-300 hover:text-white relative z-10"}>
                                {item.label}
                              </span>
                            </button>
                          );
                        })}

                        <button 
                          className="flex-1 min-w-[28%] max-w-[31%] text-center py-1.5 text-xs font-semibold rounded-full text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300 cursor-pointer relative whitespace-nowrap"
                          onClick={(e) => {
                            e.stopPropagation();
                            showToast('تم تفعيل أقوى الخصومات والعروض الحصرية حالياً بالموقع!', 'info');
                            setIsIslandOpen(false);
                          }}
                        >
                          عروض
                        </button>

                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsChatOpen(true);
                            setIsIslandOpen(false);
                          }}
                          className="flex-1 min-w-[95%] text-center py-1.5 text-xs font-bold rounded-full bg-[#c09d53] text-slate-950 hover:bg-[#d6b265] transition-all duration-300 cursor-pointer relative shadow-md whitespace-nowrap mt-1"
                        >
                          تواصل معنا
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

          </div>
        </header>

        {activeTab === 'admin' ? (
          !isAdminLoggedIn ? (
            <div className="max-w-md mx-auto my-12 bg-white/70 backdrop-blur-md rounded-3xl p-8 border border-slate-200/60 shadow-xl font-sans text-right" dir="rtl">
              <div className="flex flex-col items-center justify-center text-center mb-6">
                <div className="w-16 h-16 bg-[#c09d53]/10 text-[#c09d53] rounded-full flex items-center justify-center mb-4 shadow-inner">
                  <Lock className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-slate-900">لوحة التحكم المحمية</h2>
                <p className="text-slate-500 font-bold text-xs mt-1">هذه الصفحة مخصصة للمسؤولين فقط لإضافة وتعديل وحذف المنتجات.</p>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                if (adminPasswordInput === 'sharkawy2026' || adminPasswordInput === 'admin') {
                  setIsAdminLoggedIn(true);
                  localStorage.setItem('sharkawy_admin_logged_in', 'true');
                  setAdminPasswordInput('');
                  setLoginError('');
                  alert('تم تسجيل الدخول بنجاح كمسؤول للموقع!');
                } else {
                  setLoginError('كلمة المرور غير صحيحة، الرجاء المحاولة مرة أخرى.');
                }
              }} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">كلمة المرور الإدارية *</label>
                  <input 
                    type="password" 
                    required
                    placeholder="أدخل كلمة مرور المسؤول..."
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    className="w-full bg-[#faf8f4]/60 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#c09d53] text-right"
                  />
                  {loginError && (
                    <p className="text-rose-500 text-[10px] font-bold mt-1.5">{loginError}</p>
                  )}
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-[#c09d53] hover:bg-[#b08e43] text-slate-950 font-black text-xs rounded-xl transition-all shadow-md active:scale-95"
                >
                  تسجيل الدخول للمسؤولين
                </button>

                <button 
                  type="button"
                  onClick={() => { setActiveTab('home'); setSelectedCategory(null); }}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all"
                >
                  العودة للرئيسية
                </button>
              </form>
            </div>
          ) : (
            <div className="glass-panel glass-shine rounded-3xl p-6 sm:p-8 md:p-10 border border-white/40 shadow-xl mb-12" dir="rtl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-200/60 mb-8 font-sans">
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Settings className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900">لوحة التحكم وإدارة المنتجات</h2>
                  </div>
                  <p className="text-slate-500 font-bold text-sm sm:text-base">أضف منتجات جديدة للأقسام المختلفة أو احذف المنتجات المضافة بكل سهولة.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      setIsAdminLoggedIn(false);
                      localStorage.removeItem('sharkawy_admin_logged_in');
                      setActiveTab('home');
                      setSelectedCategory(null);
                      alert('تم تسجيل الخروج وقفل لوحة التحكم بنجاح!');
                    }}
                    className="bg-rose-50/80 hover:bg-rose-100 text-rose-600 font-bold text-xs px-5 py-3 rounded-xl transition-all border border-rose-200 flex items-center gap-1 hover:scale-105 active:scale-95"
                  >
                    <span>تسجيل الخروج</span>
                  </button>
                  <button 
                    onClick={() => { setActiveTab('home'); setSelectedCategory(null); }}
                    className="bg-[#faf8f4]/80 border border-[#e8dfc5] hover:bg-slate-50 text-slate-800 font-bold text-xs px-6 py-3 rounded-xl transition-all hover:scale-105 active:scale-95"
                  >
                    العودة للمتجر الرئيسي
                  </button>
                </div>
              </div>

            {/* Stats Summary Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 font-sans">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-slate-500 font-semibold text-xs">إجمالي المنتجات المعروضة</span>
                  <h3 className="text-3xl font-black text-slate-900 mt-1">{allProducts.length}</h3>
                </div>
                <div className="w-12 h-12 bg-blue-600/10 text-blue-600 rounded-xl flex items-center justify-center font-black text-lg">📦</div>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-slate-500 font-semibold text-xs">المنتجات المضافة يدوياً</span>
                  <h3 className="text-3xl font-black text-slate-900 mt-1">{customProducts.length}</h3>
                </div>
                <div className="w-12 h-12 bg-amber-600/10 text-amber-600 rounded-xl flex items-center justify-center font-black text-lg">✨</div>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-slate-500 font-semibold text-xs">عدد الأقسام النشطة</span>
                  <h3 className="text-3xl font-black text-slate-900 mt-1">{CATEGORIES.length}</h3>
                </div>
                <div className="w-12 h-12 bg-emerald-600/10 text-emerald-600 rounded-xl flex items-center justify-center font-black text-lg">📁</div>
              </div>
            </div>

            {/* Global Actions Bar */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-right" dir="rtl">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">⚠️</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">خيارات التحكم المتقدمة للمتجر</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">تتيح لك هذه الخيارات مسح كافة المنتجات أو استعادة المنتجات الافتراضية للموقع بالكامل بضغطة زر واحدة.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <button 
                  onClick={handleDeleteAllProducts}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] sm:text-xs rounded-xl transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف كافة منتجات المتجر</span>
                </button>
                <button 
                  onClick={handleRestoreAllDefaults}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-[10px] sm:text-xs rounded-xl transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-1"
                >
                  <span>استعادة المنتجات الافتراضية</span>
                </button>
              </div>
            </div>

            {/* Main Form + Product Table Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-sans">
              
              {/* Form Column (Col Span 5) */}
              <div id="admin-product-form" className="lg:col-span-5 bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-slate-100 shadow-md">
                <h4 className="font-black text-lg text-slate-900 mb-6 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{editingProductId ? 'تعديل تفاصيل المنتج' : 'إضافة عنصر جديد للمتجر'}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${editingProductId ? 'bg-amber-500' : 'bg-blue-600'}`}></span>
                  </div>
                  {editingProductId && (
                    <button 
                      type="button" 
                      onClick={handleCancelEdit}
                      className="text-rose-500 hover:text-rose-600 text-xs font-bold transition-colors cursor-pointer"
                    >
                      إلغاء التعديل
                    </button>
                  )}
                </h4>

                <form onSubmit={handleAddProduct} className="space-y-4">
                  {/* English Name */}
                  <div className="text-right">
                    <label className="block text-xs font-bold text-slate-700 mb-1">اسم المنتج بالإنجليزية *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. iPhone 15 Pro Max"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  {/* Arabic Name */}
                  <div className="text-right">
                    <label className="block text-xs font-bold text-slate-700 mb-1">اسم المنتج بالعربية *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="مثال: آيفون 15 برو ماكس"
                      value={adminArabicName}
                      onChange={(e) => setAdminArabicName(e.target.value)}
                      className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  {/* Price and Original Price */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-right">
                      <label className="block text-xs font-bold text-slate-700 mb-1">السعر (EGP) *</label>
                      <input 
                        type="number" 
                        required
                        placeholder="مثال: 54999"
                        value={adminPrice}
                        onChange={(e) => setAdminPrice(e.target.value)}
                        className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div className="text-right">
                      <label className="block text-xs font-bold text-slate-700 mb-1">السعر الأصلي (قبل الخصم)</label>
                      <input 
                        type="number" 
                        placeholder="مثال: 59999"
                        value={adminOriginalPrice}
                        onChange={(e) => setAdminOriginalPrice(e.target.value)}
                        className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Category Dropdown */}
                  <div className="text-right">
                    <label className="block text-xs font-bold text-slate-700 mb-1">قسم المنتج *</label>
                    <select 
                      value={adminCategory}
                      onChange={(e) => setAdminCategory(e.target.value)}
                      className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.arabicName}</option>
                      ))}
                    </select>
                  </div>

                  {/* Product Condition (New / Used) - shown on the card before opening it */}
                  <div className="text-right">
                    <label className="block text-xs font-bold text-slate-700 mb-1">حالة المنتج *</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setAdminCondition('new')}
                        className={`py-2.5 rounded-xl text-xs font-extrabold border transition-all ${
                          adminCondition === 'new'
                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                            : 'bg-white/80 text-slate-600 border-slate-200 hover:border-emerald-300'
                        }`}
                      >
                        جديد
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdminCondition('used')}
                        className={`py-2.5 rounded-xl text-xs font-extrabold border transition-all ${
                          adminCondition === 'used'
                            ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                            : 'bg-white/80 text-slate-600 border-slate-200 hover:border-amber-300'
                        }`}
                      >
                        مستعمل
                      </button>
                    </div>
                  </div>

                  {/* Product Image Selection Mode */}
                  <div className="text-right">
                    <label className="block text-xs font-bold text-slate-700 mb-1">صورة المنتج *</label>
                    <div className="space-y-3">
                      <select 
                        value={adminPresetImg}
                        onChange={(e) => {
                          setAdminPresetImg(e.target.value);
                          if (e.target.value !== 'custom' && e.target.value !== 'upload') {
                            setAdminCustomImg('');
                          }
                        }}
                        className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                      >
                        <option value="upload">تحميل صورة من جهازي (موصى به)...</option>
                        <option value="https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=600&auto=format&fit=crop">هاتف ذكي راقي (أندرويد)</option>
                        <option value="https://images.unsplash.com/photo-1588449668338-d13417f16bc5?q=80&w=600&auto=format&fit=crop">سماعة رأس فاخرة (سماعات)</option>
                        <option value="https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=600&auto=format&fit=crop">ساعة يد ذكية (ساعات)</option>
                        <option value="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=600&auto=format&fit=crop">كابلات شحن ممتازة (شواحن)</option>
                        <option value="https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600&auto=format&fit=crop">جراب كفر حماية (جرابات كفرات)</option>
                        <option value="custom">رابط صورة مخصص (URL)...</option>
                      </select>

                      {adminPresetImg === 'upload' && (
                        <div 
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all cursor-pointer relative ${
                            isDragging 
                              ? 'border-blue-500 bg-blue-50/50 scale-[1.02]' 
                              : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                          }`}
                        >
                          <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleImageFileChange}
                            accept="image/*"
                            className="hidden" 
                          />
                          <div className="flex flex-col items-center justify-center gap-1">
                            <span className="text-3xl">📸</span>
                            <p className="text-xs font-bold text-slate-700">اضغط لاختيار صورة أو اسحبها هنا</p>
                            <p className="text-[10px] text-slate-400">يدعم ملفات الصور بحد أقصى 2 ميجابايت</p>
                          </div>
                          {adminCustomImg && (
                            <div className="mt-3 flex items-center justify-center gap-2 bg-white/80 p-1.5 rounded-lg border border-slate-100" onClick={(e) => e.stopPropagation()}>
                              <img src={adminCustomImg} alt="Preview" className="w-10 h-10 object-contain rounded-md" referrerPolicy="no-referrer" />
                              <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1">
                                <Check className="w-3 h-3" /> تم تحميل الصورة بنجاح
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {adminPresetImg === 'custom' && (
                        <input 
                          type="url" 
                          required
                          placeholder="أدخل رابط صورة مباشر (URL)"
                          value={adminCustomImg}
                          onChange={(e) => setAdminCustomImg(e.target.value)}
                          className="w-full bg-[#faf8f4]/60 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 transition-colors text-right"
                        />
                      )}
                    </div>
                  </div>

                  {/* Additional Images Section */}
                  <div className="text-right p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                    <label className="block text-xs font-bold text-slate-800">صور إضافية للمنتج (اختياري - لتمكين المتصفح من التقليب)</label>
                    
                    <div className="flex gap-2">
                      <input 
                        type="url" 
                        placeholder="أدخل رابط صورة مباشر (URL)"
                        value={adminExtraUrlInput}
                        onChange={(e) => setAdminExtraUrlInput(e.target.value)}
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500 transition-colors text-right"
                      />
                      <button 
                        type="button"
                        onClick={handleAddExtraUrlImage}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-2 rounded-xl transition-all flex-shrink-0"
                      >
                        إضافة رابط
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-bold">أو اختر ملفاً من جهازك:</span>
                      <button
                        type="button"
                        onClick={() => extraFileInputRef.current?.click()}
                        className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-[10px] px-3 py-1.5 rounded-lg transition-colors"
                      >
                        تحميل صورة ملف...
                      </button>
                      <input 
                        type="file" 
                        ref={extraFileInputRef}
                        onChange={handleExtraImageFileChange}
                        accept="image/*"
                        className="hidden" 
                      />
                    </div>

                    {/* Previews Grid */}
                    {adminExtraImages.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 mt-2 pt-2 border-t border-slate-200/60">
                        {adminExtraImages.map((img, idx) => (
                          <div key={idx} className="relative aspect-square rounded-lg border border-slate-200 bg-white p-1 flex items-center justify-center group overflow-hidden">
                            <img src={img} alt={`Extra ${idx}`} className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                            <button
                              type="button"
                              onClick={() => handleRemoveExtraImage(idx)}
                              className="absolute inset-0 bg-rose-600/80 hover:bg-rose-600 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white rounded-lg transition-opacity duration-200 text-[10px] font-bold"
                            >
                              حذف
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Colors Checkbox selection */}
                  <div className="text-right">
                    <label className="block text-xs font-bold text-slate-700 mb-1">ألوان المنتج المتوفرة (اختر لوناً واحداً على الأقل)</label>
                    <div className="flex flex-wrap gap-2 mt-1 bg-white/40 p-3 rounded-2xl border border-slate-100 max-h-28 overflow-y-auto no-scrollbar">
                      {COLOR_PRESETS.map((col) => {
                        const isChecked = adminSelectedColors.includes(col.name);
                        return (
                          <button
                            type="button"
                            key={col.name}
                            onClick={() => {
                              if (isChecked) {
                                setAdminSelectedColors(adminSelectedColors.filter(c => c !== col.name));
                              } else {
                                setAdminSelectedColors([...adminSelectedColors, col.name]);
                              }
                            }}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold border transition-all ${
                              isChecked 
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <span className={`w-2.5 h-2.5 rounded-full ${col.bgClass}`} />
                            <span>{col.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Product Specifications section */}
                  <div className="text-right pt-2 border-t border-slate-100">
                    <span className="block text-xs font-bold text-slate-800 mb-2">المواصفات الفنية والتقنية</span>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" 
                        placeholder="الشاشة: Retina 120Hz"
                        value={adminScreen}
                        onChange={(e) => setAdminScreen(e.target.value)}
                        className="bg-white/80 border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-semibold focus:outline-none focus:border-blue-500 transition-colors text-right"
                      />
                      <input 
                        type="text" 
                        placeholder="المعالج: Chip A17 Pro"
                        value={adminProcessor}
                        onChange={(e) => setAdminProcessor(e.target.value)}
                        className="bg-white/80 border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-semibold focus:outline-none focus:border-blue-500 transition-colors text-right"
                      />
                      <input 
                        type="text" 
                        placeholder="الكاميرا: 48MP"
                        value={adminCamera}
                        onChange={(e) => setAdminCamera(e.target.value)}
                        className="bg-white/80 border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-semibold focus:outline-none focus:border-blue-500 transition-colors text-right"
                      />
                      <input 
                        type="text" 
                        placeholder="البطارية: 4441 mAh"
                        value={adminBattery}
                        onChange={(e) => setAdminBattery(e.target.value)}
                        className="bg-white/80 border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-semibold focus:outline-none focus:border-blue-500 transition-colors text-right"
                      />
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <button 
                    type="submit"
                    className={`w-full text-white font-extrabold text-xs py-3 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.01] transition-all cursor-pointer text-center mt-2 bg-gradient-to-r ${
                      editingProductId 
                        ? 'from-amber-500 to-orange-600 shadow-amber-500/10 hover:shadow-amber-500/20' 
                        : 'from-blue-600 to-indigo-600 shadow-blue-500/10 hover:shadow-blue-500/20'
                    }`}
                  >
                    {editingProductId ? 'حفظ التعديلات الحالية' : 'حفظ المنتج وإضافته فوراً'}
                  </button>
                </form>
              </div>

              {/* Product Table Column (Col Span 7) */}
              <div className="lg:col-span-7 bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-slate-100 shadow-md">
                <h4 className="font-black text-lg text-slate-900 mb-6 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span>المنتجات المعروضة بالمتجر ({allProducts.length})</span>
                  <span className="text-slate-400 text-xs font-semibold">تحديث فوري لجميع الأقسام</span>
                </h4>

                {allProducts.length === 0 ? (
                  <div className="text-center py-24 text-slate-400">
                    <span className="text-4xl">✨</span>
                    <p className="font-bold text-sm mt-3">لم يتم إضافة أي منتج مخصص بعد.</p>
                    <p className="text-xs text-slate-400 mt-1">املأ النموذج على اليمين للبدء فوراً في إثراء متجرك!</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto no-scrollbar max-h-[600px] overflow-y-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-slate-200/60 text-slate-400 font-bold">
                          <th className="pb-3 pl-2">المنتج</th>
                          <th className="pb-3 pl-2">القسم</th>
                          <th className="pb-3 pl-2">السعر</th>
                          <th className="pb-3 text-center">إجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-semibold">
                        {allProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3 pl-2 flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-slate-100/80 overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-200">
                                <img src={p.image} alt={p.arabicName} className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />
                              </div>
                              <div>
                                <h5 className="font-bold text-slate-900 text-[11px] sm:text-xs truncate max-w-[120px]">{p.arabicName}</h5>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[9px] text-slate-400 font-mono truncate max-w-[120px] block">{p.name}</span>
                                  {p.id.startsWith('custom-prod-') ? (
                                    <span className="bg-amber-100 text-amber-800 text-[8px] font-extrabold px-1 rounded">مضاف</span>
                                  ) : (
                                    <span className="bg-slate-100 text-slate-600 text-[8px] font-extrabold px-1 rounded">افتراضي</span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 pl-2 text-slate-600">
                              <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                                {CATEGORIES.find(c => c.id === p.category)?.arabicName || p.category}
                              </span>
                            </td>
                            <td className="py-3 pl-2 text-blue-600 font-bold">
                              {p.price.toLocaleString()} EGP
                            </td>
                            <td className="py-3 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button 
                                  onClick={() => handleStartEdit(p)}
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:scale-105 active:scale-95 cursor-pointer ${
                                    editingProductId === p.id 
                                      ? 'bg-amber-500 text-white' 
                                      : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
                                  }`}
                                  title="تعديل تفاصيل المنتج"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors hover:scale-105 active:scale-95 cursor-pointer"
                                  title="حذف المنتج"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          </div>
        )
      ) : selectedCategory ? (
          <div className="w-full mb-12">
            {/* Breadcrumb and Back Button */}
            <div className="flex items-center justify-between gap-4 mb-6" dir="rtl">
              <button 
                onClick={() => setSelectedCategory(null)}
                className="flex items-center gap-2 bg-[#faf8f4]/80 border border-[#e8dfc5] text-slate-800 font-bold text-xs px-5 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95"
              >
                <ArrowRight className="w-4 h-4" />
                <span>العودة للرئيسية</span>
              </button>
              
              <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5 font-sans">
                <span className="hover:text-blue-600 cursor-pointer" onClick={() => setSelectedCategory(null)}>الرئيسية</span>
                <span>&gt;</span>
                <span className="text-slate-800">{CATEGORIES.find(c => c.id === selectedCategory)?.arabicName}</span>
              </div>
            </div>

            {/* Gorgeous Category Banner */}
            {(() => {
              const currentCat = CATEGORIES.find(c => c.id === selectedCategory);
              return (
                <div className="relative rounded-3xl overflow-hidden h-40 sm:h-48 md:h-56 mb-8 border border-white/40 shadow-lg flex items-center justify-between p-6 sm:p-10" dir="rtl">
                  {/* Background Glass Plate */}
                  <div className="absolute inset-0 bg-slate-100/40 backdrop-blur-md z-0" />
                  
                  <div className="relative z-10 text-right max-w-md font-sans">
                    <span className="bg-blue-100 text-blue-800 text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">قسم مميز</span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mt-2 sm:mt-3">{currentCat?.arabicName}</h2>
                    <p className="text-slate-600 font-semibold text-xs sm:text-sm md:text-base mt-1 sm:mt-2">{currentCat?.subTitle}</p>
                  </div>
                  
                  {currentCat?.image && (
                    <div className="relative z-10 w-24 sm:w-32 md:w-44 h-24 sm:h-32 md:h-44 flex-shrink-0">
                      <img 
                        src={currentCat.image} 
                        alt={currentCat.arabicName} 
                        className="w-full h-full object-contain pointer-events-none filter drop-shadow-lg"
                        style={currentCat.useSlice ? { 
                          objectPosition: `${(currentCat.sliceIndex ?? 0) * 25}% center`
                        } : {}}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Sorting & Stats Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 font-sans" dir="rtl">
              <div className="text-right w-full sm:w-auto">
                <p className="text-slate-500 font-bold text-xs sm:text-sm">
                  يتم عرض <span className="text-blue-600 font-black">{categorySortedAndFilteredProducts.length}</span> منتج في قسم <span className="font-extrabold text-slate-800">{CATEGORIES.find(c => c.id === selectedCategory)?.arabicName}</span>
                </p>
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <label className="text-xs font-bold text-slate-500 whitespace-nowrap">ترتيب حسب:</label>
                <select 
                  value={categorySort}
                  onChange={(e) => setCategorySort(e.target.value)}
                  className="bg-white/80 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer shadow-sm"
                >
                  <option value="default">الترتيب الافتراضي</option>
                  <option value="price-asc">السعر: من الأقل للأعلى</option>
                  <option value="price-desc">السعر: من الأعلى للأقل</option>
                  <option value="rating-desc">التقييم: الأعلى تقييماً</option>
                </select>
              </div>
            </div>

            {/* Dedicated Category Product Grid */}
            {categorySortedAndFilteredProducts.length === 0 ? (
              <div className="glass-panel rounded-3xl p-16 text-center border border-white/30 max-w-lg mx-auto mt-8 font-sans" dir="rtl">
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 font-black text-2xl">📦</div>
                <h3 className="text-xl font-black text-slate-900">لا توجد منتجات حالياً</h3>
                <p className="text-slate-500 font-semibold text-xs mt-2">لم يتم إضافة أي منتجات لهذا القسم حتى الآن.</p>
                <div className="flex items-center justify-center gap-4 mt-6">
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className="bg-white border border-slate-200 text-slate-700 font-bold text-xs px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    العودة للرئيسية
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 font-sans">
                {categorySortedAndFilteredProducts.map((prod) => {
                  const activeColorName = productCardColors[prod.id] || prod.colors[0]?.name || '';
                  const prodIndex = PRODUCTS.findIndex(p => p.id === prod.id);
                  const images = prod.images && prod.images.length > 0 ? prod.images : [prod.image];
                  const activeImg = getProductActiveImage(prod);

                  return (
                    <div 
                      key={prod.id}
                      className="glass-card glass-shine rounded-3xl overflow-hidden cursor-pointer flex flex-col justify-between h-[390px] border border-white/30 hover:border-white/60 shadow-md group relative"
                    >
                      {/* Product image */}
                      <div 
                        className="w-full h-56 relative overflow-hidden bg-slate-50/20 border-b border-white/10 group/img"
                        onClick={() => {
                          setSelectedProduct(prod);
                          setModalColor(activeColorName);
                        }}
                      >
                        <img 
                          src={activeImg || '/input_file_2.png'} 
                          alt={prod.arabicName}
                          className={`w-full h-full group-hover:scale-105 transition-transform duration-500 ${
                            activeImg === "/input_file_2.png" ? 'object-cover' : 'object-contain bg-white/40'
                          }`}
                          style={activeImg === "/input_file_2.png" ? { 
                            objectPosition: `${prodIndex >= 0 ? prodIndex * 25 : 0}% center`
                          } : {}}
                          referrerPolicy="no-referrer"
                        />

                        {images.length > 1 && (
                          <>
                            {/* Left Navigation Arrow */}
                            <button 
                              onClick={(e) => prevProductImage(prod, e)}
                              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center text-slate-800 hover:scale-110 transition-all z-20 opacity-0 group-hover/img:opacity-100"
                            >
                              <ArrowLeft className="w-4 h-4 font-bold" />
                            </button>
                            {/* Right Navigation Arrow */}
                            <button 
                              onClick={(e) => nextProductImage(prod, e)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center text-slate-800 hover:scale-110 transition-all z-20 opacity-0 group-hover/img:opacity-100"
                            >
                              <ArrowRight className="w-4 h-4 font-bold" />
                            </button>

                            {/* Dot Indicators */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/25 backdrop-blur-xs px-1.5 py-0.5 rounded-full z-20">
                              {images.map((_, i) => (
                                <span 
                                  key={i} 
                                  className={`w-1 h-1 rounded-full transition-all ${
                                    (productImageIndices[prod.id] || 0) === i ? 'bg-white scale-125 w-1.5' : 'bg-white/50'
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                        
                        {/* Condition badge (new/used) - visible on the closed card so shoppers
                            know exactly what they're about to open */}
                        <span className={`absolute top-3 right-3 text-white font-extrabold text-[9px] px-2.5 py-1 rounded-full shadow-md z-10 ${
                          prod.condition === 'used' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}>
                          {prod.condition === 'used' ? 'مستعمل' : 'جديد'}
                        </span>

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 pointer-events-none">
                          <span className="bg-white/95 backdrop-blur-md text-slate-800 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            عرض التفاصيل
                          </span>
                        </div>
                      </div>

                      {/* Product Details (Title, Price, colors, and Buy button) */}
                      <div className="p-4 flex-1 flex flex-col justify-between" dir="rtl">
                        <div>
                          <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate text-right">{prod.arabicName}</h4>
                          <p className="text-[9px] text-slate-400 font-bold truncate mt-0.5 text-right">{prod.name}</p>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex flex-col text-right">
                            <span className="text-blue-600 text-xs sm:text-sm font-black">{(prod.price).toLocaleString()} EGP</span>
                            {prod.originalPrice && (
                              <span className="text-slate-400 text-[9px] sm:text-[10px] font-semibold line-through">{(prod.originalPrice).toLocaleString()} EGP</span>
                            )}
                          </div>

                          {/* Color dots */}
                          <div className="flex items-center gap-1">
                            {prod.colors.slice(0, 3).map((col) => {
                              const isColorSelected = activeColorName === col.name;
                              return (
                                <button
                                  key={col.name}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setProductCardColors({
                                      ...productCardColors,
                                      [prod.id]: col.name
                                    });
                                  }}
                                  className={`w-3 h-3 rounded-full ${col.bgClass} transition-all duration-300 ${
                                    isColorSelected 
                                      ? 'ring-2 ring-blue-600 scale-110 shadow-sm' 
                                      : 'hover:scale-110 opacity-70'
                                  }`}
                                  title={col.name}
                                />
                              );
                            })}
                            {prod.colors.length > 3 && (
                              <span className="text-[8px] text-slate-400 font-extrabold">+{prod.colors.length - 3}</span>
                            )}
                          </div>
                        </div>

                        {/* Buy CTA */}
                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[9px] text-slate-500 font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                            <span>ضمان عام</span>
                          </span>
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(prod, activeColorName);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm transition-all hover:scale-105 active:scale-95"
                          >
                            <Plus className="w-3 h-3" />
                            <span>شراء</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* =========================================================================================
                HERO LAYOUT (Exact grid matching input_file_3.png Hero Section)
                ========================================================================================= */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mb-12">
              
              {/* 1. LEFT COLUMN: Call to Action Arabic Text & Glass Buttons (lg:col-span-3) */}
              <div className="lg:col-span-3 text-right flex flex-col items-start lg:items-start order-1 lg:order-1 mt-2 lg:mt-0 z-10">
                <h1 className="text-4xl md:text-5xl lg:text-[52px] font-extrabold tracking-tight text-slate-950 leading-tight">
                  كل ما تحتاجه
                </h1>
                
                <div className="text-3xl md:text-4xl lg:text-[42px] font-extrabold mt-1 mb-4 flex items-center gap-2">
                  <span className="bg-gradient-to-l from-blue-600 to-sky-400 bg-clip-text text-transparent">لعالم</span>
                  <span className="text-slate-900">iPhone</span>
                </div>

                <p className="text-slate-600 text-sm md:text-base font-semibold max-w-md mb-8 leading-relaxed">
                  أحدث أجهزة إيفون و أفضل الإكسسوارات الأصلية المتوفرة بضمان رسمي وتوصيل فوري خلال 24 ساعة فقط.
                </p>

                <div className="flex flex-row gap-4 items-center w-full">
                  {/* Blue shiny shop button */}
                  <button 
                    onClick={() => {
                      const element = document.getElementById('bestsellers');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-sm md:text-base px-6 py-3.5 rounded-2xl flex items-center gap-3 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-blue-400/30"
                  >
                    <span>تسوق الآن</span>
                    <span className="text-lg">+</span>
                  </button>

                  {/* Translucent glass play video button */}
                  <button 
                    onClick={() => setIsVideoOpen(true)}
                    className="glass-button text-slate-800 font-bold text-sm md:text-base px-6 py-3.5 rounded-2xl flex items-center gap-3 border border-white/50 cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <Play className="w-3 h-3 text-blue-600 fill-blue-600 mr-0.5" />
                    </div>
                    <span>شاهد الفيديو</span>
                  </button>
                </div>
              </div>

              {/* 2. MIDDLE COLUMN: iPhone with Splashing Water swirling art (lg:col-span-6) - Clean layout */}
              <div className="lg:col-span-6 flex justify-center items-center order-2 lg:order-2 relative h-[280px] sm:h-[350px] md:h-[400px] lg:h-[440px] w-full overflow-visible">
                {/* Ambient light glow behind the main art (Dimmed to fit user requirements) */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-tr from-amber-50 to-orange-50/5 opacity-15 blur-3xl pointer-events-none"></div>
                
                {/* iPhone Splash high quality overlay matching input_file_4.png */}
                <div className="relative w-full h-full max-w-[500px] lg:max-w-[580px] flex items-center justify-center overflow-visible">
                  <img 
                    src={chatgptBg} 
                    alt="iPhone Water Splashing Art" 
                    className="w-full h-full object-contain pointer-events-none drop-shadow-xl select-none scale-[1.1] sm:scale-[1.15] md:scale-[1.2] lg:scale-[1.25] xl:scale-[1.3] opacity-70 brightness-[0.88] transition-all duration-500 hover:scale-[1.35] hover:opacity-80"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* 3. RIGHT COLUMN: Vertical Services List (lg:col-span-3) - Glass Panel from screenshot */}
              <div className="lg:col-span-3 order-3">
                <div className="glass-panel glass-shine rounded-3xl p-6 shadow-xl border border-white/45 flex flex-col justify-between h-full max-w-sm mx-auto">
                  
                  <div className="space-y-6">
                    {GUARANTEES.map((g, idx) => {
                      // Select matching icon
                      let IconComponent = ShieldCheck;
                      if (g.iconName === 'Truck') IconComponent = Truck;
                      if (g.iconName === 'Lock') IconComponent = Lock;
                      if (g.iconName === 'Headphones') IconComponent = Headphones;

                      return (
                        <div 
                          key={idx} 
                          className="flex items-center justify-between text-right gap-4 p-2 rounded-2xl hover:bg-white/20 transition-all duration-300 group cursor-pointer"
                          onClick={() => {
                            setActiveGuaranteeDot(idx);
                            showToast(`ميزة ${g.title}: نحن نوفر لعملائنا الكرام ${g.description} لضمان أقصى درجات الرضا والأمان.`, 'info');
                          }}
                        >
                          {/* Left: Glass icon box */}
                          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${g.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                            <IconComponent className="w-6 h-6" />
                          </div>

                          {/* Right: Text elements */}
                          <div className="flex-1">
                            <h4 className="font-extrabold text-base text-slate-900">{g.title}</h4>
                            <p className="text-slate-500 text-xs font-semibold mt-0.5">{g.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Dot Indicators at bottom */}
                  <div className="flex justify-center items-center gap-2 mt-8 pt-4 border-t border-white/20">
                    {[0, 1, 2, 3].map((dotIndex) => (
                      <button 
                        key={dotIndex}
                        onClick={() => setActiveGuaranteeDot(dotIndex)}
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                          activeGuaranteeDot === dotIndex 
                            ? 'w-6 bg-blue-600 active-dot-glow' 
                            : 'w-2.5 bg-slate-400/50 hover:bg-slate-400'
                        }`}
                      />
                    ))}
                  </div>

                </div>
              </div>

            </section>

            {/* =========================================================================================
                CATEGORIES ROW (Sleek Grid supporting custom non-sliced category images and original slicing)
                ========================================================================================= */}
            <section className="mb-12">
              {/* Grid Layout of 6 Glass Sliced/Custom Category Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  
                  return (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(selectedCategory === cat.id ? null : cat.id);
                      }}
                      className="flex flex-col gap-2.5 cursor-pointer group select-none"
                    >
                      {/* Category Image Card with no padding to make the image fill the exact boundaries */}
                      <div
                        className={`glass-card glass-shine rounded-3xl overflow-hidden relative h-24 md:h-28 border transition-all duration-300 w-full ${
                          isSelected 
                            ? 'ring-2 ring-blue-500 bg-white/40 shadow-blue-500/10' 
                            : 'hover:border-white/50 border-white/30'
                        }`}
                      >
                        {cat.image ? (
                          <img 
                            src={cat.image} 
                            alt={cat.arabicName}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-3xl"
                            style={cat.useSlice ? { 
                              objectPosition: `${(cat.sliceIndex ?? 0) * 25}% center`
                            } : {}}
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          /* Sleek glass placeholder for categories with no image like Android */
                          <div className="w-full h-full bg-slate-900/5 backdrop-blur-sm flex flex-col items-center justify-center rounded-3xl p-4 text-center border border-dashed border-slate-300/50">
                            <span className="text-slate-400 text-[10px] sm:text-xs font-extrabold leading-tight">جاري إضافة الصورة...</span>
                          </div>
                        )}

                        {/* Subtle click indicator ripple line on the left */}
                        <div className="absolute left-3 bottom-3 bg-white/80 backdrop-blur-sm w-6 h-6 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors">
                          <ArrowLeft className="w-3.5 h-3.5 text-slate-800" />
                        </div>
                      </div>

                      {/* Premium details placed beautifully under the image to prevent blocking/hiding the image */}
                      <div className="text-center px-1" dir="rtl">
                        <div className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                          {cat.arabicName}
                        </div>
                        {cat.subTitle && (
                          <div className="text-[10px] text-slate-500 font-semibold mt-0.5 line-clamp-1">
                            {cat.subTitle}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* =========================================================================================
                CATEGORY PRODUCT SECTIONS
                Each category (iPhone, Accessories, Watch, ...) gets its own row here, and any
                product added by the admin automatically lands in the section matching its
                category field - nothing gets dumped into one generic "best sellers" list.
                ========================================================================================= */}
            <div id="bestsellers">
            {filteredProducts.length === 0 ? (
              <section className="mb-12">
                <div className="glass-panel rounded-3xl p-12 text-center border border-white/30" dir="rtl">
                  <p className="text-slate-600 font-bold text-lg">لم يتم العثور على أي منتجات مطابقة لعملية البحث.</p>
                  <button 
                    onClick={() => { setSelectedCategory(null); setSearchQuery(''); }}
                    className="mt-4 bg-blue-600 text-white font-bold text-sm px-6 py-2.5 rounded-xl"
                  >
                    إعادة ضبط البحث
                  </button>
                </div>
              </section>
            ) : (
              CATEGORIES.map((cat) => {
                const catProducts = filteredProducts.filter(p => p.category === cat.id);
                if (catProducts.length === 0) return null;

                return (
                  <section key={cat.id} id={`section-${cat.id}`} className="mb-12">

                    {/* Header row: Category Title + Pulse + Show All Link */}
                    <div className="flex items-center justify-between mb-6">

                      <div className="flex items-center gap-3">
                        <span className="bg-blue-100 text-blue-600 p-1.5 rounded-xl animate-pulse">
                          {/* Heartbeat/Trend SVG line inside custom styling */}
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </span>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{cat.arabicName}</h2>
                      </div>

                      <button 
                        onClick={() => setSelectedCategory(cat.id)}
                        className="text-blue-600 font-bold text-sm flex items-center gap-1.5 hover:gap-3 transition-all duration-300 hover:underline cursor-pointer"
                      >
                        <span>عرض الكل</span>
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Grid Layout of Product Cards for this category */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                      {catProducts.map((prod) => renderProductGridCard(prod))}
                    </div>

                  </section>
                );
              })
            )}
            </div>
          </>
        )}

        {/* =========================================================================================
            BOTTOM FEATURES BAR (Matches input_file_3.png Footer Row Exactly)
            ========================================================================================= */}
        {activeTab === 'home' && selectedCategory === null && (
          <footer className="w-full mt-6">
            <div className="glass-panel glass-shine rounded-3xl p-6 shadow-xl border border-white/40">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                
                {BOTTOM_FEATURES.map((feat, index) => {
                  // Select Icon
                  let Icon = Gift;
                  if (feat.icon === 'Tag') Icon = Tag;
                  if (feat.icon === 'Apple') {
                    return (
                      <div 
                        key={index} 
                        className="flex items-center text-right justify-end gap-3 p-2 rounded-2xl hover:bg-white/20 transition-all duration-300 group cursor-pointer"
                        onClick={() => showToast('نحن نضمن أن كافة المنتجات أصلية 100٪ ومغطاة بالضمان الرسمي من أبل.', 'info')}
                      >
                        <div className="text-right flex-1">
                          <h4 className="font-extrabold text-sm md:text-base text-slate-900 group-hover:text-blue-600 transition-colors">{feat.title}</h4>
                          <p className="text-slate-500 text-xs font-semibold mt-0.5">{feat.desc}</p>
                        </div>
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/40 flex items-center justify-center text-slate-800 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-white/50 p-1.5">
                          <img 
                            src={logoImg} 
                            alt="Sharkawy Group Logo Icon" 
                            className="w-full h-full object-contain pointer-events-none"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>
                    );
                  }
                  if (feat.icon === 'RefreshCw') Icon = RefreshCw;

                  return (
                    <div 
                      key={index} 
                      className="flex items-center text-right justify-end gap-3 p-2 rounded-2xl hover:bg-white/20 transition-all duration-300 group cursor-pointer"
                      onClick={() => showToast(`ميزة ${feat.title}: نقدم هذه الخدمة لتوفير راحة تامة وضمان الرضا التام لعملائنا.`, 'info')}
                    >
                      <div className="text-right flex-1">
                        <h4 className="font-extrabold text-sm md:text-base text-slate-900 group-hover:text-blue-600 transition-colors">{feat.title}</h4>
                        <p className="text-slate-500 text-xs font-semibold mt-0.5">{feat.desc}</p>
                      </div>
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/40 flex items-center justify-center text-slate-800 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-white/50">
                        <Icon className="w-5 h-5 text-slate-700" />
                      </div>
                    </div>
                  );
                })}

              </div>

            </div>
          </footer>
        )}

      </div>

      {/* =========================================================================================
          SLIDING SIDE CART DRAWER (Interactive experience)
          ========================================================================================= */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 transition-opacity flex justify-end">
          <div 
            className="w-full max-w-md h-full bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-2xl p-6 flex flex-col overflow-hidden"
            dir="rtl"
          >
            {/* Cart Header (always pinned to the top) */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 flex-shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
                <h3 className="font-black text-xl text-slate-900">حقيبة المشتريات</h3>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200/50 flex items-center justify-center text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of Cart Items (this is the ONLY part that scrolls, and it always
                fills exactly the remaining space between header and footer, so
                scrolling with the mouse always reaches the real end of the list) */}
            {cartItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <ShoppingCart className="w-16 h-16 text-slate-300 mb-4" />
                <p className="text-slate-500 font-bold">الحقيبة فارغة حالياً</p>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 bg-blue-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  متابعة التسوق
                </button>
              </div>
            ) : (
              <div className="flex-1 min-h-0 space-y-4 mt-6 overflow-y-auto no-scrollbar pr-1">
                {cartItems.map((item, i) => (
                    <div 
                      key={`${item.product.id}-${item.selectedColor}-${i}`}
                      className="glass-panel rounded-2xl p-4 flex items-center justify-between gap-4 border border-slate-100"
                    >
                      {/* Product Mini Photo (we show a segment or dynamic image symbol) */}
                      <div className="w-16 h-16 rounded-xl bg-slate-100/60 overflow-hidden relative border border-slate-200 flex items-center justify-center">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name}
                          className="w-12 h-12 object-cover"
                          style={item.product.image === "/input_file_2.png" ? { 
                            objectPosition: `${PRODUCTS.findIndex(p => p.id === item.product.id) * 25}% center` 
                          } : {}}
                        />
                      </div>

                      {/* Product Name, Color, Price */}
                      <div className="flex-1 text-right">
                        <h4 className="font-extrabold text-sm text-slate-900">{item.product.name}</h4>
                        <p className="text-slate-400 text-[10px] font-semibold mt-0.5">اللون: {item.selectedColor}</p>
                        <p className="text-blue-600 text-xs font-black mt-1">{(item.product.price).toLocaleString()} EGP</p>
                      </div>

                      {/* Quantity Select and Remove Actions */}
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-1.5 bg-white/70 rounded-lg p-1 border border-slate-200 shadow-sm">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.selectedColor, 1)}
                            className="w-5 h-5 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold text-slate-800 px-1">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.selectedColor, -1)}
                            className="w-5 h-5 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.selectedColor, -item.quantity)}
                          className="text-rose-500 hover:text-rose-600 font-bold text-[10px] flex items-center gap-0.5 mt-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>حذف</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Cart Summary & Checkout (always pinned to the bottom) */}
            {cartItems.length > 0 && (
              <div className="pt-6 border-t border-slate-200 flex-shrink-0">
                <div className="flex items-center justify-between font-black text-slate-900 mb-4">
                  <span>المجموع الإجمالي:</span>
                  <span className="text-blue-600 text-lg">{cartTotal.toLocaleString()} EGP</span>
                </div>
                <button 
                  onClick={() => {
                    alert(`شكراً لطلبك من Sharkawy Group! تم حجز الطلب بنجاح بمبلغ إجمالي ${cartTotal.toLocaleString()} EGP. سنقوم بالتواصل معك لتأكيد الشحن فوراً.`);
                    setCartItems([]);
                    setIsCartOpen(false);
                  }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-base shadow-lg hover:shadow-blue-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  <span>إتمام الشراء والدفع</span>
                </button>
                <p className="text-[10px] text-slate-400 text-center font-semibold mt-3">توصيل سريع مجاني خلال 24 ساعة لجميع المحافظات.</p>
              </div>
            )}

          </div>
        </div>
      )}

      {/* =========================================================================================
          DETAILED SPECIFICATIONS MODAL
          ========================================================================================= */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div 
            className="w-full max-w-2xl bg-white/85 backdrop-blur-2xl rounded-[32px] border border-white/50 shadow-2xl p-6 md:p-8 flex flex-col relative max-h-[90vh] overflow-y-auto no-scrollbar"
            dir="rtl"
          >
            {/* Close button */}
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-6 left-6 w-10 h-10 rounded-full hover:bg-slate-200/50 flex items-center justify-center text-slate-600 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Body */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              
              {/* Right Side: Product image slice overlay */}
              <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-3xl p-2 relative border border-slate-100 min-h-[350px] w-full overflow-hidden">
                {selectedProduct.isNew && (
                  <span className="absolute top-4 right-4 bg-blue-600 text-white font-extrabold text-[10px] px-3 py-1 rounded-full shadow-md z-10">
                    جديد
                  </span>
                )}
                
                {/* Product image segment rendering dynamically */}
                {(() => {
                  const modalImages = selectedProduct.images && selectedProduct.images.length > 0 ? selectedProduct.images : [selectedProduct.image];
                  const activeImgIdx = productImageIndices[selectedProduct.id] || 0;
                  const modalActiveImg = modalImages[activeImgIdx % modalImages.length] || selectedProduct.image;

                  return (
                    <div className="w-full h-full min-h-[300px] flex-1 relative overflow-hidden flex items-center justify-center group/modalimg rounded-2xl">
                      <img 
                        src={modalActiveImg} 
                        alt={selectedProduct.arabicName}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover/modalimg:scale-105"
                        style={modalActiveImg === "/input_file_2.png" ? { 
                          objectPosition: `${PRODUCTS.findIndex(p => p.id === selectedProduct.id) * 25}% center`,
                          transform: 'scale(1.8)'
                        } : {}}
                        referrerPolicy="no-referrer"
                      />

                      {modalImages.length > 1 && (
                        <>
                          {/* Left Navigation Arrow */}
                          <button 
                            onClick={(e) => prevProductImage(selectedProduct, e)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center text-slate-800 hover:scale-110 transition-all z-20"
                          >
                            <ArrowLeft className="w-4 h-4 font-bold" />
                          </button>
                          {/* Right Navigation Arrow */}
                          <button 
                            onClick={(e) => nextProductImage(selectedProduct, e)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center text-slate-800 hover:scale-110 transition-all z-20"
                          >
                            <ArrowRight className="w-4 h-4 font-bold" />
                          </button>

                          {/* Dot Indicators */}
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/25 backdrop-blur-xs px-1.5 py-0.5 rounded-full z-20">
                            {modalImages.map((_, i) => (
                              <span 
                                key={i} 
                                  className={`w-1 h-1 rounded-full transition-all ${
                                    activeImgIdx === i ? 'bg-white scale-125 w-1.5' : 'bg-white/50'
                                  }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })()}

                {/* Stars Rating */}
                <div className="flex items-center gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < Math.floor(selectedProduct.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-slate-500 text-xs font-bold mr-1">({selectedProduct.reviewsCount} تقييم)</span>
                </div>
              </div>

              {/* Left Side: Product Specs & Options */}
              <div className="text-right flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-2xl text-slate-900">{selectedProduct.name}</h3>
                  <p className="text-slate-500 font-bold text-sm mt-1">{selectedProduct.arabicName}</p>

                  {/* Price */}
                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-2xl font-black text-blue-600">{(selectedProduct.price).toLocaleString()} EGP</span>
                    {selectedProduct.originalPrice && (
                      <span className="text-slate-400 text-sm font-bold line-through">{(selectedProduct.originalPrice).toLocaleString()} EGP</span>
                    )}
                  </div>

                  {/* Specifications list */}
                  <div className="mt-6 space-y-2">
                    <h5 className="font-extrabold text-slate-900 text-sm">المواصفات الأساسية:</h5>
                    <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600 mt-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div>الشاشة: <span className="text-slate-900">{selectedProduct.specs.screen}</span></div>
                      <div>المعالج: <span className="text-slate-900">{selectedProduct.specs.processor}</span></div>
                      <div className="col-span-2 mt-1 border-t border-slate-200/60 pt-1">الكاميرا: <span className="text-slate-900">{selectedProduct.specs.camera}</span></div>
                      <div className="col-span-2 mt-1 border-t border-slate-200/60 pt-1">البطارية والملحقات: <span className="text-slate-900">{selectedProduct.specs.battery}</span></div>
                    </div>
                  </div>

                  {/* Color Selector */}
                  <div className="mt-6">
                    <h5 className="font-extrabold text-slate-900 text-sm">اللون المختار: <span className="text-blue-600">{modalColor}</span></h5>
                    <div className="flex items-center gap-2 mt-2">
                      {selectedProduct.colors.map((col) => (
                        <button
                          key={col.name}
                          onClick={() => setModalColor(col.name)}
                          className={`w-7 h-7 rounded-full ${col.bgClass} transition-all duration-300 ${
                            modalColor === col.name 
                              ? 'ring-4 ring-blue-500 scale-110 shadow-md' 
                              : 'hover:scale-105'
                          }`}
                          title={col.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Add to Cart CTA */}
                <div className="mt-8 flex gap-3">
                  <button 
                    onClick={() => {
                      addToCart(selectedProduct, modalColor);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-sm py-4 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>إضافة لحقيبة التسوق</span>
                  </button>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

      {/* =========================================================================================
          VIDEO OVERLAY (Interactive preview)
          ========================================================================================= */}
      {isVideoOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl aspect-video bg-black rounded-3xl overflow-hidden relative shadow-2xl border border-white/20">
            <button 
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center z-10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Custom interactive video placeholder layout representing dynamic promotional review of Apple Devices */}
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 text-white bg-gradient-to-br from-blue-900 to-slate-900">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xl animate-bounce mb-4">
                <Play className="w-7 h-7 fill-white text-white ml-1" />
              </div>
              <h3 className="text-xl md:text-2xl font-black mb-2">مراجعة هواتف iPhone 15 Pro باللغة العربية</h3>
              <p className="text-slate-300 text-xs md:text-sm font-semibold max-w-md">شاهد مراجعة متكاملة لكافة مميزات الكاميرا، المعالج الخارق A17 Pro، والوزن الخفيف للتيتانيوم.</p>
              <div className="mt-6 flex gap-4 text-xs font-semibold">
                <span className="px-3 py-1.5 bg-white/10 rounded-full">الدقة: 4K HDR</span>
                <span className="px-3 py-1.5 bg-white/10 rounded-full">مدة المراجعة: 12 دقيقة</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================================
          FLOATING BLUE CHAT ACTION (Bottom Left) & CHAT CONTAINER
          ========================================================================================= */}
      <div className="fixed bottom-6 left-6 z-40">
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg hover:shadow-blue-500/30 hover:scale-110 active:scale-95 transition-all relative cursor-pointer"
          title="خدمة العملاء والدردشة الفورية"
        >
          <MessageCircle className="w-7 h-7" />
          <span className="absolute top-1 right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>

        {isChatOpen && (
          <div 
            className="absolute bottom-16 left-0 w-80 sm:w-96 bg-white/90 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl overflow-hidden flex flex-col h-[400px]"
            dir="rtl"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
                  <Headphones className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <h4 className="font-extrabold text-sm leading-tight">الدعم الفني المباشر</h4>
                  <span className="text-[10px] text-emerald-300 font-bold flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    متصل الآن لخدمتك
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3 bg-slate-50/50">
              {chatMessages.map((msg, i) => (
                <div 
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[75%] rounded-2xl p-3 text-xs md:text-sm shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none text-right' 
                      : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none text-right'
                  }`}>
                    <p className="font-semibold leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2">
              <input 
                type="text" 
                placeholder="اكتب رسالتك هنا..." 
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                className="flex-1 text-xs md:text-sm bg-slate-100/80 rounded-xl px-3 py-2 border border-slate-200 outline-none focus:border-blue-500 focus:bg-white transition-colors text-right"
              />
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-xl text-xs font-bold transition-colors"
              >
                إرسال
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Custom Confirmation Modal */}
      <AnimatePresence>
        {customConfirm.isOpen && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-[9999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 max-w-sm w-full border border-white/40 shadow-2xl text-right font-sans"
              dir="rtl"
            >
              <h4 className="font-black text-lg text-slate-900 mb-2">{customConfirm.title}</h4>
              <p className="text-slate-600 text-xs sm:text-sm font-semibold leading-relaxed mb-6">{customConfirm.message}</p>
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setCustomConfirm(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors cursor-pointer flex-1"
                >
                  إلغاء
                </button>
                <button 
                  onClick={() => {
                    customConfirm.onConfirm();
                    setCustomConfirm(prev => ({ ...prev, isOpen: false }));
                  }}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-md shadow-rose-500/10 cursor-pointer flex-1"
                >
                  تأكيد الحذف
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Toast Notification */}
      <AnimatePresence>
        {toast.isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 450, damping: 32 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[10000] max-w-sm w-full px-4"
          >
            <div 
              className={`rounded-2xl p-4 shadow-xl border backdrop-blur-xl flex items-center justify-between gap-3 text-right ${
                toast.type === 'error' 
                  ? 'bg-rose-50/95 border-rose-200/50 text-rose-900' 
                  : toast.type === 'info'
                    ? 'bg-blue-50/95 border-blue-200/50 text-blue-900'
                    : 'bg-emerald-50/95 border-emerald-200/50 text-emerald-900'
              }`}
              dir="rtl"
            >
              <div className="flex items-center gap-2.5 flex-1">
                {toast.type === 'error' ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse flex-shrink-0" />
                ) : toast.type === 'info' ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse flex-shrink-0" />
                ) : (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse flex-shrink-0" />
                )}
                <p className="text-xs font-bold leading-relaxed">{toast.message}</p>
              </div>
              <button 
                onClick={closeToast}
                className="w-6 h-6 rounded-full hover:bg-black/5 flex items-center justify-center flex-shrink-0 text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
