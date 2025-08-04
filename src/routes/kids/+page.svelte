<script lang="ts">
	import { ProductGrid } from '$lib/components/marketplace';
	
	// Mock data for kids' products
	const products = [
		{
			id: '1',
			title: 'Детска рокличка с цветя',
			price: 25,
			originalPrice: 45,
			brand: 'H&M Kids',
			condition: 'Like New',
			size: '110 (4-5г)',
			images: [
				'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400&h=500&fit=crop',
			],
			rating: 4.7,
			reviewCount: 9,
			isFavorite: false,
			isNew: true,
			seller: {
				name: 'kids_fashion',
				avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
				rating: 4.8
			}
		},
		{
			id: '2',
			title: 'Adidas детски маратонки',
			price: 42,
			brand: 'Adidas',
			condition: 'Very Good',
			size: '28',
			images: [
				'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=500&fit=crop',
			],
			rating: 4.6,
			reviewCount: 6,
			isFavorite: false,
			isNew: false,
			seller: {
				name: 'family_closet',
				avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
				rating: 4.9
			}
		}
	];
</script>

<svelte:head>
	<title>Детски дрехи - Driplo.bg</title>
</svelte:head>

<!-- Clean kids' page matching reference design -->
<div class="min-h-screen bg-gray-50">
	<div class="pt-4">
		<ProductGrid 
			products={products}
			title=""
			showFilters={true}
			showSorting={true}
			gridCols="auto"
		/>
	</div>
</div>