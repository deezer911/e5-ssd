module.exports = {
    account_name: 'hellersdorf',
    endpoint: 'netlify/passave',
    queries: [
        {
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
            convert_to: '.md',
            slug_field: 'title',
            body_field: 'body',
            folder: 'content/blog',
        },
    ],
};

                // getAccounts {
                //     id
                //     username
                //     password
                //     email
                // }
