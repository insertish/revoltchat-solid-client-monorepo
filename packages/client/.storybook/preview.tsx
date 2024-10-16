import '@revolt/ui/styles';
import './panda.css';

import { ApplyGlobalStyles, darkTheme, ThemeProvider } from '@revolt/ui';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (story) => (
      <ThemeProvider theme={darkTheme('#FF5733', false)}>
        {story} <ApplyGlobalStyles />
      </ThemeProvider>
    ),
  ],
};

export default preview;
