import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }) => {
	// Get data from parent layout (session, supabase, etc.)
	const data = await parent();
	
	return {
		...data
	};
};