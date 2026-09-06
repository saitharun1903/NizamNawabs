import { revalidatePath } from 'next/cache';

/**
 * Revalidates public Next.js pages when CMS content or settings change.
 * Ensures the public site instantly reflects updates without requiring a redeploy or restart.
 */
export function revalidatePublicPaths(specificPath?: string) {
  try {
    if (specificPath) {
      revalidatePath(specificPath, 'page');
    }
    // Always revalidate homepage since it aggregates data from all models
    revalidatePath('/', 'page');
    revalidatePath('/matches', 'page');
    revalidatePath('/roster', 'page');
    revalidatePath('/team', 'page');
    revalidatePath('/journey', 'page');
    revalidatePath('/news', 'page');
    revalidatePath('/gallery', 'page');
    revalidatePath('/contact', 'page');
  } catch (error) {
    // In non-Next execution contexts or dev, gracefully catch
    console.warn('[revalidatePublicPaths] Notice during cache invalidation:', error);
  }
}
