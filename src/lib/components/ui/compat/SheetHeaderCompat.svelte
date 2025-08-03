<script lang="ts">
	import type { Snippet } from 'svelte';
	
	interface Props {
		children?: Snippet;
		class?: string;
	}
	
	let {  }: Props = $props();
</script>