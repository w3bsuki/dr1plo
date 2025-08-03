<script lang="ts">
	import { Grid, List, Filter, X } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Skeleton from '$lib/components/ui/skeleton.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	import Select from '$lib/components/ui/select/select.svelte';
	import SelectTrigger from '$lib/components/ui/select/SelectTrigger.svelte';
	import SelectContent from '$lib/components/ui/select/SelectContent.svelte';
	import SelectItem from '$lib/components/ui/select/SelectItem.svelte';
	
	import ProductCard from './ProductCard.svelte';
	
	interface Product {
		id: string;
		title: string;
		price: number;
		originalPrice?: number;
		brand: string;
		condition: string;
		size: string;
		images: string[];
		rating: number;
		reviewCount: number;
		isFavorite: boolean;
		isNew: boolean;
		seller: {
			name: string;
			avatar: string;
			rating: number;
		};
	}
	
	let { 
		products = [],
		loading = false,
		title = "Trending Now",
		showFilters = true,
		showSorting = true,
		gridCols = "auto"
	}: {
		products?: Product[];
		loading?: boolean;
		title?: string;
		showFilters?: boolean;
		showSorting?: boolean;
		gridCols?: "auto" | "2" | "3" | "4" | "5";
	} = $props();
	
	let viewMode = $state<'grid' | 'list'>('grid');
	let sortBy = $state('newest');
	let selectedCondition = $state('');
	let selectedSize = $state('');
	let selectedPrice = $state('');
	let selectedBrand = $state('');
	
	const conditions = [
		{ value: '', label: 'Състояние' },
		{ value: 'new_with_tags', label: 'Ново с етикет' },
		{ value: 'like_new', label: 'Като ново' },
		{ value: 'very_good', label: 'Много добро' },
		{ value: 'good', label: 'Добро' },
		{ value: 'fair', label: 'Задоволително' }
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
	
	const priceRanges = [
		{ value: '', label: 'Цена' },
		{ value: 'under-25', label: 'До 25лв' },
		{ value: '25-50', label: '25-50лв' },
		{ value: '50-100', label: '50-100лв' },
		{ value: '100-200', label: '100-200лв' },
		{ value: '200-plus', label: 'Над 200лв' }
	];
	
	const brands = [
		{ value: '', label: 'Марка' },
		{ value: 'zara', label: 'Zara' },
		{ value: 'hm', label: 'H&M' },
		{ value: 'nike', label: 'Nike' },
		{ value: 'adidas', label: 'Adidas' },
		{ value: 'levis', label: "Levi's" },
		{ value: 'gucci', label: 'Gucci' },
		{ value: 'other', label: 'Други' }
	];
	
	const sortOptions = [
		{ value: 'newest', label: 'Най-нови' },
		{ value: 'price-low', label: 'Цена ↑' },
		{ value: 'price-high', label: 'Цена ↓' },
		{ value: 'popular', label: 'Популярни' }
	];
	
	const gridColsClass = {
		'auto': 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
		'2': 'grid-cols-2',
		'3': 'grid-cols-3',
		'4': 'grid-cols-4',
		'5': 'grid-cols-5'
	};

	// Track active filters count
	let activeFiltersCount = $derived.by(() => {
		let count = 0;
		if (selectedCondition) count++;
		if (selectedSize) count++;
		if (selectedPrice) count++;
		if (selectedBrand) count++;
		return count;
	});

	// Derived state for filtered and sorted products
	let filteredAndSortedProducts = $derived.by(() => {
		let result = [...products];
		
		// Apply condition filter
		if (selectedCondition) {
			const conditionMap: Record<string, string[]> = {
				'new_with_tags': ['new', 'new_with_tags'],
				'like_new': ['like-new', 'like_new', 'very_good'],
				'very_good': ['very_good', 'good'],
				'good': ['good'],
				'fair': ['fair']
			};
			const acceptedConditions = conditionMap[selectedCondition] || [selectedCondition];
			result = result.filter(p => acceptedConditions.includes(p.condition.toLowerCase()));
		}
		
		// Apply size filter
		if (selectedSize) {
			result = result.filter(p => p.size.toUpperCase() === selectedSize.toUpperCase());
		}
		
		// Apply price filter
		if (selectedPrice) {
			switch (selectedPrice) {
				case 'under-25':
					result = result.filter(p => p.price < 25);
					break;
				case '25-50':
					result = result.filter(p => p.price >= 25 && p.price <= 50);
					break;
				case '50-100':
					result = result.filter(p => p.price >= 50 && p.price <= 100);
					break;
				case '100-200':
					result = result.filter(p => p.price >= 100 && p.price <= 200);
					break;
				case '200-plus':
					result = result.filter(p => p.price > 200);
					break;
			}
		}
		
		// Apply brand filter
		if (selectedBrand) {
			if (selectedBrand === 'other') {
				const mainBrands = ['zara', 'h&m', 'nike', 'adidas', "levi's", 'gucci'];
				result = result.filter(p => !mainBrands.includes(p.brand.toLowerCase()));
			} else {
				result = result.filter(p => p.brand.toLowerCase().includes(selectedBrand.toLowerCase()));
			}
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
	
	function handleProductClick(product: Product) {
		goto(`/products/${product.id}`);
	}

	function clearAllFilters() {
		selectedCondition = '';
		selectedSize = '';
		selectedPrice = '';
		selectedBrand = '';
	}
</script>

<div class="w-full">
	<!-- Header -->
	{#if title}
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
			
			<!-- View Mode Toggle - Desktop Only -->
			<div class="hidden md:flex border border-gray-200 rounded-lg p-1">
				<Button
					variant={viewMode === 'grid' ? 'default' : 'ghost'}
					size="icon"
					class="w-8 h-8"
					onclick={() => viewMode = 'grid'}
				>
					<Grid class="w-4 h-4" />
				</Button>
				<Button
					variant={viewMode === 'list' ? 'default' : 'ghost'}
					size="icon"
					class="w-8 h-8"
					onclick={() => viewMode = 'list'}
				>
					<List class="w-4 h-4" />
				</Button>
			</div>
		</div>
	{/if}
	
	<!-- Filters Bar - Only show if explicitly enabled -->
	{#if showFilters || showSorting}
		<div class="flex gap-2 mb-4 overflow-x-auto pb-1">
			<!-- Condition Filter -->
			{#if showFilters}
				<Select bind:value={selectedCondition}>
					<SelectTrigger class="min-w-[120px] h-9 text-sm {selectedCondition ? 'border-primary' : ''}">
						{conditions.find(c => c.value === selectedCondition)?.label || 'Състояние'}
					</SelectTrigger>
					<SelectContent>
						{#each conditions as condition}
							<SelectItem value={condition.value}>{condition.label}</SelectItem>
						{/each}
					</SelectContent>
				</Select>
				
				<!-- Size Filter -->
				<Select bind:value={selectedSize}>
					<SelectTrigger class="min-w-[90px] h-9 text-sm {selectedSize ? 'border-primary' : ''}">
						{sizes.find(s => s.value === selectedSize)?.label || 'Размер'}
					</SelectTrigger>
					<SelectContent>
						{#each sizes as size}
							<SelectItem value={size.value}>{size.label}</SelectItem>
						{/each}
					</SelectContent>
				</Select>
				
				<!-- Price Filter -->
				<Select bind:value={selectedPrice}>
					<SelectTrigger class="min-w-[100px] h-9 text-sm {selectedPrice ? 'border-primary' : ''}">
						{priceRanges.find(p => p.value === selectedPrice)?.label || 'Цена'}
					</SelectTrigger>
					<SelectContent>
						{#each priceRanges as range}
							<SelectItem value={range.value}>{range.label}</SelectItem>
						{/each}
					</SelectContent>
				</Select>
				
				<!-- Brand Filter -->
				<Select bind:value={selectedBrand}>
					<SelectTrigger class="min-w-[100px] h-9 text-sm {selectedBrand ? 'border-primary' : ''}">
						{brands.find(b => b.value === selectedBrand)?.label || 'Марка'}
					</SelectTrigger>
					<SelectContent>
						{#each brands as brand}
							<SelectItem value={brand.value}>{brand.label}</SelectItem>
						{/each}
					</SelectContent>
				</Select>
				
				<!-- Clear Filters -->
				{#if activeFiltersCount > 0}
					<Button 
						variant="outline" 
						size="sm"
						onclick={clearAllFilters}
						class="h-9 px-3 text-sm flex items-center gap-1"
					>
						<X class="w-3 h-3" />
						Изчисти ({activeFiltersCount})
					</Button>
				{/if}
			{/if}
			
			<!-- Sort Dropdown -->
			{#if showSorting}
				<div class="ml-auto">
					<Select bind:value={sortBy}>
						<SelectTrigger class="w-32 h-9 text-sm">
							{sortOptions.find(opt => opt.value === sortBy)?.label || 'Сортирай'}
						</SelectTrigger>
						<SelectContent>
							{#each sortOptions as option}
								<SelectItem value={option.value}>{option.label}</SelectItem>
							{/each}
						</SelectContent>
					</Select>
				</div>
			{/if}
		</div>
	{/if}
	
	<!-- Loading State -->
	{#if loading}
		<div class="grid {gridColsClass[gridCols]} gap-3 md:gap-4">
			{#each Array(12) as _}
				<div class="space-y-3">
					<Skeleton class="aspect-[4/5] w-full" />
					<Skeleton class="h-4 w-3/4" />
					<Skeleton class="h-4 w-1/2" />
					<Skeleton class="h-6 w-1/3" />
				</div>
			{/each}
		</div>
	{:else if filteredAndSortedProducts.length === 0}
		<!-- Empty State -->
		<div class="text-center py-12">
			<div class="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
				<Grid class="w-8 h-8 text-gray-400" />
			</div>
			<h3 class="text-lg font-medium text-gray-900 mb-2">Няма намерени продукти</h3>
			<p class="text-gray-500 mb-4">Опитайте да промените филтрите</p>
			{#if activeFiltersCount > 0}
				<Button variant="outline" onclick={clearAllFilters}>Изчисти филтрите</Button>
			{/if}
		</div>
	{:else}
		<!-- Product Grid -->
		<div class="grid {gridColsClass[gridCols]} gap-3 md:gap-4">
			{#each filteredAndSortedProducts as product (product.id)}
				<ProductCard 
					{product} 
					onclick={() => handleProductClick(product)}
				/>
			{/each}
		</div>
		
		<!-- Load More Button -->
		{#if products.length >= 20}
			<div class="text-center mt-8">
				<Button variant="outline" class="px-8">
					Зареди още
				</Button>
			</div>
		{/if}
	{/if}
</div>