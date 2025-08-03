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
		const confirmPassword = formData.get('confirmPassword') as string
		const username = formData.get('username') as string
		const fullName = formData.get('fullName') as string
		const accountType = formData.get('accountType') as 'personal' | 'brand'

		// Validation
		if (!email || !password || !confirmPassword || !username || !fullName) {
			return fail(400, {
				error: 'Моля, попълнете всички полета',
				email, username, fullName, accountType
			})
		}

		if (password !== confirmPassword) {
			return fail(400, {
				error: 'Паролите не съвпадат',
				email, username, fullName, accountType
			})
		}

		if (password.length < 6) {
			return fail(400, {
				error: 'Паролата трябва да е поне 6 символа',
				email, username, fullName, accountType
			})
		}

		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					username: username.toLowerCase(),
					full_name: fullName,
					account_type: accountType
				}
			}
		})

		if (error) {
			let errorMessage = 'Възникна грешка при регистрацията'
			
			if (error.message.includes('User already registered')) {
				errorMessage = 'Този имейл вече е регистриран'
			} else if (error.message.includes('Password should be at least')) {
				errorMessage = 'Паролата трябва да е поне 6 символа'
			} else if (error.message.includes('Invalid email')) {
				errorMessage = 'Невалиден имейл адрес'
			}

			return fail(400, {
				error: errorMessage,
				email, username, fullName, accountType
			})
		}

		if (data.user && !data.session) {
			// User needs email confirmation
			return {
				success: true,
				needsConfirmation: true,
				message: 'Профилът е създаден! Моля, проверете имейла си за потвърждение.'
			}
		}

		// Auto-confirmed, redirect to onboarding
		redirect(303, '/dashboard')
	}
}