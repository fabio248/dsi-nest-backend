import axios from 'axios';

export const getBufferImage = async (url: string): Promise<Buffer> => {
  const { data: logoImage } = await axios.get(url, {
    responseType: 'arraybuffer',
  });

  return Buffer.from(logoImage, 'base64');
};
