const API_BASE_URL = "https://kv-backend.eliasfloreteng.workers.dev"

export interface SaveDataRequest {
  key: string
  password: string
  data: any
}

export interface GetDataRequest {
  key: string
  password: string
}

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  key?: string
  data?: T
}

export async function saveData(request: SaveDataRequest): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(
        result.message || `HTTP error! status: ${response.status}`
      )
    }

    return result
  } catch (error) {
    console.error("Error saving data:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to save data",
    }
  }
}

export async function getData(request: GetDataRequest): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/get`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(
        result.message || `HTTP error! status: ${response.status}`
      )
    }

    return result
  } catch (error) {
    console.error("Error getting data:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to get data",
    }
  }
}
