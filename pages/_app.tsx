import { FC } from 'react'
import { AppProps } from 'next/app'

// import '@/theme/styles/index.css'
import { useA11y } from '@/theme/hooks/use-a11y'
import { useAnalytics } from '@/theme/hooks/use-analytics'
import { usePageLoadProgress } from '@/theme/hooks/use-page-load-progress'
import { useScrollRestoration } from '@/theme/hooks/use-scroll-restoration'
import { ThemeProvider } from 'theme-ui'
// import { ThemeProvider as EmotionThemeProvider } from '@emotion/react'
import theme from '@/theme/theme-config'
import 'lazysizes'
import 'lazysizes/plugins/parent-fit/ls.parent-fit'
import 'lazysizes/plugins/respimg/ls.respimg'

require('@/content/theme/favicon.png')

export const App: FC<AppProps> = ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Component,
  pageProps
}: AppProps) => {
  // useAnalytics()
  usePageLoadProgress()
  useA11y()
  useScrollRestoration()
  // localStorage.removeItem('previousPath')

  return (
    <>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}

export default App
