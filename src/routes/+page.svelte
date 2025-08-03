<script lang="ts">
	import { Search, TrendingUp, Star, ArrowRight } from '@lucide/svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	import { ProductGrid } from '$lib/components/marketplace';
	
	let searchQuery = $state('');
	
	// Mock data for demo
	const categories = [
		{ name: 'Men', slug: 'men', image: '/placeholder-men.jpg', count: '2.1k items' },
		{ name: 'Women', slug: 'women', image: '/placeholder-women.jpg', count: '3.5k items' },
		{ name: 'Kids', slug: 'kids', image: '/placeholder-kids.jpg', count: '0.8k items' }
	];
	
	// Enhanced product data for the new ProductGrid component
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
	
	const topSellers = [
		{ username: 'streetwear_king', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', sales: 234 },
		{ username: 'hypebeast_store', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', sales: 189 },
		{ username: 'vintage_finds', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5e4?w=100&h=100&fit=crop&crop=face', sales: 156 }
	];
</script>

<!-- Hero Section - Desktop only -->
<section class="hidden md:block relative overflow-hidden bg-gradient-brand min-h-[600px]">
	<!-- Animated Background -->
	<div class="absolute inset-0 gradient-mesh opacity-30 animate-pulse"></div>
	<div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
	
	<div class="container relative mx-auto max-w-7xl px-8 py-32">
		<div class="text-center max-w-5xl mx-auto space-y-8 animate-fadeIn">
			<!-- Badge -->
			<div class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
				<span class="relative flex h-2 w-2">
					<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
					<span class="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
				</span>
				<span class="text-sm font-medium text-white">Over 10,000 items added daily</span>
			</div>
			
			<!-- Main Heading -->
			<h1 class="text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
				The Future of
				<span class="block mt-2 gradient-text">
					Fashion Trading
				</span>
			</h1>
			
			<!-- Subtitle -->
			<p class="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
				Join Bulgaria's premium marketplace for authentic streetwear, designer pieces, and curated vintage collections.
			</p>
			
			<!-- Premium Search Bar -->
			<div class="relative max-w-3xl mx-auto group">
				<div class="absolute -inset-1 gradient-brand rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
				<div class="relative flex items-center bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
					<Search class="absolute left-6 h-5 w-5 text-gray-500" />
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search brands, items, or styles..."
						class="w-full px-14 py-5 text-lg bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none"
					/>
					<Button class="absolute right-3 gradient-brand text-white hover:shadow-brand transition-all duration-300 px-8 py-3 rounded-xl">
						Search
					</Button>
				</div>
			</div>
			
			<!-- Quick Tags -->
			<div class="flex flex-wrap justify-center gap-3">
				<span class="text-white/60 text-sm">Trending:</span>
				{#each ['Nike Air', 'Supreme', 'Vintage Denim', 'Balenciaga', 'Off-White'] as tag}
					<button class="px-4 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-sm text-white border border-white/10 transition-all hover:scale-105">
						{tag}
					</button>
				{/each}
			</div>
			
			<!-- Stats -->
			<div class="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8">
				<div class="text-center">
					<div class="text-3xl font-bold text-white">50K+</div>
					<div class="text-sm text-white/70">Active Users</div>
				</div>
				<div class="text-center">
					<div class="text-3xl font-bold text-white">100K+</div>
					<div class="text-sm text-white/70">Listed Items</div>
				</div>
				<div class="text-center">
					<div class="text-3xl font-bold text-white">98%</div>
					<div class="text-sm text-white/70">Happy Customers</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Mobile Hero & Product Grid -->
<section class="md:hidden bg-gradient-to-br from-purple-600 to-pink-500">
	<!-- Mobile Hero -->
	<div class="px-4 pt-6 pb-8 text-white">
		<div class="space-y-4">
			<h1 class="text-3xl font-bold leading-tight text-white">
				Fashion
				<span class="block text-pink-200">Marketplace</span>
			</h1>
			<p class="text-white/90 text-sm">Bulgaria's premium fashion trading platform</p>
			
			<!-- Mobile Search -->
			<div class="relative">
				<Search class="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search..."
					class="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-gray-900 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
				/>
			</div>
		</div>
	</div>
</section>

<!-- Mobile Product Grid -->
<section class="md:hidden bg-white pt-4 pb-4">
	<div class="px-4">
		<div class="mb-4">
			<h2 class="text-xl font-bold text-gray-900">Trending Now</h2>
			<p class="text-sm text-gray-600">Discover the latest drops</p>
		</div>
		
		<ProductGrid 
			products={featuredProducts}
			title=""
			showFilters={false}
			showSorting={false}
			gridCols="2"
		/>
	</div>
</section>

<!-- Categories Section -->
<section class="py-12 md:py-20 bg-gradient-to-b from-white to-gray-50">
	<div class="container mx-auto max-w-7xl px-4 md:px-8">
		<div class="text-center mb-8 md:mb-16 space-y-4">
			<h2 class="text-3xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Shop by Category</h2>
			<p class="text-gray-600 max-w-2xl mx-auto">Explore our curated collections</p>
		</div>
		<div class="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
			{#each categories as category, i}
				<a 
					href="/{category.slug}" 
					class="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-gradient-to-br from-gray-200 to-gray-300 min-h-[200px] md:min-h-[280px] transform transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-slideUp"
					style="animation-delay: {i * 100}ms"
				>
					<!-- Gradient Overlay -->
					<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
					
					<!-- Content -->
					<div class="absolute bottom-0 left-0 right-0 p-6 md:p-8 transform transition-transform group-hover:translate-y-[-4px]">
						<h3 class="text-2xl md:text-3xl font-bold text-white mb-2">{category.name}</h3>
						<p class="text-sm md:text-base text-white/80">{category.count}</p>
						
						<!-- Hover Arrow -->
						<div class="mt-4 flex items-center gap-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
							<span class="text-sm font-medium">Explore</span>
							<ArrowRight class="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
						</div>
					</div>
					
					<!-- Decorative Corner -->
					<div class="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- Featured Items - Desktop only (already shown on mobile above) -->
<section class="hidden md:block py-16 bg-gray-50">
	<div class="container mx-auto max-w-7xl px-4">
		<ProductGrid 
			products={featuredProducts}
			title="Trending Now"
			showFilters={false}
			showSorting={false}
			gridCols="auto"
		/>
	</div>
</section>

<!-- Top Sellers -->
<section class="py-12 md:py-20 bg-white">
	<div class="container mx-auto max-w-7xl px-4 md:px-8">
		<div class="text-center mb-8 md:mb-16 space-y-4">
			<h2 class="text-3xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Top Sellers</h2>
			<p class="text-gray-600 max-w-2xl mx-auto">Join our community of trusted fashion traders</p>
		</div>
		
		<div class="grid grid-cols-3 md:grid-cols-3 gap-6 md:gap-12 max-w-5xl mx-auto">
			{#each topSellers as seller, index}
				<a 
					href="/profile/{seller.username}" 
					class="text-center group transform transition-all duration-300 hover:scale-110 animate-scaleIn"
					style="animation-delay: {index * 150}ms"
				>
					<div class="relative mx-auto w-20 md:w-28 h-20 md:h-28 mb-4 md:mb-6">
						<!-- Gradient Ring -->
						<div class="absolute inset-0 gradient-brand rounded-full opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300"></div>
						
						<!-- Avatar -->
						<div class="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:shadow-2xl transition-shadow">
							<img 
								src={seller.avatar} 
								alt={seller.username}
								class="w-full h-full object-cover"
							/>
						</div>
						
						<!-- Badge -->
						{#if index === 0}
							<div class="absolute -top-2 -right-2 w-8 md:w-10 h-8 md:h-10 gradient-brand rounded-full flex items-center justify-center shadow-lg animate-bounce">
								<Star class="h-4 md:h-5 w-4 md:w-5 text-white" />
							</div>
						{:else if index === 1}
							<div class="absolute -top-2 -right-2 w-8 md:w-10 h-8 md:h-10 bg-gray-400 rounded-full flex items-center justify-center shadow-lg">
								<span class="text-white font-bold text-sm">2</span>
							</div>
						{:else if index === 2}
							<div class="absolute -top-2 -right-2 w-8 md:w-10 h-8 md:h-10 bg-orange-600 rounded-full flex items-center justify-center shadow-lg">
								<span class="text-white font-bold text-sm">3</span>
							</div>
						{/if}
					</div>
					
					<!-- Info -->
					<h3 class="text-base md:text-lg font-bold text-gray-900 group-hover:gradient-text transition-all truncate mb-1">
						@{seller.username}
					</h3>
					<p class="text-sm md:text-base text-gray-600">
						<span class="font-semibold text-gray-900">{seller.sales}</span> sales
					</p>
					
					<!-- Rating -->
					<div class="flex justify-center gap-1 mt-2">
						{#each Array(5) as _, i}
							<Star class="h-3 md:h-4 w-3 md:w-4 fill-yellow-400 text-yellow-400" />
						{/each}
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="relative py-20 md:py-32 overflow-hidden">
	<!-- Gradient Background -->
	<div class="absolute inset-0 gradient-brand"></div>
	<div class="absolute inset-0 gradient-mesh opacity-20"></div>
	
	<!-- Content -->
	<div class="container relative mx-auto max-w-7xl px-4 md:px-8 text-center">
		<div class="max-w-4xl mx-auto space-y-8 animate-fadeIn">
			<!-- Heading -->
			<h2 class="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
				Ready to Start
				<span class="block gradient-text">Your Fashion Journey?</span>
			</h2>
			
			<!-- Description -->
			<p class="text-lg md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
				Join thousands of fashion enthusiasts. List your first item in under 60 seconds.
			</p>
			
			<!-- Buttons -->
			<div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
				<Button 
					size="lg" 
					class="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-white/20 transform hover:scale-105 transition-all duration-300 min-h-[56px]"
				>
					Start Selling Now
				</Button>
				<Button 
					variant="outline" 
					size="lg" 
					class="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg font-semibold rounded-xl transform hover:scale-105 transition-all duration-300 min-h-[56px]"
				>
					Browse Marketplace
				</Button>
			</div>
			
			<!-- Trust Badges -->
			<div class="flex flex-wrap justify-center gap-8 pt-8">
				<div class="flex items-center gap-2 text-white/80">
					<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
					</svg>
					<span class="text-sm font-medium">Verified Sellers</span>
				</div>
				<div class="flex items-center gap-2 text-white/80">
					<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
						<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
						<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
					</svg>
					<span class="text-sm font-medium">Secure Payments</span>
				</div>
				<div class="flex items-center gap-2 text-white/80">
					<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
					</svg>
					<span class="text-sm font-medium">24/7 Support</span>
				</div>
			</div>
		</div>
	</div>
</section>

