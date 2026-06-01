import { imagekitInstance } from "../config/imageKit.js";

const getImagekitAuth = (req, res) => {
  const authParams = imagekitInstance.helper.getAuthenticationParameters();

  res.json({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    URLEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    authenticationParameters: authParams,
  });
};

export { getImagekitAuth };

/**
 * @belowcode to implement this in frontend
 */

// const auth = await fetch("/api/imagekit/imagekit-auth").then(res => res.json());

// const formData = new FormData();
// formData.append("file", file);
// formData.append("fileName", file.name);
// formData.append("publicKey", auth.publicKey);
// formData.append("signature", auth.authenticationParameters.signature);
// formData.append("expire", auth.authenticationParameters.expire);
// formData.append("token", auth.authenticationParameters.token);

// const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
//   method: "POST",
//   body: formData,
// });
