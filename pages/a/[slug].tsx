/* eslint-disable @typescript-eslint/no-explicit-any */
import type * as React from 'react'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { fsArticleApi, fsAuthorApi, fsSitePropsApi } from '@/lib/fs-api/index'
import {
  normalizeAuthor,
  normalizeArticle,
  normalizeSiteProps,
  getUniqueListBy,
  byDate
} from '@/lib/util'
import ArticleLayout from '@/theme/layouts/article-layout'
import { mdxSerialize } from '@/theme/components/mdx-server'
import { mdxRender } from '@/theme/components/mdx-components'
import type {
  IArticle,
  IArticleDetail,
  IPageContextArticle,
  SiteProps
} from '@/theme/types'
import { normalizeArticleWithContent } from '@/lib/util/normalize'

interface Props {
  article: IArticleDetail
  mdxSerialized: any
  nextArticles: IArticle[]
  siteProps: SiteProps
}

const Post: React.FC<Props> = ({
  article,
  mdxSerialized,
  nextArticles,
  siteProps
}) => {
  const content = mdxRender(mdxSerialized)

  const pageContext: IPageContextArticle = {
    article,
    nextArticles,
    mailchimp: siteProps.blog.mailchimp
  }

  return (
    <ArticleLayout
      content={content}
      pageContext={pageContext}
      siteProps={siteProps}
    />
  )
}

export default Post

export const getStaticProps: GetStaticProps<Props, { slug: string }> = async ({
  params
}) => {
  const siteProps = normalizeSiteProps(fsSitePropsApi.getSiteProps())

  const authors = getUniqueListBy(
    fsAuthorApi.getAllAuthors(),
    'name'
  ).map((rawAuthor) => normalizeAuthor({ siteProps, rawAuthor }))

  const allArticles = fsArticleApi.getAllArticles()

  const rawArticle = allArticles.find(
    (candidate) => candidate.slug === params.slug
  )

  const [article, content] = normalizeArticleWithContent({
    rawArticle,
    authors,
    siteProps
  })

  const mdxSerialized = await mdxSerialize({
    content,
    scope: article
  })

  /**
   * We need a way to find the next artiles to suggest at the bottom of the articles page.
   * To accomplish this there is some special logic surrounding what to show next.
   */

  const articlesNotSecret = allArticles
    .filter((article) => !article.secret)
    .sort(byDate)

  const index = articlesNotSecret.findIndex(
    (searchArticle) => searchArticle.id === article.id
  )
  let rawNextArticles = articlesNotSecret.slice(index + 1, index + 3)

  // If it's the last item in the list, there will be no articles. So grab the first 2
  if (rawNextArticles.length === 0)
    rawNextArticles = articlesNotSecret.slice(0, 2)
  // If there's 1 item in the list, grab the first article
  if (rawNextArticles.length === 1 && articlesNotSecret.length !== 2)
    rawNextArticles = [...rawNextArticles, articlesNotSecret[0]]
  if (articlesNotSecret.length === 1) rawNextArticles = []

  const nextArticles = rawNextArticles.map((rawArticle) =>
    normalizeArticle({
      siteProps,
      rawArticle
    })
  )

  return {
    props: {
      mdxSerialized,
      article,
      nextArticles,
      siteProps
    }
  }
}

export const getStaticPaths: GetStaticPaths<{
  slug: string
}> = async () => {
  const rawArticles = fsArticleApi.getAllArticles()

  const result = {
    paths: rawArticles.map((posts) => {
      return {
        params: {
          slug: posts.slug
        }
      }
    }),
    fallback: false
  }

  return result
}
