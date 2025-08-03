<script lang="ts">
	import type { PageData } from './$types';
	import Button from '$lib/components/ui/button.svelte';
	import { User, Plus, Package, TrendingUp, Heart } from '@lucide/svelte';

	let { data }: { data: PageData } = $props();

	const user = data.user;
</script>

<svelte:head>
	<title>Табло - Driplo.bg</title>
	<meta name="description" content="Вашето табло в Driplo.bg" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-7xl mx-auto px-4 py-8">
		<!-- Welcome Header -->
		<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-3xl font-bold text-gray-900">
						Добре дошли, {user?.user_metadata?.full_name || user?.email}!
					</h1>
					<p class="text-gray-600 mt-1">
						Управлявайте вашите обяви и профил от тук
					</p>
				</div>
				<div class="flex gap-3">
					<Button>
						<Plus class="w-4 h-4 mr-2" />
						Нова обява
					</Button>
					<Button variant="outline" onclick={() => window.location.href = '/profile'}>
						<User class="w-4 h-4 mr-2" />
						Профил
					</Button>
				</div>
			</div>
		</div>

		<!-- Stats Cards -->
		<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
			<div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
				<div class="flex items-center">
					<div class="p-2 bg-blue-100 rounded-lg">
						<Package class="w-6 h-6 text-blue-600" />
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600">Активни обяви</p>
						<p class="text-2xl font-bold text-gray-900">0</p>
					</div>
				</div>
			</div>

			<div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
				<div class="flex items-center">
					<div class="p-2 bg-green-100 rounded-lg">
						<TrendingUp class="w-6 h-6 text-green-600" />
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600">Продажби</p>
						<p class="text-2xl font-bold text-gray-900">0</p>
					</div>
				</div>
			</div>

			<div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
				<div class="flex items-center">
					<div class="p-2 bg-gray-100 rounded-lg">
						<Heart class="w-6 h-6 text-primary" />
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600">Харесвания</p>
						<p class="text-2xl font-bold text-gray-900">0</p>
					</div>
				</div>
			</div>

			<div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
				<div class="flex items-center">
					<div class="p-2 bg-yellow-100 rounded-lg">
						<Package class="w-6 h-6 text-yellow-600" />
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600">Общо обяви</p>
						<p class="text-2xl font-bold text-gray-900">0</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Quick Actions -->
		<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
			<h2 class="text-lg font-semibold text-gray-900 mb-4">Бързи действия</h2>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Button variant="outline" class="p-6 h-auto flex-col">
					<Plus class="w-8 h-8 mb-2 text-brand" />
					<span class="font-medium">Създаване на обява</span>
					<span class="text-sm text-gray-500 mt-1">Добавете нов продукт</span>
				</Button>

				<Button variant="outline" class="p-6 h-auto flex-col" onclick={() => window.location.href = '/profile'}>
					<User class="w-8 h-8 mb-2 text-brand" />
					<span class="font-medium">Редактиране на профил</span>
					<span class="text-sm text-gray-500 mt-1">Актуализирайте информацията</span>
				</Button>

				<Button variant="outline" class="p-6 h-auto flex-col">
					<Package class="w-8 h-8 mb-2 text-brand" />
					<span class="font-medium">Управление на обяви</span>
					<span class="text-sm text-gray-500 mt-1">Редактирайте продуктите си</span>
				</Button>
			</div>
		</div>
	</div>
</div>