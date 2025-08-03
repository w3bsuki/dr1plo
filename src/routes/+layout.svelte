<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/layout/Header.svelte';
	import MobileHeader from '$lib/components/layout/MobileHeader.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
</svelte:head>

<div class="min-h-screen flex flex-col">
	<!-- Desktop Header -->
	<div class="hidden md:block">
		<Header />
	</div>
	
	<!-- Mobile Header (with built-in bottom nav) -->
	<MobileHeader />
	
	<!-- Main Content -->
	<main class="flex-1 pb-16 md:pb-0">
		{@render children?.()}
	</main>
	
	<!-- Footer - Desktop Only -->
	<div class="hidden md:block">
		<Footer />
	</div>
</div>
