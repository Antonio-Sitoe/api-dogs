/* eslint-disable @typescript-eslint/no-explicit-any */
interface IPhotoProps {
  img: Buffer
  nome: string
  idade: number
  peso: number
}

export async function extractParts(parts: any): Promise<IPhotoProps> {
  const formdata: Record<string, any> = {}
  for await (const part of parts) {
    if (part.file) {
      const chunks: Buffer[] = []
      for await (const chunk of part.file) {
        chunks.push(chunk)
      }
      const buffer = Buffer.concat(chunks)
      formdata[part.fieldname] = buffer
    } else {
      formdata[part.fieldname] = part.value
    }
  }
  return formdata as IPhotoProps
}
