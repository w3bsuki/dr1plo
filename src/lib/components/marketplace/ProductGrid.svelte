<script lang="ts">
	import ProductCard from './ProductCard.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import { Grid, List, Filter, SortAsc } from '@lucide/svelte';
	import Skeleton from '$lib/components/ui/skeleton.svelte';
	
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
	let showFilterPanel = $state(false);
	
	const sortOptions = [
		{ value: 'newest', label: 'Newest' },
		{ value: 'price-low', label: 'Price: Low to High' },
		{ value: 'price-high', label: 'Price: High to Low' },
		{ value: 'popular', label: 'Most Popular' },
		{ value: 'rating', label: 'Highest Rated' }
	];
	
	const gridColsClass = {
		'auto': 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
		'2': 'grid-cols-2',
		'3': 'grid-cols-3',
		'4': 'grid-cols-4',
		'5': 'grid-cols-5'
	};
	
	function handleProductClick(product: Product) {
		// Navigate to product detail page
		window.location.href = `/products/${product.id}`;
	}
</script>

<div class="w-full">
	<!-- Header -->
	<div class="flex items-center justify-between mb-6">
		<div>
			<h2 class="text-2xl font-bold text-gray-900">{title}</h2>
			{#if products.length > 0}
				<p class="text-gray-600 mt-1">{products.length} items</p>
			{/if}
		</div>
		
		{#if showFilters || showSorting}
			<div class="flex items-center gap-3">
				<!-- View Mode Toggle -->
				<div class="hidden sm:flex border border-gray-200 rounded-lg p-1">
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
				
				{#if showSorting}
					<!-- Sort Dropdown -->
					<div class="relative">
						<select 
							bind:value={sortBy}
							class="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
						>
							{#each sortOptions as option}
								<option value={option.value}>{option.label}</option>
							{/each}
						</select>
						<SortAsc class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
					</div>
				{/if}
				
				{#if showFilters}
					<!-- Filter Button -->
					<Button
						variant="outline"
						onclick={() => showFilterPanel = !showFilterPanel}
						class="flex items-center gap-2"
					>
						<Filter class="w-4 h-4" />
						Filters
					</Button>
				{/if}
			</div>
		{/if}
	</div>
	
	<!-- Filter Panel -->
	{#if showFilterPanel && showFilters}
		<div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
				<!-- Price Range -->
				<div>
					<span class="block text-sm font-medium text-gray-700 mb-2">Price Range</span>
					<div class="flex gap-2">
						<input type="number" placeholder="Min" aria-label="Minimum price" class="w-full px-3 py-2 border border-gray-200 rounded text-sm">
						<input type="number" placeholder="Max" aria-label="Maximum price" class="w-full px-3 py-2 border border-gray-200 rounded text-sm">
					</div>
				</div>
				
				<!-- Size -->
				<div>
					<label for="size-select" class="block text-sm font-medium text-gray-700 mb-2">Size</label>
					<select id="size-select" class="w-full px-3 py-2 border border-gray-200 rounded text-sm">
						<option>All Sizes</option>
						<option>XS</option>
						<option>S</option>
						<option>M</option>
						<option>L</option>
						<option>XL</option>
					</select>
				</div>
				
				<!-- Condition -->
				<div>
					<label for="condition-select" class="block text-sm font-medium text-gray-700 mb-2">Condition</label>
					<select id="condition-select" class="w-full px-3 py-2 border border-gray-200 rounded text-sm">
						<option>All Conditions</option>
						<option>New with tags</option>
						<option>Very good</option>
						<option>Good</option>
						<option>Fair</option>
					</select>
				</div>
				
				<!-- Brand -->
				<div>
					<label for="brand-input" class="block text-sm font-medium text-gray-700 mb-2">Brand</label>
					<input id="brand-input" type="text" placeholder="Search brands..." class="w-full px-3 py-2 border border-gray-200 rounded text-sm">
				</div>
			</div>
			
			<div class="flex justify-end gap-2 mt-4">
				<Button variant="outline" onclick={() => showFilterPanel = false}>
					Clear All
				</Button>
				<Button onclick={() => showFilterPanel = false}>
					Apply Filters
				</Button>
			</div>
		</div>
	{/if}
	
	<!-- Loading State -->
	{#if loading}
		<div class="grid {gridColsClass[gridCols]} gap-4">
			{#each Array(12) as _}
				<div class="space-y-3">
					<Skeleton class="aspect-[4/5] w-full" />
					<Skeleton class="h-4 w-3/4" />
					<Skeleton class="h-4 w-1/2" />
					<Skeleton class="h-6 w-1/3" />
				</div>
			{/each}
		</div>
	{:else if products.length === 0}
		<!-- Empty State -->
		<div class="text-center py-12">
			<div class="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
				<Grid class="w-8 h-8 text-gray-400" />
			</div>
			<h3 class="text-lg font-medium text-gray-900 mb-2">No products found</h3>
			<p class="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
			<Button variant="outline">Browse All Categories</Button>
		</div>
	{:else}
		<!-- Product Grid -->
		<div class="grid {gridColsClass[gridCols]} gap-4 md:gap-6">
			{#each products as product (product.id)}
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
					Load More Products
				</Button>
			</div>
		{/if}
	{/if}
</div>