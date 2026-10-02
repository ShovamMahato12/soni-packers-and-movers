/**
 * Centralized site image registry.
 *
 * Sources:
 * - Supabase Storage public assets bucket via `NEXT_PUBLIC_SUPABASE_STORAGE_BASE_URL`
 * - Local `/media/*` images
 * - Approved external image URLs that are still in use
 *
 * Keep every image reference in this file so pages/components only consume
 * named assets from a single source of truth.
 */

const BASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BASE_URL ?? "").replace(/\/$/, "");

const assetsUrl = (path: string, fallback?: string) => {
  if (BASE_URL) return `${BASE_URL}${path}`;
  return fallback ?? path;
};

export const siteAssets = {
  branding: {
    /** Main website logo used in the navbar brand and footer brand areas. */
    main: assetsUrl("/assets/logo/logo.png", "/media/logo.png"),
  },

  pages: {
    home: {
      /** Homepage hero section slide image used in the main hero carousel. */
      heroSlideOne: "/media/hero-1.svg",

      /** Homepage hero section video used in the main hero carousel for motion and depth. */
      heroVideo: "https://www.pexels.com/download/video/4277372/",

      /** Homepage hero section slide image used in the main hero carousel. */
      heroSlideTwo: "/media/hero-2.svg",

      /** Homepage hero badge area used to reinforce the brand message. */
      heroBadgeImage: "/media/hero-1.svg",
    },

    about: {
      /** About page hero banner image used behind the page title area. */
      heroBanner: "https://www.adarshindiapackers.com/wp-content/uploads/2026/03/young-happy-delivery-man-with-cardboard-boxes-looking-at-camera-.jpg",

      /** About page collage image shown in the left content grid beside company highlights. */
      collageOne: "/media/hero-1.svg",

      /** About page collage image shown in the middle content grid beside company overview copy. */
      collageTwo: "/media/hero-2.svg",

      /** About page collage image shown in the lower content block beside the company overview text. */
      collageThree: "/media/about-3.svg",
    },

    contact: {
      /** Contact page hero banner image used behind the page title and intro copy. */
      heroBanner: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1600&q=80",
    },

    gallery: {
      /** Gallery page hero banner image used above the filter bar and grid. */
      heroBanner: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1600&q=80",
    },

    getQuote: {
      /** Get quote page hero banner image used to frame the lead form and benefits panel. */
      heroBanner: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1600&q=80",
    },

    operationalCities: {
      /** Operational city landing section banner used across the city-specific pages. */
      heroBanner: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
    },

    jharkhand: {
      /** Jharkhand landing page hero banner image used in the statewide intro section. */
      heroBanner: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1600&q=80",
    },

    bihar: {
      /** Bihar landing page hero banner image used in the statewide intro section. */
      heroBanner: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1600&q=80",
    },

    jharkhandViewMore: {
      /** Jharkhand view-more page hero banner image used above the district discovery section. */
      heroBanner: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80",
    },

    biharViewMore: {
      /** Bihar view-more page hero banner image used above the district discovery section. */
      heroBanner: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80",
    },

    admin: {
      /** Mobile drawer backdrop image used in the navbar menu overlay for visual depth. */
      mobileDrawerBackdrop: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=900&q=80",
    },
  },

  sections: {
    heroSlider: {
      /** Home page hero carousel first slide image showing a branded moving service visual. */
     

       

      /** Home page hero carousel video slide used between static slides for motion. */
      video: assetsUrl("/assets/home-slider/vid1.mp4"),
      slideOne: assetsUrl("/assets/home-slider/image3.png"),
      /** Home page hero carousel second slide image showing a branded moving service visual. */
      slideTwo: assetsUrl("/assets/home-slider/image2.png"),
    },

    whyChooseUs: {
      /** Home page "Why Choose Us" card image showing careful packing and safe handling. */
      safeHandling: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=900&q=80",

      /** Home page "Why Choose Us" card image showing on-time delivery and route discipline. */
      onTimeDelivery: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80",

      /** Home page "Why Choose Us" card image showing trained staff and teamwork. */
      trainedProfessionals: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&w=900&q=80",

      /** Home page "Why Choose Us" card image showing transparent pricing and trust. */
      transparentPricing: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80",
    },

    process: {
      /** Home page process carousel image showing packing and moving work in action. */
      packingInAction: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=1200&q=80",

      /** Home page process carousel image showing team coordination and loading workflow. */
      teamCoordination: "https://images.unsplash.com/photo-1577415124269-fc1140a69e91?auto=format&fit=crop&w=1200&q=80",

      /** Home page process carousel image showing secure packing materials and handling. */
      securePacking: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    },

    faq: {
      /** Default FAQ panel image used in service pages to keep the FAQ section visually consistent. */
      faqSlideOne: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=1200&q=80",

      /** Default FAQ panel image used in service pages to show moving and transport support. */
      faqSlideTwo: "https://images.unsplash.com/photo-1577415124269-fc1140a69e91?auto=format&fit=crop&w=1200&q=80",

      /** Default FAQ panel image used in service pages to show loading and packing assistance. */
      faqSlideThree: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    },

    testimonials: {
      /** Testimonial section avatar source kept as a fallback image reference if profile images return later. */
      profileFallback: "https://api.dicebear.com/9.x/adventurer/svg?seed=SonyPackers",
    },
  },

  services: {
    household: {
      /** Household shifting page hero banner used on the service detail page and service card overlay. */
      heroBanner: assetsUrl("/assets/services/household/service-house-bg.avif"),

      /** Household service FAQ carousel image showing a residential relocation scene. */
      faqSlideOne: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",

      /** Household service FAQ carousel image showing a modern home move and furniture handling. */
      faqSlideTwo: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",

      /** Household service FAQ carousel image showing storage, packing, and boxes ready for relocation. */
      faqSlideThree: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    },

    office: {
      /** Office relocation page hero banner used on the service detail page and service card overlay. */
      heroBanner: assetsUrl("/assets/services/office/office-banner.avif"),

      /** Office relocation FAQ carousel image showing corporate movement support. */
      faqSlideOne: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",

      /** Office relocation FAQ carousel image showing a team handling a workspace move. */
      faqSlideTwo: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1200&q=80",

      /** Office relocation FAQ carousel image showing commercial packing and transport handling. */
      faqSlideThree: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    },

    domestic: {
      /** Domestic relocation service card image used for intercity and interstate move previews. */
      cardImage: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",

      /** Domestic relocation FAQ carousel image used to show route planning and dispatch. */
      faqSlideOne: "https://images.unsplash.com/photo-1501117716987-c8e1ecb2106e?auto=format&fit=crop&w=1200&q=80",

      /** Domestic relocation FAQ carousel image used to show long-distance moving logistics. */
      faqSlideTwo: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",

      /** Domestic relocation FAQ carousel image used to show delivery coordination and route management. */
      faqSlideThree: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80",
    },

    loading: {
      /** Loading and unloading service card image used to show manpower and lifting work. */
      cardImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",

      /** Loading service FAQ carousel image used to show heavy-item handling in action. */
      faqSlideOne: "https://images.unsplash.com/photo-1584751728958-4f2e6a9c68c2?auto=format&fit=crop&w=1200&q=80",

      /** Loading service FAQ carousel image used to show loading and unloading logistics. */
      faqSlideTwo: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",

      /** Loading service FAQ carousel image used to show transport loading support. */
      faqSlideThree: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    },

    storage: {
      /** Warehousing service card image used to show clean storage and inventory-safe handling. */
      cardImage: "https://images.unsplash.com/photo-1565891741441-64926e441838?auto=format&fit=crop&w=1200&q=80",

      /** Warehousing service FAQ carousel image used to show warehouse shelving and organized goods. */
      faqSlideOne: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",

      /** Warehousing service FAQ carousel image used to show secure loading and storage handling. */
      faqSlideTwo: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",

      /** Warehousing service FAQ carousel image used to show a repeat warehouse view for storage-related layouts. */
      faqSlideThree: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
    },

    vehicle: {
      /** Vehicle transport service card image used to show car and bike relocation support. */
      cardImage: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",

      /** Vehicle transport FAQ carousel image used to show bike and car loading support. */
      faqSlideOne: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",

      /** Vehicle transport FAQ carousel image used to show finished-vehicle logistics and handoff. */
      faqSlideTwo: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80",

      /** Vehicle transport FAQ carousel image used to show vehicle tie-down and transport safety. */
      faqSlideThree: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1200&q=80",
    },
  },

  common: {
    /** About page collage image used in the company intro section. */
    aboutCollageOne: assetsUrl("/assets/about/about1.jpg"),

    /** About page collage image used in the company intro section. */
    aboutCollageTwo: assetsUrl("/assets/about/about3.jpg"),

    /** About page collage image used in the company intro section. */
    aboutCollageThree: assetsUrl("/assets/about/about2.jpg"),

    /** Shared service preview image used in hero overlays and fallback sections. */
    movingTeamOne: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=1200&q=80",

    /** Shared service preview image used in hero overlays and fallback sections. */
    movingTeamTwo: "https://images.unsplash.com/photo-1577415124269-fc1140a69e91?auto=format&fit=crop&w=1200&q=80",

    /** Shared service preview image used in hero overlays and fallback sections. */
    movingTeamThree: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",

    /** Shared route planning image used across gallery, FAQ, and process sections. */
    routePlanning: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1200&q=80",

    /** Shared packing and transport image used across gallery and FAQ sections. */
    packingMaterials: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",

    /** Shared logistics and warehouse image used across service and gallery sections. */
    logisticsWarehouse: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",

    /** Shared district coverage image used for local move planning and route awareness sections. */
    districtMovePlanning: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80",

    /** Shared district coverage image used for packed vehicle and dispatch planning sections. */
    districtDispatchPlanning: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1600&q=80",

    /** Shared district coverage image used for stacked boxes and loading workflow sections. */
    districtLoadingWorkflow: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1600&q=80",

    /** Shared district coverage image used for customer support and relocation planning sections. */
    districtCustomerSupport: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1600&q=80",

    /** Shared district coverage image used for truck loading and delivery staging sections. */
    districtTruckLoading: "https://images.unsplash.com/photo-1501117716987-c8e1ecb2106e?auto=format&fit=crop&w=1600&q=80",

    /** Shared district coverage image used for vehicle loading and transport coordination sections. */
    districtVehicleCoordination: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1600&q=80",

    /** Shared district coverage image used for office support and professional logistics sections. */
    districtOfficeSupport: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1600&q=80",

    /** Shared district coverage image used for modern moving support and service area marketing sections. */
    districtModernMove: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1600&q=80",
  },

  external: {
    /** Alternate older Supabase-style alias kept for legacy code paths that still read the logo as a string. */
    logo: assetsUrl("/assets/logo/logo.png", "/media/logo.png"),

    /** Legacy flat alias for the household service banner used by older imports. */
    servicehousebanner: assetsUrl("/assets/services/household/service-house-bg.avif"),

    /** Legacy flat alias for the office service banner used by older imports. */
    officebanner: assetsUrl("/assets/services/office/office-banner.avif"),

    /** Legacy flat alias for the about page hero banner used by older imports. */
    aboutBanner: "https://www.adarshindiapackers.com/wp-content/uploads/2026/03/young-happy-delivery-man-with-cardboard-boxes-looking-at-camera-.jpg",

    /** Legacy flat alias for the services/packing asset used by older imports and future reuse. */
    packingService: assetsUrl("/assets/services/packing.jpg"),

    /** Legacy fallback hero image used in some older district and marketing sections. */
    jharkhandHero: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1600&q=80",

    /** Legacy fallback hero image used in some older district and marketing sections. */
    galleryHero: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1600&q=80",

    /** Legacy fallback hero image used in the quote page and contact page layouts. */
    quoteHero: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1600&q=80",

    /** Legacy mobile drawer backdrop image preserved for backwards compatibility. */
    mobileDrawerBackdrop: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=900&q=80",
  },

  /** Flat alias preserved so existing imports like `siteAssets.logo` keep working. */
  logo: assetsUrl("/assets/logo/logo.png", "/media/logo.png"),

  /** Flat alias preserved for older components that still read the household banner directly. */
  servicehousebanner: assetsUrl("/assets/services/household/service-house-bg.avif"),

  /** Flat alias preserved for older components that still read the office banner directly. */
  officebanner: assetsUrl("/assets/services/office/office-banner.avif"),

  /** Flat alias preserved for older pages that still reference the about hero banner directly. */
  aboutBanner: "https://www.adarshindiapackers.com/wp-content/uploads/2026/03/young-happy-delivery-man-with-cardboard-boxes-looking-at-camera-.jpg",

  /** Flat alias preserved for older imports that still reference the packing service image directly. */
  packingService: assetsUrl("/assets/services/packing.jpg"),
} as const;
