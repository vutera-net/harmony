import type { TietKhi } from '@/types'

export const TIET_KHI: TietKhi[] = [
  { name: 'Lap Xuan', nameVi: 'Lập Xuân', month: 2, solarLongitude: 315, description: 'Bắt đầu mùa xuân' },
  { name: 'Vu Thuy', nameVi: 'Vũ Thủy', month: 2, solarLongitude: 330, description: 'Mưa nước' },
  { name: 'Kinh Trap', nameVi: 'Kinh Trập', month: 3, solarLongitude: 345, description: 'Sâu bọ thức giấc' },
  { name: 'Xuan Phan', nameVi: 'Xuân Phân', month: 3, solarLongitude: 0, description: 'Xuân phân' },
  { name: 'Thanh Minh', nameVi: 'Thanh Minh', month: 4, solarLongitude: 15, description: 'Trời quang mây tạnh' },
  { name: 'Coc Vu', nameVi: 'Cốc Vũ', month: 4, solarLongitude: 30, description: 'Mưa lúa' },
  { name: 'Lap Ha', nameVi: 'Lập Hạ', month: 5, solarLongitude: 45, description: 'Bắt đầu mùa hè' },
  { name: 'Tieu Man', nameVi: 'Tiểu Mãn', month: 5, solarLongitude: 60, description: 'Lúa bắt đầu chín' },
  { name: 'Mang Chung', nameVi: 'Mang Chủng', month: 6, solarLongitude: 75, description: 'Gieo hạt lúa mạch' },
  { name: 'Ha Chi', nameVi: 'Hạ Chí', month: 6, solarLongitude: 90, description: 'Hạ chí' },
  { name: 'Tieu Thu', nameVi: 'Tiểu Thử', month: 7, solarLongitude: 105, description: 'Hơi nóng nhỏ' },
  { name: 'Dai Thu', nameVi: 'Đại Thử', month: 7, solarLongitude: 120, description: 'Hơi nóng lớn' },
  { name: 'Lap Thu', nameVi: 'Lập Thu', month: 8, solarLongitude: 135, description: 'Bắt đầu mùa thu' },
  { name: 'Xu Thu', nameVi: 'Xử Thử', month: 8, solarLongitude: 150, description: 'Hết nóng bức' },
  { name: 'Bach Lo', nameVi: 'Bạch Lộ', month: 9, solarLongitude: 165, description: 'Sương trắng' },
  { name: 'Thu Phan', nameVi: 'Thu Phân', month: 9, solarLongitude: 180, description: 'Thu phân' },
  { name: 'Han Lo', nameVi: 'Hàn Lộ', month: 10, solarLongitude: 195, description: 'Sương lạnh' },
  { name: 'Suong Giong', nameVi: 'Sương Giáng', month: 10, solarLongitude: 210, description: 'Sương giáng xuống' },
  { name: 'Lap Dong', nameVi: 'Lập Đông', month: 11, solarLongitude: 225, description: 'Bắt đầu mùa đông' },
  { name: 'Tieu Tuyet', nameVi: 'Tiểu Tuyết', month: 11, solarLongitude: 240, description: 'Tuyết nhỏ' },
  { name: 'Dai Tuyet', nameVi: 'Đại Tuyết', month: 12, solarLongitude: 255, description: 'Tuyết lớn' },
  { name: 'Dong Chi', nameVi: 'Đông Chí', month: 12, solarLongitude: 270, description: 'Đông chí' },
  { name: 'Tieu Han', nameVi: 'Tiểu Hàn', month: 1, solarLongitude: 285, description: 'Lạnh nhỏ' },
  { name: 'Dai Han', nameVi: 'Đại Hàn', month: 1, solarLongitude: 300, description: 'Lạnh lớn' },
]

/**
 * Approximate solar term dates (day of month) for each year
 * In practice, computed from solar longitude - these are approximations
 */
export const TIET_KHI_APPROX_DAYS: number[] = [
  4, 19, // Jan: Tiểu Hàn, Đại Hàn
  4, 19, // Feb: Lập Xuân, Vũ Thủy
  6, 21, // Mar: Kinh Trập, Xuân Phân
  5, 20, // Apr: Thanh Minh, Cốc Vũ
  6, 21, // May: Lập Hạ, Tiểu Mãn
  6, 21, // Jun: Mang Chủng, Hạ Chí
  7, 23, // Jul: Tiểu Thử, Đại Thử
  7, 23, // Aug: Lập Thu, Xử Thử
  8, 23, // Sep: Bạch Lộ, Thu Phân
  8, 23, // Oct: Hàn Lộ, Sương Giáng
  7, 22, // Nov: Lập Đông, Tiểu Tuyết
  7, 22, // Dec: Đại Tuyết, Đông Chí
]

export function getTietKhiByName(nameVi: string): TietKhi | undefined {
  return TIET_KHI.find((tk) => tk.nameVi === nameVi)
}

export function getTietKhiByLongitude(longitude: number): TietKhi | undefined {
  // Each tiet khi spans 15 degrees
  const normalizedLong = (longitude + 360) % 360
  return TIET_KHI.find((tk) => tk.solarLongitude === Math.floor(normalizedLong / 15) * 15)
}

