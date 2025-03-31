'use client';

import React from 'react';
import { useTheme } from '@cns/contexts/ThemeContext';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
	const { theme } = useTheme();

	// Set CSS variable for the footer background color
	const footerStyle = {
		'--footer-bg': theme.footerColor
	} as React.CSSProperties;

	return (
		<footer className={styles.footer} style={footerStyle}>
			<div className={styles.footerContainer}>
				<div className={styles.brandSection}>
					<div className={styles.brandColumn}>
						<h3 className={styles.brandHeading}>Our Brands</h3>
						<div className={styles.brandLogosRow} style={{ display: 'flex', flexDirection: 'row', gap: '30px', alignItems: 'center' }}>
							<Link href="/canstar" className={styles.brandLogoLink}>
								<Image 
									src={theme.logo.imageUrl || "https://www.canstar.com.au/wp-content/themes/canstar/dist/images/logo.png"}
									alt="Canstar Gold"
									width={150}
									height={45}
									className={styles.logoImage}
									style={{ background: 'transparent' }}
								/>
							</Link>
							
							<Link href="/canstarblue" className={styles.brandLogoLink}>
								<Image 
									src="https://www.canstarblue.com.au/wp-content/themes/canstar-blue/dist/images/logo.png"
									alt="Canstar Blue"
									width={150}
									height={45}
									className={styles.logoImage}
									style={{ background: 'transparent' }}
								/>
							</Link>
						</div>
					</div>
					
					<div className={styles.brandColumn}>
						<h3 className={styles.brandHeading}>Quick Links</h3>
						<Link href="#" className={styles.brandLink}>
							<span>Personal Finance</span>
						</Link>
						<Link href="#" className={styles.brandLink}>
							<span>Home Loans</span>
						</Link>
						<Link href="#" className={styles.brandLink}>
							<span>Credit Cards</span>
						</Link>
						<Link href="#" className={styles.brandLink}>
							<span>Insurance</span>
						</Link>
					</div>
					
					<div className={styles.brandColumn}>
						<h3 className={styles.brandHeading}>Resources</h3>
						<Link href="#" className={styles.brandLink}>
							<span>Calculators</span>
						</Link>
						<Link href="#" className={styles.brandLink}>
							<span>Guides</span>
						</Link>
						<Link href="#" className={styles.brandLink}>
							<span>News</span>
						</Link>
						<Link href="#" className={styles.brandLink}>
							<span>Research</span>
						</Link>
					</div>
				</div>

				<div className={styles.divider}></div>

				<div className={styles.legalSection}>
					<div className={styles.legalColumn}>
						<div className={styles.copyrightText}>
							<p>© Copyright 2025 Canstar Blue Pty Ltd ACN 142 285 434</p>
							<p>All Rights Reserved</p>
						</div>
					</div>
					
					<div className={styles.legalColumn}>
						<div className={styles.legalLinks}>
							<a href="#" className={styles.legalLink}>Privacy Policy</a>
							<a href="#" className={styles.legalLink}>Awards & Methodologies</a>
							<a href="#" className={styles.legalLink}>Advertising</a>
							<a href="#" className={styles.legalLink}>New Zealand</a>
							<a href="#" className={styles.legalLink}>FAQs</a>
							<a href="#" className={styles.legalLink}>Contact Us</a>
						</div>
					</div>
				</div>

				<div className={styles.disclaimer}>
					<p>To our knowledge, all information in articles on the Canstar Blue website was correct at the time of publication. This information may have changed over time. Refer to the product fact sheet (or relevant similar documentation) before making any purchase decision. Canstar Blue's website terms and conditions apply.</p>
					<p>You must not reproduce, transmit, disseminate, sell, or publish information on this website without prior written permission from Canstar Blue.</p>
				</div>
			</div>
		</footer>
	);
}

