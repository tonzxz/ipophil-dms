// src\app\(auth)\settings\layout.tsx
import { Metadata } from 'next'
import { Separator } from '@/components/ui/separator'
import { SidebarNav } from '@/components/custom/settings/side-bar-nav'
import { DashboardHeader } from '@/components/custom/dashboard/header'

export const metadata: Metadata = {
  title: 'Settings | DMS',
  description: 'Manage your account settings and preferences',
}

const sidebarNavItems = [
  {
    title: 'Profile',
    href: '/settings',
  },
  {
    title: 'Account',
    href: '/settings/account',
  },
  {
    title: 'Appearance',
    href: '/settings/appearance',
  },
  {
    title: 'Notifications',
    href: '/settings/notifications',
  },
  {
    title: 'Display',
    href: '/settings/display',
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: 'Settings', href: '/settings', active: true },
        ]}
      />
      <div className="container mx-auto">
        <div className="hidden space-y-6 p-6 pb-16 md:block">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">
              Manage your account settings and preferences.
            </p>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="-mx-4 lg:w-1/5">
              <SidebarNav items={sidebarNavItems} />
            </aside>
            <div className="flex-1 lg:max-w-2xl">
              <div className="rounded-lg border bg-card p-6">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}