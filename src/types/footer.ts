export interface FooterNavLink {
  label: string;
  href: string;
}

export interface FooterContactInfo {
  instagramHandle: string;
  instagramUrl: string;
  email: string;
}

export interface FooterWholesaleCta {
  label: string;
  href: string;
}

export interface FooterLegalLink {
  label: string;
  href: string;
}

export interface FooterData {
  tagline: string;
  navLinks: FooterNavLink[];
  contact: FooterContactInfo;
  wholesale: FooterWholesaleCta;
  legalLinks: FooterLegalLink[];
  copyrightText: string;
}

export interface FooterResponse {
  footer: FooterData;
}
