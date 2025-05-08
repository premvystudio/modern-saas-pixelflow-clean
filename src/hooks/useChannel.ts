'use client'
// @ts-nocheck - Disable type checking for this file

import { useEffect, useRef } from 'react'
import { cable } from '../lib/anycable'
import { Channel } from '@anycable/web'

/**
 * Subscribe to an AnyCable channel and run a callback on incoming messages.
 * Returns true/false connection state via a ref so the consuming component can
 * read without re-rendering on every status tick.
 */
export function useChannel(
  identifier: string,
  params: Record<string, unknown>,
  onMessage: (data: any) => void,
) {
  const connected = useRef(false)

  useEffect(() => {
    // Create a custom channel dynamically
    class CustomChannel extends Channel {
      static identifier = identifier
    }
    
    // Create an instance and subscribe
    const channel = new CustomChannel(params)
    const subscription = cable.subscribe(channel)
    
    // Set up handlers
    const handleMessage = (data: any) => onMessage(data)
    const handleConnect = () => { connected.current = true }
    const handleDisconnect = () => { connected.current = false }
    const handleReject = (err: any) => console.error('Subscription rejected', err)
    
    channel.on('message', handleMessage)
    channel.on('connect', handleConnect)
    channel.on('disconnect', handleDisconnect)
    channel.on('reject', handleReject)

    // Return cleanup function
    return () => {
      channel.off('message', handleMessage)
      channel.off('connect', handleConnect)
      channel.off('disconnect', handleDisconnect)
      channel.off('reject', handleReject)
      subscription()  // Unsubscribe
    }
  }, [identifier, JSON.stringify(params), onMessage])

  return connected
} 