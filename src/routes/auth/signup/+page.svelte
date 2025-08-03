<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button.svelte';
	import { Eye, EyeOff, Mail, Lock, User, Building2 } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let accountType = $state<'personal' | 'brand'>('personal');
	let showPassword = $state(false);
	let showConfirmPassword = $state(false);
	let isLoading = $state(false);

	// Validate passwords match
	const password = $state('');
	const confirmPassword = $state('');
	const passwordsMatch = $derived(password && confirmPassword && password === confirmPassword);
	const passwordError = $derived(confirmPassword && !passwordsMatch ? 'Паролите не съвпадат' : '');

	function generateUsername() {
		const fullName = (document.querySelector('input[name="fullName"]') as HTMLInputElement)?.value;
		const usernameInput = document.querySelector('input[name="username"]') as HTMLInputElement;
		if (fullName && usernameInput) {
			const parts = fullName.toLowerCase().split(' ');
			const base = parts.join('');
			const random = Math.floor(Math.random() * 999);
			usernameInput.value = `${base}${random}`;
		}
	}

	onMount(() => {
		// Auto-focus email field
		const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
		emailInput?.focus();
	});
</script>

<svelte:head>
	<title>Регистрация - Driplo.bg</title>
	<meta name="description" content="Създайте профил в Driplo.bg" />
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
			Създайте профил
		</h2>
		
		<p class="mt-2 text-center text-sm text-gray-600">
			Или
			<a 
				href="/auth/login{$page.url.searchParams.get('redirectTo') ? `?redirectTo=${$page.url.searchParams.get('redirectTo')}` : ''}" 
				class="font-medium text-brand hover:text-brand/80 transition-colors"
			>
				влезте в съществуващ профил
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
				<!-- Account Type -->
				<fieldset>
					<legend class="block text-sm font-medium text-gray-700 mb-3">
						Тип профил
					</legend>
					<div class="grid grid-cols-2 gap-3">
						<button
							type="button"
							onclick={() => accountType = 'personal'}
							class="flex items-center justify-center px-4 py-3 border-2 rounded-lg text-sm font-medium transition-all {accountType === 'personal' ? 'border-brand bg-brand/5 text-brand' : 'border-gray-200 text-gray-700 hover:border-gray-300'}"
						>
							<User class="w-4 h-4 mr-2" />
							Личен
						</button>
						<button
							type="button"
							onclick={() => accountType = 'brand'}
							class="flex items-center justify-center px-4 py-3 border-2 rounded-lg text-sm font-medium transition-all {accountType === 'brand' ? 'border-brand bg-brand/5 text-brand' : 'border-gray-200 text-gray-700 hover:border-gray-300'}"
						>
							<Building2 class="w-4 h-4 mr-2" />
							Бизнес
						</button>
					</div>
				</fieldset>

				<!-- Full Name -->
				<div>
					<label for="fullName" class="block text-sm font-medium text-gray-700">
						{accountType === 'brand' ? 'Име на марката/бизнеса' : 'Пълно име'}
					</label>
					<div class="mt-1 relative">
						<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							{#if accountType === 'brand'}
								<Building2 class="h-5 w-5 text-gray-400" />
							{:else}
								<User class="h-5 w-5 text-gray-400" />
							{/if}
						</div>
						<input
							id="fullName"
							name="fullName"
							type="text"
							required
							value={form?.fullName ?? ''}
							onblur={generateUsername}
							disabled={isLoading}
							class="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-brand focus:border-brand text-sm disabled:opacity-50 disabled:cursor-not-allowed"
							placeholder={accountType === 'brand' ? 'Име на марката' : 'Вашето име'}
						/>
					</div>
				</div>

				<!-- Username -->
				<div>
					<label for="username" class="block text-sm font-medium text-gray-700">
						Потребителско име
					</label>
					<div class="mt-1 relative">
						<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<span class="text-gray-400 text-sm">@</span>
						</div>
						<input
							id="username"
							name="username"
							type="text"
							required
							value={form?.username ?? ''}
							disabled={isLoading}
							class="appearance-none block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-brand focus:border-brand text-sm disabled:opacity-50 disabled:cursor-not-allowed"
							placeholder="username123"
						/>
					</div>
					<p class="mt-1 text-xs text-gray-500">
						Ще се показва в профила ви (може да се промени)
					</p>
				</div>

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
							autocomplete="new-password"
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
					<p class="mt-1 text-xs text-gray-500">
						Поне 6 символа
					</p>
				</div>

				<!-- Confirm Password -->
				<div>
					<label for="confirmPassword" class="block text-sm font-medium text-gray-700">
						Потвърдете паролата
					</label>
					<div class="mt-1 relative">
						<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Lock class="h-5 w-5 text-gray-400" />
						</div>
						<input
							id="confirmPassword"
							name="confirmPassword"
							type={showConfirmPassword ? 'text' : 'password'}
							autocomplete="new-password"
							required
							disabled={isLoading}
							class="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-brand focus:border-brand text-sm disabled:opacity-50 disabled:cursor-not-allowed"
							placeholder="••••••••"
						/>
						<button
							type="button"
							class="absolute inset-y-0 right-0 pr-3 flex items-center"
							onclick={() => showConfirmPassword = !showConfirmPassword}
							disabled={isLoading}
						>
							{#if showConfirmPassword}
								<EyeOff class="h-5 w-5 text-gray-400 hover:text-gray-600" />
							{:else}
								<Eye class="h-5 w-5 text-gray-400 hover:text-gray-600" />
							{/if}
						</button>
					</div>
					{#if passwordError}
						<p class="mt-1 text-xs text-red-600">
							{passwordError}
						</p>
					{/if}
				</div>

				<!-- Terms -->
				<div class="flex items-start">
					<div class="flex items-center h-5">
						<input
							id="terms"
							name="terms"
							type="checkbox"
							required
							class="h-4 w-4 text-brand focus:ring-brand border-gray-300 rounded"
							disabled={isLoading}
						/>
					</div>
					<div class="ml-3 text-sm">
						<label for="terms" class="text-gray-700">
							Съгласявам се с
							<a href="/terms" class="font-medium text-brand hover:text-brand/80" target="_blank">
								Условията за ползване
							</a>
							и
							<a href="/privacy" class="font-medium text-brand hover:text-brand/80" target="_blank">
								Политиката за поверителност
							</a>
						</label>
					</div>
				</div>

				<!-- Hidden field for account type -->
				<input type="hidden" name="accountType" value={accountType} />

				<!-- Error message -->
				{#if form?.error}
					<div class="rounded-md bg-red-50 p-4">
						<div class="text-sm text-red-700">
							{form.error}
						</div>
					</div>
				{/if}

				<!-- Success message -->
				{#if form?.success}
					<div class="rounded-md bg-green-50 p-4">
						<div class="text-sm text-green-700">
							{form.message}
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
							Създаване...
						{:else}
							Създайте профил
						{/if}
					</Button>
				</div>
			</form>
		</div>
	</div>
</div>