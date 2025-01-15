export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidPhone(phone: string) {
  return /^\+?[1-9]\d{1,14}$/.test(phone) // E.164 format
}

export function isValidFileName(fileName: string) {
  return fileName.length > 0 && fileName.length < 255
} 