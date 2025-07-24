// ============================================
// NODE_OUT COMPLETE CODE & TECHNICAL IMPLEMENTATION
// ============================================

// ============================================
// SECTION 1: DISCOVERY ENGINE - n8n Workflow Configuration
// ============================================

const discoveryWorkflow = {
  name: "CLIENT_DISCOVERY_ENGINE",
  nodes: [
    {
      id: "webhook_trigger",
      type: "n8n-nodes-base.webhook",
      typeVersion: 1,
      position: [250, 300],
      parameters: {
        path: "/discovery/start",
        method: "POST",
        authentication: "apiKey",
        apiKeyAuth: {
          name: "X-API-Key",
          value: "={{$credentials.apiKey}}"
        }
      }
    },
    {
      id: "ai_conversation_starter",
      type: "n8n-nodes-base.openAi",
      typeVersion: 1,
      position: [450, 300],
      parameters: {
        operation: "chat",
        model: "gpt-4",
        messages: {
          messages: [
            {
              role: "system",
              content: `You are a Business Process Discovery Specialist using the Craft AI Method.
                Industry: {{$json.industry}}
                
                EMPATHY HOOKS based on industry:
                - Roofing: "Storm season must completely transform how you operate..."
                - Restaurant: "Staff scheduling must feel like solving a Rubik's cube..."
                - Healthcare: "Patient scheduling must be like air traffic control..."
                
                Generate a personalized opening that gets them talking about pain points.`
            }
          ]
        }
      }
    },
    {
      id: "conversation_manager",
      type: "n8n-nodes-base.code",
      typeVersion: 1,
      position: [650, 300],
      parameters: {
        language: "javascript",
        code: `
          const conversationState = {
            stage: items[0].json.stage || 'discovery',
            painPoints: items[0].json.painPoints || [],
            industry: items[0].json.industry,
            responses: items[0].json.responses || []
          };
          
          // Determine next conversation action
          if (conversationState.painPoints.length < 3) {
            conversationState.nextAction = 'momentum_builder';
          } else if (conversationState.stage === 'discovery') {
            conversationState.nextAction = 'strategic_redirect';
          } else {
            conversationState.nextAction = 'solution_bridge';
          }
          
          return conversationState;
        `
      }
    }
  ]
};

// ============================================
// SECTION 2: IMPLEMENTATION ENGINE - Industry Modules
// ============================================

// Roofing Industry Automation Module
class RoofingAutomationSuite {
  constructor(config) {
    this.config = config;
    this.workflows = {};
  }

  // Weather Intelligence System
  async deployWeatherIntelligence() {
    const workflow = {
      name: "Weather_Intelligence_System",
      trigger: {
        type: "cron",
        expression: "0 6 * * *" // 6 AM daily
      },
      nodes: [
        {
          name: "fetch_weather",
          type: "http",
          operation: "GET",
          url: "https://api.weather.com/v1/forecast",
          parameters: {
            location: "{{$node.config.serviceArea}}",
            days: 7,
            apiKey: "{{$credentials.weatherApi}}"
          }
        },
        {
          name: "analyze_schedule_impact",
          type: "code",
          code: `
            const forecast = $input.all()[0].json;
            const schedule = await this.getSchedule();
            const conflicts = [];
            
            forecast.days.forEach(day => {
              if (day.precipitation > 0.3 || day.windSpeed > 25) {
                const affected = schedule.filter(job => 
                  job.date === day.date && job.type === 'exterior'
                );
                conflicts.push({
                  date: day.date,
                  jobs: affected,
                  reason: day.precipitation > 0.3 ? 'rain' : 'high winds',
                  severity: day.precipitation > 0.5 ? 'high' : 'medium'
                });
              }
            });
            
            return { conflicts, recommendations: this.generateReschedules(conflicts) };
          `
        },
        {
          name: "ai_communication_generator",
          type: "openai",
          operation: "chat",
          parameters: {
            messages: [
              {
                role: "system",
                content: "Generate empathetic, professional messages for weather-related reschedules."
              },
              {
                role: "user",
                content: `Create SMS and email templates for:
                  Affected Jobs: {{$json.conflicts}}
                  Weather Reason: {{$json.weatherReason}}
                  New Times: {{$json.recommendations}}`
              }
            ]
          }
        },
        {
          name: "send_notifications",
          type: "multi_channel",
          channels: ["sms", "email", "push"],
          parameters: {
            sms: {
              provider: "twilio",
              template: "{{$node.ai_communication_generator.output}}"
            },
            email: {
              provider: "sendgrid",
              template: "weather_reschedule",
              data: "{{$json}}"
            }
          }
        }
      ]
    };
    
    this.workflows.weatherIntelligence = workflow;
    return workflow;
  }

