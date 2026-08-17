export async function onRequest(context) {

    const request =
        context.request;


    const url =
        new URL(request.url);


    const originalId =
        url.searchParams.get("id");


    /*
     * If no Original ID is supplied,
     * let the normal static page handle it.
     */

    if (!originalId) {

        return context.next();

    }


    /*
     * Validate ID
     */

    if (
        !/^\d+$/.test(
            originalId
        )
    ) {

        return context.next();

    }


    try {

        /*
         * Load the Original from
         * the existing MyLikith backend.
         */

        const apiResponse =
            await fetch(
                `https://mylikith-backend.onrender.com/api/originals/${encodeURIComponent(
                    originalId
                )}`
            );


        /*
         * If the Original doesn't exist,
         * use the normal page.
         */

        if (!apiResponse.ok) {

            return context.next();

        }


        const data =
            await apiResponse.json();


        if (
            !data.success ||
            !data.original
        ) {

            return context.next();

        }


        const original =
            data.original;


        /*
         * Load the existing static
         * Original page.
         *
         * We deliberately use original.html
         * so your existing UI remains unchanged.
         */

        const pageResponse =
            await fetch(
                new URL(
                    "/original.html",
                    request.url
                )
            );


        if (!pageResponse.ok) {

            return context.next();

        }


        let html =
            await pageResponse.text();


        /*
         * Prepare SEO values.
         */

        const title =
            original.title ||
            "MyLikith Original";


        const description =
            original.description ||
            "Watch exclusive MyLikith Originals on MyLikith.";


        const coverImage =
            original.cover_url ||
            `${url.origin}/assets/images/og-image.jpg`;


        const pageUrl =
            `${url.origin}/original?id=${encodeURIComponent(
                original.id
            )}`;


        const language =
            original.language ||
            "Original";


        const category =
            original.category ||
            "Story";


        /*
         * Keep social description
         * within a safe preview length.
         */

        const cleanDescription =
            description
                .replace(/\s+/g, " ")
                .trim()
                .slice(0, 300);


        /*
         * Escape HTML attribute values.
         */

        const escapeHTML =
            (value) => {

                return String(
                    value
                )
                .replace(
                    /&/g,
                    "&amp;"
                )
                .replace(
                    /</g,
                    "&lt;"
                )
                .replace(
                    />/g,
                    "&gt;"
                )
                .replace(
                    /"/g,
                    "&quot;"
                )
                .replace(
                    /'/g,
                    "&#39;"
                );

            };


        const safeTitle =
            escapeHTML(
                title
            );


        const safeDescription =
            escapeHTML(
                cleanDescription
            );


        const safeImage =
            escapeHTML(
                coverImage
            );


        const safeUrl =
            escapeHTML(
                pageUrl
            );


        /*
         * JSON-LD structured data.
         */

        const structuredData = {

            "@context":
                "https://schema.org",

            "@type":
                "VideoObject",

            name:
                title,

            description:
                cleanDescription,

            image: [
                coverImage
            ],

            url:
                pageUrl,

            inLanguage:
                language,

            genre:
                category,

            publisher: {

                "@type":
                    "Organization",

                name:
                    "MyLikith",

                url:
                    "https://mylikith.in"

            }

        };


        const safeStructuredData =
            JSON.stringify(
                structuredData
            )
            .replace(
                /</g,
                "\\u003c"
            );


        /*
         * Build crawler-visible SEO block.
         */

        const seoBlock = `

<title>${safeTitle} - MyLikith Originals</title>

<meta
    name="description"
    content="${safeDescription}"
>

<meta
    name="robots"
    content="index, follow, max-image-preview:large"
>

<link
    rel="canonical"
    href="${safeUrl}"
>


<!-- =====================================================
     OPEN GRAPH
===================================================== -->

<meta
    property="og:title"
    content="${safeTitle}"
>

<meta
    property="og:description"
    content="${safeDescription}"
>

<meta
    property="og:image"
    content="${safeImage}"
>

<meta
    property="og:url"
    content="${safeUrl}"
>

<meta
    property="og:type"
    content="video.other"
>

<meta
    property="og:site_name"
    content="MyLikith"
>

<meta
    property="og:locale"
    content="en_IN"
>


<!-- =====================================================
     TWITTER / X
===================================================== -->

<meta
    name="twitter:card"
    content="summary_large_image"
>

<meta
    name="twitter:title"
    content="${safeTitle}"
>

<meta
    name="twitter:description"
    content="${safeDescription}"
>

<meta
    name="twitter:image"
    content="${safeImage}"
>


<!-- =====================================================
     STRUCTURED DATA
===================================================== -->

<script
    type="application/ld+json"
>
${safeStructuredData}
</script>

`;


        /*
         * Remove the static title from
         * original.html if it exists.
         */

        html =
            html.replace(
                /<title>[\s\S]*?<\/title>/i,
                ""
            );


        /*
         * Insert the dynamic SEO block
         * immediately before </head>.
         */

        html =
            html.replace(
                /<\/head>/i,
                `${seoBlock}</head>`
            );


        /*
         * Tell crawlers/browsers this is
         * an HTML document.
         */

        return new Response(
            html,
            {
                status: 200,

                headers: {

                    "Content-Type":
                        "text/html; charset=UTF-8",

                    "Cache-Control":
                        "public, max-age=300"

                }

            }
        );


    } catch (error) {

        console.error(
            "Original SEO Function error:",
            error
        );


        /*
         * Never break the Original page
         * because SEO processing failed.
         */

        return context.next();

    }

}