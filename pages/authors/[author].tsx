import type { GetStaticPaths, GetStaticProps } from 'next'

import AuthorPage, {
  getStaticProps as getAuthorsPageStaticProps,
  getStaticPaths as getAuthorsPageStaticPaths
} from './[author]/page/[page]'

import type { AuthorsPageProps } from './[author]/page/[page]'

/** Default [author] page is same as '[author[/page/1' */

export default AuthorPage

export const getStaticProps: GetStaticProps<
  AuthorsPageProps,
  { author: string }
> = ({ params }) => {
  return getAuthorsPageStaticProps({
    params: { page: '1', author: params.author }
  })
}

interface AuthorPagesStaticPath {
  params: {
    author: string
    page: string
  }
}

export const getStaticPaths: GetStaticPaths<{
  author: string
}> = async (context) => {
  const { paths, fallback } = await getAuthorsPageStaticPaths(context)
  return {
    paths: paths
      .filter((path) => (path as AuthorPagesStaticPath).params.page === '1')
      .map((path: AuthorPagesStaticPath) => ({
        params: {
          author: path.params.author
        }
      })),
    fallback
  }
}
