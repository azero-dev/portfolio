<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>RSS Feed</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            color: #333;
            background: #f9f9f9;
          }
          .dark body {
            color: #e0e0e0;
            background: #111;
          }
          h1 {
            color: #ff5500;
            border-bottom: 2px solid #ff5500;
            padding-bottom: 0.5rem;
          }
          .post {
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
          }
          .dark .post {
            background: #1a1a1a;
            border-color: #333;
          }
          .post h2 {
            margin-top: 0;
            color: #222;
          }
          .dark .post h2 {
            color: #fff;
          }
          .meta {
            font-size: 0.9rem;
            color: #666;
            margin-bottom: 1rem;
          }
          .dark .meta {
            color: #aaa;
          }
          .tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 1rem;
          }
          .tag {
            background: #eee;
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            font-size: 0.8rem;
            color: #555;
          }
          .dark .tag {
            background: #333;
            color: #ccc;
          }
          a {
            color: #ff5500;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <h1>Blog Feed</h1>
        <p>This is an RSS/Atom feed. Subscribe using your favorite reader.</p>
        <xsl:apply-templates select="//item" />
      </body>
    </html>
  </xsl:template>
  
  <xsl:template match="item">
    <div class="post">
      <h2>
        <a>
          <xsl:attribute name="href">
            <xsl:value-of select="link" />
          </xsl:attribute>
          <xsl:value-of select="title" />
        </a>
      </h2>
      <div class="meta">
        Published: <xsl:value-of select="pubDate" />
      </div>
      <p><xsl:value-of select="description" /></p>
      <xsl:if test="category">
        <div class="tags">
          <xsl:for-each select="category">
            <span class="tag"><xsl:value-of select="." /></span>
          </xsl:for-each>
        </div>
      </xsl:if>
    </div>
  </xsl:template>
</xsl:stylesheet>