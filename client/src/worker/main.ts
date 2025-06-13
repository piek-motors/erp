const VAPID_PUBLIC_KEY =
  'BCkIztWwPiSXkb_9QqHv4k40Y2tUqNkt2C8T_auoM5_x8RmjL0uw8eWb9YA2_VygdoLAm3VivwgSA1bzPU8mdwM'

;(async () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async function () {
      try {
        const register = await navigator.serviceWorker.register('/sw.js', {})
        console.log(`ServiceWorker registration successful: ${register.scope}`)

        const subscription = await register.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        })

        console.log('Push subscription successful', subscription)

        console.log(subscription.endpoint)
      } catch (e) {
        console.error(e)
      }
    })
  }
})()

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
