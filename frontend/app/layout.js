export const metadata = { title: 'YouTube AI Agent' };
export default function RootLayout({ children }){
  return (
    <html>
      <head />
      <body>
        <main style={{fontFamily:'Arial, sans-serif', padding:20}}>{children}</main>
      </body>
    </html>
  );
}
