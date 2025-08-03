<script lang="ts">
	import { MessageCircle, Heart, Share2, ShoppingBag, Eye, Phone } from '@lucide/svelte';
	
	type ActionType = 'message' | 'favorite' | 'share' | 'buy' | 'view' | 'call';
	
	interface QuickAction {
		type: ActionType;
		label: string;
		onclick?: () => void;
		variant?: 'primary' | 'secondary';
		disabled?: boolean;
	}
	
	let { 
		actions = [] as QuickAction[],
		orientation = 'horizontal' as 'horizontal' | 'vertical',
		size = 'default' as 'small' | 'default' | 'large'
	}: {
		actions?: QuickAction[];
		orientation?: 'horizontal' | 'vertical';
		size?: 'small' | 'default' | 'large';
	} = $props();
	
	const iconMap = {
		message: MessageCircle,
		favorite: Heart,
		share: Share2,
		buy: ShoppingBag,
		view: Eye,
		call: Phone
	};
	
	const sizeClasses = {
		small: 'px-2 py-1 text-xs gap-1',
		default: 'px-3 py-2 text-sm gap-1.5',
		large: 'px-4 py-3 text-base gap-2'
	};
	
	const iconSizes = {
		small: 'w-3 h-3',
		default: 'w-4 h-4',
		large: 'w-5 h-5'
	};
</script>

<div class="flex {orientation === 'vertical' ? 'flex-col' : 'flex-row'} gap-2">
	{#each actions as action}
		{@const Icon = iconMap[action.type]}
		<button
			onclick={action.onclick}
			disabled={action.disabled}
			class="
				inline-flex items-center justify-center
				{sizeClasses[size]}
				font-medium rounded-lg
				transition-all duration-[0ms]
				active:scale-95
				disabled:opacity-50 disabled:cursor-not-allowed
				{action.variant === 'primary' 
					? 'bg-brand text-white hover:bg-brand/90' 
					: 'bg-gray-50 text-gray-900 border border-gray-200 hover:bg-gray-100'}
			"
			aria-label={action.label}
		>
			<Icon class={iconSizes[size]} />
			<span>{action.label}</span>
		</button>
	{/each}
</div>

<!-- Pre-built Bulgarian quick responses for chat -->
{#snippet bulgarianQuickResponses()}
	<div class="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2 bg-gray-50 rounded-lg">
		<button class="quick-action text-left">
			Още ли е налично?
		</button>
		<button class="quick-action text-left">
			Възможна ли е доставка?
		</button>
		<button class="quick-action text-left">
			Последна цена?
		</button>
		<button class="quick-action text-left">
			Може ли размяна?
		</button>
		<button class="quick-action text-left">
			Откъде се взима?
		</button>
		<button class="quick-action text-left">
			Има ли дефекти?
		</button>
	</div>
{/snippet}

<!-- Mobile-optimized floating action button -->
{#snippet floatingActionButton(action: QuickAction)}
	{@const Icon = iconMap[action.type]}
	<button
		onclick={action.onclick}
		class="
			thumb-zone
			w-14 h-14 
			bg-brand text-white 
			rounded-full shadow-lg
			flex items-center justify-center
			active:scale-95 transition-transform duration-[0ms]
			z-50
		"
		aria-label={action.label}
	>
		<Icon class="w-6 h-6" />
	</button>
{/snippet}