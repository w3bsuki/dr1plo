<script lang="ts">
	import { type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cva, type VariantProps } from 'class-variance-authority';
	import { cn } from '$lib/utils/index.js';

	const badgeVariants = cva(
		'inline-flex items-center justify-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
		{
			variants: {
				variant: {
					default: 'border-transparent bg-black text-white shadow hover:bg-gray-800',
					secondary: 'border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200',
					destructive: 'border-transparent bg-red-500 text-white shadow hover:bg-red-600',
					outline: 'border-gray-200 text-gray-900',
					success: 'border-transparent bg-green-500 text-white shadow hover:bg-green-600',
					warning: 'border-transparent bg-yellow-500 text-black shadow hover:bg-yellow-600',
				}
			},
			defaultVariants: {
				variant: 'default'
			}
		}
	);

	type BadgeVariantProps = VariantProps<typeof badgeVariants>;

	interface BadgeProps extends BadgeVariantProps, HTMLAttributes<HTMLSpanElement> {
		class?: string;
		children: Snippet;
	}

	let {
		class: className = '',
		variant = 'default',
		children,
		...restProps
	}: BadgeProps = $props();
</script>

<span
	class={cn(badgeVariants({ variant, className }))}
	{...restProps}
>
	{@render children()}
</span>