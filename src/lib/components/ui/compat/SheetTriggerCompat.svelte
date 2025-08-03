<script lang="ts">
	import type { Snippet } from 'svelte';
	
	interface Props {
		onclick?: () => void;
		children?: Snippet;
		asChild?: boolean;
		class?: string;
	}
	
	let {  }: Props = $props();
</script>