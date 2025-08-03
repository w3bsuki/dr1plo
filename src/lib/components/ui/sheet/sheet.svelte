<script lang="ts">
	import { Dialog as SheetPrimitive } from 'bits-ui';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		portal?: HTMLElement | string | null;
		forceMount?: boolean;
		openFocus?: HTMLElement | string | null;
		closeFocus?: HTMLElement | string | null;
		preventScroll?: boolean;
		[key: string]: any;
	}

	let {
		children,
		open = $bindable(),
		onOpenChange,
		portal,
		forceMount = false,
		openFocus,
		closeFocus,
		preventScroll = true,
		...restProps
	}: Props = $props();
</script>

<SheetPrimitive.Root
	bind:open
	{onOpenChange}
	{...restProps}
>
	{@render children()}
</SheetPrimitive.Root>