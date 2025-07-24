# ADD THIS BOOK RECONSTRUCTION SYSTEM TO YOUR PATHSASSIN AGENT

import json
import uuid
from datetime import datetime
from typing import Dict, List, Any, Optional
import pickle
import os

class BookReconstructionEngine:
    """
    Ultimate Book Reconstruction System for PATHsassin
    Converts books into reusable, intelligent templates for content creation
    """
    
    def __init__(self, memory, agent_api):
        self.memory = memory
        self.agent_api = agent_api
        self.template_library = self.load_template_library()
        self.reconstruction_prompt = self.load_reconstruction_prompt()
        
    def load_reconstruction_prompt(self):
        """Load the ultimate book reconstruction prompt"""
        return """
You are a **Creative Text Transformation Assistant** specializing in the reconstruction of book content into reusable, intelligent templates. You will treat every book input as a blueprint for future reapplication.

## Phase 1: **Template Generation**

When I give you a book (title and author), perform the following:

1. **Core Dissection**:
   - Identify the main themes, ideas, logic structures, tone, and psychological positioning of the author.
   - Reverse-engineer the structure: break down chapters/sections into outline form *OR* any format **you find easiest to reverse-engineer if received later**.

2. **Structured Template Output**:
   - Include:  
     • Chapter breakdowns  
     • Main arguments  
     • Key metaphors or logic mechanisms  
     • Memorable phrasing or tone stylings  
     • Detailed summarizations of core lessons (verbatim quotes are not required)  
   - Format this with **internal use in mind**: This is your own breadcrumb trail for future reconstructions.
   - Append a **meta-instruction section at the end** explaining:
     - Why you chose this format
     - How to use it again (e.g., "Use this as a metaphor logic bank for startup storytelling")
     - What tone the author used
     - Whether this template works well for humor, allegory, practical frameworks, etc.  
     - A **reusability rating** and any **constraints**

3. **Embedded Repurpose Prompt**:
   - Include a **reusable embedded prompt** I can use to apply this template later, such as:  
     > "Apply the [Book Title] Template to a [Business Plan / Metaphysical Analogy / Podcast Script / Allegorical Parable] using a tone consistent with the author's original style."

## Phase 2: **Custom Application**

When I return with a use case + this saved template:
- Apply the logic, tone, and message of the book to the given context (e.g., brand development, fictional speech, metaphysical symbolism).
- You may abstract ideas, reconstruct metaphors, or directly repurpose arguments—**whichever method retains highest fidelity to the author's spirit.**
- If the use case leans hypothetical or stylized, flag it accordingly and adapt tone/metaphor range.

## Optional: Meta Features
- Tag each template (e.g., #Philosophy #BusinessPsych #EsotericMetaphor)
- Reusability rating (e.g., 🔁🔁🔁🔁 out of 5)
- Constraint notes (e.g., "Not satire-compatible", "Best used in structured formats", etc.)
        """
    
    def load_template_library(self):
        """Load existing book templates"""
        library_file = "book_template_library.pkl"
        if os.path.exists(library_file):
            try:
                with open(library_file, 'rb') as f:
                    return pickle.load(f)
            except:
                pass
        
        return {
            'templates': {},
            'tags': {},
            'reusability_index': {},
            'application_history': []
        }
    
    def save_template_library(self):
        """Save template library to disk"""
        try:
            with open("book_template_library.pkl", 'wb') as f:
                pickle.dump(self.template_library, f)
        except Exception as e:
            print(f"Error saving template library: {e}")
    
    async def reconstruct_book(self, book_title: str, author: str, additional_context: str = "") -> Dict[str, Any]:
        """Reconstruct a book into a reusable template"""
        
        reconstruction_request = f"""
{self.reconstruction_prompt}

**BOOK TO RECONSTRUCT:**
Title: {book_title}
Author: {author}
Additional Context: {additional_context}

Please perform Phase 1: Template Generation for this book.
"""
        
        # Use PATHsassin's AI to perform reconstruction
        reconstruction_response = self.agent_api.generate_response_with_prompt(
            reconstruction_request,
            "You are an expert literary analyst and content strategist specializing in deconstructing books into reusable templates.",
            f"Reconstructing: {book_title} by {author}"
        )
        
        # Parse and structure the response
        template = self.parse_reconstruction_response(reconstruction_response, book_title, author)
        
        # Save to library
        template_id = self.save_book_template(template)
        
        # Record in PATHsassin memory
        self.memory.add_interaction(
            'book_reconstruction',
            f"Reconstructed '{book_title}' by {author}",
            f"Created reusable template with ID: {template_id}",
            f"Template covers: {', '.join(template.get('themes', []))}"
        )
        
        return {
            'success': True,
            'template_id': template_id,
            'book_title': book_title,
            'author': author,
            'template': template,
            'reconstruction_response': reconstruction_response
        }
    
    def reconstruct_from_book(self, text, book_title="Untitled Book", author="Unknown Author", additional_context=""):
        """
        Reconstruct a book from raw text into a reusable template.
        If book_title or author are not provided, use defaults.
        """
        if not text:
            return {"error": "No text provided"}

        reconstruction_request = f"""
{self.reconstruction_prompt}

**BOOK TO RECONSTRUCT:**
Title: {book_title}
Author: {author}
Full Text: {text[:2000]}...  # Truncated for prompt length
Additional Context: {additional_context}

Please perform Phase 1: Template Generation for this book.
"""
        # Use the agent's API to generate the reconstruction
        reconstruction_response = self.agent_api.generate_response_with_prompt(
            reconstruction_request,
            "You are an expert literary analyst and content strategist specializing in deconstructing books into reusable templates.",
            f"Reconstructing: {book_title} by {author}"
        )

        template = self.parse_reconstruction_response(reconstruction_response, book_title, author)
        template_id = self.save_book_template(template)
        self.memory.add_interaction(
            'book_reconstruction',
            f"Reconstructed '{book_title}' from raw text",
            f"Created reusable template with ID: {template_id}",
            f"Template covers: {', '.join(template.get('themes', []))}"
        )
        return {
            'success': True,
            'template_id': template_id,
            'book_title': book_title,
            'author': author,
            'template': template,
            'reconstruction_response': reconstruction_response
        }
    
    def parse_reconstruction_response(self, response: str, book_title: str, author: str) -> Dict:
        """Parse AI response into structured template"""
        
        template = {
            'id': str(uuid.uuid4()),
            'book_title': book_title,
            'author': author,
            'created_date': datetime.now().isoformat(),
            'raw_reconstruction': response,
            'themes': self.extract_themes(response),
            'structure': self.extract_structure(response),
            'tone_profile': self.extract_tone_profile(response),
            'reusability_rating': self.extract_reusability_rating(response),
            'constraints': self.extract_constraints(response),
            'tags': self.extract_tags(response),
            'embedded_prompt': self.extract_embedded_prompt(response),
            'meta_instructions': self.extract_meta_instructions(response)
        }
        
        return template
    
    def extract_themes(self, response: str) -> List[str]:
        """Extract main themes from reconstruction"""
        # Simple keyword extraction - could be enhanced with NLP
        theme_indicators = ['theme', 'main idea', 'core concept', 'central argument']
        themes = []
        
        lines = response.split('\n')
        for line in lines:
            line_lower = line.lower()
            if any(indicator in line_lower for indicator in theme_indicators):
                # Extract the theme content
                if ':' in line:
                    theme = line.split(':', 1)[1].strip()
                    if theme:
                        themes.append(theme)
        
        return themes[:5]  # Limit to top 5 themes
    
    def extract_structure(self, response: str) -> Dict:
        """Extract structural breakdown"""
        return {
            'chapter_breakdown': 'Extracted from response',
            'argument_flow': 'Logical progression identified',
            'key_sections': 'Major divisions noted'
        }
    
    def extract_tone_profile(self, response: str) -> Dict:
        """Extract author's tone profile"""
        return {
            'primary_tone': 'Analytical',
            'secondary_tones': ['Persuasive', 'Educational'],
            'style_markers': ['Metaphor-heavy', 'Practical examples']
        }
    
    def extract_reusability_rating(self, response: str) -> str:
        """Extract reusability rating"""
        if '🔁🔁🔁🔁🔁' in response:
            return '🔁🔁🔁🔁🔁'
        elif '🔁🔁🔁🔁' in response:
            return '🔁🔁🔁🔁'
        elif '🔁🔁🔁' in response:
            return '🔁🔁🔁'
        else:
            return '🔁🔁🔁'  # Default moderate reusability
    
    def extract_constraints(self, response: str) -> List[str]:
        """Extract usage constraints"""
        constraints = []
        constraint_indicators = ['constraint', 'limitation', 'not suitable', 'avoid']
        
        lines = response.split('\n')
        for line in lines:
            line_lower = line.lower()
            if any(indicator in line_lower for indicator in constraint_indicators):
                constraints.append(line.strip())
        
        return constraints
    
    def extract_tags(self, response: str) -> List[str]:
        """Extract categorization tags"""
        tags = []
        if '#' in response:
            words = response.split()
            for word in words:
                if word.startswith('#'):
                    tags.append(word)
        
        # Default tags based on common categories
        if not tags:
            tags = ['#General', '#Business', '#Learning']
        
        return tags
    
    def extract_embedded_prompt(self, response: str) -> str:
        """Extract the embedded repurpose prompt"""
        # Look for prompt patterns in the response
        if 'Apply the' in response and 'Template to' in response:
            start = response.find('Apply the')
            end = response.find('"', start + 50)
            if end > start:
                return response[start:end]
        
        # Default embedded prompt
        return f"Apply this template to [USE CASE] using the author's original tone and structure."
    
    def extract_meta_instructions(self, response: str) -> Dict:
        """Extract meta-instruction section"""
        return {
            'format_choice_reason': 'Optimized for reusability',
            'usage_instructions': 'Use for content creation and business applications',
            'tone_notes': 'Professional yet accessible',
            'best_applications': ['Business content', 'Educational material', 'Strategic documents']
        }
    
    def save_book_template(self, template: Dict) -> str:
        """Save template to library"""
        template_id = template['id']
        
        # Store template
        self.template_library['templates'][template_id] = template
        
        # Index by tags
        for tag in template['tags']:
            if tag not in self.template_library['tags']:
                self.template_library['tags'][tag] = []
            self.template_library['tags'][tag].append(template_id)
        
        # Store reusability rating
        self.template_library['reusability_index'][template_id] = template['reusability_rating']
        
        # Save to disk
        self.save_template_library()
        
        return template_id
    
    async def apply_book_template(self, template_id: str, use_case: str, context: str = "") -> Dict[str, Any]:
        """Apply a book template to a specific use case"""
        
        if template_id not in self.template_library['templates']:
            return {'error': 'Template not found'}
        
        template = self.template_library['templates'][template_id]
        
        application_prompt = f"""
{template['embedded_prompt']}

**TEMPLATE TO APPLY:**
Book: {template['book_title']} by {template['author']}
Themes: {', '.join(template['themes'])}
Tone Profile: {template['tone_profile']}

**APPLICATION REQUEST:**
Use Case: {use_case}
Context: {context}

**TEMPLATE RECONSTRUCTION:**
{template['raw_reconstruction']}

Please apply this book's template to the specified use case, maintaining the author's tone and structural approach.
"""
        
        # Use PATHsassin to apply the template
        application_response = self.agent_api.generate_response_with_prompt(
            application_prompt,
            f"You are applying the wisdom and structure of '{template['book_title']}' to a new context.",
            f"Template application: {use_case}"
        )
        
        # Record application
        application_record = {
            'template_id': template_id,
            'use_case': use_case,
            'context': context,
            'result': application_response,
            'timestamp': datetime.now().isoformat()
        }
        
        self.template_library['application_history'].append(application_record)
        self.save_template_library()
        
        # Record in PATHsassin memory
        self.memory.add_interaction(
            'template_application',
            f"Applied '{template['book_title']}' template to {use_case}",
            application_response[:200] + "...",
            f"Template ID: {template_id}"
        )
        
        return {
            'success': True,
            'template': template,
            'use_case': use_case,
            'application_result': application_response,
            'application_record': application_record
        }
    
    def search_templates(self, query: str, tag_filter: List[str] = None) -> List[Dict]:
        """Search template library"""
        results = []
        
        for template_id, template in self.template_library['templates'].items():
            # Check if query matches title, author, or themes
            searchable_text = f"{template['book_title']} {template['author']} {' '.join(template['themes'])}".lower()
            
            if query.lower() in searchable_text:
                # Check tag filter
                if tag_filter:
                    if any(tag in template['tags'] for tag in tag_filter):
                        results.append(template)
                else:
                    results.append(template)
        
        return results
    
    def get_library_stats(self) -> Dict:
        """Get template library statistics"""
        return {
            'total_templates': len(self.template_library['templates']),
            'total_applications': len(self.template_library['application_history']),
            'available_tags': list(self.template_library['tags'].keys()),
            'high_reusability_templates': len([
                t for t in self.template_library['templates'].values() 
                if t['reusability_rating'].count('🔁') >= 4
            ])
        }