  // Material Ordering AI
  async deployMaterialOrderingAI() {
    const workflow = {
      name: "Material_Ordering_AI",
      nodes: [
        {
          name: "analyze_pipeline",
          type: "code",
          code: `
            const MaterialPredictor = {
              async analyzePipeline(days = 14) {
                const upcoming = await db.getJobsPipeline(days);
                const inventory = await db.getCurrentInventory();
                const historical = await db.getUsagePatterns();
                
                const predictions = upcoming.map(job => ({
                  jobId: job.id,
                  materials: this.predictMaterials(job.type, job.size, historical),
                  confidence: this.calculateConfidence(job.details),
                  deliveryDate: this.optimalDeliveryDate(job.startDate)
                }));
                
                return this.aggregateMaterialNeeds(predictions, inventory);
              },
              
              predictMaterials(jobType, size, history) {
                const baseRequirements = {
                  'full_replacement': {
                    shingles: size * 3.2,
                    underlayment: size * 1.1,
                    nails: size * 0.4,
                    ridgeCap: size * 0.15
                  },
                  'repair': {
                    shingles: size * 0.5,
                    sealant: size * 0.2,
                    nails: size * 0.1
                  }
                };
                
                const requirements = baseRequirements[jobType] || {};
                
                // Apply historical variance
                Object.keys(requirements).forEach(material => {
                  const variance = history[material]?.variance || 0.1;
                  requirements[material] *= (1 + variance);
                });
                
                return requirements;
              }
            };
            
            return await MaterialPredictor.analyzePipeline();
          `
        },
        {
          name: "check_supplier_prices",
          type: "parallel",
          branches: [
            {
              name: "supplier_a",
              type: "http",
              url: "{{$env.SUPPLIER_A_API}}/quote",
              body: "{{$node.analyze_pipeline.output.materials}}"
            },
            {
              name: "supplier_b",
              type: "http",
              url: "{{$env.SUPPLIER_B_API}}/pricing",
              body: "{{$node.analyze_pipeline.output.materials}}"
            },
            {
              name: "supplier_c",
              type: "http",
              url: "{{$env.SUPPLIER_C_API}}/availability",
              body: "{{$node.analyze_pipeline.output.materials}}"
            }
          ]
        },
        {
          name: "optimize_orders",
          type: "openai",
          parameters: {
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: "You are a supply chain optimization expert."
              },
              {
                role: "user",
                content: `Optimize material ordering based on:
                  Needed Materials: {{$json.materials}}
                  Supplier Quotes: {{$json.supplierQuotes}}
                  Delivery Times: {{$json.deliverySchedules}}
                  Job Timeline: {{$json.jobSchedule}}
                  
                  Consider bulk discounts, delivery fees, quality ratings, and storage costs.
                  Return optimal ordering strategy with reasoning.`
              }
            ]
          }
        }
      ]
    };
    
    this.workflows.materialOrdering = workflow;
    return workflow;
  }

  // AI Voice Assistant Configuration
  async deployAIVoiceAssistant() {
    const voiceAssistant = {
      name: "Roofing_AI_Receptionist",
      provider: "elevenlabs",
      voice: {
        id: "professional_female_warm",
        settings: {
          stability: 0.8,
          clarity: 0.9,
          warmth: 0.7
        }
      },
      conversationFlows: {
        emergency_repair: {
          intent: "emergency",
          workflow: `
            const EmergencyHandler = {
              async handle(call) {
                const data = await this.gatherInfo(call, [
                  "What's your address?",
                  "Can you describe the damage?",
                  "Is anyone in immediate danger?",
                  "Is water actively coming in?"
                ]);
                
                const priority = this.assessPriority(data);
                
                if (priority === 'critical') {
                  await this.alertOnCallTeam(data);
                  return "I've alerted our emergency team. Someone will call you within 15 minutes.";
                }
                
                const nextSlot = await this.findEmergencySlot();
                await this.bookEmergency(nextSlot, data);
                
                return \`I've scheduled an emergency visit for \${nextSlot.time}. 
                        Our team will be there to help.\`;
              }
            };
          `
        },
        quote_request: {
          intent: "quote",
          workflow: `
            const QuoteHandler = {
              async handle(call) {
                const info = await this.gatherInfo(call, [
                  "What's the address of the property?",
                  "What type of roof do you have?",
                  "Can you describe what work you need done?",
                  "Have you had any recent storm damage?"
                ]);
                
                const estimator = await this.assignEstimator(info.address);
                const slots = await estimator.getAvailableSlots();
                
                const appointment = await this.offerAndBook(call, slots);
                await this.sendConfirmation(appointment, info);
                
                return \`Perfect! I've scheduled \${estimator.name} to visit on 
                        \${appointment.date} at \${appointment.time}. 
                        You'll receive a text confirmation shortly.\`;
              }
            };
          `
        }
      }
    };
    
    this.workflows.voiceAssistant = voiceAssistant;
    return voiceAssistant;
  }
}

