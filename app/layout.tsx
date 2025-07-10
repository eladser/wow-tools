import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'WoW Tools - World of Warcraft Utilities',
  description: 'Essential tools for World of Warcraft players including warband analysis, log analysis, M+ utilities, and raid management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-wow-gradient text-white min-h-screen`}>
        <header className="bg-black/30 backdrop-blur-sm border-b border-wow-blue/20">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-wow-gold">WoW Tools</h1>
              <div className="flex space-x-6">
                <a href="/" className="hover:text-wow-blue transition-colors">Home</a>
                <a href="/logs" className="hover:text-wow-blue transition-colors">Log Analyzer</a>
                <a href="/mythic-plus" className="hover:text-wow-blue transition-colors">M+ Tools</a>
                <a href="/raid-utilities" className="hover:text-wow-blue transition-colors">Raid Utilities</a>
              </div>
            </div>
          </nav>
        </header>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
