'use client'

import * as React from 'react'
import { useUser, useReverification } from '@clerk/nextjs'
import { BackupCodeResource, PhoneNumberResource } from '@clerk/types'
import Link from 'next/link'
import { useTheme } from '@cns/contexts/ThemeContext'
import ThemedPage from '@cns/components/ThemedPage'
import { redirect } from 'next/navigation'

// Display phone numbers reserved for MFA
const ManageMfaPhoneNumbers = ({ buttonStyle, headingStyle }: any) => {
	const { user } = useUser()
	const { theme } = useTheme()

	if (!user) return null

	// Check if any phone numbers are reserved for MFA
	const mfaPhones = user.phoneNumbers
		.filter((ph) => ph.verification.status === 'verified')
		.filter((ph) => ph.reservedForSecondFactor)
		.sort((ph: PhoneNumberResource) => (ph.defaultSecondFactor ? -1 : 1))

	if (mfaPhones.length === 0) {
		return <p>There are currently no phone numbers reserved for MFA.</p>
	}

	const listItemStyle = {
		display: 'flex',
		alignItems: 'center',
		padding: '0.75rem',
		borderRadius: theme.borderRadius,
		backgroundColor: '#f5f5f5',
		marginBottom: '0.5rem',
	}

	const phoneTextStyle = {
		flexGrow: 1,
		margin: 0,
	}

	const defaultBadgeStyle = {
		backgroundColor: theme.colors.accent,
		color: '#fff',
		fontSize: '0.75rem',
		padding: '0.25rem 0.5rem',
		borderRadius: theme.borderRadius,
		marginLeft: '0.5rem',
	}

	return (
		<>
			<h2 style={headingStyle}>Phone numbers reserved for MFA</h2>
			<ul style={{ listStyle: 'none', padding: 0 }}>
				{mfaPhones.map((phone) => {
					return (
						<li key={phone.id} style={listItemStyle}>
							<p style={phoneTextStyle}>
								{phone.phoneNumber}
								{phone.defaultSecondFactor && (
									<span style={defaultBadgeStyle}>Default</span>
								)}
							</p>
							<div style={{ display: 'flex', gap: '0.5rem' }}>
								<button
									style={buttonStyle}
									onClick={() => phone.setReservedForSecondFactor({ reserved: false })}
								>
									Disable for MFA
								</button>

								{!phone.defaultSecondFactor && (
									<button
										style={buttonStyle}
										onClick={() => phone.makeDefaultSecondFactor()}
									>
										Make default
									</button>
								)}

								<button
									style={{ ...buttonStyle, backgroundColor: '#d32f2f' }}
									onClick={() => phone.destroy()}
								>
									Remove
								</button>
							</div>
						</li>
					)
				})}
			</ul>
		</>
	)
}

// Display phone numbers that are not reserved for MFA
const ManageAvailablePhoneNumbers = ({ buttonStyle, headingStyle }: any) => {
	const { user } = useUser()
	const { theme } = useTheme()
	const setReservedForSecondFactor = useReverification((phone: PhoneNumberResource) =>
		phone.setReservedForSecondFactor({ reserved: true }),
	)
	const destroyPhone = useReverification((phone: PhoneNumberResource) => phone.destroy())

	if (!user) return null

	// Check if any phone numbers aren't reserved for MFA
	const availableForMfaPhones = user.phoneNumbers
		.filter((ph) => ph.verification.status === 'verified')
		.filter((ph) => !ph.reservedForSecondFactor)

	// Reserve a phone number for MFA
	const reservePhoneForMfa = async (phone: PhoneNumberResource) => {
		// Set the phone number as reserved for MFA
		await setReservedForSecondFactor(phone)
		// Refresh the user information to reflect changes
		await user.reload()

		redirect("/credit-score/verification")
	}

	if (availableForMfaPhones.length === 0) {
		return <p>There are currently no verified phone numbers available to be reserved for MFA.</p>
	}

	const listItemStyle = {
		display: 'flex',
		alignItems: 'center',
		padding: '0.75rem',
		borderRadius: theme.borderRadius,
		backgroundColor: '#f5f5f5',
		marginBottom: '0.5rem',
	}

	const phoneTextStyle = {
		flexGrow: 1,
		margin: 0,
	}

	return (
		<>
			<h2 style={headingStyle}>Available phone numbers</h2>
			<ul style={{ listStyle: 'none', padding: 0 }}>
				{availableForMfaPhones.map((phone) => {
					return (
						<li key={phone.id} style={listItemStyle}>
							<p style={phoneTextStyle}>{phone.phoneNumber}</p>
							<div style={{ display: 'flex', gap: '0.5rem' }}>
								<button
									style={buttonStyle}
									onClick={() => reservePhoneForMfa(phone)}
								>
									Use for MFA
								</button>
								<button
									style={{ ...buttonStyle, backgroundColor: '#d32f2f' }}
									onClick={() => destroyPhone(phone)}
								>
									Remove
								</button>
							</div>
						</li>
					)
				})}
			</ul>
		</>
	)
}

