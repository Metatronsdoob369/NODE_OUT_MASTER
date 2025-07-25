#!/usr/bin/env node
/**
 * 🎯 DAILY NEEDLE MOVER GENERATOR
 * Automatically generates 5 fresh ways to move the needle every day
 * Never run out of lead generation ideas
 */

const fs = require('fs');
const path = require('path');

// Needle Mover Categories
const categories = {
  technology: [
    "Set up automated follow-up system for estimates",
    "Create QR code for instant roof inspection requests", 
    "Deploy chatbot for after-hours lead capture",
    "Build AR app showing roof damage to homeowners",
    "Implement GPS tracking for service transparency"
  ],
  
  directOutreach: [
    "Call 20 leads from last month that didn't convert",
    "Visit 5 commercial properties with maintenance proposals",
    "Canvass neighborhoods that had recent storm damage",
    "Attend local business networking breakfast",
    "Drop by 3 insurance offices with premium coffee"
  ],
  
  digitalMarketing: [
    "Create time-lapse video of complete roof replacement",
    "Launch Facebook ads targeting homeowners 45+ in Birmingham",
    "Write SEO blog post about Alabama storm season prep",
    "Post before/after photos with neighborhood location tags",
    "Send email blast with seasonal maintenance checklist"
  ],
  
  partnerships: [
    "Contact HVAC companies about referral partnerships",
    "Reach out to property managers with bulk service offers",
    "Meet with real estate agents about pre-sale inspections",
    "Partner with local weatherman for storm alerts",
    "Collaborate with contractors on full exterior renovations"
  ],
  
  customerExperience: [
    "Call last 10 customers to check on roof performance",
    "Send handwritten thank you cards to recent clients",
    "Create customer portal for service history tracking",
    "Implement same-day estimate guarantee program",
    "Launch referral rewards program with $500 bonuses"
  ]
};

// Revenue Impact Ranges
const impacts = [
  "$5-15k immediate potential",
  "$10-25k over 30 days", 
  "$15-40k quarterly impact",
  "$20-50k annual revenue",
  "$25-60k compound effect"
];

// Implementation Difficulty
const difficulties = [
  "🟢 Quick Win (30 min setup)",
  "🟡 Medium Effort (2-4 hours)",
  "🔴 Big Project (1-2 days)"
];

function generateTodaysNeedleMovers() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Get category based on day of week
  const categoryKeys = Object.keys(categories);
  const todayCategory = categoryKeys[dayOfWeek % categoryKeys.length];
  const categoryName = todayCategory.charAt(0).toUpperCase() + todayCategory.slice(1);
  
  const needleMovers = [];
  const usedIdeas = new Set();
  
  // Generate 5 unique needle movers
  while (needleMovers.length < 5) {
    // Mix of categories for variety
    const randomCategory = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
    const ideas = categories[randomCategory];
    const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];
    
    if (!usedIdeas.has(randomIdea)) {
      usedIdeas.add(randomIdea);
      needleMovers.push({
        idea: randomIdea,
        category: randomCategory,
        impact: impacts[Math.floor(Math.random() * impacts.length)],
        difficulty: difficulties[Math.floor(Math.random() * difficulties.length)]
      });
    }
  }
  
  return {
    date: today.toLocaleDateString(),
    focusCategory: categoryName,
    needleMovers
  };
}

function createDailyFile() {
  const data = generateTodaysNeedleMovers();
  const fileName = `NEEDLE_MOVERS_${new Date().getFullYear()}_${(new Date().getMonth() + 1).toString().padStart(2, '0')}_${new Date().getDate().toString().padStart(2, '0')}.md`;
  
  const content = `# 🎯 DAILY NEEDLE MOVERS - ${data.date}

## Today's Focus: ${data.focusCategory}

${data.needleMovers.map((mover, index) => `
### ${index + 1}. **${mover.idea}**
**Impact**: ${mover.impact}  
**Effort**: ${mover.difficulty}  
**Category**: ${mover.category}  
**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete

---`).join('')}

## 📊 Daily Execution Checklist
- [ ] All 5 needle movers identified
- [ ] Priority order established  
- [ ] Time blocks scheduled
- [ ] Resources/materials ready
- [ ] Execution started

## 📈 Results Tracking
**Leads Generated**: ___  
**Immediate Revenue**: $___  
**Follow-up Actions**: ___  
**Lessons Learned**: ___

## 🔄 Tomorrow's Prep
**What worked best today**: ___  
**What to adjust tomorrow**: ___  
**Carry-over actions**: ___

---
*Generated automatically - never run out of ways to grow the business!*`;

  fs.writeFileSync(path.join(__dirname, fileName), content);
  console.log(`🎯 Generated: ${fileName}`);
  console.log('📈 5 fresh needle movers ready for execution!');
  
  return fileName;
}

// Auto-generate if run directly
if (require.main === module) {
  createDailyFile();
}

module.exports = { generateTodaysNeedleMovers, createDailyFile };