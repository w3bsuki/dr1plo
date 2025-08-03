<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	interface Props {
		rating?: number;
		maxRating?: number;
		size?: 'sm' | 'md' | 'lg';
		readonly?: boolean;
		showValue?: boolean;
	}

	let {
		rating = 0,
		maxRating = 5,
		size = 'md',
		readonly = false,
		showValue = false
	}: Props = $props();

	const dispatch = createEventDispatcher();

	const sizeClasses = {
		sm: 'w-4 h-4',
		md: 'w-5 h-5',
		lg: 'w-6 h-6'
	}
	function handleStarClick(starValue: number) {
		if (readonly) return;
		dispatch('rating-change', starValue);
	}
</script>

<div class="flex items-center gap-1">
	{#each Array(maxRating) as _, starIndex}
		{@const starValue = starIndex + 1}
		{@const isFilled = starValue <= rating}
		<button
			type="button"
			class="text-yellow-400 {sizeClasses[size]} {readonly ? 'cursor-default' : 'cursor-pointer'} hover:scale-110 transition-transform"
			onclick={() => handleStarClick(starValue)}
			disabled={readonly}
		>
			<svg
				fill={isFilled ? 'currentColor' : 'none'}
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
				/>
			</svg>
		</button>
	{/each}
	{#if showValue}
		<span class="ml-2 text-sm text-gray-600">{rating}/{maxRating}</span>
	{/if}
</div>