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
	
	// Enhanced mock data for men's products
	const products = [
		{
			id: '1',
			title: 'Nike Спортни обувки Air Max',
			price: 185,
			originalPrice: 299,
			brand: 'Nike',
			condition: 'Like New',
			size: '42',
			images: [
				'https://images.unsplash.com/photo-1551107696-a4b57a95e98d?w=400&h=500&fit=crop',
			],
			rating: 4.9,
			reviewCount: 24,
			isFavorite: false,
			isNew: true,
			seller: {
				name: 'sneaker_head',
				avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
				rating: 4.8
			}
		},
		{
			id: '2',
			title: 'Levi\'s 501 джинси',
			price: 67,
			brand: 'Levi\'s',
			condition: 'Good',
			size: 'L',
			images: [
				'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop',
			],
			rating: 4.5,
			reviewCount: 15,
			isFavorite: false,
			isNew: false,
			seller: {
				name: 'vintage_collector',
				avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
				rating: 4.6
			}
		},
		{
			id: '3',
			title: 'Adidas Тренировъчни панталони',
			price: 45,
			originalPrice: 75,
			brand: 'Adidas',
			condition: 'Very Good',
			size: 'M',
			images: [
				'https://images.unsplash.com/photo-1506629905957-44d6915b0cf9?w=400&h=500&fit=crop',
			],
			rating: 4.7,
			reviewCount: 18,
			isFavorite: true,
			isNew: false,
			seller: {
				name: 'sport_gear',
				avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
				rating: 4.8
			}
		},
		{
			id: '4',
			title: 'Hugo Boss костюм',
			price: 320,
			originalPrice: 650,
			brand: 'Hugo Boss',
			condition: 'Like New',
			size: '50',
			images: [
				'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop',
			],
			rating: 4.9,
			reviewCount: 7,
			isFavorite: false,
			isNew: false,
			seller: {
				name: 'business_attire',
				avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
				rating: 4.9
			}
		},
		{
			id: '5',
			title: 'Tommy Hilfiger риза',
			price: 55,
			originalPrice: 95,
			brand: 'Tommy Hilfiger',
			condition: 'Very Good',
			size: 'L',
			images: [
				'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop',
			],
			rating: 4.6,
			reviewCount: 12,
			isFavorite: false,
			isNew: true,
			seller: {
				name: 'classic_shirts',
				avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
				rating: 4.7
			}
		},
		{
			id: '6',
			title: 'Stone Island яке',
			price: 280,
			originalPrice: 450,
			brand: 'Stone Island',
			condition: 'Good',
			size: 'M',
			images: [
				'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop',
			],
			rating: 4.8,
			reviewCount: 9,
			isFavorite: true,
			isNew: false,
			seller: {
				name: 'streetwear_archive',
				avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
				rating: 4.8
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
		{ value: '', label: '👔', name: 'Всички' },
		{ value: 'shirts', label: '👔', name: 'Ризи' },
		{ value: 'suits', label: '🤵', name: 'Костюми' },
		{ value: 'pants', label: '👖', name: 'Панталони' },
		{ value: 'jackets', label: '🧥', name: 'Якета' },
		{ value: 'shoes', label: '👞', name: 'Обувки' },
		{ value: 'watches', label: '⌚', name: 'Часовници' },
		{ value: 'accessories', label: '🎒', name: 'Аксесоари' }
	];
	
	// Filter options matching deployed site
	const priceRanges = [
		{ value: '', label: 'Цена' },
		{ value: 'under-50', label: 'До 50лв' },
		{ value: '50-100', label: '50-100лв' },
		{ value: '100-200', label: '100-200лв' },
		{ value: '200-400', label: '200-400лв' },
		{ value: '400-plus', label: 'Над 400лв' }
	];
	
	const sizes = [
		{ value: '', label: 'Размер' },
		{ value: 'XS', label: 'XS' },
		{ value: 'S', label: 'S' },
		{ value: 'M', label: 'M' },
		{ value: 'L', label: 'L' },
		{ value: 'XL', label: 'XL' },
		{ value: 'XXL', label: 'XXL' },
		{ value: '46', label: '46' },
		{ value: '48', label: '48' },
		{ value: '50', label: '50' },
		{ value: '52', label: '52' }
	];
	
	const brands = [
		{ value: '', label: 'Марка' },
		{ value: 'nike', label: 'Nike' },
		{ value: 'adidas', label: 'Adidas' },
		{ value: 'levis', label: "Levi's" },
		{ value: 'hugo_boss', label: 'Hugo Boss' },
		{ value: 'tommy_hilfiger', label: 'Tommy Hilfiger' },
		{ value: 'stone_island', label: 'Stone Island' },
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
				case 'under-50': result = result.filter(p => p.price < 50); break;
				case '50-100': result = result.filter(p => p.price >= 50 && p.price <= 100); break;
				case '100-200': result = result.filter(p => p.price >= 100 && p.price <= 200); break;
				case '200-400': result = result.filter(p => p.price >= 200 && p.price <= 400); break;
				case '400-plus': result = result.filter(p => p.price > 400); break;
			}
		}
		
		if (selectedSize) {
			result = result.filter(p => p.size.toUpperCase() === selectedSize.toUpperCase());
		}
		
		if (selectedBrand) {
			if (selectedBrand === 'other') {
				const mainBrands = ['nike', 'adidas', 'levis', 'hugo boss', 'tommy hilfiger', 'stone island'];
				result = result.filter(p => !mainBrands.includes(p.brand.toLowerCase()));
			} else {
				result = result.filter(p => p.brand.toLowerCase().includes(selectedBrand.toLowerCase().replace('_', ' ')));
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
	<title>Мъжки дрехи - Driplo.bg</title>
</svelte:head>

<!-- Men's page with fixed search banner -->
<div class="min-h-screen bg-blue-50">
	<!-- Fixed Search Banner - Below main header -->
	<div class="fixed top-11 left-0 right-0 z-30 bg-white shadow-sm">
		<!-- Blue Search Banner -->
		<div class="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
			<div class="relative max-w-md mx-auto">
				<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-600" />
				<Input 
					bind:value={searchQuery}
					placeholder="Търси мъжки дрехи..."
					class="pl-11 bg-white border-0 shadow-sm text-gray-900 placeholder:text-blue-400"
				/>
			</div>
		</div>
		
		<!-- Horizontal Scrollable Categories - Hide when scrolling down -->
		{#if showCategories}
			<div class="bg-white border-b border-blue-100 px-4 py-2 transition-all duration-300">
				<div class="flex gap-2 overflow-x-auto pb-1" style="scrollbar-width: none; -ms-overflow-style: none;">
					{#each categories as category}
						<button
							onclick={() => selectedCategory = selectedCategory === category.value ? '' : category.value}
							class="flex flex-col items-center min-w-14 py-1.5 px-2 rounded-lg transition-colors {
								selectedCategory === category.value 
									? 'bg-blue-100 text-blue-600' 
									: 'text-gray-600 hover:bg-blue-50'
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
				<div class="w-24 h-24 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
					<Search class="w-8 h-8 text-blue-400" />
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
		<button onclick={() => goto('/')} class="flex flex-col items-center gap-0.5 p-1.5 text-gray-500 hover:text-blue-600">
			<Home class="h-4 w-4" />
			<span class="text-[9px] font-medium">Начало</span>
		</button>
		<button 
			onclick={() => showFiltersDrawer = true} 
			class="flex flex-col items-center gap-0.5 p-1.5 text-gray-500 hover:text-blue-600 relative"
		>
			<SlidersHorizontal class="h-4 w-4" />
			<span class="text-[9px] font-medium">Филтри</span>
			{#if activeFiltersCount > 0}
				<Badge class="absolute -top-0.5 -right-0.5 h-3 w-3 text-[8px] bg-blue-500 rounded-full flex items-center justify-center">{activeFiltersCount}</Badge>
			{/if}
		</button>
		<button onclick={() => goto('/sell')} class="flex flex-col items-center gap-0.5 p-1.5 relative">
			<div class="bg-gradient-to-r from-blue-500 to-blue-400 rounded-xl p-1.5">
				<ShoppingBag class="h-4 w-4 text-white" />
			</div>
			<span class="text-[9px] font-medium text-gray-600">Продай</span>
		</button>
		<button onclick={() => goto('/favorites')} class="flex flex-col items-center gap-0.5 p-1.5 text-gray-500 hover:text-blue-600">
			<Heart class="h-4 w-4" />
			<span class="text-[9px] font-medium">Любими</span>
		</button>
		<button onclick={() => goto('/cart')} class="flex flex-col items-center gap-0.5 p-1.5 text-gray-500 hover:text-blue-600 relative">
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
					<h2 class="text-lg font-semibold text-blue-600">Филтри</h2>
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
							<SelectTrigger class="w-full border-blue-200">
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
							<SelectTrigger class="w-full border-blue-200 {selectedPriceRange ? 'border-blue-400 bg-blue-50' : ''}">
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
							<SelectTrigger class="w-full border-blue-200 {selectedSize ? 'border-blue-400 bg-blue-50' : ''}">
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
							<SelectTrigger class="w-full border-blue-200 {selectedBrand ? 'border-blue-400 bg-blue-50' : ''}">
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
							<SelectTrigger class="w-full border-blue-200 {selectedCondition ? 'border-blue-400 bg-blue-50' : ''}">
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
							class="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50"
						>
							Изчисти всички
						</Button>
					{/if}
					<Button 
						onclick={() => showFiltersDrawer = false}
						class="flex-1 bg-blue-500 hover:bg-blue-600"
					>
						Прилагай филтрите
					</Button>
				</div>
			</div>
		</div>
	</div>
{/if}