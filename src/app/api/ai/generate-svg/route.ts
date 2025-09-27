import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { componentData, featureType, description } = await request.json()

    if (!componentData || !featureType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Placeholder SVG generation - will be replaced with actual AI SVG generation
    const generatePlaceholderSVG = (type: string, color: string, name: string) => {
      switch (type) {
        case 'head':
          return `
            <svg width="200" height="200" viewBox="0 0 200 200">
              <ellipse cx="100" cy="80" rx="60" ry="50" fill="${color}" stroke="#08B0D5" stroke-width="2"/>
              <circle cx="85" cy="70" r="8" fill="#08B0D5"/>
              <circle cx="115" cy="70" r="8" fill="#08B0D5"/>
              <rect x="90" y="90" width="20" height="8" fill="#08B0D5"/>
              <text x="100" y="140" text-anchor="middle" fill="white" font-size="12">${name}</text>
            </svg>
          `
        case 'arm':
          return `
            <svg width="200" height="200" viewBox="0 0 200 200">
              <rect x="80" y="40" width="40" height="120" fill="${color}" stroke="#08B0D5" stroke-width="2"/>
              <circle cx="100" cy="50" r="15" fill="#08B0D5"/>
              <rect x="70" y="150" width="60" height="20" fill="#08B0D5"/>
              <text x="100" y="190" text-anchor="middle" fill="white" font-size="12">${name}</text>
            </svg>
          `
        case 'leg':
          return `
            <svg width="200" height="200" viewBox="0 0 200 200">
              <rect x="85" y="30" width="30" height="140" fill="${color}" stroke="#08B0D5" stroke-width="2"/>
              <circle cx="100" cy="40" r="12" fill="#08B0D5"/>
              <rect x="80" y="160" width="40" height="25" fill="#08B0D5"/>
              <text x="100" y="200" text-anchor="middle" fill="white" font-size="12">${name}</text>
            </svg>
          `
        case 'weapon':
          return `
            <svg width="200" height="200" viewBox="0 0 200 200">
              <rect x="60" y="80" width="80" height="20" fill="${color}" stroke="#08B0D5" stroke-width="2"/>
              <rect x="50" y="85" width="20" height="10" fill="#08B0D5"/>
              <rect x="130" y="85" width="20" height="10" fill="#08B0D5"/>
              <circle cx="100" cy="90" r="3" fill="#F9D648"/>
              <text x="100" y="120" text-anchor="middle" fill="white" font-size="12">${name}</text>
            </svg>
          `
        default:
          return `
            <svg width="200" height="200" viewBox="0 0 200 200">
              <rect x="50" y="50" width="100" height="100" fill="${color}" stroke="#08B0D5" stroke-width="2"/>
              <text x="100" y="110" text-anchor="middle" fill="white" font-size="12">${name}</text>
            </svg>
          `
      }
    }

    const svg = generatePlaceholderSVG(featureType, componentData.color, componentData.name)

    return NextResponse.json({
      success: true,
      svg,
      componentData
    })

  } catch (error) {
    console.error('SVG generation error:', error)
    return NextResponse.json({ error: 'SVG generation failed' }, { status: 500 })
  }
}
