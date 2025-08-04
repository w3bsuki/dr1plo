<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	// Check which pages should have special header treatment
	let isWomenOrMenPage = $derived($page.url.pathname === '/women' || $page.url.pathname === '/men');
	let isSpecialPage = $derived(
		isWomenOrMenPage ||
		$page.url.pathname === '/sell' ||
		$page.url.pathname.startsWith('/auth/') ||
		$page.url.pathname.startsWith('/products/')
	);
	let shouldHideBottomNav = $derived(
		$page.url.pathname === '/sell' ||
		$page.url.pathname.startsWith('/auth/') ||
		$page.url.pathname.startsWith('/products/')
	);
	import { Search, ShoppingBag, User, Heart, ChevronDown, MessageCircle, Home, Grid3x3, Plus, Bell } from '@lucide/svelte';
	
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Select from '$lib/components/ui/select/select.svelte';
	import SelectTrigger from '$lib/components/ui/select/SelectTrigger.svelte';
	import SelectContent from '$lib/components/ui/select/SelectContent.svelte';
	import SelectItem from '$lib/components/ui/select/SelectItem.svelte';
	import LazyAvatar from '$lib/components/ui/avatar/LazyAvatar.svelte';

	import { getTopLevelCategories } from '$lib/services/categoryService';
	import type { Database } from '$lib/types/db';

	type Category = Database['public']['Tables']['categories']['Row'];

	let searchQuery = $state('');
	let showMobileMenu = $state(false);
	let showCategoriesDropdown = $state(false);
	let selectedCategory = $state('All Categories');
	let categories = $state<Category[]>([]);
	let isLoadingCategories = $state(false);
	let isScrolled = $state(false);

	// Mock user data
	let user = $state({
		isLoggedIn: true,
		username: 'John Doe',
		avatar: null
	});

	// Load categories and handle scroll
	onMount(() => {
		async function loadCategories() {
			isLoadingCategories = true;
			try {
				categories = await getTopLevelCategories();
			} catch (error) {
				console.error('Failed to load categories:', error);
			} finally {
				isLoadingCategories = false;
			}
		}
		
		loadCategories();
		
		// Simple scroll handler
		function handleScroll() {
			isScrolled = window.scrollY > 20;
		}
		
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});

	// Create dropdown options
	let categoryOptions = $derived([
		'All Categories',
		...categories.map(cat => cat.name)
	]);

	function selectCategory(category: string) {
		selectedCategory = category;
		showCategoriesDropdown = false;
	}

	// Handle search
	async function handleSearch() {
		if (searchQuery.trim()) {
			await goto(`/search?q=${encodeURIComponent(searchQuery)}&cat=${selectedCategory}`);
		}
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

<!-- Mobile Header -->
<div class="md:hidden">
	<!-- Fixed header -->
	<div class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
		<!-- Top bar -->
		<div class="flex items-center justify-between h-11 px-3 bg-gradient-to-r from-primary to-primary/90">
			<!-- Logo -->
			<a href="/" class="flex items-center gap-1.5">
				<div class="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
					<span class="text-primary font-bold text-sm">D</span>
				</div>
				<span class="font-bold text-white text-lg">Driplo</span>
			</a>
			
			<!-- Actions -->
			<div class="flex items-center gap-2">
				<button onclick={() => goto('/messages')} class="p-1.5 text-white/90 hover:text-white">
					<MessageCircle class="h-5 w-5" />
				</button>
				{#if user.isLoggedIn}
					<button onclick={() => goto('/profile')} class="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/20 rounded-full">
						<User class="h-4 w-4 text-white" />
						<span class="text-xs font-medium text-white">Профил</span>
					</button>
				{:else}
					<button onclick={() => goto('/auth/login')} class="flex items-center gap-1.5 px-2.5 py-1.5 bg-white rounded-full">
						<User class="h-4 w-4 text-primary" />
						<span class="text-xs font-medium text-primary">Вход</span>
					</button>
				{/if}
			</div>
		</div>
		
		<!-- Search bar - Hide on special pages -->
		{#if !isSpecialPage}
			<div class="px-3 py-2 bg-gray-50">
				<div class="flex h-10 bg-white rounded-lg border-2 border-primary/20 overflow-hidden">
					<!-- Category dropdown -->
					<button
						onclick={() => showCategoriesDropdown = !showCategoriesDropdown}
						data-dropdown
						class="flex items-center gap-0.5 px-3 border-r border-gray-200"
					>
						<span class="text-sm">🛍️</span>
						<ChevronDown class="h-3 w-3 text-gray-500" />
					</button>
					
					<!-- Search input -->
					<div class="flex-1 relative flex items-center">
						<Search class="absolute left-3 h-4 w-4 text-gray-400" />
						<input
							type="text"
							bind:value={searchQuery}
							onkeydown={(e) => e.key === 'Enter' && handleSearch()}
							placeholder="Търси продукти..."
							class="w-full h-full pl-9 pr-8 text-sm bg-white focus:outline-none"
						/>
						{#if searchQuery}
							<button onclick={() => searchQuery = ''} class="absolute right-2 text-gray-400">
								✕
							</button>
						{/if}
					</div>
				</div>
				
				<!-- Enhanced Category dropdown with 2-column grid -->
				{#if showCategoriesDropdown}
					<div class="absolute left-3 right-3 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
						<div class="grid grid-cols-2 divide-x divide-gray-100">
							<!-- Left Column: Categories -->
							<div class="p-3">
								<h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">Категории</h3>
								<div class="space-y-1">
									<button onclick={() => { selectCategory('All Categories'); goto('/browse'); }} class="w-full flex items-center gap-2 px-2 py-2 text-sm hover:bg-gray-50 rounded-lg transition-colors">
										<span class="text-base">🛍️</span>
										<span>Всички</span>
									</button>
									<button onclick={() => goto('/women')} class="w-full flex items-center gap-2 px-2 py-2 text-sm hover:bg-pink-50 rounded-lg transition-colors">
										<span class="text-base">👗</span>
										<span>Дамски</span>
									</button>
									<button onclick={() => goto('/men')} class="w-full flex items-center gap-2 px-2 py-2 text-sm hover:bg-blue-50 rounded-lg transition-colors">
										<span class="text-base">👔</span>
										<span>Мъжки</span>
									</button>
									<button onclick={() => goto('/kids')} class="w-full flex items-center gap-2 px-2 py-2 text-sm hover:bg-yellow-50 rounded-lg transition-colors">
										<span class="text-base">🧸</span>
										<span>Детски</span>
									</button>
									<button onclick={() => goto('/browse?category=shoes')} class="w-full flex items-center gap-2 px-2 py-2 text-sm hover:bg-gray-50 rounded-lg transition-colors">
										<span class="text-base">👟</span>
										<span>Обувки</span>
									</button>
									<button onclick={() => goto('/browse?category=bags')} class="w-full flex items-center gap-2 px-2 py-2 text-sm hover:bg-gray-50 rounded-lg transition-colors">
										<span class="text-base">👜</span>
										<span>Чанти</span>
									</button>
									<button onclick={() => goto('/browse?category=jackets')} class="w-full flex items-center gap-2 px-2 py-2 text-sm hover:bg-gray-50 rounded-lg transition-colors">
										<span class="text-base">🧥</span>
										<span>Якета</span>
									</button>
									<button onclick={() => goto('/browse?category=accessories')} class="w-full flex items-center gap-2 px-2 py-2 text-sm hover:bg-gray-50 rounded-lg transition-colors">
										<span class="text-base">💍</span>
										<span>Аксесоари</span>
									</button>
								</div>
							</div>
							
							<!-- Right Column: Filters & Special -->
							<div class="p-3">
								<h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">Филтри</h3>
								<div class="space-y-1">
									<button onclick={() => goto('/browse?condition=new_with_tags')} class="w-full flex items-center gap-2 px-2 py-2 text-sm hover:bg-green-50 rounded-lg transition-colors">
										<span class="text-base">🏷️</span>
										<span>Ново с етикет</span>
									</button>
									<button onclick={() => goto('/browse?condition=like_new')} class="w-full flex items-center gap-2 px-2 py-2 text-sm hover:bg-green-50 rounded-lg transition-colors">
										<span class="text-base">✨</span>
										<span>Като ново</span>
									</button>
									<button onclick={() => goto('/browse?sort=newest')} class="w-full flex items-center gap-2 px-2 py-2 text-sm hover:bg-blue-50 rounded-lg transition-colors">
										<span class="text-base">🆕</span>
										<span>Най-нови</span>
									</button>
									<button onclick={() => goto('/browse?sale=true')} class="w-full flex items-center gap-2 px-2 py-2 text-sm hover:bg-red-50 rounded-lg transition-colors text-red-700">
										<span class="text-base">🔥</span>
										<span>Намаления</span>
									</button>
									<button onclick={() => goto('/browse?featured=true')} class="w-full flex items-center gap-2 px-2 py-2 text-sm hover:bg-purple-50 rounded-lg transition-colors">
										<span class="text-base">⭐</span>
										<span>Препоръчани</span>
									</button>
									<button onclick={() => goto('/browse?premium=true')} class="w-full flex items-center gap-2 px-2 py-2 text-sm hover:bg-yellow-50 rounded-lg transition-colors">
										<span class="text-base">💎</span>
										<span>Премиум</span>
									</button>
									<button onclick={() => goto('/browse?category=vintage')} class="w-full flex items-center gap-2 px-2 py-2 text-sm hover:bg-amber-50 rounded-lg transition-colors">
										<span class="text-base">🕰️</span>
										<span>Винтидж</span>
									</button>
									<button onclick={() => goto('/browse?price=under_50')} class="w-full flex items-center gap-2 px-2 py-2 text-sm hover:bg-gray-50 rounded-lg transition-colors">
										<span class="text-base">💰</span>
										<span>До 50лв</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>
		{/if}
		
		<!-- Emoji Categories - hide when scrolled or on special pages -->
		{#if !isScrolled && !isSpecialPage}
			<div class="px-3 pt-1 pb-2 bg-white border-b border-gray-100">
				<div class="flex gap-2 overflow-x-auto pb-1" style="scrollbar-width: none; -ms-overflow-style: none;">
					<button onclick={() => goto('/women')} class="flex flex-col items-center min-w-12 py-1.5 px-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-50">
						<span class="text-lg mb-0.5">👗</span>
						<span class="text-[9px] font-medium whitespace-nowrap">Жени</span>
					</button>
					<button onclick={() => goto('/men')} class="flex flex-col items-center min-w-12 py-1.5 px-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-50">
						<span class="text-lg mb-0.5">👔</span>
						<span class="text-[9px] font-medium whitespace-nowrap">Мъже</span>
					</button>
					<button onclick={() => goto('/kids')} class="flex flex-col items-center min-w-12 py-1.5 px-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-50">
						<span class="text-lg mb-0.5">🧸</span>
						<span class="text-[9px] font-medium whitespace-nowrap">Деца</span>
					</button>
					<button onclick={() => goto('/browse?category=shoes')} class="flex flex-col items-center min-w-12 py-1.5 px-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-50">
						<span class="text-lg mb-0.5">👟</span>
						<span class="text-[9px] font-medium whitespace-nowrap">Обувки</span>
					</button>
					<button onclick={() => goto('/browse?category=bags')} class="flex flex-col items-center min-w-12 py-1.5 px-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-50">
						<span class="text-lg mb-0.5">👜</span>
						<span class="text-[9px] font-medium whitespace-nowrap">Чанти</span>
					</button>
					<button onclick={() => goto('/browse?category=jackets')} class="flex flex-col items-center min-w-12 py-1.5 px-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-50">
						<span class="text-lg mb-0.5">🧥</span>
						<span class="text-[9px] font-medium whitespace-nowrap">Якета</span>
					</button>
					<button onclick={() => goto('/browse?category=vintage')} class="flex flex-col items-center min-w-12 py-1.5 px-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-50">
						<span class="text-lg mb-0.5">⭐</span>
						<span class="text-[9px] font-medium whitespace-nowrap">Винтидж</span>
					</button>
					<button onclick={() => goto('/browse?brand=luxury')} class="flex flex-col items-center min-w-12 py-1.5 px-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-50">
						<span class="text-lg mb-0.5">💎</span>
						<span class="text-[9px] font-medium whitespace-nowrap">Луксозни</span>
					</button>
					<button onclick={() => goto('/browse?sale=true')} class="flex flex-col items-center min-w-12 py-1.5 px-2 rounded-lg transition-colors text-red-600 hover:bg-red-50">
						<span class="text-lg mb-0.5">🔥</span>
						<span class="text-[9px] font-medium whitespace-nowrap">Намаления</span>
					</button>
				</div>
			</div>
		{/if}
	</div>
	
	<!-- Spacer - Adjust based on page type -->
	<div style="height: {isSpecialPage ? '44px' : (isScrolled ? '96px' : '128px')}"></div>
</div>

<!-- Desktop Header -->
<header class="hidden md:block sticky top-0 z-50 w-full border-b bg-white">
	<div class="container flex h-20 items-center px-4 mx-auto max-w-7xl">
		<!-- Logo -->
		<div class="flex items-center mr-8">
			<a href="/" class="flex items-center space-x-2">
				<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white font-bold text-lg">
					D
				</div>
				<span class="font-bold text-2xl text-gray-900">Driplo</span>
			</a>
		</div>
		
		<!-- Search -->
		<div class="flex flex-1 max-w-2xl">
			<div class="flex w-full rounded-lg border border-gray-200 bg-white overflow-hidden">
				<!-- Category Dropdown -->
				<div class="relative" data-dropdown>
					<Select bind:value={selectedCategory} bind:open={showCategoriesDropdown}>
						<SelectTrigger class="flex items-center px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 border-r border-gray-200 rounded-none">
							<span class="truncate max-w-32">{selectedCategory}</span>
						</SelectTrigger>
						<SelectContent class="w-48">
							{#if isLoadingCategories}
								<div class="px-4 py-3 text-sm text-gray-500 text-center">Loading...</div>
							{:else}
								{#each categoryOptions as category}
									<SelectItem value={category}>
										{#if category === 'All Categories'}
											🛍️ {category}
										{:else}
											{categories.find(cat => cat.name === category)?.icon || '📦'} {category}
										{/if}
									</SelectItem>
								{/each}
							{/if}
						</SelectContent>
					</Select>
				</div>
				
				<!-- Search Input -->
				<div class="relative flex-1">
					<Input
						type="text"
						bind:value={searchQuery}
						onkeydown={(e) => e.key === 'Enter' && handleSearch()}
						placeholder="Search for items, brands and more..."
						class="w-full px-4 py-3 text-sm border-0 rounded-none bg-white"
					/>
				</div>
				
				<!-- Search Button -->
				<Button onclick={handleSearch} class="px-6 py-3 bg-primary text-white rounded-none">
					<Search class="h-5 w-5" />
				</Button>
			</div>
		</div>
		
		<!-- Navigation -->
		<nav class="hidden lg:flex items-center space-x-8 ml-8">
			<a href="/browse" class="text-sm font-medium text-gray-700 hover:text-primary">Browse</a>
			<a href="/sell" class="text-sm font-medium text-gray-700 hover:text-primary">Sell</a>
			<a href="/about" class="text-sm font-medium text-gray-700 hover:text-primary">About</a>
		</nav>
		
		<!-- Actions -->
		<div class="flex items-center space-x-3 ml-8">
			<Button variant="ghost" size="icon">
				<MessageCircle class="h-5 w-5" />
			</Button>
			<Button variant="ghost" size="icon">
				<Heart class="h-5 w-5" />
			</Button>
			<Button variant="ghost" size="icon">
				<ShoppingBag class="h-5 w-5" />
			</Button>
			<div class="w-px h-8 bg-gray-300 mx-2"></div>
			{#if user.isLoggedIn}
				<button onclick={() => goto('/profile')}>
					<LazyAvatar src={user.avatar} username={user.username} size="md" eager={true} />
				</button>
			{:else}
				<Button variant="ghost" size="icon" onclick={() => goto('/auth/login')}>
					<User class="h-5 w-5" />
				</Button>
				<Button class="bg-primary text-white" onclick={() => goto('/auth/signup')}>
					Sign In
				</Button>
			{/if}
		</div>
	</div>
</header>

<!-- Bottom Navigation - Hide on special pages -->
{#if !shouldHideBottomNav}
<nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
	<div class="flex items-center justify-around py-1.5">
		<a href="/" class="flex flex-col items-center gap-0.5 p-1.5 {$page.url.pathname === '/' ? 'text-primary' : 'text-gray-500'}">
			<Home class="h-4 w-4" />
			<span class="text-[9px] font-medium">Начало</span>
		</a>
		<a href="/browse" class="flex flex-col items-center gap-0.5 p-1.5 {$page.url.pathname.startsWith('/browse') ? 'text-primary' : 'text-gray-500'}">
			<Grid3x3 class="h-4 w-4" />
			<span class="text-[9px] font-medium">Разгледай</span>
		</a>
		<a href="/sell" class="flex flex-col items-center gap-0.5 p-1.5 relative">
			<div class="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-1.5">
				<Plus class="h-4 w-4 text-white" />
			</div>
			<span class="text-[9px] font-medium text-gray-600">Продай</span>
		</a>
		<a href="/favorites" class="flex flex-col items-center gap-0.5 p-1.5 {$page.url.pathname.startsWith('/favorites') ? 'text-primary' : 'text-gray-500'}">
			<Heart class="h-4 w-4" />
			<span class="text-[9px] font-medium">Любими</span>
		</a>
		<a href="/cart" class="flex flex-col items-center gap-0.5 p-1.5 {$page.url.pathname.startsWith('/cart') ? 'text-primary' : 'text-gray-500'} relative">
			<ShoppingBag class="h-4 w-4" />
			<span class="absolute -top-0.5 right-1 h-3 w-3 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center">2</span>
			<span class="text-[9px] font-medium">Кошница</span>
		</a>
	</div>
</nav>
{/if}