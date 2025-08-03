<script lang="ts">
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import { createBrowserClient, isBrowser } from '@supabase/ssr';
	import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
	import type { LayoutData } from './$types';
	import type { Database } from '$lib/types/db';
	import { setAuthContext } from '$lib/stores/auth.svelte';

	let { children, data }: { children: any; data: LayoutData } = $props();

	// Set up auth context for the entire app
	const authContext = setAuthContext(data.user, data.session);

	// Update auth context when data changes (reactive)
	$effect(() => {
		authContext.setAuth(data.session, data.user);
	});

	// Create browser client for client-side operations
	const supabase = isBrowser() ? createBrowserClient<Database>(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_ANON_KEY
	) : null;

	onMount(() => {
		if (!supabase) return;

		const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
			if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
				// Invalidate the layout data to refresh server-side session
				invalidate('supabase:auth');
			}
		});

		return () => authListener.subscription.unsubscribe();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
</svelte:head>

<div class="min-h-screen flex flex-col">
	<!-- Unified Responsive Header -->
	<Header />
	
	<!-- Main Content -->
	<main class="flex-1 pb-16 md:pb-0">
		{@render children?.()}
	</main>
	
	<!-- Footer - Desktop Only -->
	<div class="hidden md:block">
		<Footer />
	</div>
</div>
