type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

type GtagCommand = 'config' | 'event' | 'js' | 'set';
type GtagArguments = [GtagCommand, string | Date, AnalyticsParams?];

declare global {
	interface Window {
		dataLayer?: GtagArguments[];
		gtag?: (...args: GtagArguments) => void;
		clarity?: (...args: unknown[]) => void;
	}
}

const ensureDataLayer = () => {
	window.dataLayer = window.dataLayer || [];
	return window.dataLayer;
};

const gtag = (...args: GtagArguments) => {
	if (typeof window.gtag === 'function') {
		window.gtag(...args);
		return;
	}

	ensureDataLayer().push(args);
};

const cleanParams = (params: AnalyticsParams = {}) =>
	Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== null));

export const trackEvent = (eventName: string, params: AnalyticsParams = {}) => {
	gtag('event', eventName, cleanParams(params));
};

export const trackPageView = (url: string, title: string) => {
	trackEvent('page_view', {
		page_location: url,
		page_title: title,
	});
};

export const trackGuideView = (url: string, title: string) => {
	trackEvent('guide_view', {
		page_location: url,
		page_title: title,
		content_type: 'blog_article',
	});
};

export const trackEngagedRead = (url: string, title: string, thresholdSeconds: number) => {
	trackEvent('engaged_read', {
		page_location: url,
		page_title: title,
		engagement_threshold_seconds: thresholdSeconds,
	});
};

export const trackOutboundClick = (url: string, linkText: string) => {
	trackEvent('outbound_click', {
		link_url: url,
		link_text: linkText,
	});
};
