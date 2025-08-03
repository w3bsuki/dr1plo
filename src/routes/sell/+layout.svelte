<script lang="ts">
	import type { LayoutData } from './$types';
	import { goto } from '$app/navigation';
	import { X } from '@lucide/svelte';
	
	let { children, data }: { children: any; data: LayoutData } = $props();
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Minimal header with just branding and close button -->
	<header class="sticky top-0 z-50 bg-white border-b">
		<div class="flex items-center justify-between px-4 h-14">
			<!-- Logo -->
			<div class="flex items-center gap-2">
				<div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
					D
				</div>
				<span class="font-semibold text-lg">Продай</span>
			</div>
			
			<!-- Close button -->
			<button
				onclick={() => goto('/')}
				class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
				aria-label="Затвори"
			>
				<X class="w-5 h-5" />
			</button>
		</div>
	</header>
	
	<!-- Main content without padding on mobile -->
	<main class="flex-1">
		{@render children?.()}
	</main>
</div>