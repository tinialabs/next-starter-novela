import type * as React from 'react'
import type { GetStaticPaths, GetStaticProps } from 'next'
import AuthorLayout from '@/theme/layouts/author-layout'
import type {
  IArticle,
  IAuthor,
  IPageContextAuthor,
  SiteProps
} from '@/theme/types'
import pageinate from '@/theme/utils/paginate'
import { fsArticleApi, fsAuthorApi, fsSitePropsApi } from '@/lib/fs-api'
import {
  byDate,
  getUniqueListBy,
  normalizeArticle,
  normalizeAuthor,
  normalizeSiteProps
} from '@/lib/util'

export interface AuthorsPageProps {
  author: IAuthor
  currentPage: number
  totalPages: number
  pageArticles: IArticle[]
  siteProps: SiteProps
}

const AuthorPage: React.FC<AuthorsPageProps> = ({
  author,
  currentPage,
  totalPages,
  pageArticles,
  siteProps
}) => {
  const pageContext: IPageContextAuthor = {
    author,
    pageArticles,
    mailchimp: siteProps.blog.mailchimp,
    pageCount: totalPages,
    index: currentPage,
    pathPrefix: author.slug
  }

  return <AuthorLayout pageContext={pageContext} siteProps={siteProps} />
}

export default AuthorPage

export const getStaticProps: GetStaticProps<
  AuthorsPageProps,
  { author: string; page: string }
> = async ({ params }) => {
  const siteProps = normalizeSiteProps(fsSitePropsApi.getSiteProps())

  const author = normalizeAuthor({
    siteProps,
    rawAuthor: fsAuthorApi.getAuthorBySlug(
      fsAuthorApi.getAllAuthors(),
      params.author
    )
  })

  const authorArticles = fsArticleApi
    .getArticlesByAuthor(author.name)
    .filter((article) => !article.secret)
    .sort(byDate)
    .map((rawArticle) =>
      normalizeArticle({
        siteProps,
        rawArticle
      })
    )

  const currentPage = parseInt(params.page)

  const pages = pageinate(
    authorArticles.length,
    currentPage,
    siteProps.blog.pageLength || 6
  )

  const pageArticles = authorArticles.slice(
    pages.startIndex,
    pages.endIndex + 1
  )

  return {
    props: {
      currentPage,
      totalPages: pages.totalPages,
      pageArticles,
      author,
      siteProps
    }
  }
}

export const getStaticPaths: GetStaticPaths<{
  author: string
  page: string
}> = async () => {
  const rawSiteProps = fsSitePropsApi.getSiteProps()
  const rawAuthors = getUniqueListBy(fsAuthorApi.getAllAuthors(), 'slug')
  const paths = []

  rawAuthors.forEach((author) => {
    const rawAuthor = fsAuthorApi.getAuthorBySlug(rawAuthors, author.slug)
    const rawArticles = fsArticleApi
      .getArticlesByAuthor(rawAuthor.name)
      .filter((article) => !article.secret)

    const { pages } = pageinate(
      rawArticles.length,
      1,
      rawSiteProps.blog.pageLength || 6
    )

    pages.forEach((page) => {
      paths.push({
        params: {
          author: author.slug,
          page: `${page}`
        }
      })
    })
  })

  return { paths, fallback: false }
}
