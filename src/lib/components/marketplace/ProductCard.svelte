<script lang="ts">
	import { Heart, Star, Eye, ShoppingBag, MapPin } from '@lucide/svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	import LazyAvatar from '$lib/components/ui/avatar/LazyAvatar.svelte';
	
	interface Product {
		id: string;
		title: string;
		price: number;
		originalPrice?: number;
		brand: string;
		condition: string;
		size: string;
		images: string[];
		isFavorite: boolean;
		location?: string;
		timeAgo?: string;
		view_count?: number;
		like_count?: number;
		seller: {
			name: string;
			avatar?: string;
			rating: number;
			verified?: boolean;
		};
	}
	
	let { product, onclick }: { product: Product; onclick?: () => void } = $props();
	let isLiked = $state(product.isFavorite);
	let currentImageIndex = $state(0);
	let isHovered = $state(false);
	
	function toggleLike(e: Event) {
		e.stopPropagation();
		isLiked = !isLiked;
	}
	
	function handleQuickView(e: Event) {
		e.stopPropagation();
		console.log('Quick view:', product.id);
	}
	
	const discountPercent = product.originalPrice 
		? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
		: 0;
	
	// Condition translations
	const conditionMap = {
		'new_with_tags': { label: 'Ново с етикет', color: 'bg-green-500' },
		'new_without_tags': { label: 'Ново', color: 'bg-emerald-500' },
		'very_good': { label: 'Много добро', color: 'bg-blue-500' },
		'good': { label: 'Добро', color: 'bg-sky-500' },
		'fair': { label: 'Задоволително', color: 'bg-gray-500' }
	};
	
	const conditionInfo = conditionMap[product.condition as keyof typeof conditionMap] || conditionMap.good;
</script>

<div 
	class="group relative bg-white rounded-lg cursor-pointer overflow-hidden hover:shadow-md transition-all duration-200"
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
	<!-- Image Container -->
	<div class="relative aspect-[3/4] overflow-hidden bg-gray-50">
		<!-- Main Image -->
		<img 
			src={product.images[currentImageIndex]} 
			alt={product.title}
			class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
			loading="lazy"
		/>
		
		<!-- Condition Badge - Top Left -->
		<div class="absolute top-3 left-3">
			<div class={`${conditionInfo.color} text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg`}>
				{conditionInfo.label}
			</div>
		</div>
		
		<!-- Discount Badge - Below Condition -->
		{#if discountPercent > 0}
			<div class="absolute top-10 left-3">
				<div class="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg">
					-{discountPercent}%
				</div>
			</div>
		{/if}
		
		<!-- Like Button - Top Right -->
		<button
			onclick={toggleLike}
			class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all shadow-sm"
			aria-label="Добави в любими"
		>
			<Heart class="w-4 h-4 {isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}" />
		</button>
		
		<!-- Quick View on Hover -->
		{#if isHovered}
			<button
				onclick={handleQuickView}
				class="absolute top-12 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all shadow-sm animate-in fade-in duration-200"
				aria-label="Бърз преглед"
			>
				<Eye class="w-4 h-4 text-gray-600" />
			</button>
		{/if}
		
		<!-- Image Dots -->
		{#if product.images.length > 1}
			<div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
				{#each product.images.slice(0, 5) as _, index}
					<button
						onclick={(e) => { 
							e.stopPropagation(); 
							currentImageIndex = index;
						}}
						class="w-1.5 h-1.5 rounded-full transition-all {index === currentImageIndex ? 'bg-white w-3' : 'bg-white/60'}"
						aria-label="Снимка {index + 1}"
					></button>
				{/each}
			</div>
		{/if}
	</div>
	
	<!-- Product Info - Compact like Vinted -->
	<div class="p-2 space-y-1">
		<!-- Price -->
		<div class="flex items-baseline gap-1.5">
			<span class="text-sm font-bold text-gray-900">
				{product.price} лв
			</span>
			{#if product.originalPrice}
				<span class="text-[10px] text-gray-400 line-through">
					{product.originalPrice} лв
				</span>
			{/if}
		</div>
		
		<!-- Size -->
		<p class="text-[10px] text-gray-500">
			Размер {product.size}
		</p>
		
		<!-- Brand -->
		<p class="text-[10px] text-gray-600 font-medium">
			{product.brand}
		</p>
		
		<!-- Stats Row (optional) -->
		{#if product.view_count !== undefined || product.like_count !== undefined}
			<div class="flex items-center gap-2 text-[9px] text-gray-400">
				{#if product.view_count !== undefined}
					<div class="flex items-center gap-0.5">
						<Eye class="w-2.5 h-2.5" />
						<span>{product.view_count}</span>
					</div>
				{/if}
				{#if product.like_count !== undefined}
					<div class="flex items-center gap-0.5">
						<Heart class="w-2.5 h-2.5" />
						<span>{product.like_count}</span>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	.animate-in {
		animation: fade-in 0.2s ease-out;
	}
</style>