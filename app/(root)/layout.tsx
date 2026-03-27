
import "../globals.css";
import './root.css'


export default function RootLayout({
   children, }: Readonly<{children: React.ReactNode;}>) {

      return (
         <div>
            {children}
         </div>
      )


   }