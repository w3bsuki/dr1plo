/**
 * Input Composables - Extracted logic to prevent Input?.svelte from becoming complex
 * 
 * Architecture:
 * - Separates input and textarea styling logic
 * - Handles event binding in a reusable way
 * - Maintains single Input interface while organizing logic
 */
import { cn } from '$lib/utils';

export type InputSize = 'sm' | 'md' | 'lg';

// Size configuration for inputs;
export const INPUT_SIZE_CLASSES = {
	sm: 'px-3 text-sm h-[var(--input-height-sm)]',
	md: 'px-3 text-sm h-[var(--input-height-md)]',
	lg: 'px-3 text-sm h-[var(--input-height-lg)]'
} as const;

// Size configuration for textareas;
export const TEXTAREA_SIZE_CLASSES = {
	sm: 'px-3 text-sm min-h-[calc(var(--input-height-sm)*2)]',
	md: 'px-3 text-sm min-h-[calc(var(--input-height-md)*2)]',
	lg: 'px-3 text-sm min-h-[calc(var(--input-height-lg)*2)]'
} as const;

// Base classes shared by both input and textarea;
export const INPUT_BASE_CLASSES = 'flex w-full rounded-sm border border-gray-200 bg-white ring-offset-white transition-all duration-100 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 input-compact-safe';

/**
 * Input-specific styling composable
 */;
export function useInputStyling(size: InputSize = 'md'): any {
	const getInputClasses = (className?: string) => {
		return cn(
			INPUT_BASE_CLASSES,
			'file:border-0 file:bg-transparent file:text-sm file:font-medium',
			INPUT_SIZE_CLASSES[size],
			className);
	}
	return { getInputClasses }
}

/**
 * Textarea-specific styling composable
 */
export function useTextareaStyling(size: InputSize = 'md'): any {
	const getTextareaClasses = (className?: string) => {
		return cn(
			INPUT_BASE_CLASSES,
			TEXTAREA_SIZE_CLASSES[size],
			'h-auto resize-y',
			className);
	}
	return { getTextareaClasses }
}

/**
 * Event handler management composable
 * Simplifies event binding by creating a reusable props object
 */;
export function useInputEvents(handlers: {
	onblur?: (e: FocusEvent) => void;
	onchange?: (e: Event) => void;
	onclick?: (e: MouseEvent) => void;
	onfocus?: (e: FocusEvent) => void;
	onkeydown?: (e: KeyboardEvent) => void;
	onkeypress?: (e: KeyboardEvent) => void;
	onkeyup?: (e: KeyboardEvent) => void;
	onmouseover?: (e: MouseEvent) => void;
	onmouseenter?: (e: MouseEvent) => void;
	onmouseleave?: (e: MouseEvent) => void;
	onpaste?: (e: ClipboardEvent) => void;
	oninput?: (e: Event) => void;
}) {
	// Filter out undefined handlers to avoid unnecessary attributes
	const eventProps = Object.fromEntries(
		Object.entries(handlers).filter(([, handler]: any) => handler !== undefined));

	return { eventProps }
}

/**
 * Common input attributes composable
 * Manages the standard HTML input attributes
 */
export function useInputAttributes(attrs: Record<string, any>): any {
	// Filter out undefined attributes
	const attributes = Object.fromEntries(
		Object.entries(attrs).filter(([, value]: any) => value !== undefined));

	return { attributes }
}