// ============================================
// SECTION 3: AI OPTIMIZATION ENGINE
// ============================================

class AIOptimizationEngine {
  constructor(config) {
    this.config = config;
    this.models = {
      performance: 'gpt-4-performance-analyzer',
      cost: 'gpt-4-cost-optimizer',
      experience: 'gpt-4-ux-enhancer'
    };
    this.metrics = new MetricsCollector();
    this.learningDB = new LearningDatabase();
  }

  async runOptimizationCycle() {
    console.log('Starting AI Optimization Cycle...');
    
    const cycle = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      steps: []
    };
    
    try {
      // Step 1: Collect Performance Data
      const performanceData = await this.collectPerformanceMetrics();
      cycle.steps.push({ step: 'collect', status: 'complete', data: performanceData });
      
      // Step 2: Analyze Patterns
      const patterns = await this.analyzePatterns(performanceData);
      cycle.steps.push({ step: 'analyze', status: 'complete', patterns: patterns });
      
      // Step 3: Generate Improvements
      const improvements = await this.generateImprovements(patterns);
      cycle.steps.push({ step: 'generate', status: 'complete', improvements: improvements });
      
      // Step 4: Validate Improvements
      const validated = await this.validateImprovements(improvements);
      cycle.steps.push({ step: 'validate', status: 'complete', validated: validated });
      
      // Step 5: Deploy Changes
      const deployments = await this.deployOptimizations(validated);
      cycle.steps.push({ step: 'deploy', status: 'complete', deployments: deployments });
      
      // Step 6: Monitor Impact
      const monitoring = await this.monitorImpact(deployments);
      cycle.steps.push({ step: 'monitor', status: 'active', monitoring: monitoring });
      
      cycle.status = 'success';
      cycle.summary = this.generateCycleSummary(cycle);
      
    } catch (error) {
      cycle.status = 'error';
      cycle.error = error.message;
    }
    
