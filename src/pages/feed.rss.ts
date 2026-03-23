import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  // Sort by publication date, newest first
  const sortedPosts = posts.sort(
    (a, b) => new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime()
  );

  return rss({
    title: 'azer0 Portfolio Blog',
    description:
      'Software engineer building web things. Portfolio and blog with cyberpunk aesthetic.',
    site: context.site!,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/post/${post.id}`,
      // Use rendered content if available, otherwise fallback to description
      content: post.rendered ? post.rendered.toString() : post.data.description,
      categories: post.data.tags,
    })),
    customData: `<language>en-GB</language>
      <generator>Astro + @astrojs/rss</generator>
      <docs>https://www.rssboard.org/rss-specification</docs>`,
    stylesheet: '/rss-styles.xsl',
  });
};
