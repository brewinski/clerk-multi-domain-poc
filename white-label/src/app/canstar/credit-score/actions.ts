"use server"
import { auth, reverificationError, currentUser, } from '@clerk/nextjs/server'
import Redis from 'ioredis'

type VerificationRecord = {
	userID: string,
	sessionID: string,
	lastVerificationTime: number,
	verificationStatus: "verified" | "unverified"
}

interface KeyValueStorer {
	set(k: string, v: string): Promise<void>
	get(k: string): Promise<string | undefined>
}

class MapKVStorer implements KeyValueStorer {
	private store = new Map<string, string>

	async set(k: string, v: string) {
		this.store.set(k, v)
	}

	async get(k: string): Promise<string | undefined> {
		return this.store.get(k)
	}
}

class RedisKVStorer implements KeyValueStorer {
	private store = new Redis()

	async set(k: string, v: string) {
		await this.store.set(k, v, "EX", 60)
	}

	async get(k: string): Promise<string | undefined> {
		const v = await this.store.get(k)
		if (v) {
			return v
		}
	}
}

class VerificationService {
	constructor(private store: KeyValueStorer, private keyPrefix = "verification-service") { }

	private generateSessionUserId(sessionId: string, userId: string): string {
		return `${this.keyPrefix}-${sessionId}-${userId}`
	}

	async setVerification(sessionId: string, userId: string, record: VerificationRecord) {
		const key = this.generateSessionUserId(sessionId, userId)
		this.store.set(key, JSON.stringify(record))
	}

	async getVerification(sessionId: string, userId: string): Promise<VerificationRecord | undefined> {
		const key = this.generateSessionUserId(sessionId, userId)
		const data = await this.store.get(key)
		return data ? JSON.parse(data) : undefined
	}
}

const storeImplementation = process.env.USE_STORE === "redis" ? new RedisKVStorer() : new MapKVStorer();

const verificationSerice = new VerificationService(storeImplementation)

const MFA_VERIFICATION_MINS = 0
const MFA_CUSTOM_TOTP_MINS = 1
const NEVER_VALUE = -1

function totpVerificationError(primaryPhoneNumber: string, primaryPhoneNumberVerified: boolean) {
	return {
		totp: {
			type: "forbidden",
			reason: "totp-verification-error",
			metadata: {
				phonenumber: primaryPhoneNumber,
				verified: primaryPhoneNumberVerified,
			}
		}
	}
}

function verifyWithCustomTOTPSolution(twillioVerification: VerificationRecord | undefined, primaryPhoneNumber: string, primaryPhoneNumberVerified: boolean) {
	console.log("twVerification", twillioVerification, "primaryPhoneNumber", primaryPhoneNumber, "primaryPhoneNumberVerified", primaryPhoneNumberVerified)

	if (!twillioVerification) {
		return totpVerificationError(primaryPhoneNumber, primaryPhoneNumberVerified)
	}

	const diff = Math.abs(Date.now() - twillioVerification.lastVerificationTime)
	const timeSinceTwillio = Math.floor((diff / 1000) / 60);

	console.log("twilioTimeSince", timeSinceTwillio, "twLastVerification", twillioVerification, "diff", diff)

	if (timeSinceTwillio > MFA_CUSTOM_TOTP_MINS) {
		return totpVerificationError(primaryPhoneNumber, primaryPhoneNumberVerified)
	}

	// do work....
	return { success: true, creditscore: 700 }
}

function verifyWithClerkVerifySolution(secondVerificationAge: number) {
	if (secondVerificationAge >= MFA_VERIFICATION_MINS || secondVerificationAge == NEVER_VALUE) {
		return reverificationError(
			"strict"
		)
	}

	// do work....
	return { success: true, creditscore: 700 }
}

function verifyWithClerkWithOptionalMFASolution(firstVerificationAge: number, secondVerificationAge: number, mfaConfigured: boolean) {
	if (mfaConfigured) {
		if (secondVerificationAge >= MFA_VERIFICATION_MINS || secondVerificationAge == NEVER_VALUE) {
			return reverificationError(
				"strict"
			)
		}

		return { success: true, creditscore: 700 }
	}

	if (firstVerificationAge >= MFA_VERIFICATION_MINS || firstVerificationAge == NEVER_VALUE) {
		return reverificationError(
			"strict"
		)
	}


	// do work....
	return { success: true, creditscore: 700 }
}

export async function check(
	clerkOptionalMFAFlow: boolean = false
): Promise<any> {
	const { factorVerificationAge, sessionClaims, userId, sessionId } = await auth.protect()
	const hasMFAConfigured: boolean = !!sessionClaims?.isMfa

	const [firstVerificationAge, secondVerificationAge] = factorVerificationAge!

	// custom TOTP verification solution
	const twillioVerification = await verificationSerice.getVerification(sessionId, userId)
	const user = await currentUser()

	const primaryPhoneNumber = user?.primaryPhoneNumber?.phoneNumber || ""
	const primaryPhoneNumberVerified = user?.primaryPhoneNumber?.verification?.status === "verified"

	console.log(
		"mfaConfigured", hasMFAConfigured,
		"firstFactorVerificationAge", firstVerificationAge,
		"secondFactorVerificationAge", secondVerificationAge,
		"primaryPhoneNumber", primaryPhoneNumber,
		"primaryPhoneNumberVerified", primaryPhoneNumberVerified,
		"user", user,
	)

	if (clerkOptionalMFAFlow) {
		return verifyWithClerkWithOptionalMFASolution(firstVerificationAge, secondVerificationAge, hasMFAConfigured)
	}

	if (!hasMFAConfigured) {
		return verifyWithCustomTOTPSolution(twillioVerification, primaryPhoneNumber, primaryPhoneNumberVerified)
	}

	return verifyWithClerkVerifySolution(secondVerificationAge)
}

const MOCK_CODE_SUCCESS = "000000"


export async function verify(code: string) {
	const { userId, sessionId } = await auth.protect()

	if (code === MOCK_CODE_SUCCESS) {
		await verificationSerice.setVerification(sessionId, userId, { userID: userId, lastVerificationTime: Date.now(), verificationStatus: "verified", sessionID: sessionId })
	}

}
