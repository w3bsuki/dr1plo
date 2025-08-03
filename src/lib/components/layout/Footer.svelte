<script lang="ts">
	import { Instagram, Twitter, Facebook, Youtube, Linkedin, Mail, MapPin, Phone, Download } from '@lucide/svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
</script>

<footer class="bg-gray-900 text-white">
	<!-- Newsletter Section -->
	<div class="bg-gray-800">
		<div class="container mx-auto max-w-7xl px-4 py-12">
			<div class="text-center">
				<h3 class="text-2xl font-bold mb-2">Stay in the Loop</h3>
				<p class="text-gray-300 mb-6">Get the latest drops, style tips, and exclusive offers</p>
				<div class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
					<div class="relative flex-1">
						<Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
						<input 
							type="email" 
							placeholder="Enter your email"
							class="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
						/>
					</div>
					<Button class="bg-primary text-white hover:bg-primary/90 font-semibold px-6">
						Subscribe
					</Button>
				</div>
			</div>
		</div>
	</div>

	<div class="container mx-auto max-w-7xl px-4 py-12">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
			<!-- Brand -->
			<div class="lg:col-span-2 space-y-6">
				<div class="flex items-center space-x-2">
					<div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold text-lg">
						D
					</div>
					<span class="font-bold text-2xl">Driplo</span>
				</div>
				<p class="text-gray-300 max-w-sm">
					The sustainable marketplace for fashion lovers. Buy and sell authentic streetwear, designer pieces, and vintage treasures from a community that values style and sustainability.
				</p>
				
				<!-- App Download -->
				<div class="space-y-3">
					<p class="text-sm font-semibold text-gray-200">Get the App</p>
					<div class="flex space-x-3">
						<Button variant="outline" class="border-gray-600 text-gray-200 hover:bg-gray-800 flex items-center space-x-2">
							<Download class="h-4 w-4" />
							<span class="text-xs">App Store</span>
						</Button>
						<Button variant="outline" class="border-gray-600 text-gray-200 hover:bg-gray-800 flex items-center space-x-2">
							<Download class="h-4 w-4" />
							<span class="text-xs">Google Play</span>
						</Button>
					</div>
				</div>
				
				<!-- Social Media -->
				<div class="flex space-x-4">
					<button aria-label="Follow us on Instagram" class="text-gray-400 hover:text-primary transition-colors">
						<Instagram class="h-5 w-5" />
					</button>
					<button aria-label="Follow us on Twitter" class="text-gray-400 hover:text-primary transition-colors">
						<Twitter class="h-5 w-5" />
					</button>
					<button aria-label="Follow us on Facebook" class="text-gray-400 hover:text-primary transition-colors">
						<Facebook class="h-5 w-5" />
					</button>
					<button aria-label="Follow us on Youtube" class="text-gray-400 hover:text-primary transition-colors">
						<Youtube class="h-5 w-5" />
					</button>
					<button aria-label="Follow us on LinkedIn" class="text-gray-400 hover:text-primary transition-colors">
						<Linkedin class="h-5 w-5" />
					</button>
				</div>
			</div>
			
			<!-- Shop -->
			<div>
				<h3 class="font-semibold text-white mb-4">Shop</h3>
				<ul class="space-y-3 text-sm">
					<li><a href="/men" class="text-gray-300 hover:text-primary transition-colors">Men</a></li>
					<li><a href="/women" class="text-gray-300 hover:text-primary transition-colors">Women</a></li>
					<li><a href="/kids" class="text-gray-300 hover:text-primary transition-colors">Kids</a></li>
					<li><a href="/brands" class="text-gray-300 hover:text-primary transition-colors">Brands</a></li>
					<li><a href="/new" class="text-gray-300 hover:text-primary transition-colors">New Arrivals</a></li>
					<li><a href="/sale" class="text-gray-300 hover:text-primary transition-colors">Sale</a></li>
				</ul>
			</div>
			
			<!-- Sell -->
			<div>
				<h3 class="font-semibold text-white mb-4">Sell</h3>
				<ul class="space-y-3 text-sm">
					<li><a href="/sell" class="text-gray-300 hover:text-primary transition-colors">Start Selling</a></li>
					<li><a href="/brands/join" class="text-gray-300 hover:text-primary transition-colors">Brand Partnership</a></li>
					<li><a href="/seller-guide" class="text-gray-300 hover:text-primary transition-colors">Seller Guide</a></li>
					<li><a href="/fees" class="text-gray-300 hover:text-primary transition-colors">Fees & Pricing</a></li>
					<li><a href="/verification" class="text-gray-300 hover:text-primary transition-colors">Authentication</a></li>
				</ul>
			</div>
			
			<!-- Support -->
			<div>
				<h3 class="font-semibold text-white mb-4">Support</h3>
				<ul class="space-y-3 text-sm">
					<li><a href="/help" class="text-gray-300 hover:text-primary transition-colors">Help Center</a></li>
					<li><a href="/contact" class="text-gray-300 hover:text-primary transition-colors">Contact Us</a></li>
					<li><a href="/shipping" class="text-gray-300 hover:text-primary transition-colors">Shipping Info</a></li>
					<li><a href="/returns" class="text-gray-300 hover:text-primary transition-colors">Returns & Exchanges</a></li>
					<li><a href="/safety" class="text-gray-300 hover:text-primary transition-colors">Safety & Security</a></li>
				</ul>
			</div>
		</div>
		
		<!-- Stats Section -->
		<div class="border-t border-gray-800 pt-8 mt-12">
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
				<div>
					<div class="text-2xl font-bold text-primary">2M+</div>
					<div class="text-sm text-gray-400">Active Users</div>
				</div>
				<div>
					<div class="text-2xl font-bold text-primary">500K+</div>
					<div class="text-sm text-gray-400">Items Sold</div>
				</div>
				<div>
					<div class="text-2xl font-bold text-primary">10K+</div>
					<div class="text-sm text-gray-400">Brands</div>
				</div>
				<div>
					<div class="text-2xl font-bold text-primary">99%</div>
					<div class="text-sm text-gray-400">Satisfaction</div>
				</div>
			</div>
		</div>
		
		<hr class="my-8 border-gray-800" />
		
		<div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
			<div class="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
				<p class="text-sm text-gray-400">
					© 2025 Driplo. All rights reserved.
				</p>
				<div class="flex items-center space-x-2">
					<Badge variant="outline" class="border-green-500 text-green-400 text-xs">
						Verified Sustainable
					</Badge>
					<Badge variant="outline" class="border-blue-500 text-blue-400 text-xs">
						Carbon Neutral
					</Badge>
				</div>
			</div>
			<div class="flex flex-wrap justify-center gap-4 md:gap-6">
				<a href="/privacy" class="text-sm text-gray-400 hover:text-primary transition-colors">Privacy Policy</a>
				<a href="/terms" class="text-sm text-gray-400 hover:text-primary transition-colors">Terms of Service</a>
				<a href="/cookies" class="text-sm text-gray-400 hover:text-primary transition-colors">Cookie Policy</a>
				<a href="/accessibility" class="text-sm text-gray-400 hover:text-primary transition-colors">Accessibility</a>
			</div>
		</div>
	</div>
</footer>