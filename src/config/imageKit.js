import Imagekit from "@imagekit/nodejs";


const imagekitInstance = new Imagekit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const uploadToImagekit = async (file, userId) => {
  // Convert multer's memory buffer into an ImageKit file upload.
  const uploaded= await imagekitInstance.files.upload({
    file: await Imagekit.toFile(file.buffer, file.originalname),
    fileName: `product-${userId}-${Date.now()}`,
    folder: "/peerCommerce/products",
  });
  return uploaded.url
};

// presigned url implementation


export { imagekitInstance, uploadToImagekit };
