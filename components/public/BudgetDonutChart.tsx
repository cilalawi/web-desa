'use client'

import { useState } from 'react'

type BudgetItem = {
  id: string
  label: string
  value: string
  description?: string
}

export function BudgetDonutChart({ items }: { items: BudgetItem[] }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  // Parse string values into numbers
  const parseNumber = (valStr: string) => {
    const clean = valStr.replace(/[^0-9]/g, '')
    const parsed = parseInt(clean, 10)
    return isNaN(parsed) ? 0 : parsed
  }

  const parsedItems = items.map((item) => ({
    ...item,
    numValue: parseNumber(item.value),
  }))

  const totalNum = parsedItems.reduce((acc, curr) => acc + curr.numValue, 0)

  const hasData = totalNum > 0
  const chartData = parsedItems.map((item, idx) => {
    const share = hasData ? item.numValue / totalNum : 1 / items.length
    return {
      ...item,
      share,
      percentage: Math.round(share * 100),
    }
  })

  // Format currency value helper
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num)
  }

  // Segment colors (matching premium emerald style)
  const colors = [
    'stroke-emerald-800 fill-none', // Primary
    'stroke-emerald-500 fill-none', // Secondary
    'stroke-lime-500 fill-none',    // Tertiary
    'stroke-teal-500 fill-none',    // 4th if any
    'stroke-emerald-300 fill-none', // 5th if any
  ]

  const fillColors = [
    'bg-emerald-800',
    'bg-emerald-500',
    'bg-lime-500',
    'bg-teal-500',
    'bg-emerald-300',
  ]

  // Donut SVG layout details
  const size = 260
  const radius = 85
  const strokeWidth = 20
  const center = size / 2
  const circumference = 2 * Math.PI * radius

  let accumulatedPercentage = 0

  return (
    <div className="flex flex-col items-center justify-center p-1 text-emerald-950 md:p-2">
      <div className="relative size-[220px] md:size-[260px]">
        {/* SVG Donut */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="h-[220px] w-[220px] -rotate-90 transform select-none md:h-[260px] md:w-[260px]"
        >
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            className="stroke-neutral-100 fill-none"
            strokeWidth={strokeWidth}
          />

          {/* Data segments */}
          {chartData.map((item, idx) => {
            const strokeDasharray = `${item.share * circumference} ${circumference}`
            const strokeDashoffset = -((accumulatedPercentage / 100) * circumference)
            accumulatedPercentage += item.share * 100

            const isHovered = hoveredIdx === idx
            const baseColorClass = colors[idx % colors.length]

            return (
              <circle
                key={item.id}
                cx={center}
                cy={center}
                r={radius}
                className={`cursor-pointer ${baseColorClass}`}
                style={{
                  strokeWidth: isHovered ? strokeWidth + 3 : strokeWidth,
                  opacity: hoveredIdx === null ? 1 : isHovered ? 1 : 0.45,
                  transition: 'stroke-width 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.25s ease',
                }}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            )
          })}
        </svg>

        {/* Center Text Container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center pointer-events-none md:p-6">
          {hoveredIdx !== null ? (
            <div className="flex flex-col items-center justify-center animate-fade-in">
              <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-emerald-700 w-36 truncate">
                {chartData[hoveredIdx].label}
              </p>
              <p className="mt-1 text-base font-black text-emerald-950 leading-tight w-36 truncate">
                {chartData[hoveredIdx].value}
              </p>
              {hasData && (
                <p className="mt-1 text-[0.65rem] font-bold text-emerald-800/80">
                  {chartData[hoveredIdx].percentage}% dari total
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-emerald-700">
                Transparansi Anggaran
              </p>
              <p className="mt-1 text-lg font-black text-emerald-950 leading-none">
                {hasData ? formatCurrency(totalNum) : '2026'}
              </p>
              <p className="mt-1.5 text-[0.58rem] font-bold text-emerald-950/45">
                {hasData ? 'Total APBDes' : 'Sorot diagram untuk info'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Clean horizontal row legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-x-3 gap-y-1.5 text-[0.62rem] md:mt-6 md:gap-x-5 md:gap-y-2 md:text-[0.68rem]">
        {chartData.map((item, idx) => (
          <div
            key={item.id}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            className="flex items-center gap-1.5 cursor-pointer select-none transition-opacity duration-200"
            style={{
              opacity: hoveredIdx === null ? 1 : hoveredIdx === idx ? 1 : 0.5,
            }}
          >
            <span className={`size-2.5 rounded-full shrink-0 ${fillColors[idx % fillColors.length]}`} />
            <span className="font-extrabold text-emerald-950/80 hover:text-emerald-950 transition-colors">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
