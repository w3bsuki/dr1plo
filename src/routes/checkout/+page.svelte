<script lang="ts">
	import { goto } from '$app/navigation';
	import { 
		MapPin, Phone, Mail, CreditCard, Wallet, Building, 
		Shield, Package, ArrowLeft, Check, Info, User
	} from '@lucide/svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Label from '$lib/components/ui/label.svelte';
	import Textarea from '$lib/components/ui/textarea.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	
	// Mock cart data - in production from store
	let cartItems = $state([
		{
			id: '1',
			title: 'Nike Air Jordan 1 Retro High OG',
			price: 299,
			image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop',
			size: '42',
			quantity: 1,
			shipping: 5
		},
		{
			id: '2',
			title: 'Adidas Yeezy Boost 350',
			price: 280,
			image: 'https://images.unsplash.com/photo-1554062614-6da4fa67725a?w=400&h=500&fit=crop',
			size: '42',
			quantity: 1,
			shipping: 5
		}
	]);
	
	// Form state
	let deliveryMethod = $state('shipping');
	let paymentMethod = $state('card');
	let acceptTerms = $state(false);
	let saveInfo = $state(true);
	
	// Shipping info
	let shippingInfo = $state({
		fullName: '',
		phone: '',
		email: '',
		address: '',
		city: '',
		postalCode: '',
		notes: ''
	});
	
	// Calculate totals
	let subtotal = $derived(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0));
	let shippingTotal = $derived(deliveryMethod === 'shipping' ? cartItems.reduce((sum, item) => sum + item.shipping, 0) : 0);
	let total = $derived(subtotal + shippingTotal);
	
	function handleSubmit() {
		if (!acceptTerms) {
			alert('Моля, приемете условията за ползване');
			return;
		}
		// Process payment
		goto('/order-confirmation');
	}
	
	function goBack() {
		goto('/cart');
	}
</script>

<svelte:head>
	<title>Плащане - Driplo.bg</title>
</svelte:head>

