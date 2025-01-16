import "vuetify/styles"; // Vuetify의 기본 스타일을 가져옵니다.
import { createVuetify } from "vuetify";
import * as components from "vuetify/components"; // 모든 Vuetify 컴포넌트를 가져옵니다.
import * as directives from "vuetify/directives"; // 모든 Vuetify 디렉티브를 가져옵니다.
import "@mdi/font/css/materialdesignicons.css"; // Material Design Icons를 가져옵니다.

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
  },
});
