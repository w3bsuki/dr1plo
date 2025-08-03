<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button.svelte';
	import { Eye, EyeOff, Mail, Lock } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let showPassword = $state(false);
	let isLoading = $state(false);

	onMount(() => {
		// Auto-focus email field
		const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
		emailInput?.focus();
	});
</script>

<svelte:head>
	<title>Вход - Driplo.bg</title>
	<meta name="description" content="Влезте в своя профил в Driplo.bg" />
</svelte:head>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<!-- Logo -->
		<div class="flex justify-center">
			<a href="/" class="text-2xl font-bold text-brand">
				Driplo.bg
			</a>
		</div>
		
		<h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
			Влезте в профила си
		</h2>
		
		<p class="mt-2 text-center text-sm text-gray-600">
			Или
			<a 
				href="/auth/signup{$page.url.searchParams.get('redirectTo') ? `?redirectTo=${$page.url.searchParams.get('redirectTo')}` : ''}" 
				class="font-medium text-brand hover:text-brand/80 transition-colors"
			>
				създайте нов профил
			</a>
		</p>
	</div>

	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
		<div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
			<form method="post" use:enhance={() => {
				isLoading = true;
				return async ({ update }) => {
					isLoading = false;
					await update();
				};
			}} class="space-y-6">
				<!-- Email -->
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700">
						Имейл адрес
					</label>
					<div class="mt-1 relative">
						<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Mail class="h-5 w-5 text-gray-400" />
						</div>
						<input
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							required
							value={form?.email ?? ''}
							disabled={isLoading}
							class="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-brand focus:border-brand text-sm disabled:opacity-50 disabled:cursor-not-allowed"
							placeholder="вашият@имейл.бг"
						/>
					</div>
				</div>

				<!-- Password -->
				<div>
					<label for="password" class="block text-sm font-medium text-gray-700">
						Парола
					</label>
					<div class="mt-1 relative">
						<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Lock class="h-5 w-5 text-gray-400" />
						</div>
						<input
							id="password"
							name="password"
							type={showPassword ? 'text' : 'password'}
							autocomplete="current-password"
							required
							disabled={isLoading}
							class="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-brand focus:border-brand text-sm disabled:opacity-50 disabled:cursor-not-allowed"
							placeholder="••••••••"
						/>
						<button
							type="button"
							class="absolute inset-y-0 right-0 pr-3 flex items-center"
							onclick={() => showPassword = !showPassword}
							disabled={isLoading}
						>
							{#if showPassword}
								<EyeOff class="h-5 w-5 text-gray-400 hover:text-gray-600" />
							{:else}
								<Eye class="h-5 w-5 text-gray-400 hover:text-gray-600" />
							{/if}
						</button>
					</div>
				</div>

				<!-- Remember me & Forgot password -->
				<div class="flex items-center justify-between">
					<div class="flex items-center">
						<input
							id="remember-me"
							name="remember-me"
							type="checkbox"
							class="h-4 w-4 text-brand focus:ring-brand border-gray-300 rounded"
						/>
						<label for="remember-me" class="ml-2 block text-sm text-gray-900">
							Запомни ме
						</label>
					</div>

					<div class="text-sm">
						<a href="/auth/forgot-password" class="font-medium text-brand hover:text-brand/80 transition-colors">
							Забравена парола?
						</a>
					</div>
				</div>

				<!-- Error message -->
				{#if form?.error}
					<div class="rounded-md bg-red-50 p-4">
						<div class="text-sm text-red-700">
							{form.error}
						</div>
					</div>
				{/if}

				<!-- Submit button -->
				<div>
					<Button
						type="submit"
						disabled={isLoading}
						class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{#if isLoading}
							<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
							Влизане...
						{:else}
							Влезте
						{/if}
					</Button>
				</div>
			</form>

			<!-- Social login (future) -->
			<div class="mt-6">
				<div class="relative">
					<div class="absolute inset-0 flex items-center">
						<div class="w-full border-t border-gray-300"></div>
					</div>
					<div class="relative flex justify-center text-sm">
						<span class="px-2 bg-white text-gray-500">Или продължете с</span>
					</div>
				</div>

				<div class="mt-6 grid grid-cols-2 gap-3">
					<button
						type="button"
						disabled
						class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<span class="text-lg mr-2">🇬</span>
						Google
						<span class="text-xs ml-1">(скоро)</span>
					</button>

					<button
						type="button"
						disabled
						class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<span class="text-lg mr-2">📘</span>
						Facebook
						<span class="text-xs ml-1">(скоро)</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>