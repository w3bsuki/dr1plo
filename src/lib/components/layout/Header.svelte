<script lang="ts">
	import { Search, ShoppingBag, User, Menu, Heart, ChevronDown, Bell } from '@lucide/svelte';
	import Button from '$lib/components/ui/button.svelte';
	import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '$lib/components/ui/dropdown-menu';
	import { getTopLevelCategories } from '$lib/services/categoryService';
	import { onMount } from 'svelte';
	import type { Database } from '$lib/types/db';
	
	type Category = Database['public']['Tables']['categories']['Row'];
	
	let searchQuery = $state('');
	let showMobileMenu = $state(false);
	let showCategoriesDropdown = $state(false);
	let selectedCategory = $state('All Categories');
	let categories = $state<Category[]>([]);
	let isLoadingCategories = $state(false);
	
	// Load categories from Supabase on mount
	onMount(async () => {
		isLoadingCategories = true;
		try {
			categories = await getTopLevelCategories();
		} catch (error) {
			console.error('Failed to load categories:', error);
		} finally {
			isLoadingCategories = false;
		}
	});
	
	// Create dropdown options including "All Categories"
	let categoryOptions = $derived([
		'All Categories',
		...categories.map(cat => cat.name)
	]);
	
	function selectCategory(category: string) {
		selectedCategory = category;
		showCategoriesDropdown = false;
	}
	
	// Close dropdown when clicking outside
	$effect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (showCategoriesDropdown) {
				const target = event.target as Element;
				if (!target.closest('[data-dropdown]')) {
					showCategoriesDropdown = false;
				}
			}
		}
		
		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	});
</script>

