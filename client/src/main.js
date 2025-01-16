import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify"; // Vuetify 플러그인 설정 파일
import "vuetify/styles"; // Vuetify 스타일
import "@mdi/font/css/materialdesignicons.css"; // Material Design Icons


const app = createApp(App);

app.use(vuetify);

app.mount("#app");
