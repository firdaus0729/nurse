'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BookOpen, 
  Heart, 
  Users, 
  Shield, 
  Info, 
  MessageCircle,
  LucideIcon 
} from 'lucide-react'

interface QuickAccessCard {
  id: string
  title: string
  description: string | null
  icon: string | null
  link: string
  isActive: boolean
  order: number
}

interface QuickAccessCardsProps {
  cards: QuickAccessCard[]
}

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  book: BookOpen,
  heart: Heart,
  users: Users,
  shield: Shield,
  info: Info,
  message: MessageCircle,
}

export function QuickAccessCards({ cards }: QuickAccessCardsProps) {
  const activeCards = cards
    .filter(card => card.isActive)
    .sort((a, b) => a.order - b.order)

  if (activeCards.length === 0) {
    return null
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeCards.map((card) => {
          const IconComponent = card.icon && iconMap[card.icon] 
            ? iconMap[card.icon] 
            : Info

          return (
            <Link key={card.id} href={card.link}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <IconComponent className="h-6 w-6 text-primary" />
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                  </div>
                </CardHeader>
                {card.description && (
                  <CardContent>
                    <CardDescription>{card.description}</CardDescription>
                  </CardContent>
                )}
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

