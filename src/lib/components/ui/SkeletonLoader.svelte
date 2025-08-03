<script lang="ts">
	type SkeletonType = 'product-card' | 'product-list' | 'text' | 'avatar' | 'button' | 'custom';
	
	let { 
		type = 'text',
		count = 1,
		class: className = '',
		width = '100%',
		height = 'auto'
	}: {
		type?: SkeletonType;
		count?: number;
		class?: string;
		width?: string;
		height?: string;
	} = $props();
</script>

{#if type === 'product-card'}
	<!-- Product Card Skeleton - matches actual product card dimensions -->
	{#each Array(count) as _}
		<div class="bg-white rounded-lg overflow-hidden border border-gray-200 {className}">
			<!-- Image skeleton - 4:3 aspect ratio -->
			<div class="skeleton aspect-[4/3]"></div>
			
			<!-- Content skeleton -->
			<div class="p-3 space-y-2">
				<!-- Price -->
				<div class="skeleton-text w-20 h-6"></div>
				
				<!-- Size/Brand -->
				<div class="skeleton-text w-32 h-4"></div>
				
				<!-- Title -->
				<div class="skeleton-text w-full h-4"></div>
				
				<!-- Location/Time -->
				<div class="flex gap-2">
					<div class="skeleton-text w-16 h-3"></div>
					<div class="skeleton-text w-16 h-3"></div>
				</div>
			</div>
		</div>
	{/each}
	
{:else if type === 'product-list'}
	<!-- Product List Skeleton - horizontal layout -->
	{#each Array(count) as _}
		<div class="flex gap-3 p-3 bg-white rounded-lg border border-gray-200 {className}">
			<!-- Thumbnail -->
			<div class="skeleton w-20 h-20 rounded-lg flex-shrink-0"></div>
			
			<!-- Content -->
			<div class="flex-1 space-y-2">
				<div class="skeleton-text w-24 h-5"></div>
				<div class="skeleton-text w-full h-4"></div>
				<div class="skeleton-text w-32 h-3"></div>
			</div>
		</div>
	{/each}
	
{:else if type === 'avatar'}
	<!-- Avatar Skeleton -->
	<div class="skeleton rounded-full {className}" style="width: {width}; height: {height || width}"></div>
	
{:else if type === 'button'}
	<!-- Button Skeleton -->
	<div class="skeleton rounded-lg px-4 py-2 {className}" style="width: {width}; height: {height || '36px'}"></div>
	
{:else if type === 'text'}
	<!-- Text Line Skeleton -->
	{#each Array(count) as _, i}
		<div 
			class="skeleton-text {className}" 
			style="width: {i === count - 1 ? '80%' : width}; height: {height || '1em'}"
		></div>
	{/each}
	
{:else if type === 'custom'}
	<!-- Custom Skeleton -->
	<div class="skeleton {className}" style="width: {width}; height: {height}"></div>
{/if}