import { addUpdate } from './whatsNew'

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

// Log a new update to demonstrate the system
updateTemplates.newFeature(
  'Enhanced Update Logger',
  'Added comprehensive logging system that automatically tracks and displays new features, fixes, and improvements in the What\'s New section.',
  'v4.7'
)

// NEW UPDATES - v5.6
updateTemplates.newFeature(
  'Easy Content Management',
  'Family admins can now easily manage testimonials to keep our family space positive and appropriate for everyone.',
  'v5.6'
)

updateTemplates.bugFix(
  'Smoother Experience',
  'Fixed connection issues so you can enjoy a smoother, more stable experience when using our family features.',
  'v5.6'
)

updateTemplates.newFeature(
  'Faster & More Reliable',
  'Our family app is now faster and more reliable than ever, with better performance for sharing memories and staying connected.',
  'v5.6'
)

updateTemplates.improvement(
  'Enhanced Privacy & Safety',
  'Improved security measures to keep your family information safe and ensure only authorized family members can manage content.',
  'v5.6'
)
