<script lang="ts">
	import { Search } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	import { ProductGrid, ProductCard } from '$lib/components/marketplace';
	
	let { data } = $props();
	let searchQuery = $state('');
	
	// Real Supabase data is loaded via +page.server.ts with fallbacks to demo data
	
	const featuredProducts = [
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
		},
		{
			id: '4',
			title: 'Fear of God Essentials Oversized Tee',
			price: 120,
			originalPrice: 140,
			brand: 'Fear of God',
			condition: 'Like New',
			size: 'XL',
			images: [
				'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
				'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop'
			],
			rating: 4.7,
			reviewCount: 89,
			isFavorite: false,
			isNew: true,
			seller: {
				name: 'designer_drops',
				avatar: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=100&h=100&fit=crop&crop=face',
				rating: 4.8
			}
		},
		{
			id: '5',
			title: 'Off-White Industrial Belt',
			price: 180,
			originalPrice: 220,
			brand: 'Off-White',
			condition: 'Very Good',
			size: 'OS',
			images: [
				'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop',
				'https://images.unsplash.com/photo-1506629905147-7b39696b9924?w=400&h=500&fit=crop'
			],
			rating: 4.6,
			reviewCount: 34,
			isFavorite: true,
			isNew: false,
			seller: {
				name: 'luxury_reseller',
				avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=100&h=100&fit=crop&crop=face',
				rating: 4.9
			}
		},
		{
			id: '6',
			title: 'Balenciaga Triple S Sneakers',
			price: 520,
			originalPrice: 650,
			brand: 'Balenciaga',
			condition: 'Good',
			size: '41',
			images: [
				'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=500&fit=crop',
				'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=500&fit=crop'
			],
			rating: 4.4,
			reviewCount: 18,
			isFavorite: false,
			isNew: false,
			seller: {
				name: 'sneaker_vault',
				avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&crop=face',
				rating: 4.5
			}
		}
	];
	
	// Use server data if available, otherwise fallback to demo data
	let products = data.featuredListings.length > 0 ? data.featuredListings : featuredProducts;
	
	// Individual sections with fallbacks
	let newestProducts = data.newestListings?.length > 0 ? data.newestListings : products.slice(0, 8);
	let premiumProducts = data.premiumListings?.length > 0 ? data.premiumListings : products.filter(p => p.price > 200).slice(0, 8);
	let brandProducts = data.brandListings?.length > 0 ? data.brandListings : products.filter(p => ['Supreme', 'Nike', 'Fear of God', 'Balenciaga'].includes(p.brand)).slice(0, 8);
	let topSellerProducts = data.topSellerListings?.length > 0 ? data.topSellerListings : products.filter(p => p.seller.rating >= 4.7).slice(0, 8);
	
</script>

<!-- Hero Section - Facebook Marketplace Style -->
<section class="hidden md:block bg-white border-b">
	<div class="container mx-auto max-w-7xl px-8 py-16">
		<div class="text-center max-w-4xl mx-auto space-y-8">
			<!-- Badge -->
			<div class="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
				<span class="relative flex h-2 w-2">
					<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
					<span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
				</span>
				<span class="text-sm font-medium text-gray-700">Over 10,000 items added daily</span>
			</div>
			
			<!-- Main Heading -->
			<h1 class="text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight">
				Bulgaria's Trusted
				<span class="block mt-2 text-primary">
					Fashion Marketplace
				</span>
			</h1>
			
			<!-- Subtitle -->
			<p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
				Buy and sell authentic fashion with confidence. Verified sellers, secure payments, local delivery.
			</p>
			
			<!-- Clean Search Bar -->
			<div class="relative max-w-2xl mx-auto">
				<div class="flex items-center bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
					<Search class="absolute left-4 h-5 w-5 text-gray-400" />
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search for items, brands..."
						class="w-full pl-12 pr-4 py-4 text-base bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
					/>
					<Button class="bg-primary text-white hover:bg-primary/90 px-8 py-4 m-1 rounded-md">
						Search
					</Button>
				</div>
			</div>
			
			<!-- Trust Indicators -->
			<div class="flex flex-wrap justify-center gap-8 pt-8">
				<div class="flex items-center gap-2 text-gray-600">
					<svg class="h-5 w-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
					</svg>
					<span class="text-sm font-medium">Verified Sellers</span>
				</div>
				<div class="flex items-center gap-2 text-gray-600">
					<svg class="h-5 w-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
						<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
						<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
					</svg>
					<span class="text-sm font-medium">Secure Payments</span>
				</div>
				<div class="flex items-center gap-2 text-gray-600">
					<svg class="h-5 w-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
					</svg>
					<span class="text-sm font-medium">24/7 Support</span>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Mobile Clean Layout with Horizontal Scrolling -->
