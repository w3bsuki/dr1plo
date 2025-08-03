<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	interface Props {
		href?: string;
		isActive?: boolean;
		disabled?: boolean;
		class?: string;
		children: Snippet;
		onclick?: () => void;
		'aria-label'?: string;
	}

	let { href, isActive = false, disabled = false, class: className, children, onclick, 'aria-label': ariaLabel }: Props = $props();
</script>

{#if href}
	<a
		{href}
		class={cn(
			'flex h-8 w-8 items-center justify-center rounded-[var(--border-radius-md)] text-[var(--font-size-sm)] font-medium transition-colors duration-[var(--transition-duration-100)]',
			isActive
				? 'bg-[var(--color-brand-500)] text-[var(--color-white)]'
				: 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]',
			disabled && 'pointer-events-none opacity-50',
			className
		)}
		aria-current={isActive ? 'page' : undefined}
		aria-label={ariaLabel}
		tabindex={disabled ? -1 : undefined}
	>
		{@render children()}
	</a>
{:else}
	<button
		type="button"
		class={cn(
			'flex h-8 w-8 items-center justify-center rounded-[var(--border-radius-md)] text-[var(--font-size-sm)] font-medium transition-colors duration-[var(--transition-duration-100)]',
			isActive
				? 'bg-[var(--color-brand-500)] text-[var(--color-white)]'
				: 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]',
			disabled && 'pointer-events-none opacity-50',
			className
		)}
		aria-current={isActive ? 'page' : undefined}
		aria-label={ariaLabel}
		{disabled}
		{onclick}
	>
		{@render children()}
	</button>
{/if}