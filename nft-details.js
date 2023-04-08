import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { NFTContext } from '../context/NFTContext';
import { shortenAddress } from '../utils/shortenAddress';
import { Button, Loader, Modal } from '../components';
import images from '../assets';

const PaymentBodyCmp = ({ nft, nftCurrency }) => (
  <div className="flex flex-col">
    <div className="flexBetween">
      <p className="font-poppins text-base font-semibold text-nft-black-1 dark:text-white minlg:text-xl">Item</p>
      <p className="font-poppins text-base font-semibold text-nft-black-1 dark:text-white minlg:text-xl">Subtotal</p>
    </div>

    <div className="flexBetweenStart my-5">
      <div className="flexStartCenter flex-1">
        <div className="relative h-28 w-28">
          <Image src={nft.image || images[`nft${nft.i}`]} layout="fill" objectFit="cover" />
        </div>
        <div className="flexCenterStart ml-5 flex-col">
          <p className="font-poppins text-sm font-semibold text-nft-black-1 dark:text-white minlg:text-xl">{shortenAddress(nft.seller)}</p>
          <p className="font-poppins text-sm font-normal text-nft-black-1 dark:text-white minlg:text-xl">{nft.name}</p>
        </div>
      </div>

      <div>
        <p className="font-poppins text-sm font-normal text-nft-black-1 dark:text-white minlg:text-xl">{nft.price} <span className="font-semibold">{nftCurrency}</span></p>
      </div>
    </div>

    <div className="flexBetween mt-10">
      <p className="font-poppins text-base font-semibold text-nft-black-1 dark:text-white minlg:text-xl">Total</p>
      <p className="font-poppins text-base font-normal text-nft-black-1 dark:text-white minlg:text-xl">{nft.price} <span className="font-semibold">{nftCurrency}</span></p>
    </div>
  </div>
);

