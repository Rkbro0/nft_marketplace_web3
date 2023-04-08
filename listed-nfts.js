import { useEffect, useState, useContext } from 'react';

import { NFTContext } from '../context/NFTContext';
import { Loader, NFTCard } from '../components';

const listedNFTs = () => {
  const { fetchMyNFTsOrCreatedNFTs } = useContext(NFTContext);
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyNFTsOrCreatedNFTs('fetchItemsListed')
      .then((items) => {
        setNfts(items);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flexStart min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!isLoading && nfts.length === 0) {
    return (
      <div className="flexCenter min-h-screen p-16 sm:p-4">
        <h1 className="font-poppins text-3xl font-extrabold text-nft-black-1 dark:text-white">No NFTs Listed for Sale</h1>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen justify-center p-12 sm:px-4">
      <div className="w-full minmd:w-4/5">
        <div className="mt-4">
          <h2 className="mt-2 ml-4 font-poppins text-2xl font-semibold text-nft-black-1 dark:text-white sm:ml-2">NFTs Listed for Sale</h2>
          <div className="mt-3 flex w-full flex-wrap justify-start md:justify-center">
            {nfts.map((nft) => <NFTCard key={`nft-${nft.tokenId}`} nft={nft} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default listedNFTs;
