import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { Fira_Code } from "next/font/google"
import "./globals.css"

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "SkillXpress - AI-Assisted Micro-Internship Platform",
  description: "Connect students with real-world micro-internship opportunities",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${firaCode.variable};
}
        `}</style>
      </head>
      <body
        className={`${GeistSans.variable} ${firaCode.variable} min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
