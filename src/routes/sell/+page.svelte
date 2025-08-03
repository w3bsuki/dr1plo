<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { 
		Camera, X, ChevronRight, ChevronLeft, Upload, 
		Package, Tag, FileText, DollarSign, MapPin,
		Shirt, Home, Baby, Footprints, Briefcase, Sparkles,
		Plus, Info
	} from '@lucide/svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label.svelte';
	import Textarea from '$lib/components/ui/textarea.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import CardContent from '$lib/components/ui/card/CardContent.svelte';
	import CardHeader from '$lib/components/ui/card/CardHeader.svelte';
	import CardTitle from '$lib/components/ui/card/CardTitle.svelte';
	import type { PageData } from './$types';
	
	let { data }: { data: PageData } = $props();
	
	// Wizard state
	let currentStep = $state(1);
	let isSubmitting = $state(false);
	
	// Form data
	let images = $state<File[]>([]);
	let imageUrls = $state<string[]>([]);
	let category = $state('');
	let subcategory = $state('');
	let title = $state('');
	let brand = $state('');
	let size = $state('');
	let condition = $state('new_with_tags');
	let color = $state('');
	let material = $state('');
	let description = $state('');
	let price = $state('');
	let originalPrice = $state('');
	let location = $state('София');
	let shippingType = $state('buyer_pays');
	let shippingCost = $state('5');
	
	// Categories with proper icons
	const categories = [
		{ id: 'womens', name: 'Дамски', icon: Shirt },
		{ id: 'mens', name: 'Мъжки', icon: Shirt },
		{ id: 'kids', name: 'Детски', icon: Baby },
		{ id: 'shoes', name: 'Обувки', icon: Footprints },
		{ id: 'bags', name: 'Чанти', icon: Briefcase },
		{ id: 'accessories', name: 'Аксесоари', icon: Sparkles }
	];
	
	const subcategories: Record<string, Array<{id: string, name: string}>> = {
		womens: [
			{ id: 'dresses', name: 'Рокли' },
			{ id: 'tops', name: 'Блузи и топове' },
			{ id: 'pants', name: 'Панталони' },
			{ id: 'skirts', name: 'Поли' },
			{ id: 'coats', name: 'Якета и палта' },
			{ id: 'knitwear', name: 'Плетива' }
		],
		mens: [
			{ id: 'shirts', name: 'Ризи' },
			{ id: 'tshirts', name: 'Тениски' },
			{ id: 'pants', name: 'Панталони' },
			{ id: 'jeans', name: 'Дънки' },
			{ id: 'jackets', name: 'Якета' },
			{ id: 'suits', name: 'Костюми' }
		],
		kids: [
			{ id: 'baby', name: 'Бебешки (0-2г)' },
			{ id: 'toddler', name: 'Малки деца (2-6г)' },
			{ id: 'kids', name: 'Деца (6-14г)' },
			{ id: 'shoes', name: 'Детски обувки' },
			{ id: 'accessories', name: 'Детски аксесоари' }
		]
	};
	
	const conditions = [
		{ id: 'new_with_tags', name: 'Ново с етикет', description: 'Никога не е носено, с оригинални етикети' },
		{ id: 'new_without_tags', name: 'Ново без етикет', description: 'Никога не е носено, но без етикети' },
		{ id: 'very_good', name: 'Много добро', description: 'Носено 1-2 пъти, без видими следи' },
		{ id: 'good', name: 'Добро', description: 'Леко носено, минимални следи от употреба' },
		{ id: 'fair', name: 'Задоволително', description: 'Видимо носено, но все още в добро състояние' }
	];
	
	const sizes = {
		clothing: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
		shoes: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'],
		kids: ['50', '56', '62', '68', '74', '80', '86', '92', '98', '104', '110', '116', '122', '128', '134', '140']
	};
	
	// Image handling
	function handleImageUpload(e: Event) {
		const input = e.target as HTMLInputElement;
		if (!input.files) return;
		
		const newFiles = Array.from(input.files);
		const totalImages = images.length + newFiles.length;
		
		if (totalImages > 10) {
			alert('Максимум 10 снимки');
			return;
		}
		
		images = [...images, ...newFiles];
		
		// Create preview URLs
		newFiles.forEach(file => {
			const url = URL.createObjectURL(file);
			imageUrls = [...imageUrls, url];
		});
	}
	
	function removeImage(index: number) {
		images = images.filter((_, i) => i !== index);
		URL.revokeObjectURL(imageUrls[index]);
		imageUrls = imageUrls.filter((_, i) => i !== index);
	}
	
	function moveImage(from: number, to: number) {
		const newImages = [...images];
		const newUrls = [...imageUrls];
		
		[newImages[from], newImages[to]] = [newImages[to], newImages[from]];
		[newUrls[from], newUrls[to]] = [newUrls[to], newUrls[from]];
		
		images = newImages;
		imageUrls = newUrls;
	}
	
	// Validation
	function canProceed(step: number): boolean {
		switch(step) {
			case 1: return images.length >= 1;
			case 2: return !!category && !!subcategory;
			case 3: return !!title && !!brand && !!size && !!condition;
			case 4: return !!description && description.length >= 10;
			case 5: return !!price && parseFloat(price) > 0;
			default: return true;
		}
	}
	
	// Submit
	async function submitListing() {
		if (!canProceed(5)) return;
		
		if (!data.session) {
			alert('Моля влезте в профила си');
			goto('/auth/login?redirect=/sell');
			return;
		}
		
		isSubmitting = true;
		
		try {
			// TODO: Upload images to Supabase Storage
			const uploadedImageUrls = ['https://i.imgur.com/placeholder.jpg']; // Placeholder
			
			// Use the supabase client from the parent layout that has the session
			const supabase = $page.data.supabase;
			
			// Get current user to ensure we're authenticated
			const { data: { user } } = await supabase.auth.getUser();
			
			if (!user) {
				throw new Error('Not authenticated - please login');
			}
			
			const { data: result, error } = await supabase
				.from('listings')
				.insert({
					title,
					description: description || '',
					price: parseFloat(price),
					category_id: subcategory || category,
					condition,
					size: size || null,
					brand: brand || null,
					images: uploadedImageUrls,
					location_city: location || 'София',
					seller_id: user.id,
					status: 'active',
					view_count: 0,
					like_count: 0,
					color: color || null,
					material: material || null
				})
				.select()
				.single();
			
			if (error) {
				throw error;
			}
			
			console.log('Listing created:', result);
			goto('/profile?tab=listings');
		} catch (error: any) {
			console.error('Error creating listing:', error);
			alert(error.message || 'Грешка при създаване на обявата');
		} finally {
			isSubmitting = false;
		}
	}
