import type * as React from 'react'
import type { GetStaticPaths, GetStaticProps } from 'next'
import ArticlesLayout from '@/theme/layouts/articles-layout'
import type {
  IArticle,
  IAuthor,
  IPageContextArticles,
  SiteProps
} from '@/theme/types'
import pageinate from '@/theme/utils/paginate'
import { fsArticleApi, fsAuthorApi, fsSitePropsApi } from '@/lib/fs-api'
import {
  byDate,
  normalizeArticle,
  normalizeAuthor,
  normalizeSiteProps
} from '@/lib/util'

export interface ArticlePageProps {
  currentPage: number
  totalPages: number
  pageArticles: IArticle[]
  featuredAuthor: IAuthor
  siteProps: SiteProps
}

const ArticlesIndex: React.FC<ArticlePageProps> = ({
  currentPage,
  totalPages,
  pageArticles,
  featuredAuthor,
  siteProps
}) => {
  const pageContext: IPageContextArticles = {
    pageArticles,
    mailchimp: siteProps.blog.mailchimp,
    featuredAuthor,
    pageCount: totalPages,
    index: currentPage,
    pathPrefix: '/'
  }

  return <ArticlesLayout pageContext={pageContext} siteProps={siteProps} />
}

export default ArticlesIndex

export const getStaticProps: GetStaticProps<
  ArticlePageProps,
  { page: string }
> = async ({ params }) => {
  const siteProps = normalizeSiteProps(fsSitePropsApi.getSiteProps())

  const featuredAuthor = normalizeAuthor({
    siteProps,
    rawAuthor: fsAuthorApi
      .getAllAuthors()
      .filter((author) => author.featured)[0]
  })

  const articles = fsArticleApi
    .getAllArticles()
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
    articles.length,
    currentPage,
    siteProps.blog.pageLength
  )
  const pageArticles = articles.slice(pages.startIndex, pages.endIndex + 1)

  return {
    props: {
      currentPage,
      totalPages: pages.totalPages,
      pageArticles,
      featuredAuthor,
      siteProps
    }
  }
}

export const getStaticPaths: GetStaticPaths<{
  page: string
}> = async () => {
  const rawSiteProps = fsSitePropsApi.getSiteProps()
  const rawArticles = fsArticleApi.getAllArticles()

  const articles = rawArticles.filter((article) => !article.secret)
  const { pages } = pageinate(
    articles.length,
    1,
    rawSiteProps.blog.pageLength || 6
  )

  return {
    paths: pages.map((page) => {
      return {
        params: {
          page: `${page}`
        }
      }
    }),
    fallback: false
  }
}
