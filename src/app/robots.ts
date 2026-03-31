import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/featured/success", "/featured/cancel"],
      },
    ],
    sitemap: "https://www.onboard-success.com/sitemap.xml",
  };
}
