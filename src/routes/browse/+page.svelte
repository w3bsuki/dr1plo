<script lang="ts">
	import { page } from '$app/stores';
	import { Search, Filter, ChevronDown } from '@lucide/svelte';
	import { ProductGrid } from '$lib/components/marketplace';
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	
	let { data }: { data: PageData } = $props();
	
	// Get URL parameters
	let searchQuery = $state($page.url.searchParams.get('q') || '');
	let category = $state($page.url.searchParams.get('category') || '');
	let sort = $state($page.url.searchParams.get('sort') || 'newest');
	let type = $state($page.url.searchParams.get('type') || '');
	
	// Scroll state for UI changes
	let scrollY = $state(0);
	let showCategoryDropdown = $state(false);
	let isScrolled = $derived(scrollY > 20); // Lower threshold for better UX
	
	// Debug scroll values
	$effect(() => {
		console.log('ScrollY:', scrollY, 'IsScrolled:', isScrolled);
	});
	
	// Comprehensive categories with emojis
	const categories = [
		{ id: 'womens', label: 'Дамски', emoji: '👩', subcategories: ['Дрехи', 'Обувки', 'Чанти', 'Аксесоари'] },
		{ id: 'mens', label: 'Мъжки', emoji: '👨', subcategories: ['Дрехи', 'Обувки', 'Часовници', 'Аксесоари'] },
		{ id: 'kids', label: 'Детски', emoji: '👶', subcategories: ['Бебешки', '0-2 год.', '3-8 год.', '9-16 год.'] },
		{ id: 'shoes', label: 'Обувки', emoji: '👟', subcategories: ['Маратонки', 'Официални', 'Високи', 'Сандали'] },
		{ id: 'bags', label: 'Чанти', emoji: '👜', subcategories: ['Ръчни', 'Раници', 'Портмонета', 'Куфари'] },
		{ id: 'accessories', label: 'Аксесоари', emoji: '💍', subcategories: ['Бижута', 'Часовници', 'Слънчеви очила', 'Шалове'] },
		{ id: 'vintage', label: 'Vintage', emoji: '🕰️', subcategories: ['90-те', '2000-те', 'Ретро', 'Колекционерски'] },
		{ id: 'luxury', label: 'Луксозни', emoji: '💎', subcategories: ['Gucci', 'Prada', 'Louis Vuitton', 'Chanel'] }
	];
	
	onMount(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Element;
			if (showCategoryDropdown && !target.closest('.category-dropdown')) {
				showCategoryDropdown = false;
			}
		};
		
		document.addEventListener('click', handleClickOutside);
		
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
	
	// Mock data for now - TODO: Replace with real Supabase data
	const products = [
		{
			id: '1',
			title: 'Vintage Nike Air Jordan 1 Retro High OG',
			price: 299,
			originalPrice: 350,
			brand: 'Nike',
			condition: 'Like New',
			size: '42',
			images: [
				'https://images.unsplash.com/photo-1551107696-a4b57a95e98d?w=400&h=500&fit=crop',
				'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop'
			],
			rating: 4.8,
			reviewCount: 24,
			isFavorite: false,
			isNew: true,
			seller: {
				name: 'streetwear_king',
				avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
				rating: 4.9
			}
		},
		{
			id: '2',
			title: 'Supreme Box Logo Hoodie Black',
			price: 450,
			originalPrice: 600,
			brand: 'Supreme',
			condition: 'New',
			size: 'L',
			images: [
				'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop',
				'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop'
			],
			rating: 4.9,
			reviewCount: 67,
			isFavorite: true,
			isNew: false,
			seller: {
				name: 'hypebeast_store',
				avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
				rating: 4.7
			}
		},
		{
			id: '3',
			title: 'Vintage Levi\'s Denim Jacket 90s',
			price: 85,
			brand: 'Levi\'s',
			condition: 'Good',
			size: 'M',
			images: [
				'https://images.unsplash.com/photo-1544966503-7cc5ac882d5a?w=400&h=500&fit=crop',
				'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&h=500&fit=crop'
			],
			rating: 4.5,
			reviewCount: 12,
			isFavorite: false,
			isNew: false,
			seller: {
				name: 'vintage_finds',
				avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5e4?w=100&h=100&fit=crop&crop=face',
				rating: 4.6
			}
		}
	];
	
	// Get selected category info
	const selectedCategory = $derived(categories.find(cat => cat.id === category));
	
	// Determine page title based on parameters
	let pageTitle = $derived.by(() => {
		if (searchQuery) return `Резултати за "${searchQuery}"`;
		if (category === 'premium') return 'Премиум обяви';
		if (category === 'streetwear') return 'Streetwear';
		if (category === 'vintage') return 'Vintage находки';
		if (category === 'sustainable') return 'Устойчива мода';
		if (type === 'premium') return 'Премиум обяви';
		if (sort === 'newest') return 'Най-нови обяви';
		return 'Разгледай всички обяви';
	});
	
	// Filter products based on URL parameters
	let filteredProducts = $derived.by(() => {
		let result = [...products];
		
		// Filter by search query
		if (searchQuery) {
			result = result.filter(p => 
				p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				p.brand.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}
		
		// Filter by type
		if (type === 'premium') {
			result = result.filter(p => p.price > 200);
		}
		
		// Filter by category
		if (category) {
			// For now, just show all products - in real app would filter by actual category
		}
		
		return result;
	});
</script>

<svelte:head>
	<title>{pageTitle} - Driplo.bg</title>
</svelte:head>

<svelte:window bind:scrollY />

<div class="min-h-screen bg-gray-50">
	<!-- Header with search and category dropdown -->
	<div class="bg-white border-b sticky top-14 z-40 transition-all duration-300 {isScrolled ? 'shadow-md' : ''}">
		<div class="container mx-auto px-4 {isScrolled ? 'py-2' : 'py-4'} transition-all duration-300">
			<!-- Main Search Row -->
			<div class="flex gap-3 {isScrolled || !selectedCategory ? 'mb-0' : 'mb-4'} transition-all duration-300">
				<!-- Search Bar -->
				<div class="flex-1 relative">
					<div class="flex items-center bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
						<Search class="absolute left-3 h-4 w-4 text-gray-400" />
						<input
							type="text"
							bind:value={searchQuery}
							placeholder="Търси продукти, марки..."
							class="w-full pl-10 pr-4 py-3 text-sm bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
						/>
					</div>
				</div>
				
				<!-- Category Dropdown -->
				<div class="relative category-dropdown">
					<button
						onclick={() => showCategoryDropdown = !showCategoryDropdown}
						class="flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors min-w-[140px]"
					>
						{#if selectedCategory}
							<span>{selectedCategory.emoji}</span>
							<span>{selectedCategory.label}</span>
						{:else}
							<Filter class="h-4 w-4" />
							<span>Категории</span>
						{/if}
						<ChevronDown class="h-4 w-4 ml-auto transition-transform {showCategoryDropdown ? 'rotate-180' : ''}" />
					</button>
					
					<!-- Dropdown Menu -->
					{#if showCategoryDropdown}
						<div class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[380px]">
							<div class="p-4">
								<div class="grid grid-cols-2 gap-4">
									{#each categories as cat}
										<button
											onclick={() => {
												category = category === cat.id ? '' : cat.id;
												showCategoryDropdown = false;
											}}
											class="text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border {category === cat.id ? 'border-primary bg-primary/5' : 'border-gray-100'}"
										>
											<div class="flex items-center gap-2 mb-2">
												<span class="text-lg">{cat.emoji}</span>
												<span class="font-medium text-gray-900">{cat.label}</span>
											</div>
											<div class="text-xs text-gray-500 space-y-1">
												{#each cat.subcategories as sub}
													<div>{sub}</div>
												{/each}
											</div>
										</button>
									{/each}
								</div>
							</div>
						</div>
					{/if}
				</div>
				
				<!-- Search Button -->
				<Button class="bg-primary text-white hover:bg-primary/90 px-6 py-3 rounded-lg whitespace-nowrap">
					Търси
				</Button>
			</div>
			
			<!-- Quick category pills - hide when scrolled -->
			{#if selectedCategory && !isScrolled}
				<div class="flex items-center gap-2 text-sm">
					<span class="text-gray-500">Филтри:</span>
					<div class="flex gap-2">
						<Badge variant="secondary" class="flex items-center gap-1">
							<span>{selectedCategory.emoji}</span>
							<span>{selectedCategory.label}</span>
							<button onclick={() => category = ''} aria-label="Remove category filter" class="ml-1 hover:bg-gray-200 rounded-full p-0.5">
								<svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
								</svg>
							</button>
						</Badge>
					</div>
				</div>
			{/if}
		</div>
	</div>
	
	<!-- Results -->
	<div class="container mx-auto px-4 py-6">
		<!-- Results header -->
		<div class="mb-6">
			<h1 class="text-2xl font-bold text-gray-900 mb-2">{pageTitle}</h1>
			<p class="text-gray-600">{filteredProducts.length} намерени продукта</p>
		</div>
		
		<!-- Product Grid with filters -->
		<ProductGrid 
			products={filteredProducts}
			title=""
			showFilters={true}
			showSorting={true}
			gridCols="auto"
		/>
	</div>
</div>