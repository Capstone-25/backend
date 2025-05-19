importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js'
);

firebase.initializeApp({
  apiKey: 'AIzaSyBj-ZS1T9Tm46EgOaCPiixDYS8W2RFwYBU',
  authDomain: 'capstone-415ab.firebaseapp.com',
  projectId: 'capstone-415ab',
  storageBucket: 'capstone-415ab.firebasestorage.app',
  messagingSenderId: '729746385693',
  appId: '1:729746385693:web:7b643178674d1b4895cff4',
  measurementId: 'G-5W92P03JQ5',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/assests/icons/notification-icon.png',
    badge: '/assests/icons/notification-badge.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
