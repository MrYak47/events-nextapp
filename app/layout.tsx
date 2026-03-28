import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono, Geist } from "next/font/google";
import "./globals.css";
import "./(root)/root.css"
import { cn } from "@/lib/utils";
import LightRays from '../components/LightRays'
import Navbar from '../components/Navbar'
import { PostHogProvider } from '../components/PostHogProvider'
import { PostHogPageView } from '../components/PostHogPageView'
import { Suspense } from 'react'

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const schibstedG = Schibsted_Grotesk({
   variable: "--font-schibsted_grotesk",
   subsets: ["latin"],
});


const matianM = Martian_Mono({
   variable: "--font-martian-mono",
   subsets: ["latin"],
});


export const metadata: Metadata = {
   title: "DevEvent",
   description: "The Hub for Every Dev You Mustn't Miss",
};

// className={cn("font-sans", geist.variable)}
export default function RootLayout({children,}:
   Readonly<{children: React.ReactNode;}>) {

      
      
   return (
      <html lang="en" >
         <body className={`${schibstedG.variable} ${matianM.variable} min-h-screen antialiased`}>
         <PostHogProvider>
         <Suspense fallback={null}><PostHogPageView /></Suspense>

            <Navbar />
            
            <div className="rays">
               <LightRays
                  raysOrigin="top-center-offset"
                  raysColor="#5dfeca"
                  raysSpeed={1}
                  lightSpread={1.1}
                  rayLength={3}
                  followMouse={true}
                  mouseInfluence={0.3}
                  noiseAmount={0.01}
                  distortion={0}
                  className="custom-rays"
                  pulsating={false}
                  fadeDistance={1.3}
                  saturation={1.3} />
            </div>

            <main>
               {children}
            </main>
         
         
         </PostHogProvider>
         </body>


      </html>
   );
}
