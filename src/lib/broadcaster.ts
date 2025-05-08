// Custom AnyCable broadcaster implementation that works with Next.js Edge Runtime
// This implementation avoids using Node.js crypto module directly
'use server'

// Helper function to create HMAC signatures using Web Crypto API
async function createHmacSignature(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);
  
  // Create a CryptoKey
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  // Sign the message
  const signature = await crypto.subtle.sign('HMAC', key, messageData);
  
  // Convert to base64
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

// Export an async broadcast function instead of an object
export async function broadcast(channel: string, id: Record<string, string>, data: Record<string, any>) {
  try {
    const url = process.env.ANYCABLE_BROADCAST_URL || '';
    const token = process.env.ANYCABLE_BROADCAST_KEY || '';
    
    if (!url || !url.length) {
      console.warn('ANYCABLE_BROADCAST_URL is not set');
      return false;
    }
    
    // Format the stream data
    const stream = {
      stream: channel,
      data,
      meta: id
    };
    
    // Convert to JSON string
    const payload = JSON.stringify(stream);
    const encoded = Buffer.from(payload).toString('base64');
    
    // Generate signature if token is provided
    let headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    
    if (token && token.length > 0) {
      const signature = await createHmacSignature(token, payload);
      headers['Authorization'] = `Bearer ${signature}`;
    }
    
    // Make the request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        stream: encoded
      })
    });
    
    if (!response.ok) {
      console.error(`AnyCable broadcast failed: ${response.status} ${response.statusText}`);
    }
    
    return response.ok;
  } catch (error) {
    console.error('AnyCable broadcast error:', error);
    return false;
  }
} 