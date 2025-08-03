<script lang="ts">
	import type { PageData } from './$types';
	import Button from '$lib/components/ui/button.svelte';
	import { User, Mail, Calendar, MapPin, Edit2, Settings, LogOut } from '@lucide/svelte';

	let { data }: { data: PageData } = $props();

	const user = data.user;
</script>

<svelte:head>
	<title>Профил - Driplo.bg</title>
	<meta name="description" content="Вашият профил в Driplo.bg" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-4xl mx-auto px-4 py-8">
		<!-- Header -->
		<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-4">
					<div class="w-16 h-16 bg-brand rounded-full flex items-center justify-center">
						<User class="w-8 h-8 text-white" />
					</div>
					<div>
						<h1 class="text-2xl font-bold text-gray-900">
							{user?.user_metadata?.full_name || user?.email}
						</h1>
						<p class="text-gray-600">
							@{user?.user_metadata?.username || 'потребител'}
						</p>
						<div class="flex items-center gap-1 mt-1">
							<Mail class="w-4 h-4 text-gray-400" />
							<span class="text-sm text-gray-500">{user?.email}</span>
						</div>
					</div>
				</div>
				<div class="flex gap-2">
					<Button variant="outline" size="sm">
						<Edit2 class="w-4 h-4 mr-2" />
						Редактиране
					</Button>
					<Button variant="outline" size="sm">
						<Settings class="w-4 h-4 mr-2" />
						Настройки
					</Button>
				</div>
			</div>
		</div>

		<!-- Profile Details -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<!-- Basic Info -->
			<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Основна информация</h2>
				<div class="space-y-4">
					<div>
						<span class="block text-sm font-medium text-gray-700">Тип профил</span>
						<p class="mt-1 text-sm text-gray-900 capitalize">
							{user?.user_metadata?.account_type === 'brand' ? 'Бизнес' : 'Личен'}
						</p>
					</div>
					<div>
						<span class="block text-sm font-medium text-gray-700">Дата на регистрация</span>
						<div class="flex items-center gap-1 mt-1">
							<Calendar class="w-4 h-4 text-gray-400" />
							<span class="text-sm text-gray-900">
								{new Date(user?.created_at).toLocaleDateString('bg-BG')}
							</span>
						</div>
					</div>
					<div>
						<span class="block text-sm font-medium text-gray-700">Последно активен</span>
						<p class="mt-1 text-sm text-gray-900">
							{user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('bg-BG') : 'Никога'}
						</p>
					</div>
				</div>
			</div>

			<!-- Account Status -->
			<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Статус на профила</h2>
				<div class="space-y-4">
					<div class="flex items-center justify-between">
						<span class="text-sm font-medium text-gray-700">Имейл потвърден</span>
						<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {user?.email_confirmed_at ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
							{user?.email_confirmed_at ? 'Потвърден' : 'Не е потвърден'}
						</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-sm font-medium text-gray-700">Двуфакторна автентификация</span>
						<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
							Неактивна
						</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Actions -->
		<div class="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
			<h2 class="text-lg font-semibold text-gray-900 mb-4">Действия</h2>
			<div class="flex flex-wrap gap-3">
				<Button variant="outline">
					<Edit2 class="w-4 h-4 mr-2" />
					Редактиране на профила
				</Button>
				<Button variant="outline">
					<Settings class="w-4 h-4 mr-2" />
					Настройки на профила
				</Button>
				<form method="post" action="/auth/logout" class="inline">
					<Button variant="destructive" type="submit">
						<LogOut class="w-4 h-4 mr-2" />
						Излизане
					</Button>
				</form>
			</div>
		</div>
	</div>
</div>