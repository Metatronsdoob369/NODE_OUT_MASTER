#!/usr/bin/env python3
"""
Hotline Intelligence Scraper
Finds successful hotline numbers and social media accounts for competitive analysis
"""

import asyncio
import aiohttp
import requests
from bs4 import BeautifulSoup
import re
from typing import Dict, List, Any, Optional
from datetime import datetime
import json
import time

class HotlineIntelligenceScraper:
    """
    Specialized agent for finding successful emergency/hotline businesses and their social media presence
    """
    
    def __init__(self):
        self.session = None
        self.search_patterns = self.load_search_patterns()
        self.results = []
        
    def load_search_patterns(self):
        """Load search patterns for finding hotline businesses"""
        return {
            'emergency_services': [
                'emergency storm damage',
                'storm damage hotline',
                '24/7 emergency repair',
                'emergency restoration services',
                'disaster cleanup hotline',
                'emergency roofing services',
                'storm damage repair hotline',
                '24 hour emergency services'
            ],
            'hotline_patterns': [
                r'(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})',  # Phone numbers
                r'(1-800-[\d-]+)',  # 1-800 numbers
                r'(1-888-[\d-]+)',  # 1-888 numbers
                r'(1-877-[\d-]+)',  # 1-877 numbers
            ],
            'social_indicators': [
                'facebook.com/',
                'instagram.com/',
                'twitter.com/',
                'linkedin.com/',
                'youtube.com/',
                'tiktok.com/'
            ],
            'success_indicators': [
                'reviews',
                'rated',
                'stars',
                'testimonials',
                'years in business',
                'licensed',
                'insured',
                'certified',
                'award',
                'best of',
                'A+ rating'
            ]
        }
    
    async def initialize_session(self):
        """Initialize async HTTP session"""
        if not self.session:
            timeout = aiohttp.ClientTimeout(total=30)
            headers = {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            self.session = aiohttp.ClientSession(timeout=timeout, headers=headers)
    
    async def close_session(self):
        """Close async session"""
        if self.session:
            await self.session.close()
            self.session = None
    
    async def search_google_for_hotlines(self, query: str, location: str = "Birmingham AL") -> List[Dict]:
        """Search Google for emergency hotline businesses"""
        await self.initialize_session()
        
        # Construct Google search URL
        search_query = f"{query} {location}"
        google_url = f"https://www.google.com/search?q={search_query.replace(' ', '+')}"
        
        try:
            async with self.session.get(google_url) as response:
                if response.status == 200:
                    html = await response.text()
                    return self.parse_google_results(html, search_query)
                else:
                    return []
        except Exception as e:
            print(f"Google search failed: {e}")
            return []
    
    def parse_google_results(self, html: str, query: str) -> List[Dict]:
        """Parse Google search results for hotline businesses"""
        soup = BeautifulSoup(html, 'html.parser')
        results = []
        
        # Find search result divs
        search_results = soup.find_all('div', class_=re.compile(r'g\b'))
        
        for result in search_results[:10]:  # Top 10 results
            try:
                # Extract title and URL
                title_elem = result.find('h3')
                if not title_elem:
                    continue
                    
                title = title_elem.get_text(strip=True)
                
                # Find link
                link_elem = result.find('a')
                if not link_elem:
                    continue
                    
                url = link_elem.get('href', '')
                if url.startswith('/url?q='):
                    url = url.split('/url?q=')[1].split('&')[0]
                
                # Extract snippet
                snippet_elem = result.find('div', class_=re.compile(r'VwiC3b'))
                snippet = snippet_elem.get_text(strip=True) if snippet_elem else ""
                
                # Look for phone numbers in snippet
                phone_numbers = self.extract_phone_numbers(f"{title} {snippet}")
                
                if phone_numbers or any(keyword in title.lower() for keyword in ['emergency', 'hotline', '24/7', 'storm', 'repair']):
                    results.append({
                        'title': title,
                        'url': url,
                        'snippet': snippet,
                        'phone_numbers': phone_numbers,
                        'query': query,
                        'found_at': datetime.now().isoformat()
                    })
                    
            except Exception as e:
                print(f"Error parsing result: {e}")
                continue
        
        return results
    
    def extract_phone_numbers(self, text: str) -> List[str]:
        """Extract phone numbers from text"""
        phone_numbers = []
        
        for pattern in self.search_patterns['hotline_patterns']:
            matches = re.findall(pattern, text)
            phone_numbers.extend(matches)
        
        # Clean and deduplicate
        cleaned_numbers = []
        for number in phone_numbers:
            # Remove extra formatting
            clean_number = re.sub(r'[^\d]', '', number)
            if len(clean_number) == 10 or len(clean_number) == 11:
                if number not in cleaned_numbers:
                    cleaned_numbers.append(number)
        
        return cleaned_numbers
    
    async def analyze_website_for_social_media(self, url: str) -> Dict[str, Any]:
        """Analyze website for social media links and success indicators"""
        await self.initialize_session()
        
        try:
            async with self.session.get(url) as response:
                if response.status != 200:
                    return {'error': f'Failed to fetch {url}'}
                
                html = await response.text()
                soup = BeautifulSoup(html, 'html.parser')
                
                # Find social media links
                social_links = []
                for link in soup.find_all('a', href=True):
                    href = link.get('href', '').lower()
                    for social in self.search_patterns['social_indicators']:
                        if social in href:
                            social_links.append({
                                'platform': social.replace('.com/', '').replace('facebook', 'Facebook').replace('instagram', 'Instagram').replace('twitter', 'Twitter').replace('linkedin', 'LinkedIn').replace('youtube', 'YouTube').replace('tiktok', 'TikTok'),
                                'url': href,
                                'text': link.get_text(strip=True)
                            })
                
                # Find success indicators
                page_text = soup.get_text().lower()
                success_signals = []
                for indicator in self.search_patterns['success_indicators']:
                    if indicator in page_text:
                        success_signals.append(indicator)
                
                # Extract contact information
                contact_info = {
                    'phone_numbers': self.extract_phone_numbers(soup.get_text()),
                    'email': re.findall(r'[\w\.-]+@[\w\.-]+\.\w+', soup.get_text()),
                    'address': self.extract_addresses(soup.get_text())
                }
                
                return {
                    'url': url,
                    'social_media_links': social_links,
                    'success_indicators': success_signals,
                    'contact_info': contact_info,
                    'title': soup.title.string if soup.title else '',
                    'analyzed_at': datetime.now().isoformat()
                }
                
        except Exception as e:
            return {'error': f'Analysis failed for {url}: {str(e)}'}
    
    def extract_addresses(self, text: str) -> List[str]:
        """Extract potential addresses from text"""
        # Simple address pattern - can be enhanced
        address_patterns = [
            r'\d+\s+[\w\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Circle|Cir|Court|Ct)[\w\s,]*\w{2}\s+\d{5}',
            r'\d+\s+[\w\s]+,\s*\w+,\s*\w{2}\s+\d{5}'
        ]
        
        addresses = []
        for pattern in address_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            addresses.extend(matches)
        
        return addresses[:3]  # Return up to 3 addresses
    
    async def find_top_emergency_hotlines(self, location: str = "Birmingham AL") -> List[Dict[str, Any]]:
        """Find top performing emergency hotline businesses"""
        print(f"🔍 Searching for emergency hotlines in {location}...")
        
        all_results = []
        
        # Search for different types of emergency services
        for query in self.search_patterns['emergency_services']:
            print(f"  Searching: {query}")
            results = await self.search_google_for_hotlines(query, location)
            all_results.extend(results)
            
            # Rate limiting
            await asyncio.sleep(2)
        
        # Deduplicate by URL
        unique_results = {}
        for result in all_results:
            url = result.get('url', '')
            if url and url not in unique_results:
                unique_results[url] = result
        
        # Analyze each unique website
        analyzed_results = []
        for url, result in list(unique_results.items())[:10]:  # Top 10 unique results
            print(f"  Analyzing: {result.get('title', url)}")
            
            analysis = await self.analyze_website_for_social_media(url)
            
            # Combine search result with analysis
            combined_result = {
                **result,
                'website_analysis': analysis,
                'social_media_count': len(analysis.get('social_media_links', [])),
                'success_score': len(analysis.get('success_indicators', []))
            }
            
            analyzed_results.append(combined_result)
            
            # Rate limiting
            await asyncio.sleep(1)
        
        # Sort by success indicators and social media presence
        analyzed_results.sort(
            key=lambda x: (x.get('success_score', 0), x.get('social_media_count', 0)), 
            reverse=True
        )
        
        return analyzed_results
    
    def generate_intelligence_report(self, results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate intelligence report from scraped data"""
        if not results:
            return {'error': 'No results to analyze'}
        
        # Analyze patterns
        all_phone_numbers = []
        all_social_platforms = set()
        common_success_indicators = {}
        
        for result in results:
            # Collect phone numbers
            all_phone_numbers.extend(result.get('phone_numbers', []))
            
            # Collect social platforms
            analysis = result.get('website_analysis', {})
            for social_link in analysis.get('social_media_links', []):
                all_social_platforms.add(social_link.get('platform', 'Unknown'))
            
            # Count success indicators
            for indicator in analysis.get('success_indicators', []):
                common_success_indicators[indicator] = common_success_indicators.get(indicator, 0) + 1
        
        top_performers = results[:5]  # Top 5 performers
        
        report = {
            'intelligence_summary': {
                'total_businesses_analyzed': len(results),
                'average_social_media_presence': sum(r.get('social_media_count', 0) for r in results) / len(results),
                'average_success_score': sum(r.get('success_score', 0) for r in results) / len(results),
                'most_common_platforms': list(all_social_platforms),
                'most_common_success_indicators': dict(sorted(common_success_indicators.items(), key=lambda x: x[1], reverse=True)[:10])
            },
            'top_performers': [
                {
                    'business_name': result.get('title', 'Unknown'),
                    'url': result.get('url', ''),
                    'phone_numbers': result.get('phone_numbers', []),
                    'social_media_platforms': [link.get('platform') for link in result.get('website_analysis', {}).get('social_media_links', [])],
                    'success_indicators': result.get('website_analysis', {}).get('success_indicators', []),
                    'social_media_links': result.get('website_analysis', {}).get('social_media_links', [])
                }
                for result in top_performers
            ],
            'competitive_insights': {
                'phone_number_patterns': list(set(all_phone_numbers)),
                'required_social_platforms': list(all_social_platforms),
                'key_success_factors': list(common_success_indicators.keys())[:5]
            },
            'generated_at': datetime.now().isoformat()
        }
        
        return report

async def run_hotline_intelligence():
    """Main function to run hotline intelligence gathering"""
    scraper = HotlineIntelligenceScraper()
    
    try:
        print("🚀 Starting Hotline Intelligence Scraper...")
        
        # Find top emergency hotlines
        results = await scraper.find_top_emergency_hotlines("Birmingham AL")
        
        # Generate intelligence report
        report = scraper.generate_intelligence_report(results)
        
        # Save results
        with open('/Users/joewales/NODE_OUT_Master/agents/hotline_intelligence_report.json', 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"\n📊 Intelligence Report Generated:")
        print(f"   Businesses Analyzed: {report['intelligence_summary']['total_businesses_analyzed']}")
        print(f"   Top Performers Found: {len(report['top_performers'])}")
        print(f"   Social Platforms Identified: {', '.join(report['intelligence_summary']['most_common_platforms'])}")
        
        print(f"\n🏆 Top 3 Performing Businesses:")
        for i, performer in enumerate(report['top_performers'][:3], 1):
            print(f"   {i}. {performer['business_name']}")
            print(f"      Phone: {', '.join(performer['phone_numbers'])}")
            print(f"      Social: {', '.join(performer['social_media_platforms'])}")
        
        return report
        
    finally:
        await scraper.close_session()

if __name__ == "__main__":
    # Run the intelligence gathering
    report = asyncio.run(run_hotline_intelligence())
    print("\n✅ Hotline Intelligence Gathering Complete!")
    print("📁 Report saved to: hotline_intelligence_report.json")