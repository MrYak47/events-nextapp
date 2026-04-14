import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono} from "next/font/google";
import "./globals.css";
import "./(root)/root.css"
import LightRays from '../components/LightRays'
import Navbar from '../components/Navbar'
import { PostHogPageView } from '../components/PostHogPageView'
import { PostHogProviderWrapper } from '../components/PostHogProviderWrapper'
import { Suspense } from 'react'

// Google font configs
const schibstedGrotesk = Schibsted_Grotesk({
   subsets: ["latin"],
   weight: ["400", "500", "700"], // adjust as needed
   variable: "--font-schibsted-grotesk",
   display: "swap",
});

const martianMono = Martian_Mono({
   subsets: ["latin"],
   weight: ["400", "500", "700"], // adjust as needed
   variable: "--font-martian-mono",
   display: "swap",
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
         <body className={`${schibstedGrotesk.variable} ${martianMono.variable}`}>
            <PostHogProviderWrapper>
               
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
         
            </PostHogProviderWrapper>
         
         </body>


      </html>
   );
}