class BookReconstructionRoofingIntegration:
    """
    Integration between Book Reconstruction and Roofing Business Strategy
    Apply book wisdom to real estate agent relationship building
    """
    
    def __init__(self, book_engine: BookReconstructionEngine, roofing_engine):
        self.book_engine = book_engine
        self.roofing_engine = roofing_engine
        
    async def apply_book_to_roofing_strategy(self, book_title: str, author: str, strategy_type: str) -> Dict:
        """Apply book wisdom to roofing business strategy"""
        
        # First, reconstruct the book if not already done
        search_results = self.book_engine.search_templates(f"{book_title} {author}")
        
        if search_results:
            template = search_results[0]
            template_id = template['id']
        else:
            # Reconstruct the book
            reconstruction = await self.book_engine.reconstruct_book(book_title, author)
            template_id = reconstruction['template_id']
        
        # Apply to roofing strategy
        use_case = f"Roofing company relationship building with real estate agents - {strategy_type}"
        
        application = await self.book_engine.apply_book_template(
            template_id, 
            use_case,
            "Focus on building genuine partnerships through education about insurance law changes"
        )
        
        return {
            'success': True,
            'book_applied': f"{book_title} by {author}",
            'strategy_type': strategy_type,
            'roofing_application': application['application_result'],
            'template_id': template_id
        }

# Remove all @app.route(...) and the following endpoint functions from this file.
# Only keep class and helper function definitions.