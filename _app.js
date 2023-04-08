import Script from 'next/script';
import { ThemeProvider } from 'next-themes';

import { NFTProvider } from '../context/NFTContext';
import { Footer, Navbar } from '../components';
import '../styles/globals.css';

const Marketplace = ({ Component, pageProps }) => (

  <NFTProvider>
    <ThemeProvider attribute="class">
      <div className="min-h-screen bg-white dark:bg-nft-dark">
        <Navbar />
        <div className="">
          <Component {...pageProps} />
        </div>
        <Footer />
      </div>

      <Script src="https://kit.fontawesome.com/492789e775.js" crossorigin="anonymous" />
    </ThemeProvider>
  </NFTProvider>
);

export default Marketplace;
