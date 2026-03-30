const API_KEY = import.meta.env.VITE_AI_API_KEY;
const API_URL = "https://api.openai.com/v1/chat/completions";

export const AIService = {
  async analyzeStarbooksData(starbooksUnits, query) {
    const dataContext = this.buildStarbooksContext(starbooksUnits);
    
    const prompt = `You are a STARBOOKS (Science and Technology Academic and Research-Based Openly Operated KioskS) analyst for the Philippines' digital library network.

STARBOOKS DATA CONTEXT:
${dataContext}

USER QUERY: ${query}

Provide analysis focusing on:
1. Direct answer to the query
2. Key insights about STARBOOKS distribution and utilization
3. Recommendations for optimization or expansion

Keep response under 200 words. Use STARBOOKS-specific terminology.`;

    return await this.callAI(prompt, 0.7);
  },

  async validateStarbooksUnit(unitData, existingUnits) {
    const validation = {
      isValid: true,
      warnings: [],
      suggestions: [],
      predictions: {}
    };

    // Check for duplicate unit IDs
    const duplicateId = existingUnits.find(u => u.id === unitData.id);
    if (duplicateId) {
      validation.isValid = false;
      validation.warnings.push(`Unit ID ${unitData.id} already exists in ${duplicateId.location}`);
    }

    // Check location density
    const sameLocation = existingUnits.filter(u => 
      u.municipality?.toLowerCase() === unitData.municipality?.toLowerCase()
    );
    
    if (sameLocation.length > 10) {
      validation.warnings.push(`High STARBOOKS density in ${unitData.municipality} (${sameLocation.length} existing units)`);
    } else if (sameLocation.length === 0) {
      validation.suggestions.push(`First STARBOOKS unit in ${unitData.municipality} - great expansion opportunity!`);
    }

    // Predict maintenance schedule
    validation.predictions.nextMaintenance = this.predictMaintenanceDate(unitData.installationDate);
    validation.predictions.expectedLifespan = '5-7 years';

    return validation;
  },

  async generateStarbooksInsights(starbooksUnits) {
    const insights = [];

    // Maintenance due analysis
    const maintenanceDue = starbooksUnits.filter(unit => {
      const installDate = new Date(unit.installationDate);
      const monthsSinceInstall = (Date.now() - installDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
      return monthsSinceInstall > 12; // Due for annual maintenance
    });

    if (maintenanceDue.length > 0) {
      insights.push({
        type: 'warning',
        priority: 'high',
        title: 'STARBOOKS Units Due for Maintenance',
        message: `${maintenanceDue.length} units require scheduled maintenance`,
        action: 'Schedule Maintenance',
        data: maintenanceDue
      });
    }

    // Regional distribution analysis
    const regionStats = this.analyzeRegionalDistribution(starbooksUnits);
    if (regionStats.imbalanced) {
      insights.push({
        type: 'suggestion',
        priority: 'medium',
        title: 'Regional Distribution Imbalance',
        message: `${regionStats.underserved.join(', ')} regions need more STARBOOKS units`,
        action: 'Plan Expansion',
        data: regionStats
      });
    }

    // Usage pattern analysis
    const lowUsage = starbooksUnits.filter(unit => 
      unit.usageStats && unit.usageStats.monthlyUsers < 50
    );
    
    if (lowUsage.length > 0) {
      insights.push({
        type: 'info',
        priority: 'medium',
        title: 'Low Usage Units Identified',
        message: `${lowUsage.length} units have low monthly usage (<50 users)`,
        action: 'Improve Outreach',
        data: lowUsage
      });
    }

    // Hardware upgrade recommendations
    const oldUnits = starbooksUnits.filter(unit => {
      const installDate = new Date(unit.installationDate);
      const yearsSinceInstall = (Date.now() - installDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
      return yearsSinceInstall > 4;
    });

    if (oldUnits.length > 0) {
      insights.push({
        type: 'suggestion',
        priority: 'low',
        title: 'Hardware Upgrade Candidates',
        message: `${oldUnits.length} units are over 4 years old and may benefit from upgrades`,
        action: 'Plan Upgrades',
        data: oldUnits
      });
    }

    return insights;
  },

  buildStarbooksContext(starbooksUnits) {
    const stats = {
      totalUnits: starbooksUnits.length,
      regions: this.getRegionalBreakdown(starbooksUnits),
      beneficiaryTypes: this.getBeneficiaryBreakdown(starbooksUnits),
      averageAge: this.calculateAverageAge(starbooksUnits),
      maintenanceStatus: this.getMaintenanceStatus(starbooksUnits)
    };

    return `
Total STARBOOKS Units: ${stats.totalUnits}
Regional Distribution: Luzon ${stats.regions.luzon}%, Visayas ${stats.regions.visayas}%, Mindanao ${stats.regions.mindanao}%
Beneficiary Types: Academic ${stats.beneficiaryTypes.academic}%, LGU ${stats.beneficiaryTypes.lgu}%, NGA ${stats.beneficiaryTypes.nga}%, NGO ${stats.beneficiaryTypes.ngo}%
Average Unit Age: ${stats.averageAge} years
Maintenance Status: ${stats.maintenanceStatus.upToDate} up-to-date, ${stats.maintenanceStatus.due} due for maintenance
`;
  },

  getRegionalBreakdown(units) {
    // Simplified regional breakdown based on known distribution
    return {
      luzon: 53,
      visayas: 17,
      mindanao: 30
    };
  },

  getBeneficiaryBreakdown(units) {
    // Based on known STARBOOKS distribution
    return {
      academic: 90,
      lgu: 6,
      nga: 3,
      ngo: 1
    };
  },

  calculateAverageAge(units) {
    if (units.length === 0) return 0;
    
    const ages = units.map(unit => {
      const installDate = new Date(unit.installationDate || '2020-01-01');
      return (Date.now() - installDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    });
    
    return Math.round(ages.reduce((a, b) => a + b, 0) / ages.length * 10) / 10;
  },

  getMaintenanceStatus(units) {
    const upToDate = units.filter(unit => {
      const installDate = new Date(unit.installationDate || '2020-01-01');
      const monthsSinceInstall = (Date.now() - installDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
      return monthsSinceInstall <= 12;
    }).length;

    return {
      upToDate,
      due: units.length - upToDate
    };
  },

  analyzeRegionalDistribution(units) {
    // This would analyze actual regional distribution
    // For now, return based on known targets
    return {
      imbalanced: false,
      underserved: [],
      distribution: {
        luzon: 53,
        visayas: 17,
        mindanao: 30
      }
    };
  },

  predictMaintenanceDate(installationDate) {
    const install = new Date(installationDate || Date.now());
    const nextMaintenance = new Date(install);
    nextMaintenance.setFullYear(nextMaintenance.getFullYear() + 1);
    return nextMaintenance.toISOString().split('T')[0];
  },

  async analyzeProjectData(projects, equipment, query) {
    const dataContext = this.buildDataContext(projects, equipment);
    
    const prompt = `You are a data analyst for CEST 2.0 (Community Empowerment through Science & Technology) in Region II, Philippines.

DATA CONTEXT:
${dataContext}

USER QUERY: ${query}

Provide a clear, concise analysis with:
1. Direct answer to the query
2. Key insights (2-3 bullet points)
3. Actionable recommendations if applicable

Keep response under 200 words. Use data to support your points.`;

    return await this.callAI(prompt, 0.7);
  },

  async validateProjectData(projectData, existingProjects) {
    const similarProjects = this.findSimilarProjects(projectData, existingProjects);
    
    const validation = {
      isValid: true,
      warnings: [],
      suggestions: [],
      predictions: {}
    };

    if (projectData.amountFunded) {
      const amount = parseFloat(projectData.amountFunded);
      const avgBudget = this.calculateAverageBudget(existingProjects, projectData.components);
      
      if (amount > avgBudget * 3) {
        validation.warnings.push(`Budget (₱${amount.toLocaleString()}) is 3x higher than average for similar projects (₱${avgBudget.toLocaleString()})`);
      } else if (amount < avgBudget * 0.3) {
        validation.warnings.push(`Budget seems low. Similar projects average ₱${avgBudget.toLocaleString()}`);
      }
    }

    if (similarProjects.length > 0) {
      validation.suggestions.push(`Found ${similarProjects.length} similar project(s) in ${similarProjects[0].municipality}`);
      validation.predictions.estimatedDuration = this.predictDuration(similarProjects);
      validation.predictions.successRate = this.calculateSuccessRate(similarProjects);
    }

    const duplicates = this.checkDuplicates(projectData, existingProjects);
    if (duplicates.length > 0) {
      validation.warnings.push(`Possible duplicate: Similar project exists in ${duplicates[0].municipality} (${duplicates[0].year})`);
    }

    return validation;
  },

  async generateInsights(projects, equipment) {
    const insights = [];

    const nearDeadline = projects.filter(p => 
      p.status === 'Ongoing' && p.year && (new Date().getFullYear() - p.year) >= 2
    );
    if (nearDeadline.length > 0) {
      insights.push({
        type: 'warning',
        priority: 'high',
        title: 'Projects Nearing Completion Deadline',
        message: `${nearDeadline.length} ongoing projects from ${nearDeadline[0].year} may need attention`,
        action: 'View Projects',
        data: nearDeadline
      });
    }

    const municipalityStats = this.analyzeMunicipalityTrends(projects);
    const declining = municipalityStats.filter(m => m.trend === 'declining');
    if (declining.length > 0) {
      insights.push({
        type: 'info',
        priority: 'medium',
        title: 'Declining Project Activity',
        message: `${declining.length} municipalities show reduced project activity this year`,
        action: 'View Details',
        data: declining
      });
    }

    const componentAnalysis = this.analyzeComponentBalance(projects);
    if (componentAnalysis.imbalanced) {
      insights.push({
        type: 'suggestion',
        priority: 'medium',
        title: 'Component Distribution Imbalance',
        message: `${componentAnalysis.dominant} component dominates (${componentAnalysis.percentage}%). Consider diversifying.`,
        action: 'View Analytics',
        data: componentAnalysis
      });
    }

    const budgetAnomalies = this.detectBudgetAnomalies(projects);
    if (budgetAnomalies.length > 0) {
      insights.push({
        type: 'alert',
        priority: 'high',
        title: 'Budget Anomalies Detected',
        message: `${budgetAnomalies.length} projects have unusual budget patterns`,
        action: 'Review Projects',
        data: budgetAnomalies
      });
    }

    const equipmentUtilization = this.analyzeEquipmentUtilization(equipment, projects);
    if (equipmentUtilization.underutilized.length > 0) {
      insights.push({
        type: 'suggestion',
        priority: 'low',
        title: 'Equipment Underutilization',
        message: `${equipmentUtilization.underutilized.length} municipalities have low equipment-to-project ratios`,
        action: 'Optimize Distribution',
        data: equipmentUtilization
      });
    }

    return insights;
  },

  async predictBudget(projectData, historicalProjects) {
    const similar = this.findSimilarProjects(projectData, historicalProjects);
    
    if (similar.length === 0) {
      return {
        estimated: 500000,
        confidence: 'low',
        range: { min: 300000, max: 1000000 }
      };
    }

    const budgets = similar.map(p => parseFloat(p.amountFunded)).filter(b => b > 0);
    const avg = budgets.reduce((a, b) => a + b, 0) / budgets.length;
    const stdDev = Math.sqrt(budgets.reduce((sq, n) => sq + Math.pow(n - avg, 2), 0) / budgets.length);

    return {
      estimated: Math.round(avg),
      confidence: similar.length > 5 ? 'high' : similar.length > 2 ? 'medium' : 'low',
      range: {
        min: Math.round(avg - stdDev),
        max: Math.round(avg + stdDev)
      },
      basedOn: similar.length
    };
  },

  async suggestComponents(projectDescription, municipality, historicalProjects) {
    const keywords = {
      sel: ['livelihood', 'enterprise', 'business', 'income', 'economic', 'market', 'trade'],
      hn: ['health', 'nutrition', 'medical', 'wellness', 'food', 'sanitation'],
      hrd: ['training', 'education', 'skills', 'capacity', 'learning', 'workshop'],
      drrm: ['disaster', 'risk', 'emergency', 'resilience', 'climate', 'preparedness'],
      bgcet: ['environment', 'green', 'sustainable', 'bio', 'circular', 'eco'],
      dg: ['digital', 'technology', 'online', 'internet', 'system', 'automation']
    };

    const suggestions = [];
    const desc = projectDescription.toLowerCase();

    Object.entries(keywords).forEach(([component, words]) => {
      const matches = words.filter(word => desc.includes(word)).length;
      if (matches > 0) {
        suggestions.push({
          component,
          confidence: matches / words.length,
          matches
        });
      }
    });

    const municipalityProjects = historicalProjects.filter(p => 
      p.municipality?.toLowerCase() === municipality?.toLowerCase()
    );
    
    if (municipalityProjects.length > 0) {
      const commonComponents = this.getMostCommonComponents(municipalityProjects);
      commonComponents.forEach(comp => {
        const existing = suggestions.find(s => s.component === comp.component);
        if (existing) {
          existing.confidence += 0.2;
        } else {
          suggestions.push({
            component: comp.component,
            confidence: 0.3,
            reason: 'Common in this municipality'
          });
        }
      });
    }

    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3);
  },

  async naturalLanguageQuery(query, projects, equipment) {
    const lowerQuery = query.toLowerCase();
    
    const filters = {
      status: null,
      municipality: null,
      component: null,
      year: null,
      budgetMin: null,
      budgetMax: null
    };

    if (lowerQuery.includes('ongoing')) filters.status = 'Ongoing';
    if (lowerQuery.includes('finished') || lowerQuery.includes('completed')) filters.status = 'Finished';
    if (lowerQuery.includes('liquidated')) filters.status = 'Liquidated';

    const municipalities = ['cagayan', 'isabela', 'nueva vizcaya', 'quirino', 'batanes'];
    municipalities.forEach(muni => {
      if (lowerQuery.includes(muni)) {
        filters.municipality = muni.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
    });

    const components = ['sel', 'hn', 'hrd', 'drrm', 'bgcet', 'dg'];
    components.forEach(comp => {
      if (lowerQuery.includes(comp)) filters.component = comp;
    });

    const yearMatch = lowerQuery.match(/\b(20\d{2})\b/);
    if (yearMatch) filters.year = parseInt(yearMatch[1]);

    const budgetMatch = lowerQuery.match(/(\d+(?:,\d{3})*(?:\.\d+)?)\s*(?:million|m|k|thousand)/i);
    if (budgetMatch) {
      let amount = parseFloat(budgetMatch[1].replace(/,/g, ''));
      if (lowerQuery.includes('million') || lowerQuery.includes('m')) amount *= 1000000;
      if (lowerQuery.includes('thousand') || lowerQuery.includes('k')) amount *= 1000;
      
      if (lowerQuery.includes('over') || lowerQuery.includes('above') || lowerQuery.includes('more than')) {
        filters.budgetMin = amount;
      } else if (lowerQuery.includes('under') || lowerQuery.includes('below') || lowerQuery.includes('less than')) {
        filters.budgetMax = amount;
      }
    }

    let results = projects.filter(p => {
      if (filters.status && p.status !== filters.status) return false;
      if (filters.municipality && !p.municipality?.toLowerCase().includes(filters.municipality.toLowerCase())) return false;
      if (filters.component && !p.components?.includes(filters.component)) return false;
      if (filters.year && p.year !== filters.year) return false;
      if (filters.budgetMin && parseFloat(p.amountFunded) < filters.budgetMin) return false;
      if (filters.budgetMax && parseFloat(p.amountFunded) > filters.budgetMax) return false;
      return true;
    });

    if (lowerQuery.includes('most') || lowerQuery.includes('highest') || lowerQuery.includes('top')) {
      results = results.sort((a, b) => parseFloat(b.amountFunded) - parseFloat(a.amountFunded)).slice(0, 10);
    }

    if (lowerQuery.includes('least') || lowerQuery.includes('lowest')) {
      results = results.sort((a, b) => parseFloat(a.amountFunded) - parseFloat(b.amountFunded)).slice(0, 10);
    }

    return {
      results,
      filters,
      summary: this.generateQuerySummary(query, results, filters)
    };
  },

  generateQuerySummary(query, results, filters) {
    let summary = `Found ${results.length} project(s)`;
    
    const conditions = [];
    if (filters.status) conditions.push(`status: ${filters.status}`);
    if (filters.municipality) conditions.push(`in ${filters.municipality}`);
    if (filters.component) conditions.push(`with ${filters.component.toUpperCase()} component`);
    if (filters.year) conditions.push(`from ${filters.year}`);
    if (filters.budgetMin) conditions.push(`budget over ₱${(filters.budgetMin / 1000000).toFixed(1)}M`);
    if (filters.budgetMax) conditions.push(`budget under ₱${(filters.budgetMax / 1000000).toFixed(1)}M`);
    
    if (conditions.length > 0) {
      summary += ` matching: ${conditions.join(', ')}`;
    }

    if (results.length > 0) {
      const totalBudget = results.reduce((sum, p) => sum + parseFloat(p.amountFunded || 0), 0);
      summary += `. Total budget: ₱${(totalBudget / 1000000).toFixed(2)}M`;
    }

    return summary;
  },

  buildDataContext(projects, equipment) {
    const stats = {
      totalProjects: projects.length,
      totalBudget: projects.reduce((s, p) => s + parseFloat(p.amountFunded || 0), 0),
      totalEquipment: equipment.length,
      municipalities: new Set(projects.map(p => p.municipality)).size,
      statusBreakdown: {
        ongoing: projects.filter(p => p.status === 'Ongoing').length,
        finished: projects.filter(p => p.status === 'Finished').length,
        liquidated: projects.filter(p => p.status === 'Liquidated').length
      }
    };

    return `
Total Projects: ${stats.totalProjects}
Total Budget: ₱${(stats.totalBudget / 1000000).toFixed(2)}M
Total Equipment: ${stats.totalEquipment}
Municipalities: ${stats.municipalities}
Status: ${stats.statusBreakdown.ongoing} ongoing, ${stats.statusBreakdown.finished} finished, ${stats.statusBreakdown.liquidated} liquidated
`;
  },

  findSimilarProjects(projectData, projects) {
    return projects.filter(p => {
      const sameComponents = projectData.components?.some(c => p.components?.includes(c));
      const sameMunicipality = p.municipality?.toLowerCase() === projectData.municipality?.toLowerCase();
      const similarBudget = projectData.amountFunded && 
        Math.abs(parseFloat(p.amountFunded) - parseFloat(projectData.amountFunded)) < parseFloat(projectData.amountFunded) * 0.5;
      
      return sameComponents || sameMunicipality || similarBudget;
    }).slice(0, 5);
  },

  calculateAverageBudget(projects, components) {
    const relevant = projects.filter(p => 
      components?.some(c => p.components?.includes(c)) && p.amountFunded
    );
    
    if (relevant.length === 0) {
      return projects.reduce((sum, p) => sum + parseFloat(p.amountFunded || 0), 0) / projects.length || 500000;
    }
    
    return relevant.reduce((sum, p) => sum + parseFloat(p.amountFunded), 0) / relevant.length;
  },

  checkDuplicates(projectData, projects) {
    return projects.filter(p => {
      const similarName = p.project?.toLowerCase().includes(projectData.project?.toLowerCase().substring(0, 20)) ||
                         projectData.project?.toLowerCase().includes(p.project?.toLowerCase().substring(0, 20));
      const sameMunicipality = p.municipality?.toLowerCase() === projectData.municipality?.toLowerCase();
      const sameYear = p.year === projectData.year;
      
      return similarName && sameMunicipality && sameYear;
    });
  },

  predictDuration(similarProjects) {
    const completed = similarProjects.filter(p => p.status === 'Finished');
    if (completed.length === 0) return '12-24 months';
    
    return '18-24 months';
  },

  calculateSuccessRate(similarProjects) {
    const finished = similarProjects.filter(p => p.status === 'Finished').length;
    return Math.round((finished / similarProjects.length) * 100);
  },

  analyzeMunicipalityTrends(projects) {
    const currentYear = new Date().getFullYear();
    const municipalities = {};
    
    projects.forEach(p => {
      if (!municipalities[p.municipality]) {
        municipalities[p.municipality] = { current: 0, previous: 0 };
      }
      if (p.year === currentYear) municipalities[p.municipality].current++;
      if (p.year === currentYear - 1) municipalities[p.municipality].previous++;
    });

    return Object.entries(municipalities).map(([name, data]) => ({
      name,
      current: data.current,
      previous: data.previous,
      trend: data.current < data.previous ? 'declining' : data.current > data.previous ? 'growing' : 'stable'
    }));
  },

  analyzeComponentBalance(projects) {
    const componentCounts = {};
    projects.forEach(p => {
      p.components?.forEach(c => {
        componentCounts[c] = (componentCounts[c] || 0) + 1;
      });
    });

    const total = Object.values(componentCounts).reduce((a, b) => a + b, 0);
    const sorted = Object.entries(componentCounts).sort((a, b) => b[1] - a[1]);
    
    if (sorted.length > 0) {
      const topPercentage = Math.round((sorted[0][1] / total) * 100);
      return {
        imbalanced: topPercentage > 40,
        dominant: sorted[0][0].toUpperCase(),
        percentage: topPercentage,
        distribution: componentCounts
      };
    }

    return { imbalanced: false };
  },

  detectBudgetAnomalies(projects) {
    const budgets = projects.map(p => parseFloat(p.amountFunded)).filter(b => b > 0);
    const avg = budgets.reduce((a, b) => a + b, 0) / budgets.length;
    const stdDev = Math.sqrt(budgets.reduce((sq, n) => sq + Math.pow(n - avg, 2), 0) / budgets.length);
    
    return projects.filter(p => {
      const budget = parseFloat(p.amountFunded);
      return budget > avg + (2 * stdDev) || budget < avg - (2 * stdDev);
    });
  },

  analyzeEquipmentUtilization(equipment, projects) {
    const municipalityData = {};
    
    projects.forEach(p => {
      if (!municipalityData[p.municipality]) {
        municipalityData[p.municipality] = { projects: 0, equipment: 0 };
      }
      municipalityData[p.municipality].projects++;
    });

    equipment.forEach(e => {
      if (!municipalityData[e.municipality]) {
        municipalityData[e.municipality] = { projects: 0, equipment: 0 };
      }
      municipalityData[e.municipality].equipment += parseInt(e.units) || 1;
    });

    const underutilized = Object.entries(municipalityData)
      .filter(([_, data]) => data.projects > 0 && (data.equipment / data.projects) < 0.5)
      .map(([name, data]) => ({ name, ...data }));

    return { underutilized, data: municipalityData };
  },

  getMostCommonComponents(projects) {
    const counts = {};
    projects.forEach(p => {
      p.components?.forEach(c => {
        counts[c] = (counts[c] || 0) + 1;
      });
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([component, count]) => ({ component, count }));
  },

  async callAI(prompt, temperature = 0.7) {
    if (!API_KEY) {
      return "AI service unavailable. Please configure API key.";
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature,
          max_tokens: 300
        })
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("AI Service Error:", error);
      return "Unable to process request at this time.";
    }
  }
};
