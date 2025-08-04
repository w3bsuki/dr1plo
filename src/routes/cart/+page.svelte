<script lang="ts">
	import { goto } from '$app/navigation';
	import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Package, Shield, Clock } from '@lucide/svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	
	// Mock cart data - in production this would come from stores or localStorage
	let cartItems = $state([
		{
			id: '1',
			title: 'Nike Air Jordan 1 Retro High OG',
			price: 299,
			image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop',
			size: '42',
			brand: 'Nike',
			condition: 'Ново с етикет',
			quantity: 1,
			seller: {
				name: 'sneaker_king',
				rating: 4.9
			},
			shipping: 5
		},
		{
			id: '2',
			title: 'Adidas Yeezy Boost 350',
			price: 280,
			image: 'https://images.unsplash.com/photo-1554062614-6da4fa67725a?w=400&h=500&fit=crop',
			size: '42',
			brand: 'Adidas',
			condition: 'Като ново',
			quantity: 1,
			seller: {
				name: 'streetwear',
				rating: 4.8
			},
			shipping: 5
		}
	]);
	
	// Calculate totals
	let subtotal = $derived(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0));
	let shippingTotal = $derived(cartItems.reduce((sum, item) => sum + item.shipping, 0));
	let total = $derived(subtotal + shippingTotal);
	let savings = $derived(Math.round(subtotal * 0.1)); // Mock savings
	
	// Cart functions
	function updateQuantity(itemId: string, change: number) {
		const item = cartItems.find(i => i.id === itemId);
		if (item) {
			item.quantity = Math.max(1, item.quantity + change);
		}
	}
	
	function removeItem(itemId: string) {
		cartItems = cartItems.filter(i => i.id !== itemId);
	}
	
	function proceedToCheckout() {
		goto('/checkout');
	}
	
	function continueShopping() {
		goto('/browse');
	}
</script>

<svelte:head>
	<title>Кошница - Driplo.bg</title>
</svelte:head>

<!-- Mobile Layout -->
<div class="md:hidden min-h-screen bg-gray-50 pb-32">
	<!-- Header -->
	<div class="bg-white px-4 py-3 border-b sticky top-0 z-10">
		<h1 class="text-lg font-bold">Кошница ({cartItems.length})</h1>
	</div>
	
	{#if cartItems.length === 0}
		<!-- Empty Cart -->
		<div class="flex flex-col items-center justify-center py-20 px-4">
			<div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
				<ShoppingBag class="w-10 h-10 text-gray-400" />
			</div>
			<h2 class="text-xl font-semibold mb-2">Кошницата е празна</h2>
			<p class="text-gray-500 text-center mb-6">Добавете продукти, за да продължите</p>
			<Button onclick={continueShopping} class="bg-primary">
				Разгледай продукти
			</Button>
		</div>
	{:else}
		<!-- Cart Items -->
		<div class="px-4 py-4 space-y-3">
			{#each cartItems as item}
				<div class="bg-white rounded-lg p-3 shadow-sm">
					<div class="flex gap-3">
						<!-- Product Image -->
						<img 
							src={item.image} 
							alt={item.title}
							class="w-24 h-24 object-cover rounded-lg"
						/>
						
						<!-- Product Info -->
						<div class="flex-1">
							<h3 class="font-medium text-sm mb-1 line-clamp-2">{item.title}</h3>
							<div class="text-xs text-gray-500 space-y-0.5 mb-2">
								<p>Размер: {item.size} • {item.condition}</p>
								<p>От {item.seller.name} ⭐ {item.seller.rating}</p>
							</div>
							
							<!-- Price -->
							<div class="text-lg font-bold">{item.price} лв</div>
						</div>
					</div>
					
					<!-- Actions -->
					<div class="flex items-center justify-between mt-3 pt-3 border-t">
						<div class="flex items-center gap-2">
							<button 
								onclick={() => updateQuantity(item.id, -1)}
								class="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center"
								disabled={item.quantity <= 1}
							>
								<Minus class="w-4 h-4" />
							</button>
							<span class="w-8 text-center font-medium">{item.quantity}</span>
							<button 
								onclick={() => updateQuantity(item.id, 1)}
								class="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center"
							>
								<Plus class="w-4 h-4" />
							</button>
						</div>
						
						<button 
							onclick={() => removeItem(item.id)}
							class="text-red-500 p-2"
						>
							<Trash2 class="w-5 h-5" />
						</button>
					</div>
				</div>
			{/each}
		</div>
		
		<!-- Promo Section -->
		<div class="px-4 py-3">
			<div class="bg-green-50 border border-green-200 rounded-lg p-3">
				<div class="flex items-center gap-2 text-green-700">
					<Shield class="w-5 h-5" />
					<span class="text-sm font-medium">Защита на купувача</span>
				</div>
				<p class="text-xs text-green-600 mt-1">
					Всички покупки са защитени. Парите ви са в безопасност.
				</p>
			</div>
		</div>
		
		<!-- Summary -->
		<div class="bg-white px-4 py-4 border-t">
			<div class="space-y-2 text-sm">
				<div class="flex justify-between">
					<span class="text-gray-600">Междинна сума</span>
					<span class="font-medium">{subtotal} лв</span>
				</div>
				<div class="flex justify-between">
					<span class="text-gray-600">Доставка</span>
					<span class="font-medium">{shippingTotal} лв</span>
				</div>
				{#if savings > 0}
					<div class="flex justify-between text-green-600">
						<span>Спестявате</span>
						<span class="font-medium">-{savings} лв</span>
					</div>
				{/if}
				<div class="flex justify-between text-lg font-bold pt-2 border-t">
					<span>Общо</span>
					<span>{total} лв</span>
				</div>
			</div>
		</div>
		
		<!-- Fixed Bottom Actions -->
		<div class="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-30">
			<Button onclick={proceedToCheckout} class="w-full bg-primary h-12">
				Продължи към плащане
				<ArrowRight class="w-5 h-5 ml-2" />
			</Button>
			<button onclick={continueShopping} class="w-full mt-2 text-sm text-gray-600">
				Продължи пазаруването
			</button>
		</div>
	{/if}
</div>

<!-- Desktop Layout -->
<div class="hidden md:block container mx-auto max-w-7xl px-4 py-8">
	<h1 class="text-3xl font-bold mb-8">Кошница</h1>
	
	{#if cartItems.length === 0}
		<!-- Empty Cart -->
		<div class="bg-white rounded-lg shadow-sm p-20">
			<div class="flex flex-col items-center">
				<div class="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
					<ShoppingBag class="w-16 h-16 text-gray-400" />
				</div>
				<h2 class="text-2xl font-semibold mb-3">Кошницата ви е празна</h2>
				<p class="text-gray-500 mb-8">Добавете продукти, за да продължите с поръчката</p>
				<Button onclick={continueShopping} size="lg" class="bg-primary">
					Разгледай продукти
				</Button>
			</div>
		</div>
	{:else}
		<div class="grid grid-cols-12 gap-8">
			<!-- Cart Items Column -->
			<div class="col-span-8">
				<div class="bg-white rounded-lg shadow-sm">
					<div class="p-6 border-b">
						<h2 class="text-xl font-semibold">Продукти ({cartItems.length})</h2>
					</div>
					
					<div class="divide-y">
						{#each cartItems as item}
							<div class="p-6">
								<div class="flex gap-6">
									<!-- Product Image -->
									<img 
										src={item.image} 
										alt={item.title}
										class="w-32 h-32 object-cover rounded-lg"
									/>
									
									<!-- Product Details -->
									<div class="flex-1">
										<div class="flex justify-between mb-2">
											<h3 class="text-lg font-semibold">{item.title}</h3>
											<button 
												onclick={() => removeItem(item.id)}
												class="text-gray-400 hover:text-red-500"
											>
												<Trash2 class="w-5 h-5" />
											</button>
										</div>
										
										<div class="flex gap-4 text-sm text-gray-600 mb-3">
											<span>Марка: {item.brand}</span>
											<span>Размер: {item.size}</span>
											<span>Състояние: {item.condition}</span>
										</div>
										
										<div class="flex items-center gap-2 text-sm text-gray-500 mb-4">
											<span>Продавач: {item.seller.name}</span>
											<span>⭐ {item.seller.rating}</span>
										</div>
										
										<div class="flex items-center justify-between">
											<div class="flex items-center gap-3">
												<button 
													onclick={() => updateQuantity(item.id, -1)}
													class="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
													disabled={item.quantity <= 1}
												>
													<Minus class="w-4 h-4" />
												</button>
												<span class="w-12 text-center font-medium text-lg">{item.quantity}</span>
												<button 
													onclick={() => updateQuantity(item.id, 1)}
													class="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
												>
													<Plus class="w-4 h-4" />
												</button>
											</div>
											
											<div class="text-2xl font-bold">{item.price * item.quantity} лв</div>
										</div>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
				
				<!-- Continue Shopping -->
				<button onclick={continueShopping} class="mt-4 text-primary hover:underline">
					← Продължи пазаруването
				</button>
			</div>
			
			<!-- Order Summary Column -->
			<div class="col-span-4">
				<div class="bg-white rounded-lg shadow-sm p-6 sticky top-24">
					<h2 class="text-xl font-semibold mb-6">Обобщение на поръчката</h2>
					
					<div class="space-y-3 mb-6">
						<div class="flex justify-between">
							<span class="text-gray-600">Междинна сума</span>
							<span class="font-medium">{subtotal} лв</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-600">Доставка</span>
							<span class="font-medium">{shippingTotal} лв</span>
						</div>
						{#if savings > 0}
							<div class="flex justify-between text-green-600">
								<span>Спестявате</span>
								<span class="font-medium">-{savings} лв</span>
							</div>
						{/if}
						
						<div class="border-t pt-3">
							<div class="flex justify-between text-xl font-bold">
								<span>Общо</span>
								<span>{total} лв</span>
							</div>
						</div>
					</div>
					
					<Button onclick={proceedToCheckout} class="w-full bg-primary" size="lg">
						Продължи към плащане
						<ArrowRight class="w-5 h-5 ml-2" />
					</Button>
					
					<!-- Security badges -->
					<div class="mt-6 pt-6 border-t space-y-3">
						<div class="flex items-center gap-3 text-sm">
							<Shield class="w-5 h-5 text-green-600" />
							<span>Защитено плащане</span>
						</div>
						<div class="flex items-center gap-3 text-sm">
							<Package class="w-5 h-5 text-blue-600" />
							<span>Проследяване на пратката</span>
						</div>
						<div class="flex items-center gap-3 text-sm">
							<Clock class="w-5 h-5 text-orange-600" />
							<span>Доставка 2-5 дни</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>