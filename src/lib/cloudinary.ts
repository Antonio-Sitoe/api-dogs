import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: 'noblestack',
  api_key: '226195463996143',
  api_secret: `${process.env.CLOUDINARY_PROVIDER_KEY}`,
})
