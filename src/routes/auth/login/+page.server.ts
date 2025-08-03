import { redirect, fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals: { session } }) => {
	// Redirect if already authenticated
	if (session) {
		redirect(303, '/dashboard')
	}

	return {}
}

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData()
		const email = formData.get('email') as string
		const password = formData.get('password') as string

		if (!email || !password) {
			return fail(400, {
				error: 'Моля, попълнете всички полета',
				email
			})
		}

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		})

		if (error) {
			let errorMessage = 'Възникна грешка при влизането'
			
			if (error.message.includes('Invalid login credentials')) {
				errorMessage = 'Грешен имейл или парола'
			} else if (error.message.includes('Email not confirmed')) {
				errorMessage = 'Моля, потвърдете имейла си'
			} else if (error.message.includes('Too many requests')) {
				errorMessage = 'Твърде много опити. Опитайте отново по-късно'
			}

			return fail(400, {
				error: errorMessage,
				email
			})
		}

		// Successful login will be handled by the auth hooks
		redirect(303, '/dashboard')
	}
}