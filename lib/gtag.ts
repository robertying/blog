export const GA_TRACKING_ID = "UA-90411129-2";

export const pageview = (url: string) => {
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
};