<section class="md:hidden bg-gray-50 pt-20 pb-20">
	<!-- Promotional Banner -->
	<div class="px-4 mb-6">
		<div class="relative bg-gradient-to-br from-primary to-accent rounded-xl p-4 text-white">
			<div class="absolute top-2 right-2">
				<Badge class="bg-yellow-400 text-black">-30%</Badge>
			</div>
			<h2 class="text-lg font-bold mb-1">Зимна разпродажба!</h2>
			<p class="text-sm opacity-90 mb-3">Отстъпки до 30% на избрани артикули</p>
			<Button size="sm" class="bg-white text-primary hover:bg-gray-100" onclick={() => goto('/browse?sale=true')}>
				Разгледай
			</Button>
		</div>
	</div>

	<div class="space-y-6">
		<!-- Products Grid -->
		<section>
			<div class="flex gap-3 px-4 overflow-x-auto scrollbar-hide">
				{#each newestProducts.slice(0, 6) as product}
					<div class="w-[160px] flex-shrink-0">
						<ProductCard {product} onclick={() => goto(`/products/${product.id}`)} />
					</div>
				{/each}
			</div>
		</section>

		<!-- Flash Sale Banner -->
		<div class="px-4">
			<button onclick={() => goto('/browse?flash=true')} class="w-full relative overflow-hidden rounded-xl">
				<img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=200&fit=crop" alt="Flash Sale" class="w-full h-32 object-cover" />
				<div class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center px-4">
					<div class="text-white text-left">
						<p class="text-xs uppercase tracking-wide mb-1">⚡ Flash Sale</p>
						<h3 class="text-lg font-bold">До -70% намаление</h3>
						<p class="text-xs opacity-90">Само днес!</p>
					</div>
				</div>
			</button>
		</div>

		<!-- Products Grid -->
		<section>
			<div class="flex gap-3 px-4 overflow-x-auto scrollbar-hide">
				{#each premiumProducts.slice(0, 6) as product}
					<div class="w-[160px] flex-shrink-0">
						<ProductCard {product} onclick={() => goto(`/products/${product.id}`)} />
					</div>
				{/each}
			</div>
		</section>

		<!-- Brand Collections Banner -->
		<div class="px-4">
			<div class="grid grid-cols-2 gap-3">
				<button onclick={() => goto('/browse?brand=nike')} class="relative rounded-lg overflow-hidden aspect-square">
					<img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop" alt="Nike" class="w-full h-full object-cover" />
					<div class="absolute inset-0 bg-black/40 flex items-end p-3">
						<span class="text-white font-bold">Nike</span>
					</div>
				</button>
				<button onclick={() => goto('/browse?brand=adidas')} class="relative rounded-lg overflow-hidden aspect-square">
					<img src="https://images.unsplash.com/photo-1520256862855-398228c41684?w=400&h=400&fit=crop" alt="Adidas" class="w-full h-full object-cover" />
					<div class="absolute inset-0 bg-black/40 flex items-end p-3">
						<span class="text-white font-bold">Adidas</span>
					</div>
				</button>
			</div>
		</div>

		<!-- Products Grid -->
		<section>
			<div class="flex gap-3 px-4 overflow-x-auto scrollbar-hide">
				{#each topSellerProducts.slice(0, 6) as product}
					<div class="w-[160px] flex-shrink-0">
						<ProductCard {product} onclick={() => goto(`/products/${product.id}`)} />
					</div>
				{/each}
			</div>
		</section>
	</div>
</section>


<!-- Featured Items - Desktop only (already shown on mobile above) -->
<section class="hidden md:block py-16 bg-gray-50">
	<div class="container mx-auto max-w-7xl px-4">
		<!-- Categories Quick Access - Desktop Version -->
		<div class="mb-12">
			<h2 class="text-2xl font-bold text-gray-900 mb-6">Категории</h2>
			<div class="flex justify-center gap-6">
				<button onclick={() => goto('/browse?category=women')} class="flex flex-col items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-shadow">
					<div class="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center text-2xl">👗</div>
					<span class="font-medium">Дамски</span>
				</button>
				<button onclick={() => goto('/browse?category=men')} class="flex flex-col items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-shadow">
					<div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl">👔</div>
					<span class="font-medium">Мъжки</span>
				</button>
				<button onclick={() => goto('/browse?category=shoes')} class="flex flex-col items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-shadow">
					<div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl">👟</div>
					<span class="font-medium">Обувки</span>
				</button>
				<button onclick={() => goto('/browse?category=bags')} class="flex flex-col items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-shadow">
					<div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-2xl">👜</div>
					<span class="font-medium">Чанти</span>
				</button>
				<button onclick={() => goto('/browse?category=accessories')} class="flex flex-col items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-shadow">
					<div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-2xl">💍</div>
					<span class="font-medium">Аксесоари</span>
				</button>
			</div>
		</div>
		
		<!-- Horizontal Sections for Desktop -->
		<div class="space-y-12">
			<!-- Най-нови обяви -->
			<section>
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-2xl font-bold text-gray-900">Най-нови обяви</h2>
					<Button variant="ghost" onclick={() => goto('/browse?sort=newest')}>
						Виж всички →
					</Button>
				</div>
				<div class="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
					{#each newestProducts as product}
						<div class="min-w-[160px] flex-shrink-0">
							<ProductCard {product} onclick={() => goto(`/products/${product.id}`)} compact={true} />
						</div>
					{/each}
				</div>
			</section>

			<!-- Премиум обяви -->
			<section>
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-2xl font-bold text-gray-900">Премиум обяви</h2>
					<Button variant="ghost" onclick={() => goto('/browse?type=premium')}>
						Виж всички →
					</Button>
				</div>
				<div class="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
					{#each premiumProducts as product}
						<div class="min-w-[160px] flex-shrink-0">
							<ProductCard {product} onclick={() => goto(`/products/${product.id}`)} compact={true} />
						</div>
					{/each}
				</div>
			</section>

			<!-- Обяви на брандове -->
			<section>
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-2xl font-bold text-gray-900">Обяви на брандове</h2>
					<Button variant="ghost" onclick={() => goto('/brands')}>
						Виж всички →
					</Button>
				</div>
				<div class="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
					{#each brandProducts as product}
						<div class="min-w-[160px] flex-shrink-0">
							<ProductCard {product} onclick={() => goto(`/products/${product.id}`)} compact={true} />
						</div>
					{/each}
				</div>
			</section>

			<!-- Топ продавачи -->
			<section>
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-2xl font-bold text-gray-900">Топ продавачи</h2>
					<Button variant="ghost" onclick={() => goto('/sellers')}>
						Виж всички →
					</Button>
				</div>
				<div class="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
					{#each topSellerProducts as product}
						<div class="min-w-[160px] flex-shrink-0">
							<ProductCard {product} onclick={() => goto(`/products/${product.id}`)} compact={true} />
						</div>
					{/each}
				</div>
			</section>
		</div>
		
		<!-- Stats Banner -->
		<div class="mt-16 bg-gray-900 rounded-2xl p-8 text-white">
			<div class="grid grid-cols-3 gap-8 text-center">
				<div>
					<div class="text-3xl font-bold">50K+</div>
					<div class="text-gray-400 text-sm mt-1">Активни потребители</div>
				</div>
				<div>
					<div class="text-3xl font-bold">100K+</div>
					<div class="text-gray-400 text-sm mt-1">Продукти</div>
				</div>
				<div>
					<div class="text-3xl font-bold">4.8★</div>
					<div class="text-gray-400 text-sm mt-1">Рейтинг</div>
				</div>
			</div>
		</div>
	</div>
</section>



