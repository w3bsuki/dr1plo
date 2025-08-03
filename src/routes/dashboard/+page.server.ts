import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals: { session, user } }) => {
	// Redirect if not authenticated
	if (!session || !user) {
		redirect(303, '/auth/login?redirectTo=/dashboard')
	}

	return {
		user
	}
}