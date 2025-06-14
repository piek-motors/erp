"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const VAPID_PUBLIC_KEY = 'BCkIztWwPiSXkb_9QqHv4k40Y2tUqNkt2C8T_auoM5_x8RmjL0uw8eWb9YA2_VygdoLAm3VivwgSA1bzPU8mdwM';
(() => __awaiter(void 0, void 0, void 0, function* () {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const register = yield navigator.serviceWorker.register('/sw.js', {});
                    console.log(`ServiceWorker registration successful: ${register.scope}`);
                    const subscription = yield register.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
                    });
                    console.log('Push subscription successful', subscription);
                    console.log(subscription.endpoint);
                }
                catch (e) {
                    console.error(e);
                }
            });
        });
    }
}))();
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
