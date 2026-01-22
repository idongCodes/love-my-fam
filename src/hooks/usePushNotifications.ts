'use client'
import { useState, useEffect } from 'react'
import { subscribeUser } from '@/app/actions/push'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function usePushNotifications() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [permission, setPermission] = useState('default')

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      // 1. Register Service Worker
      navigator.serviceWorker.register('/sw.js')
        .then(function(swReg) {
          console.log('Service Worker is registered', swReg);
          
          // 2. Check existing subscription
          swReg.pushManager.getSubscription().then(function(subscription) {
             setIsSubscribed(!!subscription)
          })
        })
        .catch(function(error) {
          console.error('Service Worker Error', error);
        });
        
      setPermission(Notification.permission)
    }
  }, [])

  const subscribe = async () => {
    if (!('serviceWorker' in navigator)) return
    
    try {
      const registration = await navigator.serviceWorker.ready
      
      // Request permission
      const perm = await Notification.requestPermission()
      setPermission(perm)
      
      if (perm !== 'granted') {
        alert('Notifications permission denied')
        return
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!)
      })

      // Send subscription to backend
      await subscribeUser(JSON.parse(JSON.stringify(subscription)))
      setIsSubscribed(true)
      alert('Notifications enabled! 🎉')
    } catch (error) {
      console.error('Failed to subscribe:', error)
      alert('Failed to enable notifications.')
    }
  }

  return { isSubscribed, subscribe, permission }
}
