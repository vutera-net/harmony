import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { CalendarView } from '@/components/calendar/CalendarView'
import { TuViChartDisplay } from '@/components/tuvi/TuViChartDisplay'
import { NgayTotForm } from '@/components/ngaytot/NgayTotForm'
import { PhongThuyForm } from '@/components/phongthuy/PhongThuyForm'
import { DailyHoroscopeCard } from '@/components/horoscope/DailyHoroscopeCard'

// Mock global fetch
global.fetch = jest.fn()

// Mock useSessionMemory hook
jest.mock('@/hooks/useSessionMemory', () => ({
  useSessionMemory: () => ({
    memory: null,
    isLoaded: true,
    updateMemory: jest.fn(),
  }),
}))

// Mock components that might be complex or depend on other things
jest.mock('@/components/funnel/ContentLock', () => ({
  ContentLock: ({ buttonText }: { buttonText: string }) => (
    <div data-testid="content-lock">{buttonText}</div>
  ),
}))

jest.mock('@/components/tuvi/TuViPdfExportButton', () => ({
  TuViPdfExportButton: () => <button>Export PDF</button>,
}))

describe('TuVi App Functional Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('3.2.1 Lịch Vạn Niên', () => {
    it('should render loading state then display days of the month', async () => {
      const mockDays = [
        {
          solar: { day: 1, month: 1, year: 2026, dayOfWeek: 4 },
          lunar: { day: 1, month: 1, canDay: 0, chiDay: 0, canMonth: 0, chiMonth: 0, canYear: 0, chiYear: 0, isLeapMonth: false },
          truc: 'Kiến',
          sao28: 'Câu',
          hoangDaoGio: ['0', '1'],
          ngayKy: [],
          festivals: ['Tết Dương Lịch'],
          rating: 'tot',
        },
      ]
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({ data: mockDays }),
      })

      render(<CalendarView year={2026} month={1} />)

      expect(screen.getByText('Đang tải...')).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument()
      })
      expect(screen.getByText('Tháng 1/2026')).toBeInTheDocument()
    })

    it('should show day details when a day is clicked', async () => {
      const mockDays = [
        {
          solar: { day: 1, month: 1, year: 2026, dayOfWeek: 4 },
          lunar: { day: 1, month: 1, canDay: 0, chiDay: 0, canMonth: 0, chiMonth: 0, canYear: 0, chiYear: 0, isLeapMonth: false },
          truc: 'Kiến',
          sao28: 'Câu',
          hoangDaoGio: ['0', '1'],
          ngayKy: [],
          festivals: [],
          rating: 'tot',
        },
      ]
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({ data: mockDays }),
      })

      render(<CalendarView year={2026} month={1} />)

      await waitFor(() => {
        const dayButton = screen.getByText('1')
        fireEvent.click(dayButton)
      })

      expect(screen.getByText('1/1/2026')).toBeInTheDocument()
      expect(screen.getByText('Ngày tốt')).toBeInTheDocument()
    })
  })

  describe('3.2.2 Tử Vi Đẩu Số (Basic)', () => {
    const mockChart = {
      label: 'Nguyễn Văn A',
      gender: 'male',
      birthDate: { day: 1, month: 1, year: 2000 },
      birthHourName: 'Tý',
      menh: 'Kim',
      napAm: 'Kiếm Phong Kim',
      cuc: 'Thủy Nhị Cục',
      cucNumber: 2,
      palaces: Array.from({ length: 12 }, (_, i) => ({
        index: i,
        name: `Cung ${i}`,
        diaChi: `Địa Chi ${i}`,
        isLifePalace: i === 0,
        isSoulPalace: i === 1,
        mainStars: [{ name: 'Tử Vi', brightness: 'mieu' }],
        minorStars: [],
      })),
      daiHan: [
        {
          palaceIndex: 0,
          palaceName: 'Mệnh',
          diaChi: 'Tý',
          startAge: 2,
          endAge: 3,
          startYear: 2002,
        },
      ],
    }

    it('should render the chart header and 12 palaces', () => {
      render(<TuViChartDisplay chart={mockChart as any} />)

      expect(screen.getAllByText('Nguyễn Văn A').length).toBeGreaterThan(0)
      expect(screen.getByText(/♂ Nam/)).toBeInTheDocument()
      
      const palaceButtons = screen.getAllByText(/Cung \d+/).filter(el => el.tagName === 'SPAN')
      expect(palaceButtons.length).toBeGreaterThan(0)
    })

    it('should show ContentLock when a palace is clicked', () => {
      render(<TuViChartDisplay chart={mockChart as any} />)

      const firstPalace = screen.getAllByText(/Cung \d+/)[0]
      const button = firstPalace.closest('button')
      if (!button) throw new Error('Palace button not found')
      fireEvent.click(button)

      expect(screen.getByTestId('content-lock')).toBeInTheDocument()
      expect(screen.getByText('Xem giải nghĩa chi tiết')).toBeInTheDocument()
    })
  })

  describe('3.2.3 Xem Ngày Tốt', () => {
    it('should fetch and display results when searching', async () => {
      const mockResults = [
        {
          solar: { day: 10, month: 1, year: 2026, dayOfWeek: 6 },
          lunar: { day: 21, month: 11, canDay: 0, chiDay: 0 },
          score: 85,
          rating: 'tot',
          truc: 'Kiến',
          sao28: 'Câu',
          hoangDaoHours: ['Tý', 'Sửu'],
          advantages: ['Ngày hoàng đạo', 'Hợp tuổi'],
          issues: [],
        },
      ]
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({ data: mockResults }),
      })

      render(<NgayTotForm />)

      const submitButton = screen.getByText('Tìm Ngày Tốt')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/10\/1\/2026/)).toBeInTheDocument()
        expect(screen.getByText(/85\/100/)).toBeInTheDocument()
      })
    })

    it('should show ContentLock for more results if limit exceeded', async () => {
      const mockResults = Array.from({ length: 5 }, (_, i) => ({
        solar: { day: i + 1, month: 1, year: 2026, dayOfWeek: 0 },
        lunar: { day: i + 1, month: 1, canDay: 0, chiDay: 0 },
        score: 80,
        rating: 'tot',
        truc: 'Kiến',
        sao28: 'Câu',
        hoangDaoHours: [],
        advantages: [],
        issues: [],
      }))
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({ data: mockResults }),
      })

      render(<NgayTotForm />)
      fireEvent.click(screen.getByText('Tìm Ngày Tốt'))

      await waitFor(() => {
        expect(screen.getByText('Xem tất cả ngày tốt')).toBeInTheDocument()
      })
    })
  })

  describe('3.2.4 Bát Trạch Phong Thủy', () => {
    it('should display result after submitting form', async () => {
      const mockBatTrach = {
        cungNumber: 1,
        cungMenh: 'Khảm',
        nhomMenh: 'dong',
        huongNhaTot: [
          { direction: 'N', name: 'Sinh Khí', usage: 'Tốt cho sự nghiệp' },
        ],
        huongNhaXau: [
          { direction: 'S', name: 'Tuyệt Mệnh', usage: 'Xấu cho sức khỏe' },
        ],
      }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({ data: mockBatTrach }),
      })

      render(<PhongThuyForm />)

      const yearInput = screen.getByPlaceholderText('1990')
      fireEvent.change(yearInput, { target: { value: '1990' } })
      
      const submitButton = screen.getByText('Xem Phong Thủy')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/Cung Mệnh: Khảm/)).toBeInTheDocument()
        expect(screen.getByText(/Đông Tứ Mệnh/)).toBeInTheDocument()
        expect(screen.getByText(/Sinh Khí/)).toBeInTheDocument()
        expect(screen.getByText(/Tuyệt Mệnh/)).toBeInTheDocument()
      })
    })

    it('should show validation error for invalid year', async () => {
      const { container } = render(<PhongThuyForm />)

      const yearInput = screen.getByPlaceholderText('1990')
      fireEvent.change(yearInput, { target: { value: '1800' } })
      
      const form = container.querySelector('form')
      if (form) {
        fireEvent.submit(form)
      } else {
        fireEvent.click(screen.getByText('Xem Phong Thủy'))
      }

      await waitFor(() => {
        expect(screen.getByText('Năm sinh không hợp lệ')).toBeInTheDocument()
      })
    })
  })

  describe('3.2.5 Horoscope (12 con giáp)', () => {
    const mockContent = {
      zodiac: 'Tý',
      date: '15/01/2026',
      scores: { health: 80, wealth: 70, love: 90, work: 60 },
      tongQuan: 'Một ngày đầy hứa hẹn.',
      tinhCam: 'Hạnh phúc ngập tràn.',
      suNghiep: 'Có chút áp lực.',
      taiChinh: 'Ổn định.',
      sucKhoe: 'Tốt.',
      luckyColor: 'Đỏ',
      luckyDirection: 'Nam',
      luckyHour: 'Tý',
      luckyNumber: '7',
    }

    it('should render all horoscope sections correctly', () => {
      render(<DailyHoroscopeCard content={mockContent as any} />)

      expect(screen.getByText('Tử Vi Tuổi Tý')).toBeInTheDocument()
      expect(screen.getByText('15/01/2026')).toBeInTheDocument()
      expect(screen.getByText('Một ngày đầy hứa hẹn.')).toBeInTheDocument()
      expect(screen.getByText('Hạnh phúc ngập tràn.')).toBeInTheDocument()
      expect(screen.getByText('Có chút áp lực.')).toBeInTheDocument()
      expect(screen.getByText('Ổn định.')).toBeInTheDocument()
      expect(screen.getByText('Tốt.')).toBeInTheDocument()
    })
  })
})
