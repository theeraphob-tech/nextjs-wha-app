import type { ReactNode } from "react"
import "../globals.css"
import { AdminNav } from "@/components/admin/admin-nav"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th" className="font-sans">
      <body>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <AdminNav />
          {children}
        </div>
      </body>
    </html>
  )
}
