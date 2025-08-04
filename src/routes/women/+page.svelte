<script lang="ts">
	import { Search, Heart, ShoppingBag, User, Home, SlidersHorizontal, ShoppingCart, X } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	import Select from '$lib/components/ui/select/select.svelte';
	import SelectTrigger from '$lib/components/ui/select/SelectTrigger.svelte';
	import SelectContent from '$lib/components/ui/select/SelectContent.svelte';
	import SelectItem from '$lib/components/ui/select/SelectItem.svelte';
	
	import ProductCard from '$lib/components/marketplace/ProductCard.svelte';
	
	// Enhanced mock data for women's products
	const products = [
		{
			id: '1',
			title: 'Zara Трикотажна рокля',
			price: 45,
			originalPrice: 89,
			brand: 'Zara',
			condition: 'New with tags',
			size: 'M',
			images: [
				'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop',
			],
			rating: 4.8,
			reviewCount: 12,
			isFavorite: false,
			isNew: true,
			seller: {
				name: 'maria_style',
				avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
				rating: 4.9
			}
		},
		{
			id: '2',
			title: 'H&M Джинси slim fit',
			price: 32,
			brand: 'H&M',
			condition: 'Very Good',
			size: 'S',
			images: [
				'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop',
			],
			rating: 4.6,
			reviewCount: 8,
			isFavorite: false,
			isNew: false,
			seller: {
				name: 'fashion_lover',
				avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
				rating: 4.7
			}
		},
		{
			id: '3',
			title: 'Nike Air Max за жени',
			price: 120,
			originalPrice: 180,
			brand: 'Nike',
			condition: 'Like New',
			size: '38',
			images: [
				'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=500&fit=crop',
			],
			rating: 4.9,
			reviewCount: 25,
			isFavorite: true,
			isNew: false,
			seller: {
				name: 'sneaker_queen',
				avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
				rating: 4.8
			}
		},
		{
			id: '4',
			title: 'Mango Кожено яке',
			price: 78,
			brand: 'Mango',
			condition: 'Good',
			size: 'L',
			images: [
				'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop',
			],
			rating: 4.5,
			reviewCount: 15,
			isFavorite: false,
			isNew: false,
			seller: {
				name: 'vintage_closet',
				avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
				rating: 4.6
			}
		},
		{
			id: '5',
			title: 'Adidas Спортен сет',
			price: 65,
			originalPrice: 95,
			brand: 'Adidas',
			condition: 'Very Good',
			size: 'M',
			images: [
				'https://images.unsplash.com/photo-1506629905957-44d6915b0cf9?w=400&h=500&fit=crop',
			],
			rating: 4.7,
			reviewCount: 18,
			isFavorite: false,
			isNew: true,
			seller: {
				name: 'sport_fashion',
				avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
				rating: 4.8
			}
		},
		{
			id: '6',
			title: 'Prada Чанта',
			price: 450,
			originalPrice: 800,
			brand: 'Prada',
			condition: 'Like New',
			size: 'One Size',
			images: [
				'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop',
			],
			rating: 4.9,
			reviewCount: 8,
			isFavorite: true,
			isNew: false,
			seller: {
				name: 'luxury_finds',
				avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
				rating: 4.9
			}
		}
	];
	
	// State management
	let searchQuery = $state('');
	let selectedCategory = $state('');
	let sortBy = $state('newest');
	let isScrolled = $state(false);
	let showFiltersDrawer = $state(false);
	
	// Filter states
	let selectedPriceRange = $state('');
	let selectedSize = $state('');
	let selectedBrand = $state('');
	let selectedCondition = $state('');
	
	// Horizontal scrollable categories with emojis
	const categories = [
		{ value: '', label: '👗', name: 'Всички' },
		{ value: 'dresses', label: '👗', name: 'Рокли' },
		{ value: 'tops', label: '👚', name: 'Блузи' },
		{ value: 'pants', label: '👖', name: 'Панталони' },
		{ value: 'jackets', label: '🧥', name: 'Якета' },
		{ value: 'shoes', label: '👠', name: 'Обувки' },
		{ value: 'bags', label: '👜', name: 'Чанти' },
		{ value: 'accessories', label: '💍', name: 'Аксесоари' }
	];
	
	// Filter options matching deployed site
	const priceRanges = [
		{ value: '', label: 'Цена' },
		{ value: 'under-30', label: 'До 30лв' },
		{ value: '30-60', label: '30-60лв' },
		{ value: '60-120', label: '60-120лв' },
		{ value: '120-250', label: '120-250лв' },
		{ value: '250-plus', label: 'Над 250лв' }
	];
	
	const sizes = [
		{ value: '', label: 'Размер' },
		{ value: 'XS', label: 'XS' },
		{ value: 'S', label: 'S' },
		{ value: 'M', label: 'M' },
		{ value: 'L', label: 'L' },
		{ value: 'XL', label: 'XL' },
		{ value: 'XXL', label: 'XXL' }
	];
	
	const brands = [
		{ value: '', label: 'Марка' },
		{ value: 'zara', label: 'Zara' },
		{ value: 'hm', label: 'H&M' },
		{ value: 'mango', label: 'Mango' },
		{ value: 'nike', label: 'Nike' },
		{ value: 'adidas', label: 'Adidas' },
		{ value: 'prada', label: 'Prada' },
		{ value: 'other', label: 'Други' }
	];
	
	const conditions = [
		{ value: '', label: 'Състояние' },
		{ value: 'new_with_tags', label: 'Ново с етикет' },
		{ value: 'like_new', label: 'Като ново' },
		{ value: 'very_good', label: 'Много добро' },
		{ value: 'good', label: 'Добро' },
		{ value: 'fair', label: 'Задоволително' }
	];
	
	const sortOptions = [
		{ value: 'newest', label: 'Най-нови' },
		{ value: 'price-low', label: 'Цена ↑' },
		{ value: 'price-high', label: 'Цена ↓' },
		{ value: 'popular', label: 'Популярни' }
	];
	
	// Scroll detection for hiding emoji categories
	let showCategories = $state(true);
	let lastScrollY = $state(0);
	
	onMount(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			// Hide categories when scrolling down, show when scrolling up or at top
			showCategories = currentScrollY < lastScrollY || currentScrollY < 50;
			lastScrollY = currentScrollY;
		};
		
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});
	
	// Derived filtered products
	let filteredProducts = $derived.by(() => {
		let result = [...products];
		
		// Apply search filter
		if (searchQuery) {
			result = result.filter(p => 
				p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				p.brand.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}
		
		// Apply category filter
		if (selectedCategory) {
			// Filter logic based on category
		}
		
		// Apply other filters
		if (selectedPriceRange) {
			switch (selectedPriceRange) {
				case 'under-30': result = result.filter(p => p.price < 30); break;
				case '30-60': result = result.filter(p => p.price >= 30 && p.price <= 60); break;
				case '60-120': result = result.filter(p => p.price >= 60 && p.price <= 120); break;
				case '120-250': result = result.filter(p => p.price >= 120 && p.price <= 250); break;
				case '250-plus': result = result.filter(p => p.price > 250); break;
			}
		}
		
		if (selectedSize) {
			result = result.filter(p => p.size.toUpperCase() === selectedSize.toUpperCase());
		}
		
		if (selectedBrand) {
			if (selectedBrand === 'other') {
				const mainBrands = ['zara', 'h&m', 'mango', 'nike', 'adidas', 'prada'];
				result = result.filter(p => !mainBrands.includes(p.brand.toLowerCase()));
			} else {
				result = result.filter(p => p.brand.toLowerCase().includes(selectedBrand.toLowerCase()));
			}
		}
		
		if (selectedCondition) {
			result = result.filter(p => p.condition.toLowerCase().replace(' ', '_') === selectedCondition);
		}
		
		// Apply sorting
		return result.sort((a, b) => {
			switch (sortBy) {
				case 'price-low': return a.price - b.price;
				case 'price-high': return b.price - a.price;
				case 'popular': return b.reviewCount - a.reviewCount;
				case 'newest': 
				default: return 0;
			}
		});
	});
	
	function handleProductClick(product: any) {
		goto(`/products/${product.id}`);
	}
	
	function clearAllFilters() {
		selectedPriceRange = '';
		selectedSize = '';
		selectedBrand = '';
		selectedCondition = '';
	}
	
	let activeFiltersCount = $derived.by(() => {
		let count = 0;
		if (selectedPriceRange) count++;
		if (selectedSize) count++;
		if (selectedBrand) count++;
		if (selectedCondition) count++;
		return count;
	});
</script>

<svelte:head>
	<title>Дамски дрехи - Driplo.bg</title>
</svelte:head>

<!-- Women's page with fixed search banner -->
<div class="min-h-screen bg-pink-50">
	<!-- Fixed Search Banner - Below main header -->
	<div class="fixed top-11 left-0 right-0 z-30 bg-white shadow-sm">
		<!-- Pink Search Banner -->
		<div class="bg-gradient-to-r from-pink-400 to-pink-500 p-4">
			<div class="relative max-w-md mx-auto">
				<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-600" />
				<Input 
					bind:value={searchQuery}
					placeholder="Търси дамски дрехи..."
					class="pl-11 bg-white border-0 shadow-sm text-gray-900 placeholder:text-pink-400"
				/>
			</div>
		</div>
		
		<!-- Horizontal Scrollable Categories - Hide when scrolling down -->
		{#if showCategories}
			<div class="bg-white border-b border-pink-100 px-4 py-2 transition-all duration-300">
				<div class="flex gap-2 overflow-x-auto pb-1" style="scrollbar-width: none; -ms-overflow-style: none;">
					{#each categories as category}
						<button
							onclick={() => selectedCategory = selectedCategory === category.value ? '' : category.value}
							class="flex flex-col items-center min-w-14 py-1.5 px-2 rounded-lg transition-colors {
								selectedCategory === category.value 
									? 'bg-pink-100 text-pink-600' 
									: 'text-gray-600 hover:bg-pink-50'
							}"
						>
							<span class="text-xl mb-0.5">{category.label}</span>
							<span class="text-[10px] font-medium whitespace-nowrap">{category.name}</span>
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</div>
	
	<!-- Content spacer for fixed header - Dynamic based on categories visibility -->
	<div class="{showCategories ? 'h-40' : 'h-28'} transition-all duration-300"></div>
	
	<!-- Products Grid -->
	<div class="p-4 pb-20">
		{#if filteredProducts.length === 0}
			<div class="text-center py-12">
				<div class="w-24 h-24 mx-auto mb-4 bg-pink-100 rounded-full flex items-center justify-center">
					<Search class="w-8 h-8 text-pink-400" />
				</div>
				<h3 class="text-lg font-medium text-gray-900 mb-2">Няма намерени продукти</h3>
				<p class="text-gray-500 mb-4">Опитайте да промените филтрите или търсенето</p>
			</div>
		{:else}
			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
				{#each filteredProducts as product (product.id)}
					<ProductCard 
						{product} 
						onclick={() => handleProductClick(product)}
					/>
				{/each}
			</div>
		{/if}
	</div>
</div>

<!-- Shopping-Oriented Bottom Navigation - Match main page size -->
<div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
	<div class="flex items-center justify-around py-1.5">
		<button onclick={() => goto('/')} class="flex flex-col items-center gap-0.5 p-1.5 text-gray-500 hover:text-pink-600">
			<Home class="h-4 w-4" />
			<span class="text-[9px] font-medium">Начало</span>
		</button>
		<button 
			onclick={() => showFiltersDrawer = true} 
			class="flex flex-col items-center gap-0.5 p-1.5 text-gray-500 hover:text-pink-600 relative"
		>
			<SlidersHorizontal class="h-4 w-4" />
			<span class="text-[9px] font-medium">Филтри</span>
			{#if activeFiltersCount > 0}
				<Badge class="absolute -top-0.5 -right-0.5 h-3 w-3 text-[8px] bg-pink-500 rounded-full flex items-center justify-center">{activeFiltersCount}</Badge>
			{/if}
		</button>
		<button onclick={() => goto('/sell')} class="flex flex-col items-center gap-0.5 p-1.5 relative">
			<div class="bg-gradient-to-r from-pink-500 to-pink-400 rounded-xl p-1.5">
				<ShoppingBag class="h-4 w-4 text-white" />
			</div>
			<span class="text-[9px] font-medium text-gray-600">Продай</span>
		</button>
		<button onclick={() => goto('/favorites')} class="flex flex-col items-center gap-0.5 p-1.5 text-gray-500 hover:text-pink-600">
			<Heart class="h-4 w-4" />
			<span class="text-[9px] font-medium">Любими</span>
		</button>
		<button onclick={() => goto('/cart')} class="flex flex-col items-center gap-0.5 p-1.5 text-gray-500 hover:text-pink-600 relative">
			<ShoppingBag class="h-4 w-4" />
			<span class="absolute -top-0.5 right-1 h-3 w-3 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center">2</span>
			<span class="text-[9px] font-medium">Кошница</span>
		</button>
	</div>
</div>

<!-- Filters Drawer -->
{#if showFiltersDrawer}
	<div class="fixed inset-0 bg-black bg-opacity-50 z-50">
		<div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg max-h-96 overflow-y-auto">
			<div class="p-4">
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-lg font-semibold text-pink-600">Филтри</h2>
					<Button
						variant="ghost"
						size="icon"
						onclick={() => showFiltersDrawer = false}
					>
						<X class="w-4 h-4" />
					</Button>
				</div>
				
				<div class="space-y-4">
					<!-- Sort -->
					<div>
						<h3 class="font-medium mb-2 text-sm text-gray-700">Сортирай</h3>
						<Select bind:value={sortBy}>
							<SelectTrigger class="w-full border-pink-200">
								{sortOptions.find(opt => opt.value === sortBy)?.label || 'Сортирай'}
							</SelectTrigger>
							<SelectContent>
								{#each sortOptions as option}
									<SelectItem value={option.value}>{option.label}</SelectItem>
								{/each}
							</SelectContent>
						</Select>
					</div>
					
					<!-- Price Filter -->
					<div>
						<h3 class="font-medium mb-2 text-sm text-gray-700">Цена</h3>
						<Select bind:value={selectedPriceRange}>
							<SelectTrigger class="w-full border-pink-200 {selectedPriceRange ? 'border-pink-400 bg-pink-50' : ''}">
								{priceRanges.find(p => p.value === selectedPriceRange)?.label || 'Избери цена'}
							</SelectTrigger>
							<SelectContent>
								{#each priceRanges as range}
									<SelectItem value={range.value}>{range.label}</SelectItem>
								{/each}
							</SelectContent>
						</Select>
					</div>
					
					<!-- Size Filter -->
					<div>
						<h3 class="font-medium mb-2 text-sm text-gray-700">Размер</h3>
						<Select bind:value={selectedSize}>
							<SelectTrigger class="w-full border-pink-200 {selectedSize ? 'border-pink-400 bg-pink-50' : ''}">
								{sizes.find(s => s.value === selectedSize)?.label || 'Избери размер'}
							</SelectTrigger>
							<SelectContent>
								{#each sizes as size}
									<SelectItem value={size.value}>{size.label}</SelectItem>
								{/each}
							</SelectContent>
						</Select>
					</div>
					
					<!-- Brand Filter -->
					<div>
						<h3 class="font-medium mb-2 text-sm text-gray-700">Марка</h3>
						<Select bind:value={selectedBrand}>
							<SelectTrigger class="w-full border-pink-200 {selectedBrand ? 'border-pink-400 bg-pink-50' : ''}">
								{brands.find(b => b.value === selectedBrand)?.label || 'Избери марка'}
							</SelectTrigger>
							<SelectContent>
								{#each brands as brand}
									<SelectItem value={brand.value}>{brand.label}</SelectItem>
								{/each}
							</SelectContent>
						</Select>
					</div>
					
					<!-- Condition Filter -->
					<div>
						<h3 class="font-medium mb-2 text-sm text-gray-700">Състояние</h3>
						<Select bind:value={selectedCondition}>
							<SelectTrigger class="w-full border-pink-200 {selectedCondition ? 'border-pink-400 bg-pink-50' : ''}">
								{conditions.find(c => c.value === selectedCondition)?.label || 'Избери състояние'}
							</SelectTrigger>
							<SelectContent>
								{#each conditions as condition}
									<SelectItem value={condition.value}>{condition.label}</SelectItem>
								{/each}
							</SelectContent>
						</Select>
					</div>
				</div>
				
				<!-- Action Buttons -->
				<div class="flex gap-2 mt-6 pt-4 border-t">
					{#if activeFiltersCount > 0}
						<Button 
							variant="outline" 
							onclick={clearAllFilters}
							class="flex-1 border-pink-300 text-pink-600 hover:bg-pink-50"
						>
							Изчисти всички
						</Button>
					{/if}
					<Button 
						onclick={() => showFiltersDrawer = false}
						class="flex-1 bg-pink-500 hover:bg-pink-600"
					>
						Прилагай филтрите
					</Button>
				</div>
			</div>
		</div>
	</div>
{/if}