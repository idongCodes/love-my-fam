import { addUpdate, UpdateItem } from './whatsNew'

/**
 * Utility function to log new updates during development
 * Call this whenever you implement a new feature, fix, or update
 */
export function logNewUpdate(
  title: string,
  description: string,
  icon: string = '✨',
  category: 'feature' | 'fix' | 'update' = 'feature',
  status: 'just-released' | 'recently-updated' | 'coming-soon' = 'just-released',
  version?: string
) {
  const update = addUpdate({
    title,
    description,
    icon,
    category,
    status,
    date: new Date(),
    version
  })
  
  console.log(`✨ New update logged: ${title}`, update)
  return update
}

/**
 * Pre-configured update templates for common scenarios
 */
export const updateTemplates = {
  newFeature: (title: string, description: string, version?: string) => 
    logNewUpdate(title, description, '🚀', 'feature', 'just-released', version),
    
  bugFix: (title: string, description: string, version?: string) => 
    logNewUpdate(title, description, '🔧', 'fix', 'just-released', version),
    
  improvement: (title: string, description: string, version?: string) => 
    logNewUpdate(title, description, '⚡', 'update', 'recently-updated', version),
    
  comingSoon: (title: string, description: string) => 
    logNewUpdate(title, description, '🔮', 'feature', 'coming-soon')
}

/**
 * Example usage:
 * 
 * // When implementing a new feature:
 * updateTemplates.newFeature(
 *   'Dark Mode Support',
 *   'Users can now switch between light and dark themes for better viewing comfort.',
 *   'v4.6'
 * )
 * 
 * // When fixing a bug:
 * updateTemplates.bugFix(
 *   'Fixed Login Issue',
 *   'Resolved authentication timeout problems on mobile devices.',
 *   'v4.6'
 * )
 * 
 * // When improving existing functionality:
 * updateTemplates.improvement(
 *   'Faster Image Loading',
 *   'Optimized image compression for 50% faster loading times.',
 *   'v4.6'
 * )
 */
