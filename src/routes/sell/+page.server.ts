import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: { session } } = await supabase.auth.getSession();
	
	if (!session) {
		redirect(303, '/auth/login?redirect=/sell');
	}
	
	return {
		session
	};
};