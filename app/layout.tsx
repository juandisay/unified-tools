import type { Metadata } from "next";
import { Inter, Baloo_Tammudu_2 } from "next/font/google";
import "./globals.css";
import { FloatingNav } from "@/components/FloatingNav";
import { TimerProvider } from "@/contexts/TimerContext";
import { GlobalTimerHeader } from "@/components/GlobalTimerHeader";
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const baloo = Baloo_Tammudu_2({
  variable: "--font-baloo",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
export const metadata: Metadata = {
  metadataBase: new URL("https://4track.my.id"),
  title: {
    default: "4track.my.id | Focus Timer",
    template: "%s | 4track.my.id",
  },
  description: "A free, modern, and minimalist Pomodoro timer built to help you manage your workflow and maintain deep focus.",
  keywords: [
    "pomodoro timer",
    "focus timer",
    "productivity tool",
    "study timer",
    "work management",
    "time boxing",
    "4track.my.id",
    "minimalist timer"
  ],
  authors: [{ name: "juandisay", url: "https://juandisay.org" }],
  creator: "juandisay",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://4track.my.id",
    title: "4track.my.id | Minimalist Focus Timer",
    description: "A free, modern, and minimalist Pomodoro timer built to help you manage your workflow and maintain deep focus.",
    siteName: "4track.my.id",
  },
  twitter: {
    card: "summary_large_image",
    title: "4track.my.id | Minimalist Focus Timer",
    description: "Boost your productivity with this elegant, distraction-free Pomodoro timer.",
    creator: "@juandisay",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${baloo.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col">
        <TimerProvider>
          <GlobalTimerHeader />
          {children}
          <FloatingNav />
        </TimerProvider>
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-2PT41BMK3F"} />
      </body>
    </html>
  );
}
