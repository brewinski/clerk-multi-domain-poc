import { headers } from 'next/headers';
import { ThemeType } from '@cns/themes/themeConfig';

export async function getThemeTypeFromHeaders(): Promise<ThemeType> {
  try {
    const headersList = await headers();
    const domainType = headersList.get('x-domain-type');

    // Validate and return the domain type
    if (domainType === 'canstar' || domainType === 'canstarblue') {
      return domainType as ThemeType;
    }
  } catch (error) {
    console.error('Error getting domain type from headers:', error);
  }

  // Default to canstar if no valid domain type is found
  return 'canstar';
}

