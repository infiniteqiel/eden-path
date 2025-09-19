/**
 * Immediate KB Ingestion
 * Process B Corp documents into knowledge base right now
 */

import { processBCorpStandards } from './knowledge-base-processor';

// Parsed document contents from the uploaded PDFs
const documents = [
  {
    filename: 'all-2.pdf',
    content: `B Lab Standards V2.1 - Official 2026 Standards (Master Document)

## Introduction

As the climate crisis intensifies and societal inequality grows, the need to bring about systemic change is clear. That's why B Lab has strengthened its standards for business impact, equipping companies to drive meaningful, sustainable change.

B Lab has continuously evolved its certification standards to raise the bar for responsible business. The latest updates provide greater clarity and consistency, ensuring companies focus on the most impactful business actions. These standards establish a stronger, more transparent foundation for all businesses committed to building an inclusive, equitable, and regenerative global economy.

## Overview of the B Lab Standards

Under the B Lab Standards, your company needs to meet:
• Foundation Requirements which make sure your company is eligible to pursue certification and includes a risk assessment.
• Impact Topic Requirements which cover social, environmental, and governance impact in seven areas. They're tailored to your company's size, sector, industry.

### Foundation Requirements
In a company's certification journey, its first step is meeting the Foundation Requirements. This sequencing ensures companies are meeting fundamental eligibility requirements and engage in a risk assessment before they progress to the Impact Topic requirements.

The Foundation Requirements require a company to:
• Eligibility Requirements: be legally incorporated, comply with local and national laws, and not be materially involved in industries that undermine B Lab's Theory of Change.
• Stakeholder Governance: adopt the B Corp Legal Requirement, which ensures accountability to all stakeholders, and sign the B Corp Declaration of Interdependence.
• Risk Assessment: create a risk profile using B Lab's risk profile tool (for company sizes small and above). This process determines the number of potential additional due-diligence sub-requirements that the company must meet for B Corp certification.

### Impact Topic Requirements
Next, the company is required to meet and continuously improve upon performance requirements that focus on its operations, value chain, and stakeholders across seven environmental, social, and governance impact areas.

The Impact Requirements require a company to:
• Purpose and Stakeholder Governance (PSG): act in accordance with a defined purpose and embed stakeholder governance in decision making.
• Fair Work (FW): provide good quality jobs and have positive workplace cultures.
• Justice, Equity, Diversity, & Inclusion (JEDI): have inclusive and diverse workplaces and contribute to just and equitable communities.
• Human Rights (HR): treat people with dignity and respect their human rights.
• Climate Action (CA): take action to combat the climate crisis and its impacts.
• Environmental Stewardship and Circularity (ESC): demonstrate environmental stewardship and contribute to the circular economy in their operations and value chain.
• Government Affairs & Collective Action (GACA): engage in collective action and government affairs to drive positive systemic change.`
  },
  {
    filename: 'UK_B_Corp_Legal_Requirement_2024-2.pdf',
    content: `UK B Corp Legal Requirement Guide 2024

## Introduction

The language of the Legal Requirement for B Corps in the UK (the "UK Legal Requirement") and the accompanying guidance in this document were originally developed by B Lab UK in July 2015, in collaboration with senior lawyers and other experts in purpose-driven business and investment.

The UK Legal Requirement is a fundamental part of becoming a B Corp. All prospective B Corps must amend their constitutional documents to include a commitment to a 'triple bottom line' approach to business, in the agreed form.

## The UK Legal Requirement Language

This is the standard wording that all companies limited by shares must adopt into their constitutions (the articles of association) as part of meeting the requirements for B Corp certification.

The purposes of the Company are:
(1) to conduct business in a responsible and sustainable manner, and to promote one or more public benefit purposes, being the creation of material positive impact on society and the environment as measured against third-party standards; and
(2) to promote the success of the Company for the benefit of its members.

Directors must consider:
- the impact of the Company's operations on its stakeholders, including employees, customers, suppliers, the community and the environment
- the Company's purpose and benefit goals
- the long-term interests of the Company and its stakeholders

## Process for Adopting the UK Legal Requirement

Companies must pass a special resolution (75% majority) to amend their Articles of Association. For private companies this can be done by written resolution; public companies may need to convene a general meeting.

Once passed, companies must file:
- Updated Articles of Association
- Special resolution
- Companies House form CC04
All within 15 days of the resolution being passed.

## Timing Requirements

For smaller companies (0-49 employees): Legal amendment must be completed during the certification process, typically before approval.

For larger companies (50+ employees): Up to 12 months after certification is permitted to finalize the legal change, though earlier completion is recommended.`
  },
  {
    filename: 'Step_2_Improve_your_Score-2.pdf',
    content: `Step 2: Improving Your B Impact Assessment Score

## The B Corp Certification Process

In order to progress with B Corp Certification, your company must first score 80+ points on the B Impact Assessment - the free, online platform used by B Lab to verify performance across 5 key areas of Governance, Workers, Community, Environment & Customers.

Meeting 80 points doesn't usually happen after your initial pass at the assessment but improving your company's impact is made easier thanks to a range of tools and resources built into the BIA.

## Tools and Resources for Improving Your Score

### Bookmark Report
Highlight questions on the assessment you wish to revisit by clicking the bookmark icon in the upper right corner of a question.

### Customised Improvement Report
Once you have completed the assessment, a report is generated automatically that identifies the key questions you could be performing better on to improve your current score.

### Learn More
On many of the questions within the assessment, you will find a useful 'Learn' button which provides you with further explanations, definitions and real-world examples, designed to support your improvement.

### Knowledge Base
This comprehensive resource hub is packed with detailed best practice guides to help you identify improvements, as well as a range of case studies to provide insight into the impact other B Corps have created.

### Goal Setting
Create a roadmap by clicking the star in the upper right corner of questions to set yourself goals for improvement. Set due dates, email reminders and add comments about how you will reach these goals.

## Tips to Improve Your Impact

As you set out to improve your BIA score, a good starting point is to formalise your company policies and track impact metrics across the 5 impact areas:

**Governance**: Sharing financial information with employees, implementing transparent decision-making processes
**Workers**: Providing professional development opportunities, offering competitive benefits packages
**Community**: Supporting local suppliers and community organizations, engaging in charitable activities
**Environment**: Monitoring and reducing energy consumption, implementing waste reduction programs
**Customers**: Ensuring product quality and customer satisfaction, protecting customer data and privacy`
  },
  {
    filename: 'Step_3_Meet_the_B_Corp_legal_requirement-2.pdf',
    content: `Step 3: Meeting the B Corp Legal Requirement

## The B Corp Certification Process

In addition to measuring and managing your impact through the B Impact Assessment, B Corps are also required to make a legal change in order to complete certification.

This legal change is a commitment to consider the impact of decisions on your company's stakeholders now and in the future by building this consideration into your constitutional documents.

## What is the B Corp Legal Requirement?

The B Corp Legal Requirement varies across countries but companies based in the UK are required to make an amendment to their constitutional documents committing to use business as a force for good, by:

### Creating a Material Positive Impact
Creating a material positive impact on society and the environment through your business and operations.

### Considering Stakeholder Interests
Considering all 'stakeholder interests' when making decisions - including your shareholders, employees, suppliers, society and the environment.

The approved language that limited companies use to amend their Articles of Association must be adopted verbatim. This legal language has also been adapted to other company forms such as Limited Liability Partnerships, Companies Limited by Guarantee and Community Interest Companies.

## Why is this a Requirement?

The B Corp Legal Requirement formalises your company's alignment with the B Corp Movement's values and embeds a stakeholder-focused mindset that separates B Corps from other businesses.

It differentiates B Corps from other businesses by adding a layer of legal protection to the purpose of the company. It also protects the mission of the company through capital raises and leadership changes by making stakeholder consideration a constitutional requirement.

## Implementation Process

1. **Board Approval**: Directors must approve the proposed changes to Articles
2. **Shareholder Resolution**: Pass special resolution with 75% majority
3. **Filing**: Submit updated Articles and resolution to Companies House within 15 days
4. **Timeline**: Small companies must complete before certification; larger companies have up to 12 months post-certification`
  },
  {
    filename: 'Updated_stakeholder_governance_guide_APRILpdf-2.pdf',
    content: `Embracing Stakeholder Governance: A Guide to Meeting the B Corp Legal Requirement

## What is a B Corp?

Certified B Corporations, or B Corps, are companies verified to meet high standards of social and environmental performance, transparency and accountability.

Our most challenging global problems cannot be solved by governments and charities alone. By harnessing the power of business, B Corps commit to positively impact all stakeholders – workers, communities, customers, and our planet.

## Requirements for B Corp Certification

To achieve and maintain certification, all B Corps must:

1. **Complete the B Impact Assessment** and achieve a verified score of 80+ points, recertifying every 3 years.

2. **Meet the B Corp Legal Requirement**, amending their constitutional documents to commit to consider the impact of their decisions on all stakeholders, not just shareholders.

3. **Sign the Declaration of Interdependence** and publicly list their impact score on the B Lab Directory.

## Stakeholder Governance in Practice

Stakeholder governance means considering the interests of all stakeholders in business decisions:

### Employees
- Fair compensation and benefits
- Professional development opportunities  
- Safe and inclusive workplace culture
- Worker representation in governance where appropriate

### Customers
- Product quality and safety
- Transparent pricing and marketing
- Data privacy and protection
- Accessible products and services

### Community
- Local economic development
- Community engagement and investment
- Supplier diversity and fair trade
- Environmental stewardship

### Environment
- Resource conservation and efficiency
- Pollution prevention and reduction
- Climate action and carbon management
- Circular economy principles

### Shareholders
- Long-term value creation
- Transparent reporting and communication
- Ethical business practices
- Sustainable growth strategies

## Implementation Guidelines

### Board Structure
Consider board composition that reflects stakeholder interests, potentially including:
- Independent directors with relevant expertise
- Stakeholder representatives where appropriate
- Diversity in backgrounds and perspectives

### Decision-Making Processes
Implement processes that systematically consider stakeholder impacts:
- Stakeholder impact assessments for major decisions
- Regular stakeholder engagement and feedback
- Transparent reporting on stakeholder outcomes
- Integration of stakeholder metrics in performance evaluation

### Legal Protection
The legal requirement provides protection for directors to consider broader stakeholder interests alongside shareholder returns, enabling long-term thinking and sustainable business practices.`
  },
  {
    filename: 'LTD_Research-2.pdf',
    content: `B Corp Certification Requirements for UK Limited Companies (LTD)

## Legal Requirements: Amending Articles and Section 172 Duties

### Mission-Lock in the Articles
Every UK LTD seeking B Corp Certification must amend its Articles of Association to embed a stakeholder-oriented purpose and duties. B Lab UK provides prescribed wording (to be adopted verbatim) that expands directors' duties under the Companies Act 2006 Section 172.

The company's objects clause is broadened to include a commitment to create a "material positive impact on society and the environment", alongside the traditional goal of promoting the success of the company for shareholders.

Additionally, the Articles impose a duty on directors to consider the interests of all stakeholders – not just shareholders – when making decisions (employees, suppliers, community, and the environment).

This legal "mission lock" empowers and obligates directors to balance profit with purpose, ensuring stakeholder interests are factored into board decisions going forward. It also helps protect the company's mission through future capital raises or leadership changes.

### Special Resolution and Filing
Implementing the legal requirement involves:
1. **Board approval** of the changes
2. **Shareholder approval** via special resolution (75% majority)  
3. **Filing** updated Articles, special resolution, and Companies House form CC04 within 15 days

For private companies this can be done by written resolution; public companies may need to convene a general meeting.

### Timing for Legal Change
- **Smaller companies (0-49 employees)**: Must complete Article change during certification process, typically before approval
- **Larger companies (50+ employees)**: Up to 12 months after certification permitted, though earlier completion recommended

### Section 172 CA 2006 Context
The B Corp clause leverages Section 172(2) of the Companies Act, which states that if a company's purposes include objectives beyond benefit of members, directors' duty to promote success is subject to those purposes.

The B Corp amendment elevates stakeholder and environmental objectives to constitutional purpose status, requiring directors to equally consider social/environmental mission alongside shareholder interests.

## Practical Implementation Considerations

### Corporate Governance Impact
- Directors gain legal backing to prioritize long-term stakeholder value
- Decision-making processes must incorporate stakeholder impact assessment  
- Board discussions should document stakeholder considerations
- Annual reporting should address stakeholder outcomes

### Investor Relations
- Existing shareholders must approve 75% majority for changes
- New investors should understand stakeholder governance model
- Investment agreements may need updating to reflect dual purpose
- Due diligence processes should evaluate stakeholder performance

### Operational Changes
- Management systems should track stakeholder impacts
- Key performance indicators should include non-financial metrics
- Staff training on stakeholder-oriented decision making
- Supply chain and customer relationship management alignment

This legal framework transforms the company from shareholder primacy to stakeholder governance, providing the foundation for B Corp certification and ongoing impact measurement.`
  },
  {
    filename: 'ImpactAssessmentSupportContext-2.pdf',
    content: `Company Scoping for B Corp Certification

## Overview

This article contains the rules and requirements for defining a company's scope for B Corp Certification on B Lab's new standards. The scope determines if a company with a complex structure, including multiple legal entities, facilities and operations, can be certified under a single certification and single assessment.

## Scoping Rules

### 1. Certification Scope Requirements
The B Corp Certification scope must include all the following that are owned/controlled by the applicant company:
- **Legal entities**
- **Facilities**  
- **Business activities and operations**

**Control Definition**: Having authority over an entity's leadership or being directly involved in its daily operations and decision-making, including the ability to direct or manage its business activities.

### 2. Subsidiaries (Financial or Operational Control)
The applicant company must include all subsidiaries within its certification scope if:
- The subsidiary is financially consolidated in the applicant's accounts; OR
- The applicant company exercises control over the subsidiary's operations

**Rationale**: Financial consolidation reflects the ability to govern financial and operating activities, inherently implying control. Operational control means authority over strategic or operational decision-making.

### 3. Affiliated Entities (Executive Management Control)
Affiliated entities are legal entities linked through common ownership, branding, joint ventures, or shared operations. They must be included if the applicant company exercises control through:
- Contractual or operational agreements (e.g., exclusive manufacturing relationships)
- Shared day-to-day business activities
- Shared executive team oversight

### 4. Franchise Operations
For franchised businesses:
- **Corporate-owned locations**: Must be included in scope
- **Franchisee-owned locations**: Generally excluded unless significant operational control exists
- **Mixed models**: Require case-by-case analysis of control relationships

### 5. Joint Ventures and Partnerships
- **Majority control** (>50% ownership or operational control): Must be included
- **Shared control** (50/50 partnerships): May be included if governance structure gives applicant control
- **Minority stakes**: Generally excluded unless operational control demonstrated

## Documentation Requirements

Companies must provide:
1. **Organizational chart** showing all entities and control relationships
2. **Legal documentation** proving ownership and control structures  
3. **Financial statements** showing consolidation practices
4. **Operational agreements** demonstrating management control
5. **Governance documents** outlining decision-making authority

## Impact on Assessment

The defined scope affects:
- **Revenue calculations** for size-based requirements
- **Employee counts** for workforce-related standards
- **Geographic coverage** for local impact assessments
- **Supply chain analysis** for vendor and procurement policies
- **Environmental data** for resource usage and emissions reporting

## Exclusions and Limitations

Entities that may be excluded:
- **Investment holdings** without operational involvement
- **Dormant subsidiaries** with no business activity
- **Separate management** entities with independent operations
- **Regulated entities** where control is limited by regulatory requirements

## Verification Process

B Lab will verify scope through:
- Document review of organizational and legal structures
- Management interviews about operational control
- Financial audit of consolidation practices
- Site visits to key facilities and operations
- Third-party confirmation of business relationships

This scoping framework ensures that B Corp certification accurately represents the company's full impact across all controlled operations while maintaining practical boundaries for assessment and verification.`
  }
];

export async function ingestKnowledgeBaseNow(): Promise<void> {
  console.log('Starting immediate B Corp knowledge base ingestion...');
  
  try {
    await processBCorpStandards(documents);
    console.log('✅ Successfully ingested B Corp knowledge base');
  } catch (error) {
    console.error('❌ Error ingesting knowledge base:', error);
    throw error;
  }
}

// Auto-execute when imported
ingestKnowledgeBaseNow().catch(console.error);