<script lang="ts">
	import { Search, ShoppingBag, Bell, ChevronDown, Filter, Home, Grid3x3, Plus, Heart, User } from '@lucide/svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button.svelte';
	import { getTopLevelCategories } from '$lib/services/categoryService';
	import { onMount } from 'svelte';
	import type { Database } from '$lib/types/db';
	
	type Category = Database['public']['Tables']['categories']['Row'];
	
	let searchQuery = $state('');
	let showCategorySheet = $state(false);
	let selectedCategory = $state('All');
	let categories = $state<Category[]>([]);
	let isSearchFocused = $state(false);
	
	// Load categories
	onMount(async () => {
		try {
			categories = await getTopLevelCategories();
		} catch (error) {
			console.error('Failed to load categories:', error);
		}
	});
	
	// Handle search
	async function handleSearch() {
		if (searchQuery.trim()) {
			await goto(`/search?q=${encodeURIComponent(searchQuery)}&cat=${selectedCategory}`);
		}
	}
	
	function selectCategory(name: string) {
		selectedCategory = name;
		showCategorySheet = false;
	}
</script>

<!-- Mobile Header - Instagram/TikTok Style -->
<header class="md:hidden sticky top-0 z-50 bg-white">
	<!-- Top Bar with Logo and Actions -->
	<div class="flex items-center justify-between px-4 py-3 border-b">
		<!-- Logo -->
		<a href="/" class="flex items-center">
			<div class="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
				D
			</div>
			<span class="ml-2 font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
				Driplo
			</span>
		</a>
		
		<!-- Action Buttons -->
		<div class="flex items-center gap-2">
			<Button variant="ghost" size="icon" class="relative">
				<Bell class="h-5 w-5" />
				<span class="absolute -top-0.5 -right-0.5 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
			</Button>
			<Button variant="ghost" size="icon" class="relative">
				<ShoppingBag class="h-5 w-5" />
				<span class="absolute -top-0.5 -right-0.5 h-4 w-4 bg-purple-600 rounded-full text-[9px] text-white flex items-center justify-center font-bold">
					2
				</span>
			</Button>
		</div>
	</div>
	
	<!-- Search Bar Section -->
	<div class="px-3 py-2 bg-gray-50/50">
		<div class="flex gap-2">
			<!-- Category Button -->
			<button
				onclick={() => showCategorySheet = true}
				class="flex items-center gap-1 px-3 py-2.5 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
			>
				<span class="text-xs font-semibold text-purple-600">
					{selectedCategory}
				</span>
				<ChevronDown class="h-3 w-3 text-gray-400" />
			</button>
			
			<!-- Search Input -->
			<div class="flex-1 relative">
				<div class="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm focus-within:shadow-md focus-within:border-purple-400 transition-all">
					<Search class="h-4 w-4 text-gray-400 ml-3" />
					<input
						type="text"
						bind:value={searchQuery}
						onkeydown={(e) => e.key === 'Enter' && handleSearch()}
						onfocus={() => isSearchFocused = true}
						onblur={() => setTimeout(() => isSearchFocused = false, 200)}
						placeholder="Search Driplo..."
						class="flex-1 px-2 py-2.5 text-sm focus:outline-none bg-transparent placeholder:text-gray-400"
					/>
					{#if searchQuery}
						<button 
							onclick={() => searchQuery = ''}
							class="pr-3 text-gray-400 hover:text-gray-600"
						>
							×
						</button>
					{/if}
				</div>
			</div>
			
			<!-- Filter Button -->
			<button class="px-3 py-2.5 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
				<Filter class="h-4 w-4 text-gray-600" />
			</button>
		</div>
		
		<!-- Quick Categories - Horizontal Scroll -->
		{#if categories.length > 0}
			<div class="flex gap-2 mt-2 overflow-x-auto scrollbar-hide">
				<button
					onclick={() => selectCategory('All')}
					class="px-3 py-1.5 bg-white rounded-full border text-xs font-medium whitespace-nowrap {selectedCategory === 'All' ? 'border-purple-500 text-purple-600 bg-purple-50' : 'border-gray-200 text-gray-600'}"
				>
					🛍️ All
				</button>
				{#each categories.slice(0, 5) as cat}
					<button
						onclick={() => selectCategory(cat.name)}
						class="px-3 py-1.5 bg-white rounded-full border text-xs font-medium whitespace-nowrap {selectedCategory === cat.name ? 'border-purple-500 text-purple-600 bg-purple-50' : 'border-gray-200 text-gray-600'}"
					>
						{cat.icon || '📦'} {cat.name}
					</button>
				{/each}
			</div>
		{/if}
	</div>
	
	<!-- Category Sheet -->
	{#if showCategorySheet}
		<div 
			class="fixed inset-0 bg-black/50 z-50" 
			onclick={() => showCategorySheet = false}
			role="button"
			tabindex="0"
			onkeydown={(e) => e.key === 'Escape' && (showCategorySheet = false)}
		>
			<div 
				class="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[70vh] overflow-y-auto"
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => { if (e.key === 'Escape') showCategorySheet = false; }}
				role="dialog"
				aria-label="Category selection menu"
				tabindex="-1"
			>
				<div class="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
					<h3 class="font-semibold">Select Category</h3>
					<button onclick={() => showCategorySheet = false} class="text-gray-400">
						×
					</button>
				</div>
				
				<div class="p-4 grid grid-cols-3 gap-3">
					<button
						onclick={() => selectCategory('All')}
						class="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 {selectedCategory === 'All' ? 'bg-purple-50' : ''}"
					>
						<div class="text-2xl">🛍️</div>
						<span class="text-xs font-medium">All</span>
					</button>
					{#each categories as cat}
						<button
							onclick={() => selectCategory(cat.name)}
							class="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 {selectedCategory === cat.name ? 'bg-purple-50' : ''}"
						>
							<div class="text-2xl">{cat.icon || '📦'}</div>
							<span class="text-xs font-medium text-center">{cat.name}</span>
						</button>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</header>

<!-- Bottom Navigation Bar - Instagram Style -->
<nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40">
	<div class="flex items-center justify-around py-2">
		<a href="/" class="flex flex-col items-center gap-1 p-2 {$page.url.pathname === '/' ? 'text-purple-600' : 'text-gray-600'}">
			<Home class="h-5 w-5" />
			<span class="text-[10px] font-medium">Home</span>
		</a>
		<a href="/browse" class="flex flex-col items-center gap-1 p-2 {$page.url.pathname.startsWith('/browse') ? 'text-purple-600' : 'text-gray-600'}">
			<Grid3x3 class="h-5 w-5" />
			<span class="text-[10px] font-medium">Browse</span>
		</a>
		<a href="/sell" class="flex flex-col items-center gap-1 p-2">
			<div class="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-1.5">
				<Plus class="h-4 w-4 text-white" />
			</div>
			<span class="text-[10px] font-medium">Sell</span>
		</a>
		<a href="/favorites" class="flex flex-col items-center gap-1 p-2 {$page.url.pathname.startsWith('/favorites') ? 'text-purple-600' : 'text-gray-600'}">
			<Heart class="h-5 w-5" />
			<span class="text-[10px] font-medium">Favorites</span>
		</a>
		<a href="/profile" class="flex flex-col items-center gap-1 p-2 {$page.url.pathname.startsWith('/profile') ? 'text-purple-600' : 'text-gray-600'}">
			<User class="h-5 w-5" />
			<span class="text-[10px] font-medium">Profile</span>
		</a>
	</div>
</nav>

<style>
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
</style>