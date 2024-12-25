import { v2 as cloudinary } from 'cloudinary'

export async function uploadToCloudinary(imageBase64: string): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      imageBase64,
      {
        resource_type: 'image',
        folder: 'dogs',
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Erro ao fazer upload: ${error.message}`))
        } else {
          resolve(result?.url || '')
        }
      },
    )
  })
}
