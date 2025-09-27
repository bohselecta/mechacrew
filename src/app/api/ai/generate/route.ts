import { NextRequest, NextResponse } from 'next/server'

const openai = process.env.OPENAI_API_KEY ? require('openai').default : null

interface MechaComponent {
  id: string
  type: 'head' | 'torso' | 'arm' | 'leg' | 'weapon' | 'accessory'
  name: string
  description: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  color: string
  material: string
  power: number
  durability: number
  weight: number
  createdBy: string
  createdAt: Date
}

export async function POST(request: NextRequest) {
  let command = ''
  try {
    const { command: requestCommand, existingComponents } = await request.json()
    command = requestCommand

    if (!command) {
      return NextResponse.json({ error: 'Command is required' }, { status: 400 })
    }

    // Create AI prompt for mecha component generation
    const systemPrompt = `You are an AI mecha designer for MechaCrew, a collaborative 3D mecha builder. 
    Generate realistic mecha components based on natural language commands.
    
    Current mecha has ${existingComponents?.length || 0} components.
    
    Return a JSON object with the following structure:
    {
      "name": "Component Name",
      "description": "Detailed description",
      "type": "head|torso|arm|leg|weapon|accessory",
      "position": [x, y, z],
      "rotation": [x, y, z],
      "scale": [x, y, z],
      "color": "#hexcolor",
      "material": "steel|titanium|energy|ceramic|composite",
      "power": number (0-200),
      "durability": number (0-100),
      "weight": number (0-100),
      "reasoning": "Why this component fits the command"
    }
    
    Make components realistic and balanced. Consider existing components for positioning.`

    if (!openai) {
      throw new Error('OpenAI not configured')
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: command }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from AI')
    }

    // Parse AI response
    let componentData
    try {
      componentData = JSON.parse(response)
    } catch (error) {
      // Fallback if AI doesn't return valid JSON
      componentData = {
        name: "AI Generated Component",
        description: `Generated from: "${command}"`,
        type: "weapon",
        position: [2, 1, 0],
        rotation: [0, 0, 0],
        scale: [0.8, 0.8, 2],
        color: "#08B0D5",
        material: "energy",
        power: 100,
        durability: 85,
        weight: 25,
        reasoning: "AI generated component based on user command"
      }
    }

    // Create component with unique ID
    const component: MechaComponent = {
      id: `ai-component-${Date.now()}`,
      type: componentData.type || 'weapon',
      name: componentData.name || 'AI Generated Component',
      description: componentData.description || `Generated from: "${command}"`,
      position: componentData.position || [2, 1, 0],
      rotation: componentData.rotation || [0, 0, 0],
      scale: componentData.scale || [0.8, 0.8, 2],
      color: componentData.color || '#08B0D5',
      material: componentData.material || 'energy',
      power: componentData.power || 100,
      durability: componentData.durability || 85,
      weight: componentData.weight || 25,
      createdBy: 'ai',
      createdAt: new Date()
    }

    return NextResponse.json({
      success: true,
      component,
      reasoning: componentData.reasoning || 'AI generated component based on user command'
    })

  } catch (error) {
    console.error('AI generation error:', error)
    
    // Fallback component if AI fails
    const fallbackComponent: MechaComponent = {
      id: `fallback-${Date.now()}`,
      type: 'weapon',
      name: 'Emergency Component',
      description: `Fallback component generated from: "${command || 'unknown command'}"`,
      position: [2, 1, 0],
      rotation: [0, 0, 0],
      scale: [0.8, 0.8, 2],
      color: '#E6322B',
      material: 'steel',
      power: 80,
      durability: 70,
      weight: 30,
      createdBy: 'ai',
      createdAt: new Date()
    }

    return NextResponse.json({
      success: true,
      component: fallbackComponent,
      reasoning: 'Fallback component generated due to AI service unavailability'
    })
  }
}
