import React, { useState, useMemo, useCallback, useContext } from 'react';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import { NFTContext } from '../context/NFTContext';
import { Input, Button, Loader } from '../components/index';
import images from '../assets';

const CreateNFT = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, setFormInput] = useState({ price: '', name: '', description: '' });
  const { theme } = useTheme();
  const { isLoadingNFT, uploadToIPFS, createNFT } = useContext(NFTContext);
  const router = useRouter();

  const onDrop = useCallback(async (acceptedFile) => {
    const url = await uploadToIPFS(acceptedFile[0]);
    setFileUrl(url);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({ onDrop, accept: 'image/*', maxSize: 5000000 });

  const fileStyle = useMemo(() => (
    `dark:bg-nft-black-1 bg-white border dark:border-white border-nft-gray-2 flex flex-col items-center p-5 rounded-sm border-dashed ${isDragActive && 'border-file-active'} ${isDragActive && 'border-file-accept'} ${isDragReject && 'border-file-reject'}`
  ), [isDragAccept, isDragActive, isDragReject]);

  if (isLoadingNFT) {
    return (
      <div className="flexStart min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex justify-center p-12 sm:px-4">
      <div className="w-3/5 md:w-full">
        <h1 className="flex-1 font-poppins text-2xl font-semibold text-nft-black-1 dark:text-white sm:mb-4 minlg:text-4xl">Create new NFT</h1>

        <div className="mt-16 ">
          <p className="font-poppins text-xl font-semibold text-nft-black-1 dark:text-white">Upload File</p>
          <div className="mt-4">
            <div {...getRootProps()} className={fileStyle}>
              <input {...getInputProps()} />
              <div className="flexCenter flex-col text-center" />
              <p className="font-poppins text-xl font-semibold text-nft-black-1 dark:text-white">JPG, PNG, GIF, SVG, WEBM Max 100mb.</p>
              <div className="my-12 flex w-full justify-center">
                <Image src={images.upload} width={100} height={100} objectFit="contain" alt="file upload" className={theme === 'light' && 'invert'} />
              </div>

              <p className="font-poppins text-sm font-semibold text-nft-black-1 dark:text-white">Drag and Drop File</p>
              <p className="mt-2 font-poppins text-sm font-semibold text-nft-black-1 dark:text-white">or Browse media on your device</p>
            </div>
          </div>
          {fileUrl && (
            <aside>
              <div>
                <img src={fileUrl} className="mx-auto mt-12 flex h-1/2 w-1/2" alt="asset_file" />
              </div>
            </aside>
          )}
        </div>

        <Input inputType="input" title="Name" placeholder="NFT Name" handleClick={(e) => { setFormInput({ ...formInput, name: e.target.value }); }} />
        <Input inputType="textarea" title="Description" placeholder="NFT Description" handleClick={(e) => { setFormInput({ ...formInput, description: e.target.value }); }} />
        <Input inputType="number" title="Price" placeholder="NFT Price" handleClick={(e) => { setFormInput({ ...formInput, price: e.target.value }); }} />
        <div className="mt-7 flex w-full justify-end">
          <Button btnName="Create NFT" className="rounded-xl" handleClick={() => createNFT(formInput, fileUrl, router)} />
        </div>
      </div>
    </div>
  );
};

export default CreateNFT;
