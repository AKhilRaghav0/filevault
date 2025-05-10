'use client';

import React, { useEffect, useState } from 'react';

export default function HydrationErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use this state to ensure we only render children on the client side
  // This completely avoids hydration mismatches related to extensions
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return a static container during server rendering to avoid hydration issues
  if (!mounted) {
    // This div is replaced after hydration
    return <div className="min-h-screen flex flex-col"></div>;
  }

  return <>{children}</>;
}
