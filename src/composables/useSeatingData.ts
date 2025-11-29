import { shallowRef, ref } from 'vue'
import CryptoJS from 'crypto-js'
import { encryptedData } from '../assets/data'
import type { ISeatingData } from '../types/seating'

const dataRef = shallowRef<ISeatingData | null>(null)
const loadingRef = ref(false)
const errorRef = ref<string | null>(null)
let initialized = false

export function useSeatingData() {
  const SECRET_KEY = import.meta.env.VITE_SECRET_KEY

  if (!initialized) {
    initialized = true
    if (!SECRET_KEY) {
      console.error('金鑰未設定，請在 .env 加上 VITE_SECRET_KEY')
      errorRef.value = '金鑰未設定'
    } else {
      try {
        loadingRef.value = true
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY)
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8)

        if (!decryptedString) {
          throw new Error('解密金鑰錯誤或資料已損毀。')
        }

        dataRef.value = JSON.parse(decryptedString) as ISeatingData
      } catch (err) {
        console.error('資料解密或解析失敗:', err)
        errorRef.value = '資料解密失敗'
      } finally {
        loadingRef.value = false
      }
    }
  }

  return {
    rawData: dataRef,
    loading: loadingRef,
    error: errorRef,
  }
}
