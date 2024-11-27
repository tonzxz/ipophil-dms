// src/lib/utils/file.ts
export const fileToBase64 = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer()
    const bytes = new Uint8Array(buffer)
    const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '')
    return `data:${file.type};base64,${btoa(binary)}`
}

export const isValidImageFile = (file: File): boolean => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    return validTypes.includes(file.type)
}