<script lang="ts">
	import type { Snippet } from 'svelte';
	
	interface Props {
		children?: Snippet;
		class?: string;
		side?: 'left' | 'right' | 'top' | 'bottom';
	}
	
	let {  }: Props = $props();
</script>