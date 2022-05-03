const https = require('https');
const fs = require('fs');
const slugify = require('slugify');

const data = JSON.stringify({
  query: `{
    getPosts {
      title
      body
      published
      id
      categories {
        name
      }
    }
  }`,
});

const markdownFileTemplate = (post, categories) => `
---
title: ${post.title}
categories:  ${categories}
published: ${post.published}
---

${post.body}
`;

const options = {
  hostname: 'hellersdorf.stepzen.net',
  path: '/netlify/passave/__graphql',
  port: 443,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    // Authorization: 'Apikey ' + process.env.STEPZEN_API_KEY,
    Authorization: 'Apikey hellersdorf::stepzen.net+1000::1f0d97bb8ce3431c80ba7c33ee8dd8887b76203f962bd7de7c3f9cfbf8806da0',
    'User-Agent': 'Node',
  },
};

const req = https.request(options, (res) => {
  let data = '';

  console.log(" ===API KEY : " + process.env.STEPZEN_API_KEY)

  res.on('data', (d) => {
    data += d;
  });
  res.on('end', () => {
    const results = JSON.parse(data).data.getPosts;
    results.forEach((post) => {
      let categories = '';
      post.categories.forEach((category) => {
        categories += '\n- ' + category.name;
      });
      let content = markdownFileTemplate(post, categories);
      let filename = './content/blog/' + slugify(post.title) + '.md';
      fs.writeFileSync(filename, content);
    });
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