<header class="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
	<div class="container flex h-20 items-center px-4 mx-auto max-w-7xl">
		<!-- Logo -->
		<div class="flex items-center mr-8">
			<a href="/" class="flex items-center space-x-2">
				<div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white font-bold text-lg shadow-lg">
					D
				</div>
				<span class="hidden font-bold text-2xl text-gray-900 sm:inline-block">Driplo</span>
			</a>
		</div>
		
		<!-- Main Search Section -->
		<div class="hidden md:flex flex-1 max-w-2xl">
			<div class="flex w-full rounded-full border border-gray-300 bg-white shadow-sm overflow-hidden">
				<!-- Category Dropdown -->
				<div class="relative" data-dropdown>
					<button
						onclick={() => showCategoriesDropdown = !showCategoriesDropdown}
						class="flex items-center px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 border-r border-gray-300 hover:bg-gray-100 transition-colors"
					>
						<span class="truncate max-w-32">{selectedCategory}</span>
						<ChevronDown class="ml-2 h-4 w-4" />
					</button>
					
					{#if showCategoriesDropdown}
						<div class="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
							{#if isLoadingCategories}
								<div class="px-4 py-3 text-sm text-gray-500 text-center">
									Loading categories...
								</div>
							{:else}
								{#each categoryOptions as category}
									<button
										onclick={() => selectCategory(category)}
										class="block w-full px-4 py-3 text-left text-sm hover:bg-purple-50 transition-colors {selectedCategory === category ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-700'}"
									>
										{category}
									</button>
								{/each}
							{/if}
						</div>
					{/if}
				</div>
				
				<!-- Search Input -->
				<div class="relative flex-1">
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search for items, brands and more..."
						class="w-full px-4 py-3 text-sm focus:outline-none"
					/>
				</div>
				
				<!-- Search Button -->
				<button class="px-6 py-3 bg-purple-600 text-white hover:bg-purple-700 transition-colors">
					<Search class="h-5 w-5" />
				</button>
			</div>
		</div>
		
		<!-- Desktop Navigation -->
		<nav class="hidden lg:flex items-center space-x-8 ml-8">
			<a href="/browse" class="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
				Browse
			</a>
			<a href="/sell" class="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
				Sell
			</a>
			<a href="/about" class="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
				About
			</a>
		</nav>
		
		<!-- Desktop Actions -->
		<div class="hidden md:flex items-center space-x-3 ml-8">
			<Button variant="ghost" size="icon" class="relative">
				<Bell class="h-5 w-5" />
				<span class="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
			</Button>
			<Button variant="ghost" size="icon" class="relative">
				<Heart class="h-5 w-5" />
			</Button>
			<Button variant="ghost" size="icon" class="relative">
				<ShoppingBag class="h-5 w-5" />
				<span class="absolute -top-1 -right-1 h-5 w-5 bg-purple-600 rounded-full text-xs text-white flex items-center justify-center">2</span>
			</Button>
			<div class="w-px h-8 bg-gray-300 mx-2"></div>
			<Button variant="ghost" size="icon">
				<User class="h-5 w-5" />
			</Button>
			<Button class="bg-purple-600 hover:bg-purple-700 text-white">
				Sign In
			</Button>
		</div>
		
		<!-- Mobile Actions -->
		<div class="flex md:hidden items-center ml-auto space-x-2">
			<Button variant="ghost" size="icon" class="relative">
				<Bell class="h-5 w-5" />
				<span class="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
			</Button>
			<Button variant="ghost" size="icon" class="relative">
				<ShoppingBag class="h-5 w-5" />
				<span class="absolute -top-1 -right-1 h-4 w-4 bg-purple-600 rounded-full text-[10px] text-white flex items-center justify-center">2</span>
			</Button>
		</div>
	</div>
	
	<!-- Mobile Search Bar - Clean and Modern -->
	<div class="md:hidden bg-gradient-to-b from-gray-50 to-white px-3 py-2">
		<div class="flex items-center bg-white rounded-xl shadow-sm border border-gray-200 relative">
			<!-- All/Category Button -->
			<button
				onclick={() => showCategoriesDropdown = !showCategoriesDropdown}
				class="flex items-center gap-1 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-l-xl transition-colors"
				data-dropdown
			>
				<span class="text-purple-600 font-semibold">
					{selectedCategory === 'All Categories' ? 'All' : selectedCategory.slice(0, 8)}
				</span>
				<ChevronDown class={`h-3.5 w-3.5 text-gray-400 transition-transform ${showCategoriesDropdown ? 'rotate-180' : ''}`} />
			</button>
			
			<!-- Divider -->
			<div class="w-px h-6 bg-gray-200"></div>
				
			
			<!-- Search Input with Icon -->
			<div class="flex-1 flex items-center px-3">
				<Search class="h-4 w-4 text-gray-400 mr-2" />
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search for anything..."
					class="w-full py-2.5 text-sm focus:outline-none bg-transparent placeholder:text-gray-400"
				/>
			</div>
			
			<!-- Search Button -->
			<button class="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-r-xl hover:opacity-90 transition-opacity">
				<Search class="h-4 w-4" />
			</button>
		</div>
		
		<!-- Dropdown for Categories -->
		{#if showCategoriesDropdown}
			<div class="absolute left-3 right-3 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
				{#if isLoadingCategories}
					<div class="px-4 py-3 text-sm text-gray-500 text-center">
						Loading categories...
					</div>
				{:else}
					<div class="py-1">
						{#each categoryOptions as category}
							<button
								onclick={() => selectCategory(category)}
								class="block w-full px-4 py-2.5 text-left text-sm hover:bg-purple-50 transition-colors {selectedCategory === category ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-gray-700'}"
							>
								{category === 'All Categories' ? '🛍️ All Categories' : `📦 ${category}`}
							</button>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>
	
	<!-- Mobile Menu -->
	{#if showMobileMenu}
		<div class="md:hidden border-t bg-white shadow-lg">
			<nav class="px-4 py-3 space-y-1">
				<a href="/browse" class="flex items-center px-3 py-3 text-sm font-medium hover:bg-purple-50 rounded-lg transition-colors">
					Browse
				</a>
				<a href="/sell" class="flex items-center px-3 py-3 text-sm font-medium hover:bg-purple-50 rounded-lg transition-colors">
					Sell
				</a>
				<a href="/notifications" class="flex items-center px-3 py-3 text-sm font-medium hover:bg-purple-50 rounded-lg transition-colors relative">
					<Bell class="h-4 w-4 mr-3" />
					Notifications
					<span class="ml-auto h-2 w-2 bg-red-500 rounded-full"></span>
				</a>
				<a href="/profile" class="flex items-center px-3 py-3 text-sm font-medium hover:bg-purple-50 rounded-lg transition-colors">
					<User class="h-4 w-4 mr-3" />
					Profile
				</a>
				<hr class="my-3 border-gray-200" />
				<a href="/login" class="flex items-center px-3 py-3 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
					Sign In
				</a>
				<a href="/register" class="flex items-center px-3 py-3 text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 rounded-lg transition-colors">
					Sign Up
				</a>
			</nav>
		</div>
	{/if}
</header>