export type BirthdayCountdown = { isToday: true; days: 0 } | { isToday: false; days: number }

/**
 * Menghitung hari menuju ulang tahun berikutnya dari 'YYYY-MM-DD' atau 'MM-DD'.
 * Mengembalikan null bila tanggal kosong/tidak valid — UI lalu menyembunyikan countdown.
 * Tahun lahir sengaja diabaikan: situs tidak menampilkan umur.
 */
export function getBirthdayCountdown(birthDate: string | null | undefined, now = new Date()): BirthdayCountdown | null {
  const match = birthDate?.trim().match(/^(?:\d{4}-)?(\d{2})-(\d{2})$/)
  if (!match) return null
  const month = Number(match[1]) - 1
  const day = Number(match[2])
  const probe = new Date(2024, month, day) // tahun kabisat: 29 Feb valid
  if (probe.getMonth() !== month || probe.getDate() !== day) return null

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const at = (year: number) => {
    const date = new Date(year, month, day)
    return date.getMonth() === month ? date : new Date(year, 2, 1) // 29 Feb di tahun biasa → 1 Mar
  }
  let next = at(today.getFullYear())
  if (next < today) next = at(today.getFullYear() + 1)
  const days = Math.round((next.getTime() - today.getTime()) / 86_400_000)
  return days === 0 ? { isToday: true, days: 0 } : { isToday: false, days }
}
