import { Manrope, Playfair_Display } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['400', '500', '600', '700', '800'],
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata = {
  title: 'Dentamic | Premium zobārstniecības klīnika',
  description: 'Premium zobārstniecības klīnikas mājaslapa ar interaktīvu vizīšu pieteikšanas un speciālistu vizītkaršu sistēmu.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="lv" className={`${manrope.variable} ${playfairDisplay.variable}`}>
      <body className="antialiased text-[#1a1718] bg-[#fbf9f8] flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
}
