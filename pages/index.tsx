import type { GetStaticProps } from 'next'
import ArticlesIndex, {
  getStaticProps as getArticlesStaticProps
} from './page/[page]'
import type { ArticlePageProps } from './page/[page]'

/** Default home page is same as '/page/1' */

export default ArticlesIndex

export const getStaticProps: GetStaticProps<ArticlePageProps> = async () => {
  return getArticlesStaticProps({ params: { page: '1' } })
}
