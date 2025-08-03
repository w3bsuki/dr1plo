<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		children: Snippet;
		onclick?: () => void;
		hoverable?: boolean;
	}

	let { 
		class: className, 
		children, 
		onclick,
		hoverable = false 
	}: Props = $props();
</script>

{#if onclick}
<li role="presentation">
	<button
		type="button"
		class={cn(
			'w-full text-left rounded-md border border-gray-200 bg-white p-4',
			hoverable && 'transition-colors hover:bg-gray-50',
			'cursor-pointer',
			className
		)}
		{onclick}
	>
		{@render children()}
	</button>
</li>
{:else}
<li
	class={cn(
		'rounded-md border border-gray-200 bg-white p-4',
		hoverable && 'transition-colors hover:bg-gray-50',
		className
	)}
>
	{@render children()}
</li>
{/if}