    await this.learningDB.storeCycle(cycle);
    return cycle;
  }

  async collectPerformanceMetrics() {
    const metrics = {
      timestamp: new Date().toISOString(),
      period: 'last_7_days',
      workflows: {},
      business: {},
      system: {}
    };
    
    // Workflow Performance
    const workflowQuery = `
      SELECT 
        w.id,
        w.name,
        COUNT(e.id) as execution_count,
        AVG(e.execution_time_ms) as avg_execution_time,
        SUM(CASE WHEN e.status = 'error' THEN 1 ELSE 0 END) as error_count,
        SUM(CASE WHEN e.status = 'success' THEN 1 ELSE 0 END) as success_count,
        AVG(e.retry_count) as avg_retries,
        SUM(e.api_calls) as total_api_calls,
        SUM(e.cost_estimate) as total_cost
      FROM workflows w
      LEFT JOIN executions e ON w.id = e.workflow_id
      WHERE e.started_at > NOW() - INTERVAL '7 days'
      GROUP BY w.id, w.name
    `;
    
    metrics.workflows = await this.db.query(workflowQuery);
    
    // Business Impact Metrics
    metrics.business = {
      timeSaved: await this.calculateTimeSaved(),
      revenueImpact: await this.calculateRevenueImpact(),
      customerSatisfaction: await this.getCustomerSatisfaction(),
      costReduction: await this.calculateCostReduction()
    };
    
    // System Health
    metrics.system = {
      uptime: await this.getSystemUptime(),
      apiLatency: await this.getAPILatency(),
      errorRates: await this.getErrorRates(),
      resourceUsage: await this.getResourceUsage()
    };
    
    return metrics;
  }

  async analyzePatterns(data) {
    const analysisPrompt = `
      Analyze the following automation performance data and identify patterns:
      
      Workflow Metrics:
      ${JSON.stringify(data.workflows, null, 2)}
      
      Business Impact:
      ${JSON.stringify(data.business, null, 2)}
      
      System Health:
      ${JSON.stringify(data.system, null, 2)}
      
      Identify:
      1. Workflows that are underperforming (high error rate, slow execution)
      2. Common failure patterns and their root causes
      3. Opportunities for new automations based on usage patterns
      4. Cost optimization opportunities
      5. Customer experience improvement areas
      
      Return analysis as structured JSON with specific, actionable recommendations.
    `;
    
    const response = await this.callAI(this.models.performance, analysisPrompt);
    return JSON.parse(response);
  }

  async generateImprovements(patterns) {
    const improvements = [];
    
    // Generate workflow optimizations
    for (const workflow of patterns.underperformingWorkflows || []) {
      const improvement = await this.optimizeWorkflow(workflow);
      improvements.push(improvement);
    }
    
    // Generate new automation opportunities
    for (const opportunity of patterns.newOpportunities || []) {
      const automation = await this.designNewAutomation(opportunity);
      improvements.push(automation);
    }
    
    // Generate cost optimizations
    for (const costIssue of patterns.costOptimizations || []) {
      const optimization = await this.optimizeCosts(costIssue);
      improvements.push(optimization);
    }
    
    return improvements;
  }

  async optimizeWorkflow(workflow) {
    const currentConfig = await this.getWorkflowConfig(workflow.id);
    
    const optimizationPrompt = `
      Optimize this n8n workflow configuration:
      
      Current Configuration:
      ${JSON.stringify(currentConfig, null, 2)}
      
      Performance Issues:
      - Error Rate: ${workflow.errorRate}%
      - Avg Execution Time: ${workflow.avgExecutionTime}ms
      - Specific Issues: ${JSON.stringify(workflow.issues)}
      
      Generate an optimized configuration that:
      1. Reduces execution time by adding parallel processing where possible
      2. Improves error handling with try-catch blocks and fallbacks
      3. Adds intelligent retries with exponential backoff
      4. Optimizes API calls through batching or caching
      5. Enhances logging for better debugging
      
      Return complete n8n workflow JSON configuration.
    `;
    
    const optimizedConfig = await this.callAI(this.models.performance, optimizationPrompt);
    
    return {
      type: 'workflow_optimization',
      workflowId: workflow.id,
      workflowName: workflow.name,
      current: currentConfig,
      optimized: JSON.parse(optimizedConfig),
      expectedImprovement: {
        executionTime: '-30%',
        errorRate: '-50%',
        cost: '-20%'
      },
      testPlan: this.generateTestPlan(workflow)
    };
  }

  async validateImprovements(improvements) {
    const validated = [];
    
    for (const improvement of improvements) {
      const validation = {
        improvement: improvement,
        checks: {}
      };
      
      // Syntax Validation
      validation.checks.syntax = await this.validateSyntax(improvement);
      if (!validation.checks.syntax.passed) continue;
      
      // Security Audit
      validation.checks.security = await this.securityAudit(improvement);
      if (!validation.checks.security.passed) continue;
      
      // Cost Analysis
      validation.checks.cost = await this.analyzeCost(improvement);
      if (validation.checks.cost.increase > 0.2) continue; // Skip if >20% cost increase
      
      // Risk Assessment
      validation.checks.risk = await this.assessRisk(improvement);
      if (validation.checks.risk.level === 'high') continue;
      
      // Create A/B test plan
      improvement.testPlan = await this.createTestPlan(improvement);
      
      validated.push(improvement);
    }
    
    return validated;
  }

  async deployOptimizations(improvements) {
    const deployments = [];
    
    for (const improvement of improvements) {
      const deployment = {
        id: generateId(),
        improvement: improvement,
        startTime: new Date().toISOString(),
        status: 'pending'
      };
      
      try {
        switch (improvement.type) {
          case 'workflow_optimization':
            await this.deployWorkflowUpdate(improvement, deployment);
            break;
            
          case 'new_automation':
            await this.deployNewAutomation(improvement, deployment);
            break;
            
          case 'cost_optimization':
            await this.deployCostOptimization(improvement, deployment);
            break;
        }
        
        deployment.status = 'deployed';
        deployment.endTime = new Date().toISOString();
        
      } catch (error) {
        deployment.status = 'failed';
        deployment.error = error.message;
        console.error(`Deployment failed for ${improvement.type}:`, error);
      }
      
      deployments.push(deployment);
    }
    
    return deployments;
  }

  async deployWorkflowUpdate(improvement, deployment) {
    // Create canary deployment
    const canary = {
      workflowId: improvement.workflowId,
      config: improvement.optimized,
      trafficPercentage: 10, // Start with 10% of traffic
      testGroup: generateTestGroupId()
    };
    
    // Deploy to n8n
    const result = await this.n8nAPI.updateWorkflow({
      id: canary.workflowId,
      data: {
        nodes: canary.config.nodes,
        connections: canary.config.connections,
        settings: {
          ...canary.config.settings,
          executionOrder: 'v1_canary',
          canaryConfig: {
            enabled: true,
            percentage: canary.trafficPercentage,
            testGroup: canary.testGroup
          }
        }
      }
    });
    
    deployment.canaryConfig = canary;
    deployment.n8nResponse = result;
    
    // Set up monitoring
    await this.setupCanaryMonitoring(deployment);
  }

  async monitorImpact(deployments) {
    const monitoring = {
      id: generateId(),
      deployments: deployments,
      startTime: new Date().toISOString(),
      metrics: {},
      alerts: []
    };
    
    for (const deployment of deployments) {
      if (deployment.status !== 'deployed') continue;
      
      const monitor = {
        deployment: deployment,
        metrics: [
          'execution_time',
          'error_rate',
          'success_rate',
          'api_calls',
          'cost_per_execution',
          'user_satisfaction'
        ],
        thresholds: {
          error_rate_increase: 0.05,
          execution_time_increase: 0.2,
          cost_increase: 0.1,
          satisfaction_decrease: 0.1
        },
        checkInterval: 300000, // 5 minutes
        escalation: {
          channels: ['slack', 'email', 'sms'],
          recipients: this.config.alertRecipients
        }
      };
      
      // Start real-time monitoring
      const monitoringJob = await this.startMonitoringJob(monitor);
      monitoring.metrics[deployment.id] = monitoringJob;
    }
    
    // Schedule progressive rollout
    await this.scheduleProgressiveRollout(deployments);
    
    return monitoring;
  }

  // Helper method for AI calls
  async callAI(model, prompt, options = {}) {
    const defaultOptions = {
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    };
    
    const response = await this.openai.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: "You are an expert in workflow optimization and automation." },
        { role: "user", content: prompt }
      ],
      ...defaultOptions,
      ...options
    });
    
    return response.choices[0].message.content;
  }
}

