// Middleware removed - authentication is now handled at the root layout level
// All routes are accessible, but login page is shown if no session exists
export default function middleware() {
  // No middleware needed - authentication handled in RootLayoutContent
}

export const config = {
  matcher: [],
}

