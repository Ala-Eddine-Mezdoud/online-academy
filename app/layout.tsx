import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer' 
import './globals.css'


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="h-120">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}