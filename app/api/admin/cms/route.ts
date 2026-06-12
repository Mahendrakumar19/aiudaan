import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const getConfigPath = () => path.join(process.cwd(), 'lib', 'cms-config.json')

export async function GET() {
  try {
    const configPath = getConfigPath()
    if (!fs.existsSync(configPath)) {
      return NextResponse.json({ error: 'Config file not found' }, { status: 404 })
    }
    const rawData = fs.readFileSync(configPath, 'utf8')
    const config = JSON.parse(rawData)
    return NextResponse.json({ success: true, config })
  } catch (error) {
    console.error('Failed to read CMS configuration', error)
    return NextResponse.json({ error: 'Failed to read CMS configuration' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const configPath = getConfigPath()
    const { config } = await req.json()
    if (!config) {
      return NextResponse.json({ error: 'Invalid config details' }, { status: 400 })
    }
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8')
    return NextResponse.json({ success: true, message: 'CMS configuration updated successfully' })
  } catch (error) {
    console.error('Failed to save CMS configuration', error)
    return NextResponse.json({ error: 'Failed to save CMS configuration' }, { status: 500 })
  }
}
