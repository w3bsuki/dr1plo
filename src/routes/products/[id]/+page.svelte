<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Heart, Share2, Shield, MapPin, Clock, ChevronLeft, ChevronRight, MessageCircle, ShoppingBag, Star, Check, X } from '@lucide/svelte';
	
	import Button from '$lib/components/ui/button.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	import ProductCard from '$lib/components/marketplace/ProductCard.svelte';
	
	let productId = $derived($page.params.id);
	
	// Mock product data - in production this would come from +page.server.ts
	let product = {
		id: $page.params.id,
		title: 'Nike Air Jordan 1 Retro High OG',
		price: 299,
		originalPrice: 450,
		brand: 'Nike',
		condition: 'new_with_tags',
		size: '42',
		category: 'Обувки',
		color: 'Черно/Червено',
		material: 'Кожа',
		description: `Оригинални Nike Air Jordan 1 Retro High OG в перфектно състояние.
		
• Закупени от официален магазин
• Носени само веднъж за снимки
• Включва оригинална кутия и всички аксесоари
• 100% автентични с фактура

Размер EU 42 / US 8.5 / UK 7.5

Причина за продажба: Не ми стават добре, взех грешен размер.`,
		images: [
			'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1000&fit=crop',
			'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop',
			'https://images.unsplash.com/photo-1551107696-a4b57a95e98d?w=800&h=1000&fit=crop',
			'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=1000&fit=crop'
		],
		location: 'София, Център',
		timeAgo: 'Преди 2 часа',
		viewCount: 124,
		likeCount: 18,
		seller: {
			id: '1',
			name: 'sneaker_king',
			avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
			rating: 4.9,
			reviewCount: 47,
			joinedDate: 'Януари 2023',
			responseTime: 'Обикновено отговаря до 1 час',
			verified: true,
			soldCount: 89,
			followers: 234
		},
		shipping: {
			available: true,
			price: 5,
			methods: ['Еконт', 'Speedy', 'Лично предаване']
		},
		tags: ['nike', 'jordan', 'оригинални', 'limited edition'],
		authenticity: {
			verified: true,
			certificate: true
		}
	};
	
	// Breadcrumb data - after product is defined
	let breadcrumbs = $derived([
		{ label: 'Начало', href: '/' },
		{ label: product.category || 'Продукти', href: '/browse' },
		{ label: product.brand, href: `/browse?brand=${encodeURIComponent(product.brand)}` },
		{ label: product.title, href: null }
	]);
	
	// State
	let currentImageIndex = $state(0);
	let isLiked = $state(false);
	let showImageModal = $state(false);
	let touchStartX = $state(0);
	
	// Related products mock data
	const relatedProducts = [
		{
			id: '2',
			title: 'Adidas Yeezy Boost 350',
			price: 280,
			brand: 'Adidas',
			condition: 'Like New',
			size: '42',
			images: ['https://images.unsplash.com/photo-1554062614-6da4fa67725a?w=400&h=500&fit=crop'],
			rating: 4.7,
			reviewCount: 23,
			isFavorite: false,
			seller: { name: 'streetwear', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', rating: 4.8 }
		},
		{
			id: '3',
			title: 'Nike Dunk Low',
			price: 180,
			brand: 'Nike',
			condition: 'Very Good',
			size: '41',
			images: ['https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400&h=500&fit=crop'],
			rating: 4.6,
			reviewCount: 15,
			isFavorite: false,
			seller: { name: 'kicks_store', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', rating: 4.7 }
		},
		{
			id: '4',
			title: 'New Balance 550',
			price: 150,
			brand: 'New Balance',
			condition: 'Like New',
			size: '42',
			images: ['https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&h=500&fit=crop'],
			rating: 4.8,
			reviewCount: 31,
			isFavorite: true,
			seller: { name: 'nb_official', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', rating: 4.9 }
		}
	];
	
	// Condition color mapping
	const conditionColors: Record<string, string> = {
		'new_with_tags': 'bg-green-500',
		'new_without_tags': 'bg-emerald-500',
		'like_new': 'bg-blue-500',
		'very_good': 'bg-sky-500',
		'good': 'bg-gray-500',
		'fair': 'bg-orange-500'
	};
	
	const conditionLabels: Record<string, string> = {
		'new_with_tags': 'Ново с етикет',
		'new_without_tags': 'Ново без етикет',
		'like_new': 'Като ново',
		'very_good': 'Много добро',
		'good': 'Добро',
		'fair': 'Задоволително'
	};
	
	// Image navigation
	function nextImage() {
		currentImageIndex = (currentImageIndex + 1) % product.images.length;
	}
	
	function prevImage() {
		currentImageIndex = (currentImageIndex - 1 + product.images.length) % product.images.length;
	}
	
	// Touch handlers for swipe
	function handleTouchStart(e: TouchEvent) {
		touchStartX = e.touches[0].clientX;
	}
	
	function handleTouchEnd(e: TouchEvent) {
		const touchEndX = e.changedTouches[0].clientX;
		const diff = touchStartX - touchEndX;
		
		if (Math.abs(diff) > 50) {
			if (diff > 0) {
				nextImage();
			} else {
				prevImage();
			}
		}
	}
	
	// Actions
	function toggleLike() {
		isLiked = !isLiked;
	}
	
	function shareProduct() {
		if (navigator.share) {
			navigator.share({
				title: product.title,
				text: `Check out ${product.title} on Driplo`,
				url: window.location.href
			});
		} else {
			// Fallback - copy to clipboard
			navigator.clipboard.writeText(window.location.href);
		}
	}
	
	function contactSeller() {
		goto(`/messages/new?seller=${product.seller.id}&product=${product.id}`);
	}
	
	function buyNow() {
		goto(`/checkout?product=${product.id}`);
	}
	
	function viewSellerProfile() {
		goto(`/sellers/${product.seller.id}`);
	}
</script>

<svelte:head>
	<title>{product.title} - {product.price} лв | Driplo.bg</title>
</svelte:head>

<!-- Mobile Layout -->
<div class="md:hidden min-h-screen bg-gray-50 pb-20">
	<!-- Breadcrumbs -->
	<div class="bg-white px-3 py-2 border-b border-gray-100">
		<div class="flex items-center gap-1 text-xs overflow-x-auto" style="scrollbar-width: none; -ms-overflow-style: none;">
			{#each breadcrumbs as crumb, i}
				{#if crumb.href}
					<a href={crumb.href} class="text-gray-500 hover:text-primary whitespace-nowrap">
						{crumb.label}
					</a>
				{:else}
					<span class="text-gray-900 font-medium whitespace-nowrap truncate max-w-[150px]">
						{crumb.label}
					</span>
				{/if}
				{#if i < breadcrumbs.length - 1}
					<ChevronRight class="w-3 h-3 text-gray-400 flex-shrink-0" />
				{/if}
			{/each}
		</div>
	</div>
	<!-- Image Gallery -->
	<div 
		class="relative bg-white"
		ontouchstart={handleTouchStart}
		ontouchend={handleTouchEnd}
	>
		<!-- Main Image -->
		<div class="relative aspect-[4/5] overflow-hidden">
			<button 
				onclick={() => showImageModal = true}
				class="w-full h-full block p-0 border-0"
				aria-label="View full size image"
			>
				<img 
					src={product.images[currentImageIndex]} 
					alt={product.title}
					class="w-full h-full object-cover"
				/>
			</button>
			
			<!-- Image Counter -->
			<div class="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
				{currentImageIndex + 1}/{product.images.length}
			</div>
			
			<!-- Condition Badge -->
			<div class="absolute top-3 left-3">
				<div class={`${conditionColors[product.condition]} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg`}>
					{conditionLabels[product.condition]}
				</div>
			</div>
			
			<!-- Navigation Arrows (Desktop) -->
			<button 
				onclick={prevImage}
				class="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full items-center justify-center shadow-md hover:bg-white"
			>
				<ChevronLeft class="w-5 h-5" />
			</button>
			<button 
				onclick={nextImage}
				class="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full items-center justify-center shadow-md hover:bg-white"
			>
				<ChevronRight class="w-5 h-5" />
			</button>
			
			<!-- Image Dots -->
			<div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
				{#each product.images as _, index}
					<button
						onclick={() => currentImageIndex = index}
						class="w-2 h-2 rounded-full transition-all {
							index === currentImageIndex 
								? 'bg-white w-6' 
								: 'bg-white/60'
						}"
						aria-label="Go to image {index + 1}"
					></button>
				{/each}
			</div>
		</div>
		
		<!-- Thumbnail Strip -->
		<div class="flex gap-1 p-2 overflow-x-auto">
			{#each product.images as image, index}
				<button
					onclick={() => currentImageIndex = index}
					class="relative min-w-16 h-16 rounded-lg overflow-hidden border-2 transition-all {
						index === currentImageIndex 
							? 'border-primary' 
							: 'border-transparent'
					}"
				>
					<img src={image} alt="" class="w-full h-full object-cover" />
				</button>
			{/each}
		</div>
	</div>
	
	<!-- Product Info -->
	<div class="bg-white mt-2 p-4">
		<!-- Title & Price -->
		<div class="mb-3">
			<h1 class="text-xl font-bold text-gray-900 mb-2">{product.title}</h1>
			<div class="flex items-baseline gap-2">
				<span class="text-2xl font-bold text-gray-900">{product.price} лв</span>
				{#if product.originalPrice}
					<span class="text-base text-gray-400 line-through">{product.originalPrice} лв</span>
					<Badge class="bg-red-100 text-red-700">
						-{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
					</Badge>
				{/if}
			</div>
		</div>
		
		<!-- Quick Info Grid -->
		<div class="grid grid-cols-2 gap-3 mb-4 text-sm">
			<div class="flex items-center gap-2">
				<span class="text-gray-500">Марка:</span>
				<span class="font-medium">{product.brand}</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="text-gray-500">Размер:</span>
				<span class="font-medium">{product.size}</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="text-gray-500">Цвят:</span>
				<span class="font-medium">{product.color}</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="text-gray-500">Материал:</span>
				<span class="font-medium">{product.material}</span>
			</div>
		</div>
		
		<!-- Stats -->
		<div class="flex items-center gap-4 text-xs text-gray-500 mb-4">
			<span class="flex items-center gap-1">
				<Clock class="w-3 h-3" />
				{product.timeAgo}
			</span>
			<span class="flex items-center gap-1">
				<MapPin class="w-3 h-3" />
				{product.location}
			</span>
			<span>👁️ {product.viewCount}</span>
			<span>❤️ {product.likeCount}</span>
		</div>
		
		<!-- Authenticity Badge -->
		{#if product.authenticity.verified}
			<div class="flex items-center gap-2 p-3 bg-green-50 rounded-lg mb-4">
				<Shield class="w-5 h-5 text-green-600" />
				<div class="flex-1">
					<p class="text-sm font-medium text-green-900">Проверена автентичност</p>
					<p class="text-xs text-green-700">Включва сертификат</p>
				</div>
				<Check class="w-4 h-4 text-green-600" />
			</div>
		{/if}
		
		<!-- Description -->
		<div class="mb-4">
			<h3 class="font-semibold mb-2">Описание</h3>
			<p class="text-sm text-gray-600 whitespace-pre-line">{product.description}</p>
		</div>
		
		<!-- Tags -->
		<div class="flex flex-wrap gap-2 mb-4">
			{#each product.tags as tag}
				<Badge variant="secondary" class="text-xs">#{tag}</Badge>
			{/each}
		</div>
		
		<!-- Shipping Info -->
		<div class="border-t pt-4 mb-4">
			<h3 class="font-semibold mb-2">Доставка</h3>
			<div class="space-y-2 text-sm">
				<p class="text-gray-600">Доставка: {product.shipping.price} лв</p>
				<div class="flex flex-wrap gap-2">
					{#each product.shipping.methods as method}
						<Badge variant="outline">{method}</Badge>
					{/each}
				</div>
			</div>
		</div>
	</div>
	
	<!-- Seller Info -->
	<div class="bg-white mt-2 p-4">
		<button onclick={viewSellerProfile} class="w-full">
			<div class="flex items-center gap-3">
				<img 
					src={product.seller.avatar} 
					alt={product.seller.name}
					class="w-12 h-12 rounded-full object-cover"
				/>
				<div class="flex-1 text-left">
					<div class="flex items-center gap-2">
						<h3 class="font-semibold">{product.seller.name}</h3>
						{#if product.seller.verified}
							<Badge class="bg-blue-100 text-blue-700 text-xs">Verified</Badge>
						{/if}
					</div>
					<div class="flex items-center gap-3 text-xs text-gray-500">
						<span class="flex items-center gap-1">
							<Star class="w-3 h-3 fill-yellow-400 text-yellow-400" />
							{product.seller.rating} ({product.seller.reviewCount})
						</span>
						<span>{product.seller.soldCount} продадени</span>
					</div>
				</div>
				<ChevronRight class="w-5 h-5 text-gray-400" />
			</div>
		</button>
		
		<div class="mt-3 pt-3 border-t space-y-1 text-xs text-gray-500">
			<p>Член от {product.seller.joinedDate}</p>
			<p>{product.seller.responseTime}</p>
			<p>{product.seller.followers} последователи</p>
		</div>
	</div>
	
	<!-- Related Products -->
	<div class="bg-white mt-2 p-4">
		<h3 class="font-semibold mb-3">Подобни продукти</h3>
		<div class="grid grid-cols-2 gap-3">
			{#each relatedProducts.slice(0, 4) as relatedProduct}
				<ProductCard 
					product={relatedProduct} 
					onclick={() => goto(`/products/${relatedProduct.id}`)}
				/>
			{/each}
		</div>
	</div>
	
	<!-- Fixed Bottom Actions -->
	<div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-30">
		<div class="flex gap-2">
			<button
				onclick={toggleLike}
				class="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-lg"
			>
				<Heart class="w-5 h-5 {isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}" />
			</button>
			<button
				onclick={shareProduct}
				class="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-lg"
			>
				<Share2 class="w-5 h-5 text-gray-600" />
			</button>
			<Button 
				onclick={contactSeller}
				variant="outline" 
				class="flex-1 h-12"
			>
				<MessageCircle class="w-4 h-4 mr-2" />
				Съобщение
			</Button>
			<Button 
				onclick={buyNow}
				class="flex-1 h-12 bg-primary"
			>
				<ShoppingBag class="w-4 h-4 mr-2" />
				Купи сега
			</Button>
		</div>
	</div>
</div>

<!-- Desktop Layout -->
<div class="hidden md:block container mx-auto max-w-7xl px-4 py-8">
	<!-- Breadcrumbs -->
	<div class="mb-6">
		<div class="flex items-center gap-2 text-sm">
			{#each breadcrumbs as crumb, i}
				{#if crumb.href}
					<a href={crumb.href} class="text-gray-500 hover:text-primary transition-colors">
						{crumb.label}
					</a>
				{:else}
					<span class="text-gray-900 font-medium">
						{crumb.label}
					</span>
				{/if}
				{#if i < breadcrumbs.length - 1}
					<ChevronRight class="w-4 h-4 text-gray-400" />
				{/if}
			{/each}
		</div>
	</div>
	<div class="grid grid-cols-12 gap-8">
		<!-- Images Column -->
		<div class="col-span-7">
			<div class="sticky top-24 space-y-4">
				<!-- Main Image -->
				<div class="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
					<button
						onclick={() => showImageModal = true}
						class="w-full h-full block p-0 border-0 cursor-zoom-in"
						aria-label="View full size image"
					>
						<img 
							src={product.images[currentImageIndex]} 
							alt={product.title}
							class="w-full h-full object-cover"
						/>
					</button>
					
					<!-- Navigation -->
					<button 
						onclick={prevImage}
						class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white"
					>
						<ChevronLeft class="w-6 h-6" />
					</button>
					<button 
						onclick={nextImage}
						class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white"
					>
						<ChevronRight class="w-6 h-6" />
					</button>
				</div>
				
				<!-- Thumbnails -->
				<div class="grid grid-cols-6 gap-2">
					{#each product.images as image, index}
						<button
							onclick={() => currentImageIndex = index}
							class="aspect-square rounded-lg overflow-hidden border-2 transition-all {
								index === currentImageIndex 
									? 'border-primary' 
									: 'border-gray-200 hover:border-gray-400'
							}"
						>
							<img src={image} alt="" class="w-full h-full object-cover" />
						</button>
					{/each}
				</div>
			</div>
		</div>
		
		<!-- Info Column -->
		<div class="col-span-5 space-y-6">
			<!-- Title & Price -->
			<div>
				<div class="flex items-start justify-between mb-4">
					<h1 class="text-3xl font-bold text-gray-900">{product.title}</h1>
					<div class="flex gap-2">
						<button
							onclick={toggleLike}
							class="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50"
						>
							<Heart class="w-5 h-5 {isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}" />
						</button>
						<button
							onclick={shareProduct}
							class="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50"
						>
							<Share2 class="w-5 h-5 text-gray-600" />
						</button>
					</div>
				</div>
				
				<div class="flex items-baseline gap-3">
					<span class="text-4xl font-bold text-gray-900">{product.price} лв</span>
					{#if product.originalPrice}
						<span class="text-xl text-gray-400 line-through">{product.originalPrice} лв</span>
						<Badge class="bg-red-100 text-red-700">
							-{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
						</Badge>
					{/if}
				</div>
			</div>
			
			<!-- Condition & Stats -->
			<div class="flex items-center gap-4">
				<div class={`${conditionColors[product.condition]} text-white text-sm font-bold px-4 py-2 rounded-full`}>
					{conditionLabels[product.condition]}
				</div>
				<div class="flex items-center gap-4 text-sm text-gray-500">
					<span>👁️ {product.viewCount}</span>
					<span>❤️ {product.likeCount}</span>
					<span>{product.timeAgo}</span>
				</div>
			</div>
			
			<!-- Details Grid -->
			<div class="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
				<div>
					<p class="text-sm text-gray-500 mb-1">Марка</p>
					<p class="font-semibold">{product.brand}</p>
				</div>
				<div>
					<p class="text-sm text-gray-500 mb-1">Размер</p>
					<p class="font-semibold">{product.size}</p>
				</div>
				<div>
					<p class="text-sm text-gray-500 mb-1">Цвят</p>
					<p class="font-semibold">{product.color}</p>
				</div>
				<div>
					<p class="text-sm text-gray-500 mb-1">Материал</p>
					<p class="font-semibold">{product.material}</p>
				</div>
			</div>
			
			<!-- Authenticity -->
			{#if product.authenticity.verified}
				<div class="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
					<Shield class="w-6 h-6 text-green-600" />
					<div class="flex-1">
						<p class="font-semibold text-green-900">Проверена автентичност</p>
						<p class="text-sm text-green-700">Продуктът включва сертификат за автентичност</p>
					</div>
				</div>
			{/if}
			
			<!-- Action Buttons -->
			<div class="flex gap-3">
				<Button 
					onclick={contactSeller}
					variant="outline" 
					size="lg"
					class="flex-1"
				>
					<MessageCircle class="w-5 h-5 mr-2" />
					Изпрати съобщение
				</Button>
				<Button 
					onclick={buyNow}
					size="lg"
					class="flex-1 bg-primary"
				>
					<ShoppingBag class="w-5 h-5 mr-2" />
					Купи сега
				</Button>
			</div>
			
			<!-- Seller Card -->
			<div class="border border-gray-200 rounded-lg p-4">
				<button onclick={viewSellerProfile} class="w-full">
					<div class="flex items-center gap-4">
						<img 
							src={product.seller.avatar} 
							alt={product.seller.name}
							class="w-16 h-16 rounded-full object-cover"
						/>
						<div class="flex-1 text-left">
							<div class="flex items-center gap-2 mb-1">
								<h3 class="text-lg font-semibold">{product.seller.name}</h3>
								{#if product.seller.verified}
									<Badge class="bg-blue-100 text-blue-700">Verified</Badge>
								{/if}
							</div>
							<div class="flex items-center gap-4 text-sm text-gray-500">
								<span class="flex items-center gap-1">
									<Star class="w-4 h-4 fill-yellow-400 text-yellow-400" />
									{product.seller.rating} ({product.seller.reviewCount} отзива)
								</span>
								<span>{product.seller.soldCount} продадени</span>
							</div>
							<p class="text-sm text-gray-500 mt-1">{product.seller.responseTime}</p>
						</div>
						<ChevronRight class="w-5 h-5 text-gray-400" />
					</div>
				</button>
			</div>
			
			<!-- Shipping & Location -->
			<div class="space-y-4">
				<div>
					<h3 class="font-semibold mb-2">Локация</h3>
					<p class="flex items-center gap-2 text-gray-600">
						<MapPin class="w-4 h-4" />
						{product.location}
					</p>
				</div>
				
				<div>
					<h3 class="font-semibold mb-2">Доставка</h3>
					<p class="text-gray-600 mb-2">Цена на доставка: {product.shipping.price} лв</p>
					<div class="flex flex-wrap gap-2">
						{#each product.shipping.methods as method}
							<Badge variant="outline">{method}</Badge>
						{/each}
					</div>
				</div>
			</div>
			
			<!-- Description -->
			<div>
				<h3 class="font-semibold mb-3">Описание</h3>
				<p class="text-gray-600 whitespace-pre-line">{product.description}</p>
			</div>
			
			<!-- Tags -->
			<div class="flex flex-wrap gap-2">
				{#each product.tags as tag}
					<Badge variant="secondary">#{tag}</Badge>
				{/each}
			</div>
		</div>
	</div>
	
	<!-- Related Products Section -->
	<div class="mt-12 pt-8 border-t">
		<h2 class="text-2xl font-bold mb-6">Подобни продукти</h2>
		<div class="grid grid-cols-4 gap-6">
			{#each relatedProducts as relatedProduct}
				<ProductCard 
					product={relatedProduct} 
					onclick={() => goto(`/products/${relatedProduct.id}`)}
				/>
			{/each}
		</div>
	</div>
</div>

<!-- Full Screen Image Modal -->
{#if showImageModal}
	<div class="fixed inset-0 bg-black z-50 flex items-center justify-center">
		<button
			onclick={() => showImageModal = false}
			class="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30"
		>
			<X class="w-6 h-6" />
		</button>
		
		<img 
			src={product.images[currentImageIndex]} 
			alt={product.title}
			class="max-w-full max-h-full object-contain"
		/>
		
		<button 
			onclick={prevImage}
			class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30"
		>
			<ChevronLeft class="w-6 h-6" />
		</button>
		<button 
			onclick={nextImage}
			class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30"
		>
			<ChevronRight class="w-6 h-6" />
		</button>
		
		<div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
			{#each product.images as _, index}
				<button
					onclick={() => currentImageIndex = index}
					class="w-2 h-2 rounded-full transition-all {
						index === currentImageIndex 
							? 'bg-white w-8' 
							: 'bg-white/60'
					}"
					aria-label="Go to image {index + 1}"
				></button>
			{/each}
		</div>
	</div>
{/if}