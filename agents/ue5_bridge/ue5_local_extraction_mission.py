#!/usr/bin/env python3
"""
UE5 Local Installation Knowledge Extraction Mission
Target: Complete local UE5 documentation and file analysis
Agents: PATHsassin + Clay-I for comprehensive learning
"""

import os
import json
import time
from datetime import datetime
from pathlib import Path
import glob

class UE5LocalExtractionMission:
    """Extract knowledge from local UE5 installation"""
    
    def __init__(self):
        self.mission_id = f"ue5_local_{int(time.time())}"
        
        # Common UE5 installation paths
        self.ue5_paths = [
            "/Applications/Epic Games/UE_5.3",
            "/Applications/Epic Games/UE_5.4", 
            "/Applications/Epic Games/UE_5.5",
            "C:/Program Files/Epic Games/UE_5.3",
            "C:/Program Files/Epic Games/UE_5.4",
            "C:/Program Files/Epic Games/UE_5.5",
            "~/Epic Games/UE_5.3",
            "~/Epic Games/UE_5.4",
            "~/Epic Games/UE_5.5"
        ]
        
        self.target_directories = [
            "Documentation",
            "Engine/Documentation", 
            "Templates",
            "Samples",
            "Engine/Content",
            "Engine/Source",
            "Engine/Plugins",
            "FeaturePacks"
        ]
        
        self.file_types = {
            "documentation": [".md", ".html", ".txt", ".pdf"],
            "blueprints": [".uasset", ".umap"],
            "code": [".cpp", ".h", ".cs"],
            "config": [".ini", ".json", ".xml"],
            "projects": [".uproject"]
        }
        
        self.extraction_results = {
            "installation_found": False,
            "installation_path": None,
            "documentation_files": [],
            "sample_projects": [],
            "blueprint_examples": [],
            "source_code_files": [],
            "learning_resources": [],
            "total_files_found": 0
        }
    
    def find_ue5_installation(self):
        """Locate UE5 installation directory"""
        print("🔍 SEARCHING FOR UE5 INSTALLATION")
        print("="*50)
        
        for path in self.ue5_paths:
            expanded_path = os.path.expanduser(path)
            if os.path.exists(expanded_path):
                print(f"✅ UE5 Found: {expanded_path}")
                self.extraction_results["installation_found"] = True
                self.extraction_results["installation_path"] = expanded_path
                return expanded_path
        
        print("❌ UE5 installation not found in common locations")
        print("📝 Please specify custom installation path when available")
        return None
    
    def scan_documentation(self, base_path):
        """Extract all documentation files"""
        print("\n📚 SCANNING DOCUMENTATION")
        print("-" * 30)
        
        doc_files = []
        for target_dir in self.target_directories:
            full_path = os.path.join(base_path, target_dir)
            if os.path.exists(full_path):
                print(f"📁 Scanning: {target_dir}")
                
                for file_ext in self.file_types["documentation"]:
                    pattern = os.path.join(full_path, f"**/*{file_ext}")
                    files = glob.glob(pattern, recursive=True)
                    
                    for file_path in files:
                        doc_info = {
                            "path": file_path,
                            "name": os.path.basename(file_path),
                            "size": os.path.getsize(file_path),
                            "category": self.categorize_file(file_path),
                            "last_modified": datetime.fromtimestamp(
                                os.path.getmtime(file_path)
                            ).isoformat()
                        }
                        doc_files.append(doc_info)
                        print(f"  📄 {doc_info['name']} ({doc_info['size']} bytes)")
        
        self.extraction_results["documentation_files"] = doc_files
        print(f"\n✅ Found {len(doc_files)} documentation files")
        return doc_files
    
    def scan_sample_projects(self, base_path):
        """Find sample projects and templates"""
        print("\n🎮 SCANNING SAMPLE PROJECTS")
        print("-" * 30)
        
        projects = []
        sample_dirs = ["Templates", "Samples", "FeaturePacks"]
        
        for sample_dir in sample_dirs:
            full_path = os.path.join(base_path, sample_dir)
            if os.path.exists(full_path):
                print(f"📁 Scanning: {sample_dir}")
                
                # Find .uproject files
                pattern = os.path.join(full_path, "**/*.uproject")
                project_files = glob.glob(pattern, recursive=True)
                
                for project_file in project_files:
                    project_info = {
                        "path": project_file,
                        "name": os.path.basename(project_file),
                        "directory": os.path.dirname(project_file),
                        "type": sample_dir.lower(),
                        "size": os.path.getsize(project_file)
                    }
                    projects.append(project_info)
                    print(f"  🎯 {project_info['name']}")
        
        self.extraction_results["sample_projects"] = projects
        print(f"\n✅ Found {len(projects)} sample projects")
        return projects
    
    def scan_blueprints(self, base_path):
        """Find blueprint examples and assets"""
        print("\n🔷 SCANNING BLUEPRINT EXAMPLES")
        print("-" * 30)
        
        blueprints = []
        content_dirs = ["Engine/Content", "Templates", "Samples"]
        
        for content_dir in content_dirs:
            full_path = os.path.join(base_path, content_dir)
            if os.path.exists(full_path):
                print(f"📁 Scanning: {content_dir}")
                
                # Find blueprint files
                for bp_ext in [".uasset", ".umap"]:
                    pattern = os.path.join(full_path, f"**/*{bp_ext}")
                    bp_files = glob.glob(pattern, recursive=True)[:50]  # Limit for performance
                    
                    for bp_file in bp_files:
                        bp_info = {
                            "path": bp_file,
                            "name": os.path.basename(bp_file),
                            "type": bp_ext,
                            "size": os.path.getsize(bp_file),
                            "category": "blueprint" if bp_ext == ".uasset" else "level"
                        }
                        blueprints.append(bp_info)
        
        self.extraction_results["blueprint_examples"] = blueprints
        print(f"\n✅ Found {len(blueprints)} blueprint files")
        return blueprints
    
    def scan_source_code(self, base_path):
        """Find C++ source code examples"""
        print("\n💻 SCANNING SOURCE CODE")
        print("-" * 30)
        
        source_files = []
        source_path = os.path.join(base_path, "Engine/Source")
        
        if os.path.exists(source_path):
            print(f"📁 Scanning: Engine/Source")
            
            for code_ext in [".cpp", ".h"]:
                pattern = os.path.join(source_path, f"**/*{code_ext}")
                code_files = glob.glob(pattern, recursive=True)[:100]  # Limit for performance
                
                for code_file in code_files:
                    code_info = {
                        "path": code_file,
                        "name": os.path.basename(code_file),
                        "type": code_ext,
                        "size": os.path.getsize(code_file),
                        "module": self.extract_module_name(code_file)
                    }
                    source_files.append(code_info)
        
        self.extraction_results["source_code_files"] = source_files
        print(f"\n✅ Found {len(source_files)} source code files")
        return source_files
    
    def categorize_file(self, file_path):
        """Categorize files by content type"""
        filename = os.path.basename(file_path).lower()
        
        if any(keyword in filename for keyword in ["blueprint", "bp"]):
            return "blueprints"
        elif any(keyword in filename for keyword in ["tutorial", "guide", "getting"]):
            return "tutorials"
        elif any(keyword in filename for keyword in ["api", "reference"]):
            return "reference"
        elif any(keyword in filename for keyword in ["sample", "example"]):
            return "examples"
        else:
            return "general"
    
    def extract_module_name(self, file_path):
        """Extract UE5 module name from file path"""
        path_parts = file_path.split(os.sep)
        if "Source" in path_parts:
            source_index = path_parts.index("Source")
            if source_index + 1 < len(path_parts):
                return path_parts[source_index + 1]
        return "Unknown"
    
    def generate_learning_plan(self):
        """Generate personalized UE5 learning plan from extracted data"""
        print("\n🎯 GENERATING LEARNING PLAN")
        print("-" * 30)
        
        learning_plan = {
            "beginner_path": [],
            "intermediate_path": [],
            "advanced_path": [],
            "specialized_tracks": {}
        }
        
        # Categorize resources by difficulty
        for doc in self.extraction_results["documentation_files"]:
            if doc["category"] == "tutorials":
                if any(word in doc["name"].lower() for word in ["intro", "basic", "getting", "first"]):
                    learning_plan["beginner_path"].append(doc)
                elif any(word in doc["name"].lower() for word in ["advanced", "expert", "master"]):
                    learning_plan["advanced_path"].append(doc)
                else:
                    learning_plan["intermediate_path"].append(doc)
        
        # Add sample projects to learning tracks
        for project in self.extraction_results["sample_projects"]:
            track_name = f"{project['type']}_projects"
            if track_name not in learning_plan["specialized_tracks"]:
                learning_plan["specialized_tracks"][track_name] = []
            learning_plan["specialized_tracks"][track_name].append(project)
        
        self.extraction_results["learning_resources"] = learning_plan
        
        print(f"📚 Beginner resources: {len(learning_plan['beginner_path'])}")
        print(f"📊 Intermediate resources: {len(learning_plan['intermediate_path'])}")
        print(f"🚀 Advanced resources: {len(learning_plan['advanced_path'])}")
        print(f"🎯 Specialized tracks: {len(learning_plan['specialized_tracks'])}")
        
        return learning_plan
    
    def save_mission_results(self):
        """Save complete extraction results"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"ue5_local_extraction_{timestamp}.json"
        
        # Calculate totals
        total_files = (
            len(self.extraction_results["documentation_files"]) +
            len(self.extraction_results["sample_projects"]) +
            len(self.extraction_results["blueprint_examples"]) +
            len(self.extraction_results["source_code_files"])
        )
        
        self.extraction_results["total_files_found"] = total_files
        self.extraction_results["extraction_timestamp"] = datetime.now().isoformat()
        self.extraction_results["mission_id"] = self.mission_id
        
        with open(filename, 'w') as f:
            json.dump(self.extraction_results, f, indent=2)
        
        print(f"\n💾 Mission results saved: {filename}")
        return filename
    
    def execute_mission(self, custom_path=None):
        """Execute complete local UE5 extraction mission"""
        print("🚀 UE5 LOCAL EXTRACTION MISSION")
        print("="*50)
        print(f"Mission ID: {self.mission_id}")
        print(f"Timestamp: {datetime.now().isoformat()}")
        print("="*50)
        
        # Find UE5 installation
        ue5_path = custom_path or self.find_ue5_installation()
        
        if not ue5_path:
            print("\n❌ Cannot proceed without UE5 installation")
            print("📝 Install UE5 and run mission again")
            return None
        
        # Execute extraction phases
        self.scan_documentation(ue5_path)
        self.scan_sample_projects(ue5_path)
        self.scan_blueprints(ue5_path)
        self.scan_source_code(ue5_path)
        self.generate_learning_plan()
        
        # Save results
        results_file = self.save_mission_results()
        
        print("\n🎉 MISSION COMPLETE!")
        print("="*50)
        print(f"📁 Installation: {ue5_path}")
        print(f"📚 Documentation files: {len(self.extraction_results['documentation_files'])}")
        print(f"🎮 Sample projects: {len(self.extraction_results['sample_projects'])}")
        print(f"🔷 Blueprint examples: {len(self.extraction_results['blueprint_examples'])}")
        print(f"💻 Source code files: {len(self.extraction_results['source_code_files'])}")
        print(f"📊 Total files extracted: {self.extraction_results['total_files_found']}")
        print(f"💾 Results: {results_file}")
        
        return self.extraction_results

def main():
    """Run UE5 local extraction mission"""
    mission = UE5LocalExtractionMission()
    results = mission.execute_mission()
    return results

if __name__ == "__main__":
    main()