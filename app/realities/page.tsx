'use client'

import { EditableRealitiesPage } from '@/components/EditableRealitiesPage'

export default function RealitiesPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  return <EditableRealitiesPage searchParams={searchParams} />
}