const NFTDetails = () => {
  const { nftCurrency, buyNFT, currentAccount, isLoadingNFT } = useContext(NFTContext);
  const [nft, setNft] = useState({ image: '', itemId: '', name: '', owner: '', price: '', seller: '' });
  const [paymentModal, setPaymentModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (paymentModal || successModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
  }, [paymentModal, successModal]);

  useEffect(() => {
    if (!router.isReady) return;

    setNft(router.query);

    setIsLoading(false);
  }, [router.isReady]);

  const checkout = async () => {
    await buyNFT(nft);

    setPaymentModal(false);
    setSuccessModal(true);
  };

  if (isLoading) return <Loader />;

  console.log(nft.seller);

  return (
    <div className="relative flex min-h-screen justify-center md:flex-col">
      <div className="flexCenter relative flex-1 border-r border-nft-gray-1 dark:border-nft-black-1 md:border-r-0 md:border-b sm:px-4">
        <div className="relative h-557 w-557 md:mt-20 sm:h-300 sm:w-full minmd:h-2/3 minmd:w-2/3 ">
          <Image src={nft.image || images[`nft${nft.i}`]} objectFit="cover" className=" rounded-xl shadow-lg" layout="fill" />
        </div>
      </div>

      <div className="flex-1 justify-start p-12 lg:my-auto sm:px-4 sm:pb-4">
        <div className="flex flex-row sm:flex-col">
          <h2 className="font-poppins text-2xl font-semibold text-nft-black-1 dark:text-white minlg:text-3xl">{nft.name}</h2>
        </div>

        <div className="mt-10">
          <p className="font-poppins text-xs font-normal text-nft-black-1 dark:text-white minlg:text-base">Creator</p>
          <div className="mt-3 flex flex-row items-center">
            <div className="relative mr-2 h-12 w-12 minlg:h-20 minlg:w-20">
              <Image src={`https://firebasestorage.googleapis.com/v0/b/nft-marketplace-332cc.appspot.com/o/creators%2Fcreator${1}.png?alt=media&token=a9f5cabe-d7a8-462b-945e-3ef375913764`}  width={50} height={50}objectFit="cover" className="rounded-full" />
            </div>
            <p className="font-poppins text-sm font-semibold text-nft-black-1 dark:text-white minlg:text-lg">{shortenAddress(nft.owner)}</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col">
          <div className="flex w-full flex-row border-b border-nft-gray-1 dark:border-nft-black-1">
            <p className="mb-2 font-poppins text-base font-medium text-nft-black-1 dark:text-white">Details</p>
          </div>
          <div className="mt-3">
            <p className="font-poppins text-base font-normal text-nft-black-1 dark:text-white">
              {nft.description}
            </p>
          </div>
        </div>
        <div className="mt-10 flex flex-row sm:flex-col">
          {currentAccount === nft.seller.toLowerCase()
            ? (
              <p className="border border-gray-300 p-2 font-poppins text-base font-normal text-nft-black-1 dark:text-white">
                You cannot buy your own NFT
              </p>
            )
            : currentAccount === nft.owner.toLowerCase()
              ? (
                <Button
                  btnName="List on Marketplace"
                  btnType="primary"
                  classStyles="mr-5 sm:mr-0 sm:mb-5 rounded-xl"
                  handleClick={() => router.push(`/resell-nft?tokenId=${nft.tokenId}&tokenURI=${nft.tokenURI}`)}
                />
              )
              : (
                <Button
                  btnName={`Buy for ${nft.price} ${nftCurrency}`}
                  btnType="primary"
                  classStyles="mr-5 sm:mr-0 sm:mb-5 rounded-xl"
                  handleClick={() => setPaymentModal(true)}
                />
              )}
        </div>
      </div>

      {paymentModal && (
        <Modal
          header="Check Out"
          body={<PaymentBodyCmp nft={nft} nftCurrency={nftCurrency} />}
          footer={(
            <div className="flex flex-row sm:flex-col">
              <Button
                btnName="Checkout"
                btnType="primary"
                classStyles="mr-5 sm:mr-0 sm:mb-5 rounded-xl"
                handleClick={checkout}
              />
              <Button
                btnName="Cancel"
                btnType="outline"
                classStyles="rounded-lg"
                handleClick={() => setPaymentModal(false)}
              />
            </div>
          )}
          handleClose={() => setPaymentModal(false)}
        />
      )}

      {isLoadingNFT && (
      <Modal
        header="Buying NFT..."
        body={
        (
          <div className="flexCenter flex-col text-center">
            <div className="relative h-52 w-52">
              <Loader />
            </div>
          </div>
        )
}
        handleClose={() => setPaymentModal(false)}
      />
      )}

      {isLoadingNFT && (
        <Modal
          header="Buying NFT..."
          body={(
            <div className="flexCenter flex-col text-center">
              <div className="relative h-52 w-52">
                <Loader />
              </div>
            </div>
          )}
          handleClose={() => setSuccessModal(false)}
        />
      )}

      {successModal && (
        <Modal
          header="Payment Successful"
          body={(
            <div className="flexCenter flex-col text-center" onClick={() => setSuccessModal(false)}>
              <div className="relative h-52 w-52">
                <Image src={nft.image || images[`nft${nft.i}`]} objectFit="cover" layout="fill" />
              </div>
              <p className="mt-10 font-poppins text-sm font-normal text-nft-black-1 dark:text-white minlg:text-xl"> You successfully purchased <span className="font-semibold">{nft.name}</span> from <span className="font-semibold">{shortenAddress(nft.seller)}</span>.</p>
            </div>
          )}
          footer={(
            <div className="flexCenter flex-col">
              <Button
                btnName="Check it out"
                btnType="primary"
                classStyles="sm:mr-0 sm:mb-5 rounded-xl"
                handleClick={() => router.push('/my-nfts')}
              />
            </div>
          )}
          handleClose={() => setSuccessModal(false)}
        />
      )}
    </div>
  );
};

export default NFTDetails;