// ============================================
// SECTION 4: CLIENT DASHBOARD BACKEND
// ============================================

class ClientDashboardAPI {
  constructor(config) {
    this.config = config;
    this.cache = new RedisCache();
  }

  async getClientMetrics(clientId, timeRange = '7d') {
    const cacheKey = `metrics:${clientId}:${timeRange}`;
    const cached = await this.cache.get(cacheKey);
    
    if (cached) return cached;
    
    const metrics = {
      overview: await this.getOverviewMetrics(clientId, timeRange),
      automations: await this.getAutomationMetrics(clientId, timeRange),
      roi: await this.getROIMetrics(clientId, timeRange),
      activity: await this.getRecentActivity(clientId),
      insights: await this.getAIInsights(clientId)
    };
    
    await this.cache.set(cacheKey, metrics, 300); // Cache for 5 minutes
    return metrics;
  }

  async getOverviewMetrics(clientId, timeRange) {
    const query = `
      SELECT 
        COUNT(DISTINCT workflow_id) as active_automations,
        SUM(time_saved_minutes) / 60 as hours_saved,
        AVG(customer_satisfaction) as satisfaction_score,
        SUM(revenue_impact) as revenue_impact,
        COUNT(CASE WHEN status = 'error' THEN 1 END) as active_issues
      FROM automation_metrics
      WHERE client_id = $1 
        AND timestamp >= NOW() - INTERVAL $2
    `;
    
    const result = await this.db.query(query, [clientId, timeRange]);
    return result.rows[0];
  }

