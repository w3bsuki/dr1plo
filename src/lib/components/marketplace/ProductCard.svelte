<script lang="ts">
	import { Heart, Star, Eye, ShoppingBag, Shield } from '@lucide/svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	
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
		location?: string;
		timeAgo?: string;
		seller: {
			name: string;
			avatar: string;
			rating: number;
			verified?: boolean;
			responseTime?: string;
			isOnline?: boolean;
		};
	}
	
	let { product, onclick }: { product: Product; onclick?: () => void } = $props();
	let isLiked = $state(product.isFavorite);
	let currentImageIndex = $state(0);
	let isHovered = $state(false);
	let imageLoaded = $state(false);
	
	function toggleLike(e: Event) {
		e.stopPropagation();
		isLiked = !isLiked;
	}
	
	function handleQuickView(e: Event) {
		e.stopPropagation();
		// Quick view logic here
		console.log('Quick view:', product.id);
	}
	
	function handleAddToCart(e: Event) {
		e.stopPropagation();
		// Add to cart logic here
		console.log('Add to cart:', product.id);
	}
	
	const discountPercent = product.originalPrice 
		? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
		: 0;
</script>

<div 
	class="group relative bg-white rounded-lg border border-gray-200 cursor-pointer overflow-hidden w-full contain-layout"
	onclick={onclick}
	role="button"
	tabindex="0"
	onmouseenter={() => isHovered = true}
	onmouseleave={() => isHovered = false}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onclick?.();
		}
	}}
>
	<!-- Image Container with 3D Effect -->
	<div class="relative aspect-[4/3] overflow-hidden bg-gray-50">
		<!-- Skeleton loader -->
		{#if !imageLoaded}
			<div class="absolute inset-0 skeleton-card"></div>
		{/if}
		
		<!-- Main Image -->
		<img 
			src={product.images[currentImageIndex]} 
			alt={product.title}
			class="w-full h-full object-cover"
			onload={() => imageLoaded = true}
		/>
		
		<!-- Gradient Overlay -->
		<div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
		
		<!-- Image Navigation -->
		{#if product.images.length > 1 && isHovered}
			<div class="absolute inset-x-0 bottom-4 flex justify-center gap-1.5 animate-slideUp">
				{#each product.images as img, index}
					<button
						onclick={(e) => { 
							e.stopPropagation(); 
							currentImageIndex = index;
						}}
						class="group/dot relative"
						aria-label="View image {index + 1}"
					>
						<div class="w-8 h-8 rounded-lg overflow-hidden border-2 {index === currentImageIndex ? 'border-white shadow-lg' : 'border-white/50'} transition-all hover:scale-110">
							<img src={img} alt="" class="w-full h-full object-cover" />
						</div>
					</button>
				{/each}
			</div>
		{/if}
		
		<!-- Premium Badges -->
		<div class="absolute top-3 left-3 flex flex-col gap-2">
			{#if product.isNew}
				<Badge class="bg-green-500 text-white text-xs px-2 py-1">
					NEW
				</Badge>
			{/if}
			{#if discountPercent > 0}
				<Badge class="bg-red-500 text-white text-xs px-2 py-1">
					-{discountPercent}%
				</Badge>
			{/if}
		</div>
		
		<!-- Action Buttons -->
		<div class="absolute top-3 right-3 flex flex-col gap-2">
			<!-- Like Button -->
			<button
				onclick={toggleLike}
				class="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors shadow-md"
				aria-label="Add to favorites"
			>
				<Heart class="w-4 h-4 {isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700'}" />
			</button>
			
			<!-- Quick View Button (appears on hover) -->
			{#if isHovered}
				<button
					onclick={handleQuickView}
					class="w-10 h-10 rounded-full glass backdrop-blur-md bg-white/90 hover:bg-white flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110 animate-slideLeft"
					aria-label="Quick view"
				>
					<Eye class="w-5 h-5 text-gray-700" />
				</button>
			{/if}
		</div>
		
		<!-- Desktop Hover Actions Bar -->
		<div class="hidden md:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center">
			<Button onclick={handleQuickView} class="bg-white text-black hover:bg-gray-100">
				Quick View
			</Button>
		</div>
	</div>
	
	<!-- Product Info with Enhanced Typography -->
	<div class="p-3 space-y-2">
		<!-- Brand & Title -->
		<div>
			<p class="text-xs font-medium uppercase tracking-wide text-gray-500">{product.brand}</p>
			<h3 class="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
				{product.title}
			</h3>
		</div>
		
		<!-- Tags with Glass Effect -->
		<div class="flex flex-wrap gap-2">
			<Badge variant="outline" class="text-xs px-2 py-1 bg-gray-50 border-gray-200">
				Size {product.size}
			</Badge>
			<Badge variant="outline" class="text-xs px-2 py-1 bg-gray-50 border-gray-200">
				{product.condition}
			</Badge>
		</div>
		
		<!-- Price -->
		<div class="flex items-center gap-2">
			<span class="text-lg font-bold text-gray-900">
				€{product.price}
			</span>
			{#if product.originalPrice}
				<span class="text-sm text-gray-500 line-through">
					€{product.originalPrice}
				</span>
			{/if}
		</div>
		
		<!-- Seller Info with Premium Badge -->
		<div class="flex items-center justify-between pt-3 border-t border-gray-100">
			<div class="flex items-center gap-2 group/seller">
				<div class="relative">
					<img 
						src={product.seller.avatar} 
						alt={product.seller.name}
						class="w-7 h-7 rounded-full object-cover border-2 border-white shadow-md group-hover/seller:scale-110 transition-transform"
					/>
					{#if product.seller.rating >= 4.8}
						<div class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
					{/if}
				</div>
				<span class="text-xs font-medium text-gray-700 group-hover/seller:text-primary transition-colors">
					{product.seller.name}
				</span>
			</div>
			
			<!-- Rating with Stars -->
			<div class="flex items-center gap-1.5">
				<div class="flex gap-0.5">
					{#each Array(5) as _, i}
						<Star class="w-3 h-3 {i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}" />
					{/each}
				</div>
				<span class="text-xs font-medium text-gray-600">
					{product.rating}
				</span>
				<span class="text-xs text-gray-400">
					({product.reviewCount})
				</span>
			</div>
		</div>
	</div>
</div>

<style>
	.line-clamp-1 {
		display: -webkit-box;
		-webkit-line-clamp: 1;
		line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	
</style>