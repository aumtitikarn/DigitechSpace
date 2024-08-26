'use server'
import path from "path"
import fs from "fs/promises"

async function savePhotoToLocal(formData) {
    const files = formData.getAll('files')
    
    const multipleBuffersPromise = files.map(files => (
        file.arrayBuffer()
        .then(data => {
            const buffer = Buffer.from(data)

            const uploadDir = path.join(process.cwd(),"public",`/${file.name}`)

            fs.writeFile(uploadDir,buffer)
        })
    ))
}

export async function uploadPhoto(formData) {
    try{

        const newFiles = await savePhotoToLocal(formData)

    }catch(error){
        return {errMsg: error.message}
    }
  }