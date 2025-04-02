'use client'

import * as React from 'react'
import { useUser, useReverification } from '@clerk/nextjs'
import { PhoneNumberResource } from '@clerk/types'
import ThemedPage from '@cns/components/ThemedPage'
import { useTheme } from '@cns/contexts/ThemeContext'

export default function Page() {
	const { isLoaded, user } = useUser()
	const { theme } = useTheme()
	const [phone, setPhone] = React.useState('')
	const [code, setCode] = React.useState('')
	const [isVerifying, setIsVerifying] = React.useState(false)
	const [successful, setSuccessful] = React.useState(false)
	const [phoneObj, setPhoneObj] = React.useState<PhoneNumberResource | undefined>()
	const [error, setError] = React.useState<string | null>(null)
	const createPhoneNumber = useReverification((phone: string) =>
		user?.createPhoneNumber({ phoneNumber: phone }),
	)

	if (!isLoaded) return null

	if (!user) {
		return <p>You must be logged in to access this page</p>
	}

	// Shared styles for consistent UI
	const containerStyle = {
		maxWidth: '500px',
		margin: '2rem auto',
		padding: '2rem',
		borderRadius: theme.borderRadius,
		backgroundColor: '#fff',
		boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
	}

	const titleStyle = {
		color: theme.colors.primary,
		marginBottom: '1.5rem',
		fontSize: '1.8rem',
	}

	const formGroupStyle = {
		marginBottom: '1.5rem',
	}

	const labelStyle = {
		display: 'block',
		marginBottom: '0.5rem',
		fontWeight: 'bold',
		color: '#555',
	}

	const inputStyle = {
		width: '100%',
		padding: '0.75rem',
		borderRadius: theme.borderRadius,
		border: '1px solid #ddd',
		fontSize: '1rem',
		transition: 'border-color 0.3s ease',
		outline: 'none',
		':focus': {
			borderColor: theme.colors.primary,
		},
	}

	const buttonStyle = {
		backgroundColor: theme.colors.primary,
		color: '#fff',
		border: 'none',
		padding: '0.75rem 1.5rem',
		borderRadius: theme.borderRadius,
		fontSize: '1rem',
		fontWeight: 'bold',
		cursor: 'pointer',
		transition: 'background-color 0.3s ease',
		':hover': {
			backgroundColor: theme.colors.secondary,
		},
	}

	const errorStyle = {
		color: '#d32f2f',
		marginTop: '0.5rem',
		fontSize: '0.875rem',
	}

	const successStyle = {
		display: 'flex',
		flexDirection: 'column' as const,
		alignItems: 'center',
		justifyContent: 'center',
		padding: '2rem',
		textAlign: 'center' as const,
		backgroundColor: '#e8f5e9',
		borderRadius: theme.borderRadius,
		marginTop: '1rem',
	}

	// Handle addition of the phone number
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)

		if (!phone || phone.trim().length < 10) {
			setError('Please enter a valid phone number')
			return
		}

		try {
			// Add unverified phone number to user
			const res = await createPhoneNumber(phone)
			// Reload user to get updated User object
			await user.reload()

			// Create a reference to the new phone number to use related methods
			const phoneNumber = user.phoneNumbers.find((a) => a.id === res!.id)
			setPhoneObj(phoneNumber)

			// Send the user an SMS with the verification code
			phoneNumber?.prepareVerification()

			// Set to true to display second form
			// and capture the OTP code
			setIsVerifying(true)
		} catch (err) {
			// See https://clerk.com/docs/custom-flows/error-handling
			// for more info on error handling
			console.error(JSON.stringify(err, null, 2))
			setError('There was an error adding your phone number. Please try again.')
		}
	}

	// Handle the submission of the verification form
	const verifyCode = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)

		if (!code || code.trim().length < 4) {
			setError('Please enter the verification code sent to your phone')
			return
		}

		try {
			// Verify that the provided code matches the code sent to the user
			const phoneVerifyAttempt = await phoneObj?.attemptVerification({ code })

			if (phoneVerifyAttempt?.verification.status === 'verified') {
				setSuccessful(true)
			} else {
				// If the status is not complete, check why. User may need to
				// complete further steps.
				console.error(JSON.stringify(phoneVerifyAttempt, null, 2))
				setError('Invalid verification code. Please try again.')
			}
		} catch (err) {
			console.error(JSON.stringify(err, null, 2))
			setError('There was an error verifying your code. Please try again.')
		}
	}

	// Display a success message if the phone number was added successfully
	if (successful) {
		return (
			<ThemedPage>
				<div style={containerStyle}>
					<div style={successStyle}>
						<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={theme.colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
							<polyline points="22 4 12 14.01 9 11.01"></polyline>
						</svg>
						<h1 style={{ ...titleStyle, marginTop: '1rem' }}>Phone Added Successfully</h1>
						<p>Your phone number has been verified and added to your account.</p>
						<button
							onClick={() => window.history.back()}
							style={{ ...buttonStyle, marginTop: '1.5rem' }}
						>
							Return to Account
						</button>
					</div>
				</div>
			</ThemedPage>
		)
	}

	// Display the verification form to capture the OTP code
	if (isVerifying) {
		return (
			<ThemedPage>
				<div style={containerStyle}>
					<h1 style={titleStyle}>Verify Your Phone</h1>
					<p>We've sent a verification code to your phone. Please enter it below to complete the verification.</p>
					<form onSubmit={(e) => verifyCode(e)}>
						<div style={formGroupStyle}>
							<label htmlFor="code" style={labelStyle}>Verification Code</label>
							<input
								onChange={(e) => setCode(e.target.value)}
								id="code"
								name="code"
								type="text"
								value={code}
								placeholder="Enter your 6-digit code"
								style={inputStyle}
							/>
							{error && <div style={errorStyle}>{error}</div>}
						</div>
						<div style={formGroupStyle}>
							<button type="submit" style={buttonStyle}>Verify Phone</button>
						</div>
					</form>
					<p style={{ fontSize: '0.9rem', color: '#666', marginTop: '1rem' }}>
						Didn't receive a code? <button
							onClick={() => phoneObj?.prepareVerification()}
							style={{ background: 'none', border: 'none', color: theme.colors.primary, textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
						>
							Send again
						</button>
					</p>
				</div>
			</ThemedPage>
		)
	}

	// Display the initial form to capture the phone number
	return (
		<ThemedPage>
			<div style={containerStyle}>
				<h1 style={titleStyle}>Add Phone Number</h1>
				<p>Add your phone number to enable two-factor authentication for increased account security.</p>
				<form onSubmit={(e) => handleSubmit(e)}>
					<div style={formGroupStyle}>
						<label htmlFor="phone" style={labelStyle}>Phone Number</label>
						<input
							onChange={(e) => setPhone(e.target.value)}
							id="phone"
							name="phone"
							type="tel"
							value={phone}
							placeholder="+61 400 000 000"
							style={inputStyle}
						/>
						{error && <div style={errorStyle}>{error}</div>}
						<div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
							Enter your full phone number including country code (e.g., +61 for Australia)
						</div>
					</div>
					<div style={formGroupStyle}>
						<button type="submit" style={buttonStyle}>Continue</button>
					</div>
				</form>
			</div>
		</ThemedPage>
	)
}