</script>

<svelte:head>
	<title>Продай - Driplo.bg</title>
</svelte:head>

<div class="max-w-3xl mx-auto md:px-4 md:py-6">
		<!-- Clean Progress Indicator -->
		<div class="bg-white border-b md:rounded-lg md:border md:mb-4">
			<div class="px-4 py-3">
				<!-- Mobile: Simple step counter -->
				<div class="flex items-center justify-between md:hidden">
					<span class="text-sm font-medium">Стъпка {currentStep} от 5</span>
					<div class="flex gap-1">
						{#each [1, 2, 3, 4, 5] as step}
							<div class="w-2 h-2 rounded-full transition-colors {
								currentStep > step ? 'bg-green-500' : 
								currentStep === step ? 'bg-primary' : 
								'bg-gray-300'
							}"></div>
						{/each}
					</div>
				</div>
				
				<!-- Desktop: Detailed progress -->
				<div class="hidden md:flex items-center justify-between">
					{#each [
						{ num: 1, icon: Camera, label: 'Снимки' },
						{ num: 2, icon: Package, label: 'Категория' },
						{ num: 3, icon: Tag, label: 'Детайли' },
						{ num: 4, icon: FileText, label: 'Описание' },
						{ num: 5, icon: DollarSign, label: 'Цена' }
					] as step}
						<div class="flex items-center gap-2">
							<div class="w-8 h-8 rounded-full flex items-center justify-center transition-all {
								currentStep > step.num ? 'bg-green-500 text-white' : 
								currentStep === step.num ? 'bg-primary text-white' : 
								'bg-gray-200 text-gray-400'
							}">
								<step.icon class="w-4 h-4" />
							</div>
							<span class="text-sm font-medium hidden lg:block {
								currentStep === step.num ? 'text-gray-900' : 'text-gray-500'
							}">{step.label}</span>
							{#if step.num < 5}
								<ChevronRight class="w-4 h-4 text-gray-400" />
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>
		
		<!-- Clean Content Container -->
		<div class="bg-white md:rounded-lg md:border md:shadow-sm">
			<div class="p-4 md:p-6">
				<!-- Step 1: Images -->
				{#if currentStep === 1}
					<div class="space-y-4">
						<div>
							<h3 class="text-lg font-semibold mb-1">Добавете снимки</h3>
							<p class="text-sm text-gray-600">Качествените снимки увеличават продажбите до 5 пъти</p>
						</div>
						
						<!-- Image Grid -->
						<div class="grid grid-cols-3 gap-3">
							{#each imageUrls as url, index}
								<div class="relative group aspect-square">
									<img src={url} alt="Upload {index + 1}" class="w-full h-full object-cover rounded-lg border" />
									<div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
										{#if index > 0}
											<button
												onclick={() => moveImage(index, index - 1)}
												class="p-1 bg-white rounded-full"
											>
												<ChevronLeft class="w-3 h-3" />
											</button>
										{/if}
										<button
											onclick={() => removeImage(index)}
											class="p-1 bg-red-500 text-white rounded-full"
										>
											<X class="w-3 h-3" />
										</button>
										{#if index < imageUrls.length - 1}
											<button
												onclick={() => moveImage(index, index + 1)}
												class="p-1 bg-white rounded-full"
											>
												<ChevronRight class="w-3 h-3" />
											</button>
										{/if}
									</div>
									{#if index === 0}
										<span class="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-0.5 rounded">
											Основна
										</span>
									{/if}
								</div>
							{/each}
							
							{#if images.length < 10}
								<label class="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
									<Plus class="w-6 h-6 text-gray-400 mb-1" />
									<span class="text-xs text-gray-500">Добави</span>
									<input
										type="file"
										accept="image/*"
										multiple
										onchange={handleImageUpload}
										class="hidden"
									/>
								</label>
							{/if}
						</div>
						
						<div class="text-xs text-gray-500">
							Минимум 1 • Максимум 10 снимки • Първата е основна
						</div>
					</div>
				{/if}
				
				<!-- Step 2: Category -->
				{#if currentStep === 2}
					<div class="space-y-6">
						<div>
							<h3 class="text-lg font-semibold mb-4">Изберете категория</h3>
							<div class="grid grid-cols-3 md:grid-cols-3 gap-2">
								{#each categories as cat}
									<button
										onclick={() => category = cat.id}
										class="flex flex-col items-center gap-2 p-3 border-2 rounded-lg transition-all {
											category === cat.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
										}"
									>
										<cat.icon class="w-5 h-5 {
											category === cat.id ? 'text-primary' : 'text-gray-600'
										}" />
										<span class="text-sm font-medium">{cat.name}</span>
									</button>
								{/each}
							</div>
						</div>
						
						{#if category && subcategories[category]}
							<div>
								<h3 class="text-lg font-semibold mb-4">Изберете подкатегория</h3>
								<div class="space-y-2">
									{#each subcategories[category] as subcat}
										<button
											onclick={() => subcategory = subcat.id}
											class="w-full text-left p-3 border rounded-lg transition-all {
												subcategory === subcat.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
											}"
										>
											<span class="font-medium">{subcat.name}</span>
										</button>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				{/if}
				
				<!-- Step 3: Details -->
				{#if currentStep === 3}
					<div class="space-y-4">
						<div>
							<h3 class="text-lg font-semibold mb-4">Детайли за продукта</h3>
						</div>
						
						<div>
							<Label for="title">Заглавие *</Label>
							<Input
								id="title"
								type="text"
								bind:value={title}
								placeholder="напр. Червена рокля Zara"
								class="mt-1"
							/>
						</div>
						
						<div class="grid grid-cols-2 gap-4">
							<div>
								<Label for="brand">Марка *</Label>
								<Input
									id="brand"
									type="text"
									bind:value={brand}
									placeholder="напр. Zara"
									class="mt-1"
								/>
							</div>
							
							<div>
								<Label for="size">Размер *</Label>
								<select
									id="size"
									bind:value={size}
									class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
								>
									<option value="">Изберете</option>
									{#each sizes.clothing as s}
										<option value={s}>{s}</option>
									{/each}
								</select>
							</div>
						</div>
						
						<div>
							<Label>Състояние *</Label>
							<div class="mt-2 space-y-2">
								{#each conditions as cond}
									<label class="flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all {
										condition === cond.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
									}">
										<input
											type="radio"
											bind:group={condition}
											value={cond.id}
											class="mt-1"
										/>
										<div class="flex-1">
											<div class="font-medium text-sm">{cond.name}</div>
											<div class="text-xs text-gray-600">{cond.description}</div>
										</div>
									</label>
								{/each}
							</div>
						</div>
						
						<div class="grid grid-cols-2 gap-4">
							<div>
								<Label for="color">Цвят</Label>
								<Input
									id="color"
									type="text"
									bind:value={color}
									placeholder="напр. Червен"
									class="mt-1"
								/>
							</div>
							
							<div>
								<Label for="material">Материал</Label>
								<Input
									id="material"
									type="text"
									bind:value={material}
									placeholder="напр. Памук"
									class="mt-1"
								/>
							</div>
						</div>
					</div>
				{/if}
				
				<!-- Step 4: Description -->
				{#if currentStep === 4}
					<div class="space-y-4">
						<div>
							<h3 class="text-lg font-semibold mb-4">Описание</h3>
						</div>
						
						<div>
							<Label for="description">
								Опишете продукта * 
								<span class="text-gray-500 font-normal">({description.length}/500)</span>
							</Label>
							<Textarea
								id="description"
								bind:value={description}
								placeholder="Опишете продукта - защо го продавате, има ли дефекти, как се поддържа..."
								maxlength="500"
								rows="6"
								class="mt-1"
							/>
						</div>
						
						<Card class="bg-blue-50 border-blue-200">
							<CardContent class="p-4">
								<div class="flex gap-2">
									<Info class="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
									<div class="text-sm">
										<p class="font-semibold text-blue-900 mb-1">Съвети за добро описание:</p>
										<ul class="space-y-1 text-blue-800">
											<li>• Споменете точните размери в сантиметри</li>
											<li>• Опишете състоянието честно</li>
											<li>• Посочете причината за продажба</li>
											<li>• Споменете дали идва от дом без домашни любимци/пушачи</li>
										</ul>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				{/if}
				
				<!-- Step 5: Price & Shipping -->
				{#if currentStep === 5}
					<div class="space-y-6">
						<div>
							<h3 class="text-lg font-semibold mb-4">Цена и доставка</h3>
						</div>
						
						<div class="grid grid-cols-2 gap-4">
							<div>
								<Label for="price">Цена *</Label>
								<div class="relative mt-1">
									<Input
										id="price"
										type="number"
										bind:value={price}
										placeholder="0"
										min="1"
										step="0.01"
										class="pr-10"
									/>
									<span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">лв</span>
								</div>
							</div>
							
							<div>
								<Label for="originalPrice">Оригинална цена</Label>
								<div class="relative mt-1">
									<Input
										id="originalPrice"
										type="number"
										bind:value={originalPrice}
										placeholder="0"
										min="1"
										step="0.01"
										class="pr-10"
									/>
									<span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">лв</span>
								</div>
							</div>
						</div>
						
						{#if originalPrice && price}
							{@const discount = Math.round(((parseFloat(originalPrice) - parseFloat(price)) / parseFloat(originalPrice)) * 100)}
							<Card class="bg-green-50 border-green-200">
								<CardContent class="p-3">
									<span class="text-sm">Вашата отстъпка: <strong class="text-green-700">{discount}%</strong></span>
								</CardContent>
							</Card>
						{/if}
						
						<div>
							<Label>Доставка</Label>
							<div class="mt-2 space-y-2">
								<label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all {
									shippingType === 'buyer_pays' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
								}">
									<input
										type="radio"
										bind:group={shippingType}
										value="buyer_pays"
									/>
									<div class="flex-1">
										<div class="font-medium text-sm">Купувачът плаща доставката</div>
										<div class="text-xs text-gray-600">Стандартна доставка {shippingCost} лв</div>
									</div>
								</label>
								
								<label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all {
									shippingType === 'free' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
								}">
									<input
										type="radio"
										bind:group={shippingType}
										value="free"
									/>
									<div class="flex-1">
										<div class="font-medium text-sm">Безплатна доставка</div>
										<div class="text-xs text-gray-600">Вие покривате разходите</div>
									</div>
								</label>
								
								<label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all {
									shippingType === 'meet' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
								}">
									<input
										type="radio"
										bind:group={shippingType}
										value="meet"
									/>
									<div class="flex-1">
										<div class="font-medium text-sm">Само лична среща</div>
										<div class="text-xs text-gray-600">В {location}</div>
									</div>
								</label>
							</div>
						</div>
						
						<div>
							<Label for="location">Локация</Label>
							<Input
								id="location"
								type="text"
								bind:value={location}
								placeholder="напр. София, Център"
								class="mt-1"
							/>
						</div>
					</div>
				{/if}
			</div>
			
			<!-- Navigation Footer -->
			<div class="border-t px-4 py-3 flex justify-between items-center bg-gray-50 md:rounded-b-lg">
				<Button
					variant="outline"
					onclick={() => currentStep > 1 ? currentStep-- : goto('/')}
					class="gap-2"
				>
					<ChevronLeft class="w-4 h-4" />
					{currentStep === 1 ? 'Отказ' : 'Назад'}
				</Button>
				
				{#if currentStep < 5}
					<Button
						onclick={() => currentStep++}
						disabled={!canProceed(currentStep)}
						class="gap-2"
					>
						Напред
						<ChevronRight class="w-4 h-4" />
					</Button>
				{:else}
					<Button
						onclick={submitListing}
						disabled={!canProceed(5) || isSubmitting}
					>
						{#if isSubmitting}
							Публикуване...
						{:else}
							Публикувай
						{/if}
					</Button>
				{/if}
			</div>
		</div>
		
		<!-- Save Draft Button - Mobile Fixed -->
		<div class="fixed bottom-4 left-4 md:hidden">
			<Button variant="outline" size="sm" class="shadow-lg">
				Запази чернова
			</Button>
	</div>
</div>