import type { PageServerLoad } from './$types'
import { createServerClient } from '$lib/supabase'

export const load: PageServerLoad = async ({ fetch, locals: { safeGetSession } }) => {
	const { session, user } = await safeGetSession()
	const supabase = createServerClient(fetch)

	try {
		// Transform function to match ProductGrid format
		const transformListing = (listing: any) => ({
			id: listing.id,
			title: listing.title,
			price: listing.price,
			originalPrice: undefined,
			brand: listing.brand || 'Unknown',
			condition: listing.condition || 'Good',
			size: listing.size || 'OS',
			images: Array.isArray(listing.images) ? listing.images : 
					(listing.images ? [listing.images] : ['https://images.unsplash.com/photo-1551107696-a4b57a95e98d?w=400&h=500&fit=crop']),
			rating: listing.profiles?.seller_rating || 4.5,
			reviewCount: listing.profiles?.seller_rating_count || 0,
			isFavorite: false,
			isNew: listing.is_featured || new Date(listing.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
			seller: {
				name: listing.profiles?.username || 'Unknown',
				avatar: listing.profiles?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
				rating: listing.profiles?.seller_rating || 4.5
			}
		});

		// Fetch different sections in parallel
		const [
			{ data: newestListings, error: newestError },
			{ data: premiumListings, error: premiumError },
			{ data: brandListings, error: brandError },
			{ data: topSellerListings, error: topSellerError }
		] = await Promise.all([
			// Newest listings
			supabase
				.from('listings')
				.select(`
					id, title, price, brand, condition, size, images, is_featured, created_at,
					profiles!listings_seller_id_fkey (username, avatar_url, seller_rating, seller_rating_count)
				`)
				.eq('status', 'active')
				.order('created_at', { ascending: false })
				.limit(10),
			
			// Premium listings (high-priced items)
			supabase
				.from('listings')
				.select(`
					id, title, price, brand, condition, size, images, is_featured, created_at,
					profiles!listings_seller_id_fkey (username, avatar_url, seller_rating, seller_rating_count)
				`)
				.eq('status', 'active')
				.gte('price', 200)
				.order('price', { ascending: false })
				.limit(10),
			
			// Brand listings (popular brands)
			supabase
				.from('listings')
				.select(`
					id, title, price, brand, condition, size, images, is_featured, created_at,
					profiles!listings_seller_id_fkey (username, avatar_url, seller_rating, seller_rating_count)
				`)
				.eq('status', 'active')
				.in('brand', ['Nike', 'Supreme', 'Fear of God', 'Balenciaga', 'Gucci', 'Off-White'])
				.order('created_at', { ascending: false })
				.limit(10),
			
			// Top seller listings (high-rated sellers)
			supabase
				.from('listings')
				.select(`
					id, title, price, brand, condition, size, images, is_featured, created_at,
					profiles!listings_seller_id_fkey (username, avatar_url, seller_rating, seller_rating_count)
				`)
				.eq('status', 'active')
				.order('created_at', { ascending: false })
				.limit(10)
		]);

		// Log any errors but don't fail the entire page
		if (newestError) console.error('Error fetching newest listings:', newestError);
		if (premiumError) console.error('Error fetching premium listings:', premiumError);
		if (brandError) console.error('Error fetching brand listings:', brandError);
		if (topSellerError) console.error('Error fetching top seller listings:', topSellerError);

		// Transform all sections
		const transformedNewest = (newestListings || []).map(transformListing);
		const transformedPremium = (premiumListings || []).map(transformListing);
		const transformedBrands = (brandListings || []).map(transformListing);
		const transformedTopSellers = (topSellerListings || []).map(transformListing);

		console.log('Loaded sections:', {
			newest: transformedNewest.length,
			premium: transformedPremium.length,
			brands: transformedBrands.length,
			topSellers: transformedTopSellers.length
		});

		return {
			session,
			user,
			featuredListings: transformedNewest, // Keep for backward compatibility
			newestListings: transformedNewest,
			premiumListings: transformedPremium,
			brandListings: transformedBrands,
			topSellerListings: transformedTopSellers
		}
	} catch (error) {
		console.error('Error in page server load:', error)
		
		// Return empty arrays on error - components will use fallback data
		return {
			session,
			user,
			featuredListings: [],
			newestListings: [],
			premiumListings: [],
			brandListings: [],
			topSellerListings: []
		}
	}
}