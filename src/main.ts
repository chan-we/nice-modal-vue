import { createApp } from 'vue';
import App from './App.vue';
import NiceModal from '../lib';

const app = createApp(App);

app.use(NiceModal.NiceModalProvider);

app.mount('#app');

