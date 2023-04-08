import { useEffect, useState, useContext } from 'react';
import Image from 'next/image';

import { NFTContext } from '../context/NFTContext';
import { shortenAddress } from '../utils/shortenAddress';
import { Loader, NFTCard, SearchBar, Banner } from '../components';
import images from '../assets';

const MyNFTs = () => {
  const { fetchMyNFTsOrCreatedNFTs, currentAccount } = useContext(NFTContext);
  const [nfts, setNfts] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSelect, setActiveSelect] = useState('Recently Added');

  //fetch data 
  useEffect(() => {
    fetchMyNFTsOrCreatedNFTs('fetchMyNFTs')
      .then((items) => {
        setNfts(items);
        setNftsCopy(items);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const sortedNfts = [...nfts];

    switch (activeSelect) {
      case 'Price (low to high)':
        setNfts(sortedNfts.sort((a, b) => a.price - b.price));
        break;
      case 'Price (high to low)':
        setNfts(sortedNfts.sort((a, b) => b.price - a.price));
        break;
      case 'Recently added':
        setNfts(sortedNfts.sort((a, b) => b.tokenId - a.tokenId));
        break;
      default:
        setNfts(nfts);
        break;
    }
  }, [activeSelect]);

  const onHandleSearch = (value) => {
    const filteredNfts = nfts.filter(({ name }) => name.toLowerCase().includes(value.toLowerCase()));

    if (filteredNfts.length === 0) {
      setNfts(nftsCopy);
    } else {
      setNfts(filteredNfts);
    }
  };

  const onClearSearch = () => {
    if (nfts.length && nftsCopy.length) {
      setNfts(nftsCopy);
    }
  };

  if (isLoading) {
    return (
      <div className="flexStart min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start">
      <div className="flexCenter w-full flex-col">
        <Banner
          name="Browse your NFTs"
          childStyles="text-center mb-4"
          parentStyle="h-80 justify-center"
        />

        <div className="flexCenter z-0 -mt-20 flex-col">
          <div className="flexCenter h-40 w-40 rounded-full bg-white p-1 dark:bg-nft-black-2 sm:h-36 sm:w-36">
            <Image src={`https://firebasestorage.googleapis.com/v0/b/nft-marketplace-332cc.appspot.com/o/creators%2Fcreator${1}.png?alt=media&token=a9f5cabe-d7a8-462b-945e-3ef375913764`} className="rounded-full  object-cover" objectFit="cover" width={200} height={200} />
          </div>
          <p className="mt-6 font-poppins text-2xl font-semibold text-nft-black-1 dark:text-white">{shortenAddress(currentAccount)}</p>
        </div>
      </div>

      {(!isLoading && nfts.length === 0) ? (
        <div className="flexCenter p-16 sm:p-4">
          <h1 className="font-poppins text-3xl font-extrabold text-nft-black-1 dark:text-white">No NFTs owned</h1>
        </div>
      ) : (
        <div className="flexCenter w-full flex-col p-12 sm:px-4 minmd:w-4/5">
          <div className="flex w-full flex-1 flex-row px-4 sm:flex-col xs:px-0 minlg:px-8">
            <SearchBar activeSelect={activeSelect} setActiveSelect={setActiveSelect} handleSearch={onHandleSearch} clearSearch={onClearSearch} />
          </div>
          <div className="mt-3 flex w-full flex-wrap">
            {nfts.map((nft) => <NFTCard key={`nft-${nft.tokenId}`} nft={nft} onProfilePage />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyNFTs;
