<script lang="ts">
	import { Home, Search, Heart, ShoppingBag, Plus } from '@lucide/svelte';
	import { page } from '$app/stores';
	import Badge from '$lib/components/ui/badge.svelte';
	
	// Mock data for cart and favorites count
	let cartCount = $state(2);
	let favoritesCount = $state(5);
	
	// Use derived to make nav items reactive to state changes
	let navItems = $derived([
		{ icon: Home, label: 'Home', href: '/', count: null },
		{ icon: Search, label: 'Browse', href: '/browse', count: null },
		{ icon: Heart, label: 'Favorites', href: '/favorites', count: () => favoritesCount },
		{ icon: ShoppingBag, label: 'Cart', href: '/cart', count: () => cartCount },
		{ icon: Plus, label: 'Sell', href: '/sell', count: null, isSpecial: true }
	]);
	
	function isActiveRoute(href: string): boolean {
		if (href === '/') {
			return $page.url.pathname === '/';
		}
		return $page.url.pathname.startsWith(href);
	}
</script>

<!-- Mobile Bottom Navigation - Only visible on mobile screens -->
<nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden">
	<div class="flex justify-around items-center h-16 px-2">
		{#each navItems as item}
			{@const IconComponent = item.icon}
			{@const countValue = typeof item.count === 'function' ? item.count() : item.count}
			<a 
				href={item.href}
				class="flex flex-col items-center justify-center flex-1 py-2 px-1 relative group transition-colors duration-200 {
					isActiveRoute(item.href) 
						? 'text-brand' 
						: 'text-gray-500'
				}"
			>
				<div class="relative">
					{#if item.isSpecial}
						<!-- Special Sell Button with Circle Background -->
						<div class="w-8 h-8 bg-brand rounded-full flex items-center justify-center mb-1 transition-colors">
							<IconComponent 
								class="w-4 h-4 text-white"
							/>
						</div>
					{:else}
						<!-- Regular Icon -->
						<IconComponent 
							class="w-5 h-5 mb-1 {isActiveRoute(item.href) ? 'text-brand' : 'text-gray-500'}"
						/>
					{/if}
					
					<!-- Count Badge -->
					{#if countValue && countValue > 0}
						<div class="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-brand text-white text-xs rounded-full flex items-center justify-center font-medium">
							{countValue > 99 ? '99+' : countValue}
						</div>
					{/if}
				</div>
				
				<span class="text-xs font-medium {
					isActiveRoute(item.href) 
						? 'text-brand' 
						: 'text-gray-500 group-hover:text-brand'
				}">
					{item.label}
				</span>
				
				<!-- Active Indicator -->
				{#if isActiveRoute(item.href)}
					<div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-brand rounded-b"></div>
				{/if}
			</a>
		{/each}
	</div>
	
	<!-- Safe area for devices with home indicator -->
	<div class="h-safe-bottom bg-white"></div>
</nav>

<!-- Spacer to prevent content from being hidden behind the nav -->
<div class="h-16 md:hidden"></div>

<style>
	/* Add safe area support for devices with home indicator */
	.h-safe-bottom {
		height: env(safe-area-inset-bottom);
	}
	
	/* Ensure the navigation stays above other fixed elements */
	nav {
		z-index: 40;
	}
</style>