// Generate and display backup codes
function GenerateBackupCodes() {
	const { user } = useUser()
	const { theme } = useTheme()
	const [backupCodes, setBackupCodes] = React.useState<BackupCodeResource | undefined>(undefined)
	const createBackupCode = useReverification(() => user?.createBackupCode())
	const [loading, setLoading] = React.useState(false)

	React.useEffect(() => {
		if (backupCodes) {
			return
		}

		setLoading(true)
		void createBackupCode()
			.then((backupCode) => {
				setBackupCodes(backupCode)
				setLoading(false)
			})
			.catch((err) => {
				// See https://clerk.com/docs/custom-flows/error-handling
				// for more info on error handling
				console.error(JSON.stringify(err, null, 2))
				setLoading(false)
			})
	}, [])

	const loadingStyle = {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '1rem',
		color: theme?.colors?.secondary || '#2196F3',
	}

	const codeListStyle = {
		display: 'grid',
		gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
		gap: '0.75rem',
		padding: '0',
		margin: '1rem 0',
	}

	const codeItemStyle = {
		fontFamily: 'monospace',
		backgroundColor: '#fff',
		border: '1px solid #e0e0e0',
		borderRadius: theme?.borderRadius || '4px',
		padding: '0.75rem',
		listStyle: 'none',
		textAlign: 'center' as const,
		boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
		fontSize: '1.1rem',
		letterSpacing: '1px',
		color: '#333',
		fontWeight: 600,
	}

	if (loading) {
		return <div style={loadingStyle}>
			<p>Generating backup codes...</p>
		</div>
	}

	if (!backupCodes) {
		return <p style={{ color: '#d32f2f', padding: '1rem' }}>
			There was a problem generating backup codes. Please try again.
		</p>
	}

	return (
		<ul style={codeListStyle}>
			{backupCodes.codes.map((code, index) => (
				<li key={index} style={codeItemStyle}>{code}</li>
			))}
		</ul>
	)
}

