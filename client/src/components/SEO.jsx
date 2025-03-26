import { useEffect } from "react";

const SEO = ({ title, description, keywords, ogImage, url }) => {
    useEffect(() => {
        // Update title
        document.title = title;

        // Update meta description
        const metaDescription = document.querySelector("meta[name='description']");
        if (metaDescription) {
            metaDescription.setAttribute("content", description);
        } else {
            const meta = document.createElement("meta");
            meta.name = "description";
            meta.content = description;
            document.head.appendChild(meta);
        }

        // Update meta keywords
        const metaKeywords = document.querySelector("meta[name='keywords']");
        if (metaKeywords) {
            metaKeywords.setAttribute("content", keywords);
        } else {
            const meta = document.createElement("meta");
            meta.name = "keywords";
            meta.content = keywords;
            document.head.appendChild(meta);
        }

        // Open Graph Tags for social media sharing
        const ogTags = [
            { property: "og:title", content: title },
            { property: "og:description", content: description },
            { property: "og:image", content: ogImage },
            { property: "og:url", content: url },
            { property: "og:type", content: "website" },
        ];

        ogTags.forEach(({ property, content }) => {
            let element = document.querySelector(`meta[property='${property}']`);
            if (element) {
                element.setAttribute("content", content);
            } else {
                const meta = document.createElement("meta");
                meta.setAttribute("property", property);
                meta.content = content;
                document.head.appendChild(meta);
            }
        });

    }, [title, description, keywords, ogImage, url]);

    return null; // This component doesn't render anything
};

export default SEO;
