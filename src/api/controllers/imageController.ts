import {Request, Response, NextFunction} from 'express';
import fetchData from '../../lib/fetchData';
import {ImageGenerateParams, ImagesResponse} from 'openai/resources';
import CustomError from '../../classes/CustomError';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const createImage = async (
  req: Request<{}, {}, {text: string}>,
  res: Response<{response: string}>,
  next: NextFunction
) => {
  try {
    if (!process.env.OPENAI_API_URL) {
      next(new CustomError('No OPENAI_API_URL in .env', 500));
      return;
    }

    const aiRequest: ImageGenerateParams = {
      model: 'dall-e-2',
      prompt: req.body.text,
      size: '256x256',
    };

    console.log('Fetching image with request:', aiRequest);

    const image = await fetchData<ImagesResponse>(
      process.env.OPENAI_API_URL + '/v1/images/generations',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aiRequest),
      }
    );

    if (!image || !image.data[0].url) {
      next(new CustomError('No image data', 500));
      return;
    }

    const imageUrl = image.data[0].url;
    const response = await fetch(imageUrl);
    const buffer = await response.buffer();
    const dirPath = '/Users/aihki/Documents/week4/AI-image-starter/ss';
    fs.mkdirSync(dirPath, { recursive: true });

    // Get the current highest image number
    const files = fs.readdirSync(dirPath);
    const imageNumbers = files
      .map(file => parseInt(file.match(/generated_image_(\d+)\.png/)?.[1] || '0'))
      .filter(num => !isNaN(num));
    const nextImageNumber = imageNumbers.length > 0 ? Math.max(...imageNumbers) + 1 : 1;

    const imagePath = path.join(dirPath, `generated_image_${nextImageNumber}.png`);

    fs.writeFile(imagePath, buffer, () => 
      console.log('Image saved to', imagePath)
    );

    res.json({response: image.data[0].url});
  } catch (error) {
    next(error);
  }
};

export {createImage};