export default function ManageSMSMFA() {
	const [showBackupCodes, setShowBackupCodes] = React.useState(false)
	const { isLoaded, user } = useUser()
	const { theme } = useTheme()

	if (!isLoaded) return null

	if (!user) {
		return (
			<ThemedPage>
				<div style={{
					padding: '2rem',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '50vh'
				}}>
					<p>You must be logged in to access this page</p>
				</div>
			</ThemedPage>
		)
	}

	const containerStyle = {
		maxWidth: '800px',
		margin: '0 auto',
		padding: '2rem',
	}

	const cardStyle = {
		backgroundColor: '#ffffff',
		borderRadius: theme.borderRadius,
		boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
		padding: '2rem',
		marginBottom: '2rem',
	}

	const sectionStyle = {
		marginBottom: '2rem',
	}

	const headingStyle = {
		color: theme.colors.primary,
		marginBottom: '1.5rem',
		fontFamily: theme.fontFamily,
	}

	const buttonStyle = {
		backgroundColor: theme.colors.primary,
		color: '#fff',
		border: 'none',
		padding: '0.5rem 1rem',
		borderRadius: theme.borderRadius,
		cursor: 'pointer',
		marginRight: '0.5rem',
		fontFamily: theme.fontFamily,
		fontSize: '0.9rem',
		transition: 'background-color 0.2s',
	}

	const linkStyle = {
		display: 'inline-block',
		backgroundColor: theme.colors.secondary,
		color: '#fff',
		padding: '0.75rem 1.25rem',
		borderRadius: theme.borderRadius,
		textDecoration: 'none',
		marginTop: '1rem',
		fontFamily: theme.fontFamily,
		transition: 'background-color 0.2s',
		fontWeight: 600,
	}

	return (
		<ThemedPage>
			<div style={containerStyle}>
				<div style={cardStyle}>
					<h1 style={{ ...headingStyle, fontSize: '1.75rem', marginTop: 0 }}>User MFA Settings</h1>

					{/* Manage SMS MFA */}
					<div style={sectionStyle}>
						<ManageMfaPhoneNumbers buttonStyle={buttonStyle} headingStyle={headingStyle} />
					</div>

					<div style={sectionStyle}>
						<ManageAvailablePhoneNumbers buttonStyle={buttonStyle} headingStyle={headingStyle} />
					</div>

					<Link
						href="/account/manage-mfa/add-phone"
						style={linkStyle}
						onMouseOver={(e) => {
							e.currentTarget.style.backgroundColor = theme.colors.gradient.to;
						}}
						onMouseOut={(e) => {
							e.currentTarget.style.backgroundColor = theme.colors.secondary;
						}}
					>
						Add a new phone number
					</Link>

					{/* Manage backup codes */}
					{user.twoFactorEnabled && (
						<div style={{ ...sectionStyle, marginTop: '2.5rem' }}>
							<h2 style={{ ...headingStyle, fontSize: '1.4rem' }}>Backup Codes</h2>
							<p>
								Generate new backup codes? {' '}
								<button
									style={buttonStyle}
									onClick={() => setShowBackupCodes(true)}
									onMouseOver={(e) => {
										e.currentTarget.style.backgroundColor = theme.colors.gradient.to;
									}}
									onMouseOut={(e) => {
										e.currentTarget.style.backgroundColor = theme.colors.primary;
									}}
								>
									Generate
								</button>
							</p>
						</div>
					)}
					{showBackupCodes && (
						<div style={{
							marginTop: '1rem',
							padding: '1.5rem',
							backgroundColor: '#f9f9f9',
							borderRadius: theme.borderRadius,
							border: `1px solid ${theme.colors.primary}20`
						}}>
							<h3 style={{ ...headingStyle, fontSize: '1.2rem', marginTop: 0 }}>Your Backup Codes</h3>
							<p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
								Store these codes securely. Each code can only be used once.
							</p>
							<GenerateBackupCodes />
							<button
								style={{ ...buttonStyle, marginTop: '1rem' }}
								onClick={() => setShowBackupCodes(false)}
								onMouseOver={(e) => {
									e.currentTarget.style.backgroundColor = theme.colors.gradient.to;
								}}
								onMouseOut={(e) => {
									e.currentTarget.style.backgroundColor = theme.colors.primary;
								}}
							>
								Done
							</button>
						</div>
					)}


					{user.twoFactorEnabled && (
						<div style={{ ...sectionStyle, marginTop: '2.5rem' }}>
							<h2 style={{ ...headingStyle, fontSize: '1.4rem' }}>Back To:</h2>
							<p>
								Credit Score:
								<button
									style={buttonStyle}
									onClick={() => redirect("/credit-score/verification")}
									onMouseOver={(e) => {
										e.currentTarget.style.backgroundColor = theme.colors.gradient.to;
									}}
									onMouseOut={(e) => {
										e.currentTarget.style.backgroundColor = theme.colors.primary;
									}}
								>
									Credit Score
								</button>
							</p>
						</div>
					)}
				</div>
			</div>
		</ThemedPage>
	)
}