  async getAutomationMetrics(clientId, timeRange) {
    const query = `
      SELECT 
        DATE_TRUNC('day', timestamp) as date,
        workflow_category,
        COUNT(*) as executions,
        SUM(time_saved_minutes) / 60 as hours_saved,
        AVG(success_rate) as success_rate
      FROM automation_executions
      WHERE client_id = $1 
        AND timestamp >= NOW() - INTERVAL $2
      GROUP BY date, workflow_category
      ORDER BY date ASC
    `;
    
    const results = await this.db.query(query, [clientId, timeRange]);
    
    // Transform for chart display
    const chartData = {};
    results.rows.forEach(row => {
      const date = row.date.toISOString().split('T')[0];
      if (!chartData[date]) {
        chartData[date] = {
          date: date,
          total_executions: 0,
          total_hours_saved: 0,
          categories: {}
        };
      }
      
      chartData[date].total_executions += row.executions;
      chartData[date].total_hours_saved += row.hours_saved;
      chartData[date].categories[row.workflow_category] = {
        executions: row.executions,
        hours_saved: row.hours_saved,
        success_rate: row.success_rate
      };
    });
    
    return Object.values(chartData);
  }

  async getROIMetrics(clientId, timeRange) {
    const laborRate = 40; // $ per hour
    
    const query = `
      SELECT 
        SUM(time_saved_minutes) / 60 as total_hours_saved,
        SUM(revenue_impact) as revenue_increase,
        SUM(cost_reduction) as cost_reduction,
        AVG(efficiency_gain) as efficiency_gain,
        COUNT(DISTINCT DATE_TRUNC('week', timestamp)) as weeks_active
      FROM automation_metrics
      WHERE client_id = $1 
        AND timestamp >= NOW() - INTERVAL $2
    `;
    
    const result = await this.db.query(query, [clientId, timeRange]);
    const data = result.rows[0];
    
    const laborCostSaved = data.total_hours_saved * laborRate;
    const totalBenefit = laborCostSaved + data.revenue_increase + data.cost_reduction;
    const monthlyFee = this.getClientMonthlyFee(clientId);
    const roi = ((totalBenefit - monthlyFee) / monthlyFee) * 100;
    
    return {
      hoursSaved: data.total_hours_saved,
      laborCostSaved: laborCostSaved,
      revenueIncrease: data.revenue_increase,
      costReduction: data.cost_reduction,
      totalBenefit: totalBenefit,
      roi: roi,
      paybackPeriod: monthlyFee / (totalBenefit / data.weeks_active * 4)
    };
  }

  async getAIInsights(clientId) {
    const recentData = await this.getClientMetrics(clientId, '30d');
    
    const insightPrompt = `
      Based on this client's automation data, generate 2-3 actionable insights:
      
      Client Industry: ${this.getClientIndustry(clientId)}
      Recent Performance: ${JSON.stringify(recentData, null, 2)}
      
      Generate insights that:
      1. Identify optimization opportunities
      2. Predict upcoming needs or challenges
      3. Suggest new automation opportunities
      
      Format as JSON array with title, description, and actionType for each insight.
    `;
    
    const insights = await this.aiEngine.generateInsights(insightPrompt);
    return JSON.parse(insights);
  }
}

// ============================================
// SECTION 5: UTILITY FUNCTIONS AND HELPERS
// ============================================

// ID Generation
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function generateTestGroupId() {
  return 'tg_' + generateId();
}

// Database Connection
class DatabaseConnection {
  constructor(config) {
    this.pool = new Pool({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  async query(text, params) {
    const start = Date.now();
    const res = await this.pool.query(text, params);
    const duration = Date.now() - start;
    
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  }
}

// Redis Cache
class RedisCache {
  constructor() {
    this.client = redis.createClient({
      url: process.env.REDIS_URL
    });
    this.client.connect();
  }

  async get(key) {
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key, value, ttl = 3600) {
    await this.client.setex(key, ttl, JSON.stringify(value));
  }
}

// n8n API Wrapper
class N8NAPI {
  constructor(config) {
    this.baseURL = config.baseURL;
    this.apiKey = config.apiKey;
  }

  async updateWorkflow(params) {
    const response = await fetch(`${this.baseURL}/workflows/${params.id}`, {
      method: 'PATCH',
      headers: {
        'X-N8N-API-KEY': this.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params.data)
    });
    
    if (!response.ok) {
      throw new Error(`n8n API error: ${response.statusText}`);
    }
    
    return response.json();
  }

  async executeWorkflow(workflowId, data) {
    const response = await fetch(`${this.baseURL}/workflows/${workflowId}/execute`, {
      method: 'POST',
      headers: {
        'X-N8N-API-KEY': this.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data })
    });
    
    return response.json();
  }
}

// Export main classes
module.exports = {
  RoofingAutomationSuite,
  AIOptimizationEngine,
  ClientDashboardAPI,
  DatabaseConnection,
  RedisCache,
  N8NAPI,
  discoveryWorkflow
};