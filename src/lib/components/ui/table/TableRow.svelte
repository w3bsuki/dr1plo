<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		children: Snippet;
		onclick?: () => void;
	}

	let { class: className, children, onclick }: Props = $props();
</script>

<tr
	class={cn(
		'border-b transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-100',
		className
	)}
	{onclick}
>
	{@render children()}
</tr>