<!-- Mobile Layout -->
<div class="md:hidden min-h-screen bg-gray-50 pb-32">
	<!-- Header -->
	<div class="bg-white px-4 py-3 border-b sticky top-0 z-10">
		<div class="flex items-center gap-3">
			<button onclick={goBack}>
				<ArrowLeft class="w-5 h-5" />
			</button>
			<h1 class="text-lg font-bold">Плащане</h1>
		</div>
	</div>
	
	<!-- Order Summary -->
	<div class="bg-white px-4 py-4 mb-2">
		<h2 class="font-semibold mb-3">Поръчка ({cartItems.length} продукта)</h2>
		<div class="space-y-3">
			{#each cartItems as item}
				<div class="flex gap-3">
					<img src={item.image} alt={item.title} class="w-16 h-16 object-cover rounded-lg" />
					<div class="flex-1">
						<p class="text-sm font-medium line-clamp-1">{item.title}</p>
						<p class="text-xs text-gray-500">Размер: {item.size} • Бр: {item.quantity}</p>
						<p class="text-sm font-bold">{item.price} лв</p>
					</div>
				</div>
			{/each}
		</div>
		
		<div class="border-t mt-4 pt-3 space-y-1">
			<div class="flex justify-between text-sm">
				<span>Междинна сума</span>
				<span>{subtotal} лв</span>
			</div>
			<div class="flex justify-between text-sm">
				<span>Доставка</span>
				<span>{shippingTotal > 0 ? `${shippingTotal} лв` : 'Безплатно'}</span>
			</div>
			<div class="flex justify-between font-bold text-lg pt-2">
				<span>Общо</span>
				<span>{total} лв</span>
			</div>
		</div>
	</div>
	
	<!-- Delivery Method -->
	<div class="bg-white px-4 py-4 mb-2">
		<h2 class="font-semibold mb-3">Начин на доставка</h2>
		<div class="space-y-2">
			<label class="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 {deliveryMethod === 'shipping' ? 'border-primary bg-primary/5' : ''}">
				<div class="flex items-center gap-3">
					<input type="radio" bind:group={deliveryMethod} value="shipping" class="text-primary" />
					<div>
						<p class="font-medium">Доставка до адрес</p>
						<p class="text-xs text-gray-500">2-5 работни дни</p>
					</div>
				</div>
				<span class="text-sm font-medium">5 лв</span>
			</label>
			
			<label class="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 {deliveryMethod === 'pickup' ? 'border-primary bg-primary/5' : ''}">
				<div class="flex items-center gap-3">
					<input type="radio" bind:group={deliveryMethod} value="pickup" class="text-primary" />
					<div>
						<p class="font-medium">Вземане от офис</p>
						<p class="text-xs text-gray-500">София, бул. Витоша 10</p>
					</div>
				</div>
				<span class="text-sm font-medium text-green-600">Безплатно</span>
			</label>
		</div>
	</div>
	
	<!-- Shipping Info -->
	{#if deliveryMethod === 'shipping'}
		<div class="bg-white px-4 py-4 mb-2">
			<h2 class="font-semibold mb-3">Данни за доставка</h2>
			<div class="space-y-3">
				<div>
					<Label for="fullName">Име и фамилия</Label>
					<Input id="fullName" bind:value={shippingInfo.fullName} placeholder="Иван Иванов" />
				</div>
				
				<div>
					<Label for="phone">Телефон</Label>
					<Input id="phone" bind:value={shippingInfo.phone} placeholder="+359 88 123 4567" type="tel" />
				</div>
				
				<div>
					<Label for="email">Имейл</Label>
					<Input id="email" bind:value={shippingInfo.email} placeholder="ivan@example.com" type="email" />
				</div>
				
				<div>
					<Label for="address">Адрес</Label>
					<Input id="address" bind:value={shippingInfo.address} placeholder="ул. Шипка 6" />
				</div>
				
				<div class="grid grid-cols-2 gap-3">
					<div>
						<Label for="city">Град</Label>
						<Input id="city" bind:value={shippingInfo.city} placeholder="София" />
					</div>
					<div>
						<Label for="postalCode">Пощ. код</Label>
						<Input id="postalCode" bind:value={shippingInfo.postalCode} placeholder="1000" />
					</div>
				</div>
				
				<div>
					<Label for="notes">Бележки (по желание)</Label>
					<Textarea id="notes" bind:value={shippingInfo.notes} placeholder="Специални инструкции за доставка..." />
				</div>
			</div>
		</div>
	{/if}
	
	<!-- Payment Method -->
	<div class="bg-white px-4 py-4 mb-2">
		<h2 class="font-semibold mb-3">Начин на плащане</h2>
		<div class="space-y-2">
			<label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 {paymentMethod === 'card' ? 'border-primary bg-primary/5' : ''}">
				<input type="radio" bind:group={paymentMethod} value="card" class="text-primary" />
				<CreditCard class="w-5 h-5" />
				<span class="font-medium">Карта</span>
			</label>
			
			<label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 {paymentMethod === 'paypal' ? 'border-primary bg-primary/5' : ''}">
				<input type="radio" bind:group={paymentMethod} value="paypal" class="text-primary" />
				<Wallet class="w-5 h-5" />
				<span class="font-medium">PayPal</span>
			</label>
			
			<label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 {paymentMethod === 'cash' ? 'border-primary bg-primary/5' : ''}">
				<input type="radio" bind:group={paymentMethod} value="cash" class="text-primary" />
				<Building class="w-5 h-5" />
				<span class="font-medium">В брой при доставка</span>
			</label>
		</div>
		
		{#if paymentMethod === 'card'}
			<div class="mt-4 p-3 bg-blue-50 rounded-lg">
				<p class="text-sm text-blue-700">Ще бъдете пренасочени към сигурна страница за плащане</p>
			</div>
		{/if}
	</div>
	
	<!-- Terms -->
	<div class="bg-white px-4 py-4">
		<label class="flex items-start gap-3 cursor-pointer">
			<input type="checkbox" bind:checked={acceptTerms} class="mt-1 text-primary" />
			<span class="text-sm">
				Съгласен съм с <a href="/terms" class="text-primary underline">Общите условия</a> и 
				<a href="/privacy" class="text-primary underline">Политиката за поверителност</a>
			</span>
		</label>
		
		<label class="flex items-start gap-3 cursor-pointer mt-3">
			<input type="checkbox" bind:checked={saveInfo} class="mt-1 text-primary" />
			<span class="text-sm">Запази данните ми за следващи поръчки</span>
		</label>
	</div>
	
	<!-- Security Badge -->
	<div class="px-4 py-3">
		<div class="bg-green-50 border border-green-200 rounded-lg p-3">
			<div class="flex items-center gap-2 text-green-700">
				<Shield class="w-5 h-5" />
				<span class="text-sm font-medium">Сигурно плащане</span>
			</div>
			<p class="text-xs text-green-600 mt-1">
				Вашите данни са криптирани и защитени
			</p>
		</div>
	</div>
	
	<!-- Fixed Bottom -->
	<div class="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-30">
		<Button 
			onclick={handleSubmit} 
			class="w-full bg-primary h-12"
			disabled={!acceptTerms}
		>
			Завърши поръчката • {total} лв
		</Button>
	</div>
</div>

<!-- Desktop Layout -->
<div class="hidden md:block container mx-auto max-w-7xl px-4 py-8">
	<h1 class="text-3xl font-bold mb-8">Завършване на поръчката</h1>
	
	<div class="grid grid-cols-12 gap-8">
		<!-- Left Column - Forms -->
		<div class="col-span-8">
			<!-- Delivery Method -->
			<div class="bg-white rounded-lg shadow-sm p-6 mb-6">
				<h2 class="text-xl font-semibold mb-4">Начин на доставка</h2>
				<div class="space-y-3">
					<label class="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 {deliveryMethod === 'shipping' ? 'border-primary bg-primary/5' : ''}">
						<div class="flex items-center gap-4">
							<input type="radio" bind:group={deliveryMethod} value="shipping" class="text-primary" />
							<Package class="w-6 h-6 text-gray-600" />
							<div>
								<p class="font-medium">Доставка до адрес</p>
								<p class="text-sm text-gray-500">Стандартна доставка (2-5 работни дни)</p>
							</div>
						</div>
						<span class="font-medium">5 лв</span>
					</label>
					
					<label class="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 {deliveryMethod === 'pickup' ? 'border-primary bg-primary/5' : ''}">
						<div class="flex items-center gap-4">
							<input type="radio" bind:group={deliveryMethod} value="pickup" class="text-primary" />
							<MapPin class="w-6 h-6 text-gray-600" />
							<div>
								<p class="font-medium">Вземане от офис</p>
								<p class="text-sm text-gray-500">София, бул. Витоша 10</p>
							</div>
						</div>
						<span class="font-medium text-green-600">Безплатно</span>
					</label>
				</div>
			</div>
			
			<!-- Shipping Information -->
			{#if deliveryMethod === 'shipping'}
				<div class="bg-white rounded-lg shadow-sm p-6 mb-6">
					<h2 class="text-xl font-semibold mb-4">Информация за доставка</h2>
					<div class="grid grid-cols-2 gap-4">
						<div class="col-span-2">
							<Label for="fullName">Име и фамилия *</Label>
							<Input id="fullName" bind:value={shippingInfo.fullName} placeholder="Иван Иванов" />
						</div>
						
						<div>
							<Label for="phone">Телефон *</Label>
							<Input id="phone" bind:value={shippingInfo.phone} placeholder="+359 88 123 4567" type="tel" />
						</div>
						
						<div>
							<Label for="email">Имейл адрес *</Label>
							<Input id="email" bind:value={shippingInfo.email} placeholder="ivan@example.com" type="email" />
						</div>
						
						<div class="col-span-2">
							<Label for="address">Адрес *</Label>
							<Input id="address" bind:value={shippingInfo.address} placeholder="ул. Шипка 6, вх. А, ет. 3, ап. 12" />
						</div>
						
						<div>
							<Label for="city">Град *</Label>
							<Input id="city" bind:value={shippingInfo.city} placeholder="София" />
						</div>
						
						<div>
							<Label for="postalCode">Пощенски код *</Label>
							<Input id="postalCode" bind:value={shippingInfo.postalCode} placeholder="1000" />
						</div>
						
						<div class="col-span-2">
							<Label for="notes">Бележки за доставката (по желание)</Label>
							<Textarea 
								id="notes" 
								bind:value={shippingInfo.notes} 
								placeholder="Специални инструкции за куриера..."
								rows="3"
							/>
						</div>
					</div>
				</div>
			{/if}
			
			<!-- Payment Method -->
			<div class="bg-white rounded-lg shadow-sm p-6 mb-6">
				<h2 class="text-xl font-semibold mb-4">Начин на плащане</h2>
				<div class="space-y-3">
					<label class="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 {paymentMethod === 'card' ? 'border-primary bg-primary/5' : ''}">
						<input type="radio" bind:group={paymentMethod} value="card" class="text-primary" />
						<CreditCard class="w-6 h-6" />
						<div class="flex-1">
							<p class="font-medium">Дебитна или кредитна карта</p>
							<p class="text-sm text-gray-500">Visa, Mastercard, Maestro</p>
						</div>
					</label>
					
					<label class="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 {paymentMethod === 'paypal' ? 'border-primary bg-primary/5' : ''}">
						<input type="radio" bind:group={paymentMethod} value="paypal" class="text-primary" />
						<Wallet class="w-6 h-6" />
						<div class="flex-1">
							<p class="font-medium">PayPal</p>
							<p class="text-sm text-gray-500">Плащане през PayPal акаунт</p>
						</div>
					</label>
					
					<label class="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 {paymentMethod === 'cash' ? 'border-primary bg-primary/5' : ''}">
						<input type="radio" bind:group={paymentMethod} value="cash" class="text-primary" />
						<Building class="w-6 h-6" />
						<div class="flex-1">
							<p class="font-medium">Наложен платеж</p>
							<p class="text-sm text-gray-500">Плащане в брой при доставка</p>
						</div>
					</label>
				</div>
				
				{#if paymentMethod === 'card'}
					<div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
						<div class="flex gap-3">
							<Info class="w-5 h-5 text-blue-600 mt-0.5" />
							<div>
								<p class="text-sm text-blue-800 font-medium">Сигурно плащане</p>
								<p class="text-sm text-blue-600 mt-1">
									След потвърждение ще бъдете пренасочени към защитена страница за въвеждане на данните на картата.
								</p>
							</div>
						</div>
					</div>
				{/if}
			</div>
			
			<!-- Terms and Conditions -->
			<div class="bg-white rounded-lg shadow-sm p-6">
				<div class="space-y-4">
					<label class="flex items-start gap-3 cursor-pointer">
						<input type="checkbox" bind:checked={acceptTerms} class="mt-1 text-primary" />
						<span class="text-sm">
							Прочетох и приемам <a href="/terms" class="text-primary hover:underline">Общите условия</a> и 
							<a href="/privacy" class="text-primary hover:underline">Политиката за поверителност</a> *
						</span>
					</label>
					
					<label class="flex items-start gap-3 cursor-pointer">
						<input type="checkbox" bind:checked={saveInfo} class="mt-1 text-primary" />
						<span class="text-sm">
							Запази информацията ми за бъдещи поръчки
						</span>
					</label>
				</div>
			</div>
		</div>
		
		<!-- Right Column - Order Summary -->
		<div class="col-span-4">
			<div class="bg-white rounded-lg shadow-sm p-6 sticky top-24">
				<h2 class="text-xl font-semibold mb-4">Вашата поръчка</h2>
				
				<!-- Cart Items -->
				<div class="space-y-4 mb-6">
					{#each cartItems as item}
						<div class="flex gap-4">
							<img 
								src={item.image} 
								alt={item.title}
								class="w-20 h-20 object-cover rounded-lg"
							/>
							<div class="flex-1">
								<h3 class="font-medium text-sm line-clamp-2">{item.title}</h3>
								<p class="text-sm text-gray-500">Размер: {item.size}</p>
								<div class="flex justify-between items-center mt-1">
									<span class="text-sm">Бр: {item.quantity}</span>
									<span class="font-bold">{item.price} лв</span>
								</div>
							</div>
						</div>
					{/each}
				</div>
				
				<!-- Totals -->
				<div class="border-t pt-4 space-y-2">
					<div class="flex justify-between text-sm">
						<span class="text-gray-600">Междинна сума</span>
						<span>{subtotal} лв</span>
					</div>
					<div class="flex justify-between text-sm">
						<span class="text-gray-600">Доставка</span>
						<span>{shippingTotal > 0 ? `${shippingTotal} лв` : 'Безплатно'}</span>
					</div>
					<div class="border-t pt-2 mt-2">
						<div class="flex justify-between text-xl font-bold">
							<span>Общо</span>
							<span>{total} лв</span>
						</div>
					</div>
				</div>
				
				<!-- Submit Button -->
				<Button 
					onclick={handleSubmit}
					class="w-full bg-primary mt-6"
					size="lg"
					disabled={!acceptTerms}
				>
					Завърши поръчката
				</Button>
				
				<!-- Security Badges -->
				<div class="mt-6 pt-6 border-t">
					<div class="flex items-center gap-2 text-sm text-gray-600 mb-3">
						<Shield class="w-4 h-4" />
						<span>Гарантирана сигурност</span>
					</div>
					<div class="flex gap-2">
						<img src="/visa.svg" alt="Visa" class="h-8" />
						<img src="/mastercard.svg" alt="Mastercard" class="h-8" />
						<img src="/paypal.svg" alt="PayPal" class="h-8" />
					</div>
				</div>
			</div>
		</div>
	</div>
</div>