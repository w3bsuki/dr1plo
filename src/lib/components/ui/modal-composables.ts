/**
 * Modal Composables - Extracted logic to prevent Modal.svelte from becoming a God Component
 * 
 * Architecture:
 * - Separates type-specific logic (dialog, alert, sheet) into focused functions
 * - Handles positioning, styling, and behavior logic separately
 * - Maintains single Modal interface while organizing complex logic
 */
import type { ComponentType, SvelteComponent } from 'svelte';
import { cn } from '$lib/utils';

// Size configuration (shared across all modal types)
export const MODAL_SIZES = {
	sm: 'max-w-sm',
	md: 'max-w-md',
	lg: 'max-w-lg',
	xl: 'max-w-xl',
	full: 'max-w-none w-full h-full'
} as const;

// Position configuration (primarily for sheets)
export const MODAL_POSITIONS = {
	center: 'left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]',
	top: 'top-0 left-0 right-0',
	bottom: 'bottom-0 left-0 right-0',
	left: 'left-0 top-0 bottom-0 w-80 max-w-sm h-full',
	right: 'right-0 top-0 bottom-0 w-80 max-w-sm h-full'
} as const;
export type ModalType = 'dialog' | 'alert' | 'sheet';
export type ModalSize = keyof typeof MODAL_SIZES;
export type ModalPosition = keyof typeof MODAL_POSITIONS;

// Base modal configuration interface
interface BaseModalConfig {
	getContentClasses: (contentClass: string, className: string) => string;
	getBackdropClasses: (backdropClass: string) => string;
	role: string;
	shouldShowHeaderCloseButton: boolean;
}

// Extended interfaces for specific modal types
interface AlertModalConfig extends BaseModalConfig {
	getHeaderClasses: () => string;
	getContentAreaClasses: () => string;
	getFooterClasses: () => string;
}

interface SheetModalConfig extends BaseModalConfig {
	shouldShowSheetCloseButton: boolean;
}

export type ModalConfig = BaseModalConfig | AlertModalConfig | SheetModalConfig;

/**
 * Dialog-specific styling and behavior
 */
export function useDialogModal(size: ModalSize = 'md'): BaseModalConfig {
	const getContentClasses = (contentClass: string, className: string) => {
		const baseClasses = 'relative bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700';
		return cn(
			baseClasses,
			'rounded-lg p-6',
			MODAL_SIZES[size] + ' w-full',
			contentClass,
			className
		);
	}
	const getBackdropClasses = (backdropClass: string) => {
		return cn(
			'fixed inset-0 bg-black/50 backdrop-blur-sm',
			backdropClass
		);
	}
	return {
		getContentClasses,
		getBackdropClasses,
		role: 'dialog',
		shouldShowHeaderCloseButton: true
	}
}

/**
 * Alert dialog-specific styling and behavior
 */
export function useAlertModal(size: ModalSize = 'md'): AlertModalConfig {
	const getContentClasses = (contentClass: string, className: string) => {
		const baseClasses = 'relative bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700';
		return cn(
			baseClasses,
			'rounded-lg p-6',
			MODAL_SIZES[size] + ' w-full',
			contentClass,
			className
		);
	}
	const getBackdropClasses = (backdropClass: string) => {
		return cn(
			'fixed inset-0 bg-black/50 backdrop-blur-sm',
			backdropClass
		);
	}
	const getHeaderClasses = () => 'text-center sm:text-left';
	const getContentAreaClasses = () => 'text-center sm:text-left';
	const getFooterClasses = () => 'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0';

	return {
		getContentClasses,
		getBackdropClasses,
		getHeaderClasses,
		getContentAreaClasses,
		getFooterClasses,
		role: 'alertdialog',
		shouldShowHeaderCloseButton: true
	}
}

/**
 * Sheet-specific styling and behavior
 */
export function useSheetModal(position: ModalPosition = 'bottom'): SheetModalConfig {
	const getContentClasses = (contentClass: string, className: string) => {
		const baseClasses = 'relative bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700';
		
		if (position === 'left' || position === 'right') {
			return cn(baseClasses, 'h-full p-6', contentClass, className);
		} else {
			return cn(baseClasses, 'w-full max-h-[80vh] rounded-t-lg p-6', contentClass, className);
		}
	}
	const getBackdropClasses = (backdropClass: string) => {
		return cn(
			'fixed inset-0 bg-black/50',
			backdropClass
		);
	}
	return {
		getContentClasses,
		getBackdropClasses,
		role: 'dialog',
		shouldShowHeaderCloseButton: false, // Sheet has absolute positioned close button instead
		shouldShowSheetCloseButton: true
	}
}

/**
 * Lazy loading composable for modal components
 */
export function useLazyModal() {
	let Component: ComponentType<SvelteComponent> | null = null;
	let loading = false;
	let error: Error | null = null;

	async function loadComponent(loader: () => Promise<{ default: ComponentType<SvelteComponent> }>) {
		if (!loader || Component || loading) return;
		loading = true;
		error = null;
		
		try {
			const module = await loader();
			Component = module?.default;
		} catch (e) {
			error = e as Error;
			console?.error('Failed to load modal component:', e);
		} finally {
			loading = false;
		}
	}

	function preload(loader?: () => Promise<{ default: ComponentType<SvelteComponent> }>) {
		if (loader && !Component && !loading) {
			loadComponent(loader);
		}
	}

	return {
		Component: () => Component,
		loading: () => loading,
		error: () => error,
		loadComponent,
		preload
	}
}

/**
 * Modal behavior composable - handles common interactions
 */
export function useModalBehavior() {
	function createCloseHandler(
		onClose: () => void,
		onOpenChange?: (open: boolean) => void
	) {
		return function handleClose() {
			onClose();
			onOpenChange?.(false);
		}
	}

	function createBackdropClickHandler(
		closeOnBackdrop: boolean,
		handleClose: () => void
	) {
		return function handleBackdropClick(e: MouseEvent) {
			if (closeOnBackdrop && e?.target === e?.currentTarget) {
				handleClose();
			}
		}
	}

	function createKeydownHandler(
		closeOnEscape: boolean,
		handleClose: () => void
	) {
		return function handleKeydown(e: KeyboardEvent) {
			if (closeOnEscape && e?.key === 'Escape') {
				handleClose();
			}
		}
	}

	return {
		createCloseHandler,
		createBackdropClickHandler,
		createKeydownHandler
	}
}

/**
 * Body scroll lock composable
 */
export function useBodyScrollLock() {
	function lockScroll() {
		const originalOverflow = document?.body?.style?.overflow;
		if (document?.body?.style) {
			document.body.style.overflow = 'hidden';
		}
		
		// Return cleanup function
		return () => {
			if (document?.body?.style) {
				document.body.style.overflow = originalOverflow;
			}
		}
	}

	return { lockScroll }
}