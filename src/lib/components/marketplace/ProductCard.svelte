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
	class="group relative bg-white rounded-xl border border-gray-100 cursor-pointer overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300"
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
	
	<!-- Product Info -->
	<div class="p-3 space-y-2">
		<!-- Brand & Title -->
		<div>
			<p class="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-0.5">
				{product.brand}
			</p>
			<h3 class="text-sm font-medium text-gray-900 line-clamp-1 hover:text-primary transition-colors">
				{product.title}
			</h3>
		</div>
		
		<!-- Size & Location -->
		<div class="flex items-center gap-3 text-[11px] text-gray-500">
			<span class="font-medium">Размер {product.size}</span>
			{#if product.location}
				<div class="flex items-center gap-0.5">
					<MapPin class="w-3 h-3" />
					<span>{product.location}</span>
				</div>
			{/if}
		</div>
		
		<!-- Price -->
		<div class="flex items-baseline gap-2">
			<span class="text-lg font-bold text-gray-900">
				{product.price} лв
			</span>
			{#if product.originalPrice}
				<span class="text-xs text-gray-400 line-through">
					{product.originalPrice} лв
				</span>
			{/if}
		</div>
		
		<!-- Seller Info - Clean & Simple -->
		<div class="flex items-center gap-2 pt-2 border-t border-gray-100">
			<LazyAvatar 
				src={product.seller.avatar} 
				username={product.seller.name}
				size="xs"
				eager={false}
			/>
			<div class="flex-1 min-w-0">
				<p class="text-xs font-medium text-gray-700 truncate">
					{product.seller.name}
				</p>
			</div>
			<div class="flex items-center gap-0.5">
				<Star class="w-3 h-3 fill-yellow-400 text-yellow-400" />
				<span class="text-[11px] font-medium text-gray-600">
					{product.seller.rating}
				</span>
			</div>
		</div>
		
		<!-- Stats Row -->
		{#if product.view_count !== undefined || product.like_count !== undefined}
			<div class="flex items-center gap-3 text-[11px] text-gray-400 pt-2">
				{#if product.view_count !== undefined}
					<div class="flex items-center gap-1">
						<Eye class="w-3 h-3" />
						<span>{product.view_count} прегледа</span>
					</div>
				{/if}
				{#if product.like_count !== undefined}
					<div class="flex items-center gap-1">
						<Heart class="w-3 h-3" />
						<span>{product.like_count} харесвания</span>
					</div>
				{/if}
			</div>
		{/if}
		
		{#if product.timeAgo}
			<p class="text-[10px] text-gray-400 text-center">
				{product.timeAgo}
			</p>
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