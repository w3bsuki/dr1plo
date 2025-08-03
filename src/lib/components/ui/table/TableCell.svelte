<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		children: Snippet;
		colspan?: number;
	}

	let { class: className, children, colspan }: Props = $props();
</script>

<td
	class={cn('p-3 align-middle [&:has([role=checkbox])]:pr-0', className)}
	{colspan}
>
	{@render children()}
</td>