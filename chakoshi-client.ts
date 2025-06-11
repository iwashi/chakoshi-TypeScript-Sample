interface ChakoshiConfig {
  apiKey: string;
  baseUrl?: string;
}

interface GuardrailRequest {
  content: string;
}

interface JudgeRequest {
  input: string;
  model?: string;
  category_set_id?: string;
}

interface JudgeResponse {
  id: string;
  model: string;
  category_set_id: string;
  results: {
    unsafe_flag: boolean;
    label_str: string;
    unsafe_score: string;
    unsafe_category: string;
    user_prompt: {
      chat: Array<{
        role: string;
        content: string;
      }>;
    };
  };
}

interface GuardrailResponse {
  id: string;
  status: 'safe' | 'flagged' | 'blocked';
  violations?: string[];
  confidence: number;
  timestamp: string;
}

interface ChakoshiError {
  code: string;
  message: string;
  details?: any;
}

class ChakoshiClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: ChakoshiConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.beta.chakoshi.ntt.com';
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      ...options.headers,
    };

    console.log(`Making request to: ${url}`);
    
    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON response but got ${contentType}. Response: ${text.substring(0, 200)}...`);
      }

      if (!response.ok) {
        const error = await response.json() as ChakoshiError;
        throw new Error(`Chakoshi API Error: ${error.message || response.statusText}`);
      }

      return response.json() as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred');
    }
  }

  async checkContent(content: string): Promise<GuardrailResponse> {
    // Convert to Judge API format
    const judgeRequest: JudgeRequest = {
      input: content,
      model: 'chakoshi-moderation-241223',
      category_set_id: '01jfrm3xhas2ftcpr39qqdktqa'
    };
    
    const judgeResponse = await this.request<JudgeResponse>('/v1/judge/text', {
      method: 'POST',
      body: JSON.stringify(judgeRequest),
    });
    
    // Convert Judge API response to GuardrailResponse format
    return {
      id: judgeResponse.id,
      status: judgeResponse.results.unsafe_flag ? 'flagged' : 'safe',
      violations: judgeResponse.results.unsafe_category ? [judgeResponse.results.unsafe_category] : [],
      confidence: parseFloat(judgeResponse.results.unsafe_score),
      timestamp: new Date().toISOString()
    };
  }

}

export { ChakoshiClient, ChakoshiConfig, GuardrailRequest, GuardrailResponse, ChakoshiError, JudgeRequest, JudgeResponse };