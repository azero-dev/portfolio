import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  const posts = await getCollection('blog', ({ data }) => !data.draft);

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
      content: post.rendered ? post.rendered.toString() : post.data.description,
      categories: post.data.tags,
    })),
    // Atom-specific extensions
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom',
    },
    customData: `<generator>Astro + @astrojs/rss</generator>
      <docs>https://validator.w3.org/feed/docs/atom.html</docs>`,
    stylesheet: '/rss-styles.xsl',
  });
};
