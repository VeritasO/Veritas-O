import { API_CONFIG } from './constants'

export interface TribunalRulingParams {
  contradictionId: string
  ruling: string
}

export interface TribunalRulingResponse {
  id: string
  contradictionId: string
  ruling: string
  timestamp: string
  status: 'submitted' | 'pending' | 'applied'
}

export async function sendTribunalRuling(params: TribunalRulingParams): Promise<TribunalRulingResponse> {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/tribunal/rulings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
    
    if (!response.ok) {
      throw new Error('Failed to submit tribunal ruling')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error submitting tribunal ruling:', error)
    // For development, return mock response
    return {
      id: Date.now().toString(),
      contradictionId: params.contradictionId,
      ruling: params.ruling,
      timestamp: new Date().toISOString(),
      status: 'submitted'
    }
  }
}

export async function getTribunalRulings(contradictionId?: string): Promise<TribunalRulingResponse[]> {
  try {
    const url = contradictionId 
      ? `${API_CONFIG.BASE_URL}/api/tribunal/rulings?contradictionId=${contradictionId}`
      : `${API_CONFIG.BASE_URL}/api/tribunal/rulings`
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error('Failed to fetch tribunal rulings')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching tribunal rulings:', error)
    // Return mock data for development
    return []
  }
}

export async function applyTribunalRuling(rulingId: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/tribunal/rulings/${rulingId}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error('Failed to apply tribunal ruling')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error applying tribunal ruling:', error)
    return { success: false, message: 'Failed to apply ruling' }
  }
}
