<script lang="ts">
	import { page } from '$app/stores';
	import { ProductGrid } from '$lib/components/marketplace';
	import type { PageData } from './$types';
	
	let { data }: { data: PageData } = $props();
	
	// Get URL parameters
	let searchQuery = $state($page.url.searchParams.get('q') || '');
	let category = $state($page.url.searchParams.get('category') || '');
	let sort = $state($page.url.searchParams.get('sort') || 'newest');
	let type = $state($page.url.searchParams.get('type') || '');
	
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

<!-- Clean browse page - just like the reference image -->
<div class="min-h-screen bg-gray-50">
	<!-- Product Grid - Clean and minimal -->
	<div class="pt-4">
		<ProductGrid 
			products={filteredProducts}
			title=""
			showFilters={true}
			showSorting={true}
			gridCols="auto"
		/>
	</div>
</div>