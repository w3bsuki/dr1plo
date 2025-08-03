<script lang="ts">
	import { Check, Clock, Star, Shield, TrendingUp } from '@lucide/svelte';
	
	interface TrustSignals {
		verifiedSeller?: boolean;
		responseTime?: string;
		activeListings?: number;
		memberSince?: Date;
		lastSeen?: string;
		reviews?: { count: number; rating: number };
		completionRate?: number;
		isOnline?: boolean;
	}
	
	let { signals = {} as TrustSignals, compact = false }: { signals?: TrustSignals; compact?: boolean } = $props();
	
	// Format member since date
	const memberSinceText = $derived(() => {
		if (!signals.memberSince) return null;
		const year = new Date(signals.memberSince).getFullYear();
		return `Член от ${year}`;
	});
	
	// Calculate trust score
	const trustScore = $derived(() => {
		let score = 0;
		if (signals.verifiedSeller) score += 30;
		if (signals.responseTime && signals.responseTime.includes('час')) score += 20;
		if (signals.reviews && signals.reviews.rating >= 4) score += 25;
		if (signals.completionRate && signals.completionRate >= 90) score += 25;
		return score;
	});
</script>

{#if compact}
	<!-- Compact view for product cards -->
	<div class="flex items-center gap-2 text-xs">
		{#if signals.verifiedSeller}
			<span class="inline-flex items-center gap-0.5 text-success">
				<Shield class="w-3 h-3" />
				<span class="font-medium">Проверен</span>
			</span>
		{/if}
		
		{#if signals.responseTime}
			<span class="text-muted-foreground">
				{signals.responseTime}
			</span>
		{/if}
		
		{#if signals.isOnline}
			<span class="inline-flex items-center gap-1">
				<span class="w-2 h-2 bg-success rounded-full"></span>
				<span class="text-muted-foreground">Онлайн</span>
			</span>
		{/if}
	</div>
{:else}
	<!-- Full view for seller profiles -->
	<div class="space-y-3 p-4 bg-gray-50 rounded-lg">
		<!-- Trust Score Bar -->
		{#if trustScore() > 0}
			<div class="space-y-1">
				<div class="flex items-center justify-between text-sm">
					<span class="font-medium">Ниво на доверие</span>
					<span class="text-muted-foreground">{trustScore()}%</span>
				</div>
				<div class="h-2 bg-gray-200 rounded-full overflow-hidden">
					<div 
						class="h-full bg-success transition-all duration-500"
						style="width: {trustScore()}%"
					></div>
				</div>
			</div>
		{/if}
		
		<!-- Trust Badges -->
		<div class="grid grid-cols-2 gap-2">
			{#if signals.verifiedSeller}
				<div class="flex items-center gap-2 p-2 bg-white rounded-lg">
					<Shield class="w-4 h-4 text-success" />
					<div>
						<p class="text-xs font-medium">Проверен продавач</p>
						<p class="text-[10px] text-muted-foreground">Потвърдена самоличност</p>
					</div>
				</div>
			{/if}
			
			{#if signals.responseTime}
				<div class="flex items-center gap-2 p-2 bg-white rounded-lg">
					<Clock class="w-4 h-4 text-brand" />
					<div>
						<p class="text-xs font-medium">{signals.responseTime}</p>
						<p class="text-[10px] text-muted-foreground">Време за отговор</p>
					</div>
				</div>
			{/if}
			
			{#if signals.activeListings}
				<div class="flex items-center gap-2 p-2 bg-white rounded-lg">
					<TrendingUp class="w-4 h-4 text-blue-500" />
					<div>
						<p class="text-xs font-medium">{signals.activeListings} обяви</p>
						<p class="text-[10px] text-muted-foreground">Активни в момента</p>
					</div>
				</div>
			{/if}
			
			{#if signals.reviews}
				<div class="flex items-center gap-2 p-2 bg-white rounded-lg">
					<Star class="w-4 h-4 text-yellow-500" />
					<div>
						<p class="text-xs font-medium">{signals.reviews.rating}/5.0</p>
						<p class="text-[10px] text-muted-foreground">{signals.reviews.count} отзива</p>
					</div>
				</div>
			{/if}
		</div>
		
		<!-- Additional Info -->
		<div class="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-gray-200">
			{#if memberSinceText}
				<span>{memberSinceText}</span>
			{/if}
			
			{#if signals.lastSeen}
				<span>Последно активен: {signals.lastSeen}</span>
			{/if}
		</div>
	</div>
{/if}

<style>
	/* Optimistic rendering */
	* {
		will-change: auto;
	}